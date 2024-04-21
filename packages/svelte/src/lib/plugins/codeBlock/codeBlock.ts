import {CodeBlock} from '@tiptap/extension-code-block';
import type {BundledLanguage} from 'shiki';

import SvelteCodeBlock from './CodeBlock.svelte';
import {PluginKey, Plugin} from '@tiptap/pm/state';
import {SvelteNodeViewRenderer} from '$lib/node-view';
import {createHighlightPlugin, highlighter, lazyParser} from './plugin';
import type {ShikiTheme} from './shiki';
import {mergeAttributes} from '@tiptap/core';

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
      }
    };
  },
  renderHTML({HTMLAttributes, node}) {
    const textContent = node.textContent;
    const withSyntax = highlighter?.codeToHtml(textContent, {
      lang: node.attrs.lang,
      themes: this.options.themes
    });
    const parsed = new DOMParser().parseFromString(
      withSyntax || '',
      'text/html'
    );
    const pre = parsed.querySelector('pre.shiki');
    if (pre) {
      pre.setAttribute('data-lang', node.attrs.lang);
      return pre;
    }
    return [
      'pre',
      mergeAttributes(HTMLAttributes, {
        'data-node-view-root': true
      }),
      [
        'pre',
        {
          'data-node-view-content': true
        },
        0
      ]
    ];
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
