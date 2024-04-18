import {Node as ProseMirrorNode} from '@tiptap/pm/model';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';

import {DecorationCache} from './cache';
import type {LanguageExtractor, Parser, TiptapShikiTheme} from './types';
import {getHighlighter} from 'shiki';
import type {BuiltinLanguage, BundledTheme, Highlighter} from 'shiki';

import {createParser, type ShikiTheme} from './shiki';

export interface HighlightPluginState {
  cache: DecorationCache;
  decorations: DecorationSet;
  promises: Promise<void>[];
}

export {highlighter};

let highlighterPromise: Promise<void> | undefined;
let highlighter: Highlighter | undefined;
let parser: Parser | undefined;
const loadedLanguages = new Set<string>();

export const lazyParser: Parser = options => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: Object.values(options.themes) as BundledTheme[],
      langs: []
    }).then(h => {
      highlighter = h;
    });
    return highlighterPromise;
  }

  if (!highlighter) {
    return highlighterPromise;
  }

  const language = options.language;
  if (language && !loadedLanguages.has(language)) {
    return highlighter.loadLanguage(language as BuiltinLanguage).then(() => {
      loadedLanguages.add(language);
    });
  }

  if (!parser) {
    parser = createParser(highlighter);
  }

  return parser(options);
};

export function createHighlightPlugin({
  parser,
  nodeTypes = ['NextlintCodeBlock'],
  languageExtractor = (node: ProseMirrorNode) =>
    node?.attrs?.lang || 'javascript',
  themes
}: {
  parser: Parser;
  nodeTypes?: string[];
  languageExtractor?: LanguageExtractor;
  themes: ShikiTheme;
}): Plugin<HighlightPluginState> {
  const key = new PluginKey<HighlightPluginState>();

  return new Plugin<HighlightPluginState>({
    key,
    state: {
      init(_, instance) {
        const cache = new DecorationCache();
        const [decorations, promises] = calculateDecoration(
          instance.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
          themes
        );

        return {cache, decorations, promises};
      },
      apply: (tr, data) => {
        const cache = data.cache.invalidate(tr);
        const refresh = !!tr.getMeta('prosemirror-highlight-refresh');

        if (!tr.docChanged && !refresh) {
          const decorations = data.decorations.map(tr.mapping, tr.doc);
          const promises = data.promises;
          return {cache, decorations, promises};
        }

        const [decorations, promises] = calculateDecoration(
          tr.doc,
          parser,
          nodeTypes,
          languageExtractor,
          cache,
          themes
        );
        return {cache, decorations, promises};
      }
    },
    view: view => {
      const promises = new Set<Promise<void>>();

      // Refresh the decorations when all promises resolve
      const refresh = () => {
        if (promises.size > 0) {
          return;
        }
        const tr = view.state.tr.setMeta('prosemirror-highlight-refresh', true);
        view.dispatch(tr);
      };

      const check = () => {
        const state = key.getState(view.state);

        for (const promise of state?.promises ?? []) {
          promises.add(promise);
          promise
            .then(() => {
              promises.delete(promise);
              refresh();
            })
            .catch(() => {
              promises.delete(promise);
            });
        }
      };

      check();

      return {
        update: () => {
          check();
        }
      };
    },
    props: {
      decorations(this, state) {
        return this.getState(state)?.decorations;
      }
    }
  });
}

function calculateDecoration(
  doc: ProseMirrorNode,
  parser: Parser,
  nodeTypes: string[],
  languageExtractor: LanguageExtractor,
  cache: DecorationCache,
  themes: TiptapShikiTheme
) {
  const result: Decoration[] = [];
  const promises: Promise<void>[] = [];

  doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (!node.type.isTextblock) {
      return true;
    }

    if (nodeTypes.includes(node.type.name)) {
      const language = languageExtractor(node);
      const cached = cache.get(pos);

      if (cached) {
        const [, decorations] = cached;
        result.push(...decorations);
      } else {
        const decorations = parser({
          content: node.textContent,
          language: language || undefined,
          pos,
          themes
        });

        if (decorations && Array.isArray(decorations)) {
          cache.set(pos, node, decorations);
          result.push(...decorations);
        } else if (decorations instanceof Promise) {
          cache.remove(pos);
          promises.push(decorations);
        }
      }
    }
    return false;
  });

  return [DecorationSet.create(doc, result), promises] as const;
}
