import type {Node} from '@tiptap/pm/model';
import {mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';

type RenderParams = {
  node: Node;
  HTMLAttributes: Record<string, any>;
};

export const renderHTML = ({HTMLAttributes}: RenderParams) => {
  const figure = document.createElement('figure');
  const caption = document.createElement('figcaption');
  const image = document.createElement('img');
  Object.entries(mergeAttributes(HTMLAttributes)).forEach(([k, v = '']) => {
    image.setAttribute(k, v);
    figure.setAttribute(k, v);
  });
  caption.innerText = HTMLAttributes.alt;
  figure.append(image, caption);
  return {dom: figure, contentDOM: caption};
};

export const setFocusNode = (nodeViewProps: NodeViewRendererProps): boolean => {
  const {editor, getPos, node} = nodeViewProps;
  if (typeof getPos !== 'function' || !node) return false;

  return editor.chain().setNodeSelection(getPos()).focus().run();
};
