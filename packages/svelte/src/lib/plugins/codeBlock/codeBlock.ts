import {CodeBlock} from '@tiptap/extension-code-block';
import type {BundledLanguage, BundledTheme} from 'shikiji';

import {SvelteNodeViewRenderer} from '$lib/node-view';

import SvelteCodeBlock from './CodeBlock.svelte';

export type NextlintCodeBlockAttrs = {
  lang: BundledLanguage;
  theme: 'github-light' | 'github-dark';
};

export type NextlintCodeBlockOptions = {
  langs: BundledLanguage[];
  themes: BundledTheme[];
};

export const NextlintCodeBlock = CodeBlock.extend<NextlintCodeBlockOptions>({
  name: 'NextlintCodeBock',

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
        'java',
        'go',
        'html',
        'css',
        'scss',
        'bash',
        'lua',
        'python',
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
  }
});
