import {Decoration} from '@tiptap/pm/view';

import {
  type BundledLanguage,
  type BundledTheme,
  type CodeToTokensWithThemesOptions,
  type Highlighter
} from 'shiki';

export type ShikiTheme = CodeToTokensWithThemesOptions<
  BundledLanguage,
  BundledTheme
>['themes'];

export type Parser = (options: {
  content: string;
  pos: number;
  language?: string;
  themes: ShikiTheme;
}) => Decoration[] | Promise<void>;

export function createParser(highlighter: Highlighter): Parser {
  return function parser({content, language, pos, themes}) {
    const decorations: Decoration[] = [];
    const tokens = highlighter.codeToTokensWithThemes(content, {
      lang: language as BundledLanguage,
      themes
    });

    let from = pos + 1;

    for (const line of tokens) {
      for (const token of line) {
        const to = from + token.content.length;
        const decoration = Decoration.inline(from, to, {
          style: `color: ${token.variants.light.color};--shiki-dark:${token.variants.dark.color}`
        });

        decorations.push(decoration);

        from = to;
      }

      from += 1;
    }

    return decorations;
  };
}
