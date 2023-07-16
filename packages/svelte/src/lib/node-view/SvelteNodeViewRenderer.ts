import type {
  Decoration,
  NodeView as ProseMirrorNodeView
} from '@tiptap/pm/view';
import type {Node as PMNode} from '@tiptap/pm/model';

import type {ComponentType} from 'svelte';
import {
  NodeView,
  type Editor,
  type NodeViewProps,
  type NodeViewRendererProps
} from '@tiptap/core';
import {writable, type Writable} from 'svelte/store';

import {SvelteRenderer} from './SvelteRenderer';

class SvelteNodeView
  extends NodeView<ComponentType, Editor>
  implements ProseMirrorNodeView
{
  renderer!: SvelteRenderer;
  store!: Writable<NodeViewProps>;

  constructor(
    nodeViewOptions: NodeViewRendererOptions,
    props: NodeViewRendererProps
  ) {
    super(nodeViewOptions.component, props);
    this.store = writable<NodeViewProps>({
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode()
    });

    this.renderer = new SvelteRenderer(nodeViewOptions, this.store);
  }

  get dom() {
    return this.renderer.element;
  }

  get contentDOM() {
    if (this.node.isLeaf) return null;
    return this.renderer.contentElement || null;
  }

  update(node: PMNode, decorations) {
    if (!this.node.eq(node)) {
      this.store.update(store => {
        store.node = node;
        return store;
      });
    }
    return true;
  }

  selectNode() {
    this.store.update(store => {
      store.selected = true;
      return store;
    });
  }

  deselectNode() {
    this.store.update(store => {
      store.selected = false;
      return store;
    });
  }

  deleteNode() {
    this.editor.commands.deleteRange({
      from: this.getPos(),
      to: this.node.nodeSize
    });
  }

  destroy = () => {
    this.renderer.destroy();
  };
}

export interface NodeViewRendererOptions {
  component: ComponentType;
  contentAs?: string;
  domAs?: string;
}
export const SvelteNodeViewRenderer = (options: NodeViewRendererOptions) => {
  return (props: NodeViewRendererProps) => new SvelteNodeView(options, props);
};
