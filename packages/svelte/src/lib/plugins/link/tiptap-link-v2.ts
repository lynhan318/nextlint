import {Editor, mergeAttributes} from '@tiptap/core';
import {Plugin, PluginKey, type PluginView} from '@tiptap/pm/state';
import TiptapLinkExtension, {type LinkOptions} from '@tiptap/extension-link';
import type {Mark, Node} from '@tiptap/pm/model';
import {get} from 'svelte/store';
import {computePosition, flip, shift} from '@floating-ui/dom';
import type {EditorView} from '@tiptap/pm/view';

import PreviewLinkModal from './PreviewLinkModal.svelte';
import {positionStore} from '$lib/components/Positioner';

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

class TooltipView implements PluginView {
  wrapper: HTMLDivElement;
  component: PreviewLinkModal | null = null;
  showing = false;

  constructor(
    readonly view: EditorView,
    readonly editor: Editor
  ) {
    this.wrapper = document.createElement('div');
    this.wrapper.style.cssText = 'position: absolute; z-index: 1;opacity:0';
    document.body.appendChild(this.wrapper);

    editor.on('blur', () => {
      this.hide();
    });
  }

  clean() {
    this.wrapper?.remove();
    this.component?.$destroy();
  }

  show(linkProps: LinkProps) {
    this.component ||= new PreviewLinkModal({
      target: this.wrapper,
      props: {linkProps, editor: this.editor, onHide: () => this.hide()}
    });

    //Do not shot preview popup when selection position is visible
    if (get(positionStore).selection) {
      this.hide();
      return;
    }

    computePosition(linkProps.dom, this.wrapper, {
      placement: 'top',
      middleware: [shift(), flip()]
    }).then(({x, y}) => {
      Object.assign(this.wrapper.style, {
        top: `${y}px`,
        left: `${x}px`,
        opacity: 1
      });
      this.component?.$set({linkProps});
      this.showing = true;
    });
  }

  hide() {
    if (this.wrapper) {
      this.wrapper.style.opacity = '0';
    }
    this.showing = false;
  }

  destroy() {
    this.clean();
  }
}

export const LinkExtension = TiptapLinkExtension.extend({
  renderHTML({HTMLAttributes}) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  addProseMirrorPlugins() {
    let pluginView: TooltipView;
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey('link-hover'),
        view: editorView => {
          pluginView = new TooltipView(editorView, editor);
          return pluginView;
        },
        props: {
          handleDOMEvents: {
            mouseover: (view: EditorView, event: MouseEvent) => {
              const pos = view.posAtDOM(event.target as Node, 0);
              if (!pos || (event.target as HTMLElement).tagName !== 'A') {
                return pluginView.hide();
              }
              const node = view.state.doc.nodeAt(pos);

              if (node && hasLinkMark(node.marks || [])) {
                const mark = node.marks.find(
                  m => m.type.name === 'link'
                ) as Mark;

                pluginView.show({
                  pos,
                  node,
                  mark,
                  dom: event.target as HTMLLinkElement
                });
              } else {
                pluginView.hide();
              }
            }
          }
        }
      })
    ];
  }
});
