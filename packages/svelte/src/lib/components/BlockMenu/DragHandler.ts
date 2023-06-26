import {throttle, debounce} from 'radash';
import type {Editor} from '@tiptap/core';
import {NodeSelection} from '@tiptap/pm/state';
import type {EditorView} from '@tiptap/pm/view';
import * as pv from '@tiptap/pm/view';

const serializeForClipboard = (pv as any).__serializeForClipboard;
let dragImageElement: Element | undefined;

export class DragHandler {
  menuOpen = false;
  isDragging = false;
  lockMenu = false;

  handlers: {name: string; handler: (event: Event) => void}[];

  constructor(readonly editorView: EditorView, readonly editor: Editor) {
    this.handlers = ['dragover', 'dragstart', 'drop', 'mousemove'].map(name => {
      const handler = (e: Event) => {
        (this as any)[name](e);
      };
      editorView.dom.addEventListener(name, handler, true);
      return {name, handler};
    });
  }

  drop = debounce({delay: 50}, (event: DragEvent) => {
    if ((event as any).synthetic || !this.isDragging) {
      return;
    }
    const pos = this.editor.view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    });

    this.isDragging = false;

    if (pos) {
      const evt = new Event('drop', event) as any;
      const editorBoundingBox = (
        this.editor.view.dom.firstChild! as HTMLElement
      ).getBoundingClientRect();
      evt.clientX = editorBoundingBox.left + editorBoundingBox.width / 2;
      evt.clientY = event.clientY;
      evt.dataTransfer = event.dataTransfer;
      evt.preventDefault = () => event.preventDefault();
      evt.synthetic = true; // prevent recursion
      // console.log("dispatch fake drop");
      this.editor.view.dom.dispatchEvent(evt);

      // hide block menu when drop, restore initial state
      this.lockMenu = false;
      this.menuOpen = false;
    }
  });

  dragstart = (event: DragEvent) => {
    this.isDragging = true;
  };

  dragover = (event: DragEvent) => {
    if ((event as any).synthetic || !this.isDragging) {
      return;
    }
    const pos = this.editor.view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    });

    if (!pos || pos.inside === -1) {
      const evt = new Event('dragover', event) as any;
      const editorBoundingBox = (
        this.editor.view.dom.firstChild! as HTMLElement
      ).getBoundingClientRect();
      evt.clientX = editorBoundingBox.left + editorBoundingBox.width / 2;
      evt.clientY = event.clientY;
      evt.dataTransfer = event.dataTransfer;
      evt.preventDefault = () => event.preventDefault();
      evt.synthetic = true; // prevent recursion
      // console.log("dispatch fake dragover");
      this.editor.view.dom.dispatchEvent(evt);
    }
  };

  mousemove = throttle({interval: 50}, (event: MouseEvent) => {
    if (this.lockMenu) return;
    const editorBox = (
      this.editor.view.dom.firstChild! as HTMLElement
    ).getBoundingClientRect();

    // Gets block at mouse cursor's vertical position.
    const coords = {
      left: editorBox.left + editorBox.width / 2, // take middle of editor
      top: event.clientY
    };
    const pos = this.editorView.posAtCoords(coords);
    const block = getDraggableBlockFromCoords(coords, this.editor.view);

    const resolver = this.editorView.state.doc.resolve(pos.pos);

    this.menuOpen = true;
  });

  destroy() {
    this.handlers.map(({name, handler}) => {
      this.editorView.dom.removeEventListener(name, handler);
    });
  }
}

function getDraggableBlockFromCoords(
  coords: {left: number; top: number},
  view: EditorView
) {
  if (!view.dom.isConnected) return undefined;

  const pos = view.posAtCoords(coords);
  if (!pos) return undefined;

  const resolver = view.state.doc.resolve(pos.pos);
  if (!resolver) return undefined;

  const node = view.domAtPos(resolver.start(1), -1);
  if (!node) return undefined;
  //Find parent node, for example resolver.start(1) on figure return figurecaption
  while (node.node && !node.node?.getAttribute?.('data-node-type')) {
    node.node = node.node.parentNode;
  }
  if (node.node) {
    return {node: node.node, id: node.node.id};
  }
  return undefined;
}

export function dragStart(e: DragEvent, view: EditorView) {
  if (!e.dataTransfer) {
    return;
  }

  const editorBoundingBox = view.dom.getBoundingClientRect();

  const coords = {
    left: editorBoundingBox.left + editorBoundingBox.width / 2, // take middle of editor
    top: e.clientY
  };

  const pos = blockPositionFromCoords(coords, view);
  if (pos != null) {
    const resolver = view.state.doc.resolve(pos);
    view.dispatch(
      view.state.tr.setSelection(
        NodeSelection.create(view.state.doc, resolver.start(1) - 1) // get root block level
      )
    );
    setDragImage(view, pos);

    const slice = view.state.selection.content();

    const {dom, text} = serializeForClipboard(view, slice);

    const blockFromCoords = view.nodeDOM(pos);

    e.dataTransfer.clearData();
    e.dataTransfer.setData('text/html', dom.innerHTML);
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(blockFromCoords!, -10, -10);
    view.dragging = {slice, move: true};
  }
}
export function blockPositionFromCoords(
  coords: {left: number; top: number},
  view: EditorView
) {
  const block = getDraggableBlockFromCoords(coords, view);

  if (block && block.node.nodeType === 1) {
    // TODO: this uses undocumented PM APIs? do we need this / let's add docs?
    const docView = (view as any).docView;
    const desc = docView.nearestDesc(block.node, true);
    if (!desc || desc === docView) {
      return null;
    }
    return desc.posBefore;
  }
  return null;
}

export function setDragImage(view: EditorView, from: number, to = from) {
  if (from === to) {
    // Moves to position to be just after the first (and only) selected block.
    to += view.state.doc.resolve(from + 1).node().nodeSize;
  }

  // Parent element is cloned to remove all unselected children without affecting the editor content.
  const parentClone = view.domAtPos(from).node.cloneNode(true) as Element;
  const parent = view.domAtPos(from).node as Element;

  const getElementIndex = (parentElement: Element, targetElement: Element) =>
    Array.prototype.indexOf.call(parentElement.children, targetElement);

  const firstSelectedBlockIndex = getElementIndex(
    parent,
    // Expects from position to be just before the first selected block.
    view.domAtPos(from + 1).node.parentElement!
  );
  const lastSelectedBlockIndex = getElementIndex(
    parent,
    // Expects to position to be just after the last selected block.
    view.domAtPos(to - 1).node.parentElement!
  );

  for (let i = parent.childElementCount - 1; i >= 0; i--) {
    if (i > lastSelectedBlockIndex || i < firstSelectedBlockIndex) {
      parentClone.removeChild(parentClone.children[i]);
    }
  }
  unsetDragImage();

  dragImageElement = parentClone;

  document.body.appendChild(dragImageElement);
}

function unsetDragImage() {
  if (dragImageElement !== undefined) {
    document.body.removeChild(dragImageElement);
    dragImageElement = undefined;
  }
}
