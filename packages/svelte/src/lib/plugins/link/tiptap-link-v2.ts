import {Editor, mergeAttributes} from '@tiptap/core';
import {Plugin, PluginKey, type PluginView} from '@tiptap/pm/state';
import TiptapLinkExtension, {type LinkOptions} from '@tiptap/extension-link';
import tippy, {type Instance, type Props} from 'tippy.js';
import type {Mark, Node} from '@tiptap/pm/model';
import type {EditorView} from '@tiptap/pm/view';

import PreviewLinkModal from './PreviewLinkModal.svelte';
import {get} from 'svelte/store';
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
  svelteComponent: PreviewLinkModal | null = null;
  tooltipContent: HTMLDivElement | null = null;
  popup: Instance<Props> | null = null;
  showing = false;

  constructor(readonly view: EditorView, readonly editor: Editor) {
    editor.on('blur', () => {
      this.hide();
    });
  }

  clean() {
    if (this.popup) {
      this.popup?.destroy();
      this.popup = null;
    }
    if (this.tooltipContent) {
      this.tooltipContent.remove();
      this.tooltipContent = null;
    }
    if (this.svelteComponent) {
      this.svelteComponent?.$destroy();
      this.svelteComponent = null;
    }
  }

  show(linkProps: LinkProps) {
    this.tooltipContent ||= document.createElement('div');

    this.svelteComponent ||= new PreviewLinkModal({
      target: this.tooltipContent,
      props: {linkProps, editor: this.editor, onHide: () => this.hide()}
    });

    this.popup ||= tippy('body', {
      offset: [0, -10],
      getReferenceClientRect: () => linkProps.dom.getBoundingClientRect(),
      content: this.tooltipContent,
      appendTo: () => document.body,
      interactive: true,
      animation: 'fade',
      showOnCreate: true
    })[0];

    //Do not shot preview popup when selection position is visible
    if (get(positionStore).selection) {
      this.hide();
      return;
    }

    this.svelteComponent.$set({linkProps});
    this.popup.setProps({
      getReferenceClientRect: () => linkProps.dom.getBoundingClientRect()
    });
    this.popup.show();
    this.showing = true;
  }
  hide() {
    this.showing = false;
    this.popup?.setProps({
      getReferenceClientRect: null
    });
    this.popup?.hide();
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
