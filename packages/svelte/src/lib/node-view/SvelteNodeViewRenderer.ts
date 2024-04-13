//Inspire by Prosemirror Adapter by Mirone.
import type {
  Decoration,
  NodeView as ProseMirrorNodeView
} from '@tiptap/pm/view';
import type {Attrs, Node as PMNode} from '@tiptap/pm/model';

import type {ComponentType} from 'svelte';
import {
  NodeView,
  type Editor,
  type NodeViewProps,
  type NodeViewRendererProps,
  type NodeViewRendererOptions as TNodeViewRendererOptions
} from '@tiptap/core';

import {writable, type Writable} from 'svelte/store';

import {SvelteRenderer} from './SvelteRenderer';

export interface NodeViewContext {
  // immutable
  editor: Editor;
  contentDOM: (node: HTMLElement) => void;
  getPos: () => number | undefined;
  updateAttributes: (attrs: Attrs) => void;
  deleteNode: () => void;

  // changes between updates
  node: Writable<PMNode>;
  selected: Writable<boolean>;
  decorations: Writable<readonly Decoration[]>;
}

//@ts-expect-error skip
export class SvelteNodeView
  extends NodeView<ComponentType, Editor>
  implements ProseMirrorNodeView
{
  store!: Writable<NodeViewProps>;
  props: NodeViewRendererProps;
  context: NodeViewContext;
  renderer: SvelteRenderer;
  #contentDOM: HTMLElement | null = null;

  constructor(
    readonly options: NodeViewRendererOptions,
    props: NodeViewRendererProps
  ) {
    super(options.component, props, {
      stopEvent: options.stopEvent || null,
      ignoreMutation: options.ignoreMutation || null
    });
    this.props = props;
    this.context = {
      //immutable
      editor: this.editor,
      getPos: this.getPos,
      updateAttributes: (attrs = {}) => this.updateAttributes(attrs),
      deleteNode: this.deleteNode,
      contentDOM: (contentElement: HTMLElement) => {
        this.#contentDOM = contentElement;
      },

      //change between updates
      node: writable(this.node),
      selected: writable(false),
      decorations: writable(this.decorations)
    };

    this.renderer = new SvelteRenderer(options, this.context);
  }

  override get dom() {
    return this.renderer.element;
  }

  override get contentDOM() {
    if (this.node.isLeaf) return null;
    return this.#contentDOM || null;
  }

  deleteNode = () => {
    super.deleteNode();
    this.editor.chain().focus().scrollIntoView().run();
  };

  update(node: PMNode) {
    if (this.shouldUpdate(node)) {
      this.context.node.set(node);
      return true;
    }
    return false;
  }
  selectNode() {
    this.context.selected.set(true);
  }

  deselectNode() {
    this.context.selected.set(false);
  }

  shouldUpdate = (node: PMNode) => {
    if (node.type !== this.node.type) return false;
    if (node.sameMarkup(this.node) && node.content.eq(this.node.content))
      return false;
    return true;
  };
  destroy() {
    this.renderer.destroy();
  }
  ignoreMutation(mutation: MutationRecord) {
    if (!this.dom || !this.contentDOM) return true;

    if (this.node.isLeaf || this.node.isAtom) return true;

    if ((mutation.type as unknown) === 'selection') return false;

    if (this.contentDOM === mutation.target && mutation.type === 'attributes')
      return true;

    if (this.contentDOM.contains(mutation.target)) return false;

    return true;
  }
}

export interface NodeViewRendererOptions
  extends Partial<TNodeViewRendererOptions> {
  component: ComponentType;
  contentAs?: string;
  domAs?: string;
}
export const SvelteNodeViewRenderer = (options: NodeViewRendererOptions) => {
  return (props: NodeViewRendererProps) => {
    return new SvelteNodeView(options, props);
  };
};
