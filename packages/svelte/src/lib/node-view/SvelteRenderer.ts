import {getContext, type ComponentType, type SvelteComponent} from 'svelte';
import type {NodeViewProps} from '@tiptap/core';

import type {Writable} from 'svelte/store';
import type {NodeViewContext} from './SvelteNodeViewRenderer';

export interface SvelteNodeViewContext {
  props?: Writable<NodeViewProps>;
  contentDOM?: (element: HTMLElement) => void;
}

export interface SvelteRenderOptions {
  component: ComponentType;
  domAs?: string;
  contentAs?: string;
}

export class SvelteRenderer {
  element!: HTMLElement;
  contentElement?: HTMLElement;

  component: SvelteComponent;

  constructor(
    opts: SvelteRenderOptions,
    readonly context: NodeViewContext
  ) {
    const {component: Component, domAs} = opts;

    // Create dom node
    this.element = document.createElement(domAs || 'div');
    this.element.setAttribute('data-node-view-root', 'true');
    this.component = new Component({
      target: this.element,
      context: new Map(Object.entries(context))
    });
  }

  destroy() {
    this.component.$destroy();
    this.contentElement?.remove();
    this.element?.remove();
  }
}

export const useNodeViewContext = <K extends keyof NodeViewContext>(
  ctxKey: K
) => getContext<NodeViewContext[K]>(ctxKey);
