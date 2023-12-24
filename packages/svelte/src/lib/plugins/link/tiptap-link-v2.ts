import {mergeAttributes} from '@tiptap/core';
// eslint-disable-next-line import/named
import {Plugin, PluginKey} from '@tiptap/pm/state';
import TiptapLinkExtension, {type LinkOptions} from '@tiptap/extension-link';
import type {Mark, Node} from '@tiptap/pm/model';
// eslint-disable-next-line import/no-unresolved
import {FloatingRenderer} from '$lib/node-view';
import type {EditorView} from '@tiptap/pm/view';

import PreviewLinkModal from './PreviewLinkModal.svelte';

export type NextLinkOptions = LinkOptions;

export type LinkProps = {
  pos: number;
  node: Node;
  mark: Mark;
  dom: HTMLLinkElement;
};

const hasLinkMark = (marks: Readonly<Mark[]>) => {
  return marks.find(m => m.type.name === 'link');
};
export type Coordinate = {
  top: number;
  left: number;
  bottom: number;
  pos: number;
};

export const LinkExtension = TiptapLinkExtension.extend({
  renderHTML({HTMLAttributes}) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  addProseMirrorPlugins() {
    const floatingRenderer = new FloatingRenderer({
      component: PreviewLinkModal,
      editor: this.editor
    });
    return [
      new Plugin({
        key: new PluginKey('link-hover'),
        view: () => {
          return {destroy: floatingRenderer.destroy};
        },
        props: {
          handleDOMEvents: {
            click: (view: EditorView, event: MouseEvent) => {
              const pos = view.posAtDOM(event.target as unknown as Node, 0);
              if (!pos || (event.target as HTMLElement).tagName !== 'A') {
                floatingRenderer.unmount();
                return;
              }
              const node = view.state.doc.nodeAt(pos);

              if (node && hasLinkMark(node.marks || [])) {
                const mark = node.marks.find(
                  m => m.type.name === 'link'
                ) as Mark;

                floatingRenderer.mount({
                  element: event.target as HTMLLinkElement,
                  pos,
                  node,
                  mark
                });
              } else {
                floatingRenderer.unmount();
              }
            }
          }
        }
      })
    ];
  }
});
