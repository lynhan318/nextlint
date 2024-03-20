import {
  getHighlighter as shikijiHighlighter,
  type HighlighterGeneric,
  type BundledLanguage,
  type BundledTheme
} from 'shiki/bundle-full.mjs';

import {NextlintCodeBlock} from './codeBlock';

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>;

export async function getHighlighter() {
  highlighter ||= await shikijiHighlighter({
    langs: NextlintCodeBlock.options.langs,
    themes: NextlintCodeBlock.options.themes
  });
  return highlighter;
}

export * from './codeBlock';
