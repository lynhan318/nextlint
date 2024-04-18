import {CodeBlock} from '@tiptap/extension-code-block';
import type {BundledLanguage} from 'shiki';

import SvelteCodeBlock from './CodeBlock.svelte';
import {PluginKey, Plugin} from '@tiptap/pm/state';
import {SvelteNodeViewRenderer} from '$lib/node-view';
import {createHighlightPlugin, highlighter, lazyParser} from './plugin';
import type {ShikiTheme} from './shiki';

export type NextlintCodeBlockOptions = {
  langs: BundledLanguage[];
  themes: ShikiTheme;
};

export const NextlintCodeBlock = CodeBlock.extend<NextlintCodeBlockOptions>({
  name: 'NextlintCodeBlock',

  addAttributes() {
    return {
      lang: {
        default: this.options.langs[0],
        parseHTML: html => {
          return html.getAttribute('data-lang');
        },
        renderHTML: attrs => {
          return {
            'data-lang': attrs.lang
          };
        }
      },
      theme: {
        default: this.options.themes[0],
        parseHTML: html => {
          return html.getAttribute('data-theme');
        },
        renderHTML: attrs => {
          return {
            'data-theme': attrs.theme
          };
        }
      }
    };
  },
  onCreate() {
    const {dark, light} = this.options.themes;
    if (dark) {
      highlighter?.loadTheme(dark);
    }
    if (light) {
      highlighter?.loadTheme(light);
    }
  },
  addProseMirrorPlugins() {
    return [
      createHighlightPlugin({parser: lazyParser, themes: this.options.themes}),
      new Plugin({
        key: new PluginKey('codeBlock'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Tab') {
              const resolver = view.state.selection.$from;
              const pNode = resolver.node(1);
              if (pNode.type.name === this.name) {
                event.preventDefault();
                event.stopPropagation();
                this.editor
                  .chain()
                  .insertContentAt(resolver.pos, '\t')
                  .setTextSelection(resolver.pos + 1)
                  .run();
              }
            }
          }
        }
      })
    ];
  },

  addNodeView() {
    return SvelteNodeViewRenderer({
      component: SvelteCodeBlock,
      options: this.options,
      domAs: () => {
        const pre = document.createElement('pre');
        pre.classList.add('shiki');
        return pre;
      }
    });
  }
});
