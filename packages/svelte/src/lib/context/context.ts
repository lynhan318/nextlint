import {getContext, setContext} from 'svelte';
import type {Editor} from '@tiptap/core';
import {type Writable, writable} from 'svelte/store';
import {createEditor, type EditorOptions} from '@nextlint/core';

export const EditorContextKey = Symbol.for('EditorContext');

type MaybeEditor = Editor | null;
export interface EditorContext {
  render(element: HTMLElement): void;
  ready: PromiseLike<boolean>;
}

export const createEditorContext = (options: EditorOptions): EditorContext => {
  const editorStore = writable<MaybeEditor>(null);
  setContext(EditorContextKey, editorStore);

  let resolver: any;
  const readyPromise = new Promise<boolean>(resolve => (resolver = resolve));

  return {
    render: (element: HTMLElement) => {
      const editor = createEditor({...options, element});
      editorStore.set(editor);
      if (typeof options.onChange === 'function') {
        editor.on('update', () => {
          options.onChange?.(editor);
        });
      }
      resolver(true);
    },
    ready: readyPromise
  };
};
export const useEditor = (): Writable<Editor> => {
  const editor = getContext<Writable<MaybeEditor>>(EditorContextKey);
  if (!editor) {
    throw new Error('No editor found');
  }
  return editor as Writable<Editor>;
};
