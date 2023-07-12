import {getContext, type SvelteComponent} from 'svelte';
import type {NodeViewProps} from '@tiptap/core';

import type {SvelteComponentConstructor} from './types';

export interface SvelteNodeViewContext {
  props?: NodeViewProps;
  contentRef?: (element: HTMLElement) => void;
}

export class SvelteRenderer {
  element!: HTMLElement;
  contentElement?: HTMLElement;

  component: SvelteComponent;
  context: SvelteNodeViewContext = {};

  constructor(Component: SvelteComponentConstructor, props: NodeViewProps) {
    this.context = {
      props,
      contentRef: (element: HTMLElement) => {
        this.contentElement = element;
      }
    };

    // Create dom node
    this.element = document.createElement('div');
    this.element.setAttribute('data-node-view-wrapper', '');

    this.component = new Component({
      target: this.element,
      context: new Map(Object.entries(this.context))
    });
  }

  update() {
    console.log('update');
  }
}

export const useNodeViewProps = () => getContext('nodeViewProps');
export const useContentRef = () => getContext('contentRef');
