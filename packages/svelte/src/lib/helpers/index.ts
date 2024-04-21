import type {ClassValue} from 'clsx';
import {clsx} from 'clsx';
import {renderHTML} from '@nextlint/core';
import {twMerge} from 'tailwind-merge';

import type {Editor} from '$lib';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const svelteEditorToHtml = async (editor: Editor) => {
  try {
    const html = await renderHTML(editor, async element => {
      return element.render();
    });
    return html;
  } catch (error) {
    console.error('[NextlintEditor]', error);
    return '';
  }
};
