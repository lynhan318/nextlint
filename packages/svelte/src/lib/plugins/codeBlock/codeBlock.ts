import {CodeBlock} from '@tiptap/extension-code-block';
import type {BundledLanguage, BundledTheme} from 'shiki';

import SvelteCodeBlock from './CodeBlock.svelte';
import {PluginKey, Plugin} from '@tiptap/pm/state';
import {mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import type {SvelteComponent} from 'svelte';
import {SvelteNodeView} from '@prosemirror-adapter/svelte';

import type {NodeView} from '@tiptap/pm/view';

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
        'svelte',
        'json',
        'shell',
        'yaml',
        'vue',
        'lua',
        'python',
        'c',
        'c++',
        'java',
        'zig',
        'swift',
        'kotlin',
        'go',
        'angular-ts',
        'angular-html'
      ]
    };
  },

  addNodeView() {
    return props => {
      const svelteNodeView = new SvelteNodeView({
        node: props.node,
        //@ts-expect-error skip
        getPos: props.getPos,
        decorations: props.decorations,
        view: this.editor.view,
        options: {
          component: SvelteCodeBlock,
          as: 'code-block',
          contentAs: 'code',
          stopEvent() {
            return true;
          },
          selectNode() {
            console.log('nodeSeeclted');
          }
        }
      });
      svelteNodeView.render();
      return svelteNodeView;
    };
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
