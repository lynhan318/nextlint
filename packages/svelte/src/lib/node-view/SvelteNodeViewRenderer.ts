import type {NodeView as ProseMirrorNodeView} from '@tiptap/pm/view';
import type {Node as PMNode} from '@tiptap/pm/model';

import type {ComponentType} from 'svelte';
import {
  NodeView,
  type Editor,
  type NodeViewProps,
  type NodeViewRendererProps,
  type NodeViewRendererOptions as TNodeViewRendererOptions
} from '@tiptap/core';

import {get, writable, type Writable} from 'svelte/store';

import {SvelteRenderer} from './SvelteRenderer';

export class SvelteNodeView
  extends NodeView<ComponentType, Editor>
  implements ProseMirrorNodeView
{
  renderer!: SvelteRenderer;
  store!: Writable<NodeViewProps>;

  constructor(
    readonly options: NodeViewRendererOptions,
    props: NodeViewRendererProps
  ) {
    super(options.component, props, {
      stopEvent: options.stopEvent || null,
      ignoreMutation: options.ignoreMutation || null
    });
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

    this.renderer = new SvelteRenderer(
      {
        component: options.component,
        contentAs: options.contentAs,
        domAs: options.domAs
      },
      this.store
    );
  }

  override get dom() {
    return this.renderer.element;
  }

  override get contentDOM() {
    if (this.node.isLeaf) return null;
    return this.renderer.contentElement || null;
  }

  deleteNode = () => {
    super.deleteNode();
    this.editor.chain().focus().scrollIntoView().run();
  };

  update(node: PMNode) {
    this.store.update(store => {
      store.node = node;
      return store;
    });
    return true;
  }

  selectNode = () => {
    this.store.update(store => {
      store.selected = true;
      return store;
    });
  };

  deselectNode = () => {
    this.store.update(store => {
      store.selected = false;
      return store;
    });
  };

  toggleNodeSelection = () => {
    if (get(this.store).selected) {
      this.deselectNode();
      return;
    }
    return this.selectNode();
  };

  destroy() {
    this.renderer.destroy();
  }
}

export interface NodeViewRendererOptions
  extends Partial<TNodeViewRendererOptions> {
  component: ComponentType;
  contentAs?: string;
  domAs?: string;
}
export const SvelteNodeViewRenderer = (options: NodeViewRendererOptions) => {
  return (props: NodeViewRendererProps) => new SvelteNodeView(options, props);
};
