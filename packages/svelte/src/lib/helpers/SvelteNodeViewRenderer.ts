import type {ComponentType} from 'svelte';
import {
  NodeView,
  type Editor,
  type NodeViewProps,
  type NodeViewRendererProps
} from '@tiptap/core';

import {SvelteRenderer} from './SvelteRenderer';

let renderer: SvelteRenderer;

class SvelteNodeView extends NodeView<ComponentType, Editor> {
  mount() {
    const props: NodeViewProps = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode()
    };
    renderer = new SvelteRenderer(this.component, props);
  }

  get dom() {
    return renderer.element;
  }

  get contentDOM() {
    if (this.node.isLeaf) return null;
    return renderer.contentElement || null;
  }
}

export const SvelteNodeViewRenderer = (Component: ComponentType) => {
  console.log('trigger render');
  return (props: NodeViewRendererProps) => new SvelteNodeView(Component, props);
};
