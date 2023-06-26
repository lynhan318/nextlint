import {isNodeSelection, isTextSelection} from '@tiptap/core';
import type {EditorView} from '@tiptap/pm/view';
import type {PositionData} from './provider';
import type {Positioner} from '.';

export type GetCoord = DOMRect | null;

export const coordAtCursor = (
  view: EditorView,
  event: MouseEvent
): PositionData | null => {
  const {anchor} = view.state.selection;

  const resolver = view.state.selection.$anchor;
  return {
    pos: anchor,
    resolver,
    clientRects: new DOMRect(event.x, event.y),
    blockDOM: view.domAtPos(resolver.start(1))?.node as HTMLElement
  };
};

export const blockEndCoordinate = (view: EditorView) => {
  const {selection, doc} = view.state;
  const editorBox = (
    view.dom.firstChild as HTMLElement
  ).getBoundingClientRect();
  const coord = view.coordsAtPos(selection.from);
  return new DOMRect(editorBox.right, coord.top);
};

export const blockHoverCoordinate = (
  view: EditorView,
  event: MouseEvent
): PositionData | null => {
  const editorBox = (
    view.dom.firstChild as HTMLElement
  ).getBoundingClientRect();

  console.log('editorBox', editorBox);

  const pos = view.posAtCoords({
    left: editorBox.right / 2,
    top: event.y
  });

  if (!pos?.pos) return null;

  let node: HTMLElement | null = view.domAtPos(pos.pos, -1).node;

  while (node) {
    //Reach root node
    if (node.classList?.contains?.('ProseMirror')) {
      return null;
    }
    if (node.getAttribute?.('data-node-type')) {
      return {
        resolver: view.state.doc.resolve(pos.pos),
        pos: pos.pos,
        clientRects: node.getBoundingClientRect(),
        blockDOM: node
      };
    }
    node = node.parentNode as HTMLElement;
  }
  return null;
};

export const blockAtCursor = (
  view: EditorView,
  event: MouseEvent
): PositionData | null => {
  const editorBox = (
    view.dom.firstChild as HTMLElement
  ).getBoundingClientRect();
  const pos = view.posAtCoords({
    left: editorBox.left,
    top: event.y
  });
  if (pos?.pos) {
    const domAtPos = view.domAtPos(pos?.pos, -1);
    let domNode = domAtPos?.node as HTMLElement;
    while (domNode && !domNode.hasAttribute?.('data-node-type')) {
      domNode = domNode.parentNode as HTMLElement;
    }
    if (domNode) {
      return {
        pos: pos.pos,
        clientRects: new DOMRect(
          editorBox.left,
          domNode.getBoundingClientRect().top
        ),
        blockDOM: domNode,
        resolver: view.state.doc.resolve(pos.pos)
      };
    }
  }
  return null;
};

export const emptyBlock = (view: EditorView) => {
  const sel = view.state.selection;
  const {$anchor, empty} = sel;
  const isRootDepth = $anchor.depth === 1;
  const isEmpty =
    $anchor.parent.isTextblock &&
    !$anchor.parent.type.spec.code &&
    !$anchor.parent.textContent;

  if (!empty || !isRootDepth || !isEmpty || !view.editable) {
    return false;
  }
  return true;
};

export const selectionCoords = (view: EditorView): PositionData | null => {
  const {doc, selection: sel} = view.state;

  const isEmptyTextBlock =
    !doc.textBetween(sel.from, sel.to).length && isTextSelection(sel);

  if (isNodeSelection(sel) || sel.empty || isEmptyTextBlock || !view.editable)
    return null;

  const {ranges} = sel;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const to = Math.max(...ranges.map(range => range.$to.pos));

  const coordFrom = view.coordsAtPos(from);
  const coordTo = view.coordsAtPos(to);

  const left = (() => {
    let x = (coordTo.left + coordFrom.left) / 2;
    // element should render full width of view
    if (coordTo.top !== coordFrom.top) {
      const editorBox = (
        view.dom.offsetParent as HTMLElement
      ).getBoundingClientRect();
      x = (editorBox.left + editorBox.right) / 2;
    }
    return x;
  })();

  return {
    clientRects: new DOMRect(left, coordFrom.top),
    pos: sel.from,
    blockDOM: view.domAtPos(sel.from).node as HTMLElement,
    resolver: doc.resolve(from)
  };
};
