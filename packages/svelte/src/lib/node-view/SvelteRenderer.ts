import {getContext, type ComponentType, type SvelteComponent} from 'svelte';
import type {NodeViewProps} from '@tiptap/core';

import {get, type Writable} from 'svelte/store';

export interface SvelteNodeViewContext {
  props?: Writable<NodeViewProps>;
  contentRef?: (element: HTMLElement) => void;
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
  context: SvelteNodeViewContext = {};

  constructor(opts: SvelteRenderOptions, props: Writable<NodeViewProps>) {
    const {component: Component, domAs, contentAs} = opts;
    this.context = {
      props,
      contentRef: (element: HTMLElement) => {
        element.setAttribute('data-node-view-content', '');
        this.contentElement = element;
      }
    };

    // Create dom node
    this.element = document.createElement(domAs || 'div');
    this.element.setAttribute('data-node-view-wrapper', '');

    this.component = new Component({
      target: this.element,
      props: {
        contentAs
      },
      context: new Map(Object.entries(this.context))
    });
  }

  destroy() {
    this.component.$destroy();
    this.contentElement?.remove();
    this.element?.remove();
  }
}

export const useNodeViewProps = () =>
  getContext<Writable<NodeViewProps>>('props');

export const useContentRef = () => getContext('contentRef');
