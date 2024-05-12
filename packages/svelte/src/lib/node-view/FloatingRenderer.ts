import {EditorContextKey} from '$lib/context';
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
import {writable} from 'svelte/store';

export const FLOATING_CONTEXT_KEY = Symbol.for('svelteFloatingProps');

export type FloatingMountProps = {
  element: ReferenceElement;
  pos?: number;
  mark?: Mark;
  node?: Node;
  data?: unknown;
};
export type SvelteFloatingProps = {
  editor: Editor;
  onHide: () => void;
} & Partial<FloatingMountProps>;

class FloatingRenderer {
  static DEFAULT_OPTIONS: ComputePositionConfig = {
    placement: 'top',
    middleware: [flip(), shift(), offset(10)]
  };
  private wrapper: HTMLElement;
  private svelteRenderer: SvelteComponent | null = null;

  constructor(
    private readonly opts: {
      component: ComponentType;
      editor: Editor;
      portal?: HTMLElement;
      style?: Partial<CSSStyleDeclaration>;
    },
    private readonly floatingOptions?: Partial<ComputePositionConfig>
  ) {
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('id', crypto.randomUUID());
    Object.assign(this.wrapper.style, {
      opacity: 0,
      position: 'absolute',
      transition: 'opacity 0.2s ease-in-out',
      ...opts.style
    });
    (opts.portal || document.body).appendChild(this.wrapper);
  }

  get id() {
    return this.wrapper.getAttribute('id');
  }

  get mounted() {
    return Boolean(this.svelteRenderer);
  }
  get element(): HTMLElement {
    return this.wrapper;
  }

  async mount(props: FloatingMountProps) {
    const {element} = props;
    const Component = this.opts.component;
    this.svelteRenderer?.$destroy();
    this.svelteRenderer = new Component({
      target: this.wrapper,
      context: new Map([
        ['data', props.data],
        [
          FLOATING_CONTEXT_KEY,
          {
            ...props,
            //@ts-expect-error pass onHide to child omponent
            onHide: () => this.unmount(),
            editor: this.opts.editor
          }
        ],
        [EditorContextKey, writable(this.opts.editor)]
      ])
    });
    const {x, y} = await computePosition(element, this.wrapper, {
      ...FloatingRenderer.DEFAULT_OPTIONS,
      ...this.floatingOptions
    });
    Object.assign(this.wrapper.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    requestAnimationFrame(() => {
      this.wrapper.style.opacity = '1';
    });
  }
  unmount() {
    this.svelteRenderer?.$destroy();
    this.svelteRenderer = null;
    requestAnimationFrame(() => {
      Object.assign(this.wrapper.style, {
        top: '-9999px',
        left: '-9999px'
      });
    });
  }

  //update floating component position, create if component is not created
  async updateOrMount(props: FloatingMountProps) {
    if (!this.svelteRenderer) {
      await this.mount(props);
      return;
    }
    const {x, y} = await computePosition(props.element, this.wrapper, {
      ...FloatingRenderer.DEFAULT_OPTIONS,
      ...this.floatingOptions
    });
    console.log('>>>>>>> x', x);
    console.log('>>>>>>> y', y);
    Object.assign(this.wrapper.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    requestAnimationFrame(() => {
      this.wrapper.style.opacity = '1';
    });
  }

  destroy() {
    this.unmount?.();
    this.wrapper?.remove?.();
  }
}

export function useFloatingProps(): SvelteFloatingProps {
  return getContext(FLOATING_CONTEXT_KEY);
}
export {FloatingRenderer};
