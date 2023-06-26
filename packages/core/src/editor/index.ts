import {lowlight} from 'lowlight/lib/common';
import {Editor, type Content, Extension} from '@tiptap/core';

import {StarterKit, type StarterKitOptions} from './starterKit';

export type EditorOptions = {
  content?: Content;
  placeholder?: string;
  element?: HTMLElement;
  starterKit?: Partial<StarterKitOptions>;
  editable?: boolean;
  onChange?: (editor: Editor) => void;
  onCreated?: (editor: Editor) => void;
  extensions?: Extension[];
};

export const createEditor = (options: EditorOptions) => {
  const editor = new Editor({
    element: options.element,
    onCreate: ({editor}) => options.onCreated?.(editor),
    editable: options.editable,
    extensions: [
      StarterKit.configure({
        placeholder: {
          placeholder: options.placeholder
        },
        codeBlock: {
          lowlight
        },
        ...options.starterKit
      })
    ].concat(options.extensions || []),
    content: options.content
  });
  return editor;
};
export {lowlight};
