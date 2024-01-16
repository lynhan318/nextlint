import {isTextSelection} from '@tiptap/core';
import type {EditorView} from '@tiptap/pm/view';

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
