import type {ClassValue} from 'clsx';
import {clsx} from 'clsx';
import {renderHTML} from '@nextlint/core';
import {twMerge} from 'tailwind-merge';

import {getHighlighter} from '$lib/plugins/codeBlock';
import type {Editor} from '$lib';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const svelteEditorToHtml = async (editor: Editor) => {
  try {
    const html = await renderHTML(editor, async element => {
      if (element.nodeName === 'PRE') {
        const highlighter = await getHighlighter();
        const lang = element._attributes['code-block-lang'] || 'javascript';
        const code = highlighter.codeToHtml(
          element.querySelector('code')?.textContent || '',
          {
            lang,
            themes: {
              dark: 'github-dark',
              light: 'github-light'
            }
          }
        );
        return code;
      }
      return element.render();
    });
    return html;
  } catch (error) {
    console.error('[NextlintEditor]', error);
    return '';
  }
};
