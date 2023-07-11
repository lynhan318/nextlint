import {getContext, type SvelteComponent} from 'svelte';
import type {NodeViewRendererProps} from '@tiptap/core';

import type {Maybe, SvelteComponentConstructor} from './types';

export type NodeViewProps = {
  test: '';
};

export interface SvelteNodeViewContext {
  nodeViewProps?: NodeViewRendererProps;
  contentRef?: (element: HTMLElement) => void;
}
export interface NodeViewOptions {
  nodeViewProps: NodeViewRendererProps;
  component: SvelteComponentConstructor<NodeViewProps>;
}

export class SvelteNodeView {
  dom: HTMLElement;
  contentDOM: Maybe<HTMLElement> = document.createElement('p');

  _component: SvelteComponent<NodeViewProps>;
  _context: SvelteNodeViewContext = {};

  constructor(readonly options: NodeViewOptions) {
    this._context = {
      nodeViewProps: options.nodeViewProps,
      contentRef: (element: HTMLElement) => {
        this.contentDOM = element;
      }
    };
    this.dom = document.createElement('div');
    this.dom.setAttribute('data-node-view-root', 'true');

    this._component = new options.component({
      target: this.dom,
      context: new Map(Object.entries(this._context))
    });
  }
  static create(options: NodeViewOptions) {
    return new SvelteNodeView(options);
  }

  update() {
    console.log('update');
  }
  destroy() {
    console.log('destroy');
    this.dom?.remove();
    this._component?.$destroy();
  }
}

export const useNodeViewProps = () => getContext('nodeViewProps');

export const useContentRef = () => getContext('contentRef');
