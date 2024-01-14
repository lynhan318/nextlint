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
  // group: 'block',
  // content: 'inline*',
  addOptions() {
    return {
      langs: [
        'javascript',
        'rust',
        'typescript',
        'java',
        'go',
        'html',
        'css',
        'scss'
      ],
      themes: ['github-dark', 'github-light']
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
