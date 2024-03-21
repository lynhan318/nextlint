import {mergeAttributes} from '@tiptap/core';
// eslint-disable-next-line import/named
import {Plugin, PluginKey} from '@tiptap/pm/state';
import TiptapLinkExtension, {type LinkOptions} from '@tiptap/extension-link';
import type {Mark, Node} from '@tiptap/pm/model';
// eslint-disable-next-line import/no-unresolved
import {FloatingRenderer} from '$lib/node-view';
import type {EditorView} from '@tiptap/pm/view';
import LinkPreview from './LinkPreview.svelte';

import type {ComponentType} from 'svelte';

export type NextLinkOptions = LinkOptions & {
  component: ComponentType;
};

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

export const LinkExtension = TiptapLinkExtension.extend<NextLinkOptions>({
  renderHTML({HTMLAttributes}) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },

  addProseMirrorPlugins() {
    const floatingRenderer = new FloatingRenderer({
      component: LinkPreview,
      editor: this.editor
    });
    return [
      new Plugin({
        key: new PluginKey('LinkPreview'),
        view: () => {
          return {
            destroy: floatingRenderer.destroy,
            update(view: EditorView) {
              const posOfCursor = view.state.selection.anchor;
              const {node} = view.domAtPos(posOfCursor);

              if (!node.parentNode) {
                floatingRenderer.unmount();
                return;
              }

              if (node.parentNode?.nodeName !== 'A') {
                floatingRenderer.unmount();
                return;
              }

              if (!view.state.selection.empty) {
                floatingRenderer.unmount();
                return;
              }
            }
          };
        },
        props: {
          handleDOMEvents: {
            mouseup: (view: EditorView, event: MouseEvent) => {
              const pos = view.posAtDOM(event.target as unknown as Node, 0);
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
