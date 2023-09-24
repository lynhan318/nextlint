import {createLowlight, common} from 'lowlight';
import {Editor, type Content, type Extensions} from '@tiptap/core';

import {StarterKit, type StarterKitOptions} from './starterKit';

const lowlight = createLowlight(common);

export type EditorOptions = {
  content?: Content;
  placeholder?: string;
  element?: HTMLElement;
  starterKit?: Partial<StarterKitOptions>;
  editable?: boolean;
  onChange?: (editor: Editor) => void;
  onCreated?: (editor: Editor) => void;
  extensions?: Extensions;
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
    ].concat((options.extensions as any) || []),
    content: options.content
  });
  return editor;
};
export {lowlight};
