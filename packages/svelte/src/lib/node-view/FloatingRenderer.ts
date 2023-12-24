import {
  computePosition,
  shift,
  type ComputePositionConfig,
  type ReferenceElement,
  flip,
  offset
} from '@floating-ui/dom';
import type {Editor} from '@tiptap/core';
import type {Mark, Node} from '@tiptap/pm/model';
import {getContext, type ComponentType, type SvelteComponent} from 'svelte';

export const FLOATING_CONTEXT_KEY = Symbol.for('svelteFloatingProps');

export type FloatingMountProps<FNode, FMark> = {
  element: ReferenceElement;
  pos: number;
  mark: FMark;
  node: FNode;
};
export type SvelteFloatingProps<FNode, FMark> = {
  editor: Editor;
  onHide: () => void;
} & FloatingMountProps<FNode, FMark>;

export class FloatingRenderer<FNode extends Node, FMark extends Mark> {
  private wrapper: HTMLElement;
  private svelteRenderer: SvelteComponent | null = null;

  constructor(
    private readonly opts: {component: ComponentType; editor: Editor},
    private readonly floatingOptions?: Partial<ComputePositionConfig>
  ) {
    this.wrapper = document.createElement('div');
    Object.assign(this.wrapper.style, {
      opacity: 0,
      position: 'absolute',
      transition: 'opacity 0.2s ease-in-out'
    });
    document.body.appendChild(this.wrapper);
  }

  async mount(props: FloatingMountProps<FNode, FMark>) {
    const {element} = props;
    this.svelteRenderer?.$destroy();
    this.svelteRenderer = new this.opts.component({
      target: this.wrapper,
      context: new Map([
        [
          FLOATING_CONTEXT_KEY,
          {
            ...props,
            onHide: () => this.unmount(),
            editor: this.opts.editor
          }
        ]
      ])
    });
    const {x, y} = await computePosition(element, this.wrapper, {
      ...this.floatingOptions,
      placement: 'top',
      middleware: [flip(), shift(), offset(10)]
    });
    Object.assign(this.wrapper.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    requestAnimationFrame(() => {
      this.wrapper.style.opacity = '1';
    });
  }
  async unmount() {
    this.svelteRenderer?.$destroy();
    this.svelteRenderer = null;
  }
  async destroy() {
    this.unmount?.();
    this.wrapper?.remove?.();
  }
}

export function useFloatingProps<FNode, FMark>(): SvelteFloatingProps<
  FNode,
  FMark
> {
  return getContext(FLOATING_CONTEXT_KEY);
}
