import {
  getHighlighter as shikijiHighlighter,
  type HighlighterGeneric
} from 'shikiji';
import {NextlintCodeBlock} from './codeBlock';

let highlighter: HighlighterGeneric<string, string>;

export async function getHighlighter() {
  highlighter ||= await shikijiHighlighter({
    langs: NextlintCodeBlock.options.langs,
    themes: NextlintCodeBlock.options.themes
  });
  return highlighter;
}

export * from './codeBlock';
