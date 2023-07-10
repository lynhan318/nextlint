import tippy, {type Instance, type Props} from 'tippy.js';
import type {EditorView} from '@tiptap/pm/view';
import type {Editor, Content} from '@tiptap/core';

import PromtComponent from './Prompt.svelte';

const createHidePlugin = (editor: Editor) => ({
  name: 'hideOnEsc',
  defaultValue: true,
  fn({hide}) {
    function onKeyDown(event) {
      if (event.keyCode === 27) {
        hide();
        editor.commands.focus();
      }
    }

    return {
      onShow() {
        document.addEventListener('keydown', onKeyDown);
      },
      onHide() {
        document.removeEventListener('keydown', onKeyDown);
      }
    };
  }
});

export class Renderer {
  private svelteComponent: PromtComponent | null = null;
  private tooltipWrapper: HTMLDivElement | null = null;
  popup: Instance<Props>;
  constructor(
    readonly view: EditorView,
    readonly editor: Editor,
    readonly options
  ) {
    const editorDOM = view.dom.parentNode as HTMLElement;
    if (editorDOM) {
      this.tooltipWrapper = document.createElement('div');
      this.svelteComponent = new PromtComponent({
        target: this.tooltipWrapper,
        context: new Map([['options', options]]),
        props: {
          onClose: () => this.hide(),
          onApply: (text: string) => {
            const content: Content = [];
            text.split('\n').forEach(line => {
              if (!line) return;
              if (line) {
                content.push({
                  type: 'paragraph',
                  content: [{type: 'text', text: line}]
                });
              }
            });
            this.editor
              .chain()
              .insertContent(content)
              .selectTextblockEnd()
              .focus()
              .run();

            this.hide();
          }
        }
      });
      editorDOM.appendChild(this.tooltipWrapper);
      this.popup ||= tippy('body', {
        getReferenceClientRect: () => new DOMRect(-9999, -9999),
        content: this.tooltipWrapper,
        showOnCreate: false,
        hideOnClick: true,
        interactive: true,
        trigger: 'manual',
        placement: 'top-start',
        plugins: [createHidePlugin(this.editor)]
      })[0];
    }
  }
  show(props: any) {
    requestAnimationFrame(() => {
      this.popup.setProps({
        getReferenceClientRect: props.clientRect
      });
      this.popup.show();
      this.svelteComponent?.onShow();
    });
  }

  hide() {
    this.popup?.hide();
    this.svelteComponent?.onHide();
  }
  destroy() {
    this.svelteComponent?.$destroy();
    this.popup?.destroy();
  }
}
