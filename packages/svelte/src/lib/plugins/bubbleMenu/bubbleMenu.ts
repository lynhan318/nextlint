//reference source at: https://github.com/ueberdosis/tiptap/blob/develop/packages/extension-bubble-menu/src/bubble-menu-plugin.ts
//except part replace tippy with floating-ui
//
import {FloatingRenderer} from '$lib/node-view';
import {Editor, Extension, isTextSelection} from '@tiptap/core';
import {EditorState, Plugin, PluginKey} from '@tiptap/pm/state';
import type {ComponentType} from 'svelte';
import type {EditorView} from '@tiptap/pm/view';

import type {VirtualElement} from '@floating-ui/dom';

type BubbleMenuOptions = {
  component: ComponentType;
};

export const BubbleMenuExtension = Extension.create<BubbleMenuOptions>({
  name: 'BubbleMenu',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('BunbbleMenu'),
        view: view =>
          new BubbleMenuView({
            editor: this.editor,
            component: this.options.component,
            view
          })
      })
    ];
  }
});

class BubbleMenuView {
  private editor: Editor;
  private floatingRenderer: FloatingRenderer;
  private preventHide = false;
  private isVisible = false;

  constructor({
    view,
    editor,
    component
  }: {
    editor: Editor;
    component: ComponentType;
    view: EditorView;
  }) {
    this.editor = editor;
    this.floatingRenderer = new FloatingRenderer({
      editor: editor,
      component: component,
      portal: view.dom.parentElement!
    });

    this.floatingRenderer.element.addEventListener(
      'mousedown',
      this.mousedownHandler,
      {capture: true}
    );

    this.editor.on('blur', this.blurHandler);
    this.editor.on('focus', this.focusHandler);
  }

  blurHandler = ({event}: {event: FocusEvent}) => {
    if (this.preventHide) {
      this.preventHide = false;
      return;
    }
    if (
      event?.relatedTarget &&
      this.floatingRenderer.element.contains(event.relatedTarget as Node)
    ) {
      return;
    }

    this.hide();
  };

  focusHandler = () => {
    setTimeout(() => {
      this.update(this.editor.view);
    });
  };

  mousedownHandler = () => {
    this.preventHide = true;
  };

  update(view: EditorView, oldState?: EditorState) {
    const selectionChanged = !oldState?.selection.eq(view.state.selection);
    const docChanged = !oldState?.doc.eq(view.state.doc);
    const same = !selectionChanged && !docChanged;

    if (same || view.composing) {
      return;
    }

    this.updateHandler(view);
  }

  shouldShow(view: EditorView) {
    const {doc, selection: sel} = view.state;

    const isEmptyTextBlock =
      !doc.textBetween(sel.from, sel.to).length && isTextSelection(sel);

    const isEditorFocus =
      view.hasFocus() ||
      this.floatingRenderer.element.contains(document.activeElement);

    if (
      !isEditorFocus ||
      sel.empty ||
      isEmptyTextBlock ||
      !this.editor.isEditable
    ) {
      return false;
    }
    return true;
  }

  updateHandler = (view: EditorView) => {
    if (!this.shouldShow(view)) {
      this.hide();
      return;
    }
    // if (this.isVisible) return;
    const {from, to} = view.state.selection;
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

    const virtualElement: VirtualElement = {
      getBoundingClientRect() {
        return new DOMRect(left, coordFrom.top);
      }
    };
    this.floatingRenderer.updateOrMount({
      element: virtualElement
    });
    this.isVisible = true;
  };
  hide() {
    this.isVisible = false;
    this.floatingRenderer.unmount();
  }
  destroy() {
    this.floatingRenderer?.element.removeEventListener(
      'onmousedown',
      this.mousedownHandler,
      {capture: true}
    );
    this.editor.off('focus', this.focusHandler);
    this.editor.off('blur', this.blurHandler);
    this.floatingRenderer?.destroy();
  }
}
