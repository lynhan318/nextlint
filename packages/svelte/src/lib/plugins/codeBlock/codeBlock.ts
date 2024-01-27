import {CodeBlock} from '@tiptap/extension-code-block';
import type {BundledLanguage, BundledTheme} from 'shikiji';

import {SvelteNodeViewRenderer} from '$lib/node-view';

import SvelteCodeBlock from './CodeBlock.svelte';
import {PluginKey, Plugin} from '@tiptap/pm/state';

export type NextlintCodeBlockAttrs = {
  lang: BundledLanguage;
  theme: 'github-light' | 'github-dark';
};

export type NextlintCodeBlockOptions = {
  langs: BundledLanguage[];
  themes: BundledTheme[];
};

export const NextlintCodeBlock = CodeBlock.extend<NextlintCodeBlockOptions>({
  name: 'NextlintCodeBlock',

  addAttributes() {
    return {
      lang: {
        default: this.options.langs[0],
        parseHTML: html => {
          return html.getAttribute('code-block-lang');
        },
        renderHTML: attrs => {
          return {
            'code-block-lang': attrs.lang
          };
        }
      },
      theme: {
        default: this.options.themes[0],
        parseHTML: html => {
          return html.getAttribute('code-block-theme');
        },
        renderHTML: attrs => {
          return {
            'code-block-theme': attrs.theme
          };
        }
      }
    };
  },

  addOptions() {
    return {
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'rust',
        'typescript',
        'css',
        'html',
        'tsx',
        'svelte'
      ]
    };
  },

  addNodeView() {
    return SvelteNodeViewRenderer({
      component: SvelteCodeBlock,
      domAs: 'code-block',
      contentAs: 'code'
    });
  },

  addProseMirrorPlugins() {
    const codeBlockPlugin = new Plugin({
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
    });
    return [codeBlockPlugin];
  }
});
