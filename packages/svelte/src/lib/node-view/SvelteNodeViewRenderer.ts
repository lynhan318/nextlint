//Inspire by Prosemirror Adapter by Mirone.
import type {
  Decoration,
  NodeView as ProseMirrorNodeView
} from '@tiptap/pm/view';
import type {Attrs, Node as PMNode} from '@tiptap/pm/model';

import {getContext, type ComponentType, type SvelteComponent} from 'svelte';
import {
  NodeView,
  type Editor,
  type NodeViewProps,
  type NodeViewRendererProps,
  type NodeViewRendererOptions as TNodeViewRendererOptions
} from '@tiptap/core';

import {writable, type Writable} from 'svelte/store';

export type Theme = 'dark' | 'light';

export interface NodeViewContext {
  // immutable
  editor: Editor;
  contentDOM: (node: HTMLElement) => void;
  getPos: () => number | undefined;
  updateAttributes: (attrs: Attrs) => void;
  deleteNode: () => void;
  selectNode: () => void;
  deSelectNode: () => void;
  options?: unknown;

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
  renderer: SvelteComponent;
  contentElement: HTMLElement | null = null;
  element: HTMLElement;

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
      options: options.options || {},
      updateAttributes: (attrs = {}) => this.updateAttributes(attrs),
      deleteNode: () => this.deleteNode(),
      selectNode: () => this.selectNode(),
      deSelectNode: () => this.deselectNode(),
      contentDOM: (contentElement: HTMLElement) => {
        this.contentElement = this.#createElement(options.contentAs);
        this.contentElement.setAttribute('data-node-view-content', 'true');
        this.contentElement.style.whiteSpace = 'inherit';
        contentElement.appendChild(this.contentElement);
      },

      //change between updates
      node: writable(this.node),
      selected: writable(false),
      decorations: writable(this.decorations)
    };

    this.element = this.#createElement(options.domAs);
    this.element.setAttribute('data-node-view-root', 'true');
    this.renderer = new options.component({
      target: this.element,
      context: new Map(Object.entries(this.context))
    });
  }

  #createElement(as?: string | HTMLElement | ((node: PMNode) => HTMLElement)) {
    const {node} = this;
    return as == null
      ? document.createElement(node.isInline ? 'span' : 'div')
      : as instanceof HTMLElement
        ? as
        : as instanceof Function
          ? as(this.node)
          : document.createElement(as);
  }

  override get dom() {
    return this.element;
  }

  override get contentDOM() {
    if (this.node.isLeaf) return null;
    return this.contentElement || null;
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
    this.editor.commands.setNodeSelection(this.getPos());
    this.context.selected.set(true);
    requestAnimationFrame(() => {
      this.element.classList.add('ProseMirror-selectednode');
    });
  }

  deselectNode() {
    requestAnimationFrame(() => {
      this.element.classList.remove('ProseMirror-selectednode');
    });
    this.context.selected.set(false);
  }

  shouldUpdate = (node: PMNode) => {
    if (node.type !== this.node.type) return false;
    if (node.sameMarkup(this.node) && node.content.eq(this.node.content))
      return false;
    return true;
  };
  destroy() {
    this.contentElement?.remove();
    this.element?.remove();
    this.renderer?.$destroy();
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
  options?: unknown;
  domAs?: string | ((node: PMNode) => HTMLElement);
  contentAs?: string;
}

export const SvelteNodeViewRenderer = (options: NodeViewRendererOptions) => {
  return (props: NodeViewRendererProps) => {
    return new SvelteNodeView(options, props);
  };
};

export const useNodeViewContext = <K extends keyof NodeViewContext>(
  ctxKey: K
) => getContext<NodeViewContext[K]>(ctxKey);
