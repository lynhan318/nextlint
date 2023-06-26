import {type EditorView} from '@tiptap/pm/view';
import type {SvelteComponent, ComponentConstructorOptions} from 'svelte';

export type Position =
  | 'blockEmpty'
  | 'blockEmptyStart'
  | 'blockEmptyEnd'
  | 'cursor'
  | 'selection';

export type Placement = 'top' | 'left' | 'right' | 'bottom';

export type AnyRecord = Record<string, any>;

export type SvelteComponentConstructor<T extends AnyRecord = AnyRecord> = new (
  options: ComponentConstructorOptions<T>
) => SvelteComponent;
export type PositionFactory = {
  component: SvelteComponentConstructor;
  position?: Position;
  placement?: Placement;
};

export const positionFactory = (options: PositionFactory) => {
  const wrapper = document.createElement('div');
  const createPosition = (editorView: EditorView) => {
    const {component: ComponentConstructor, position, placement} = options;
    return new ComponentConstructor({
      target: wrapper
    });
  };
  return createPosition;
};
