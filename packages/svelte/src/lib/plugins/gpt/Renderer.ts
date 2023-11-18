import {computePosition, flip, hide, shift} from '@floating-ui/dom';

import type {EditorView} from '@tiptap/pm/view';
import type {Editor, Content} from '@tiptap/core';

import PromtComponent from './Prompt.svelte';

export class Renderer {
  private svelteComponent: PromtComponent | null = null;
  private tooltipWrapper: HTMLDivElement | null = null;
  constructor(
    readonly view: EditorView,
    readonly editor: Editor,
    readonly options
  ) {
    const editorDOM = view.dom.parentNode as HTMLElement;
    if (editorDOM) {
      this.tooltipWrapper = document.createElement('div');
      Object.assign(this.tooltipWrapper.style, {
        position: 'absolute',
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out'
      });
      editorDOM.appendChild(this.tooltipWrapper);
    }
  }
  show(props: {node: HTMLElement}) {
    this.svelteComponent ||= new PromtComponent({
      target: this.tooltipWrapper,
      context: new Map([['options', this.options]]),
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
    if (this.tooltipWrapper) {
      computePosition(props.node, this.tooltipWrapper, {
        placement: 'left',
        middleware: [
          flip(),
          shift(),
          hide({
            strategy: 'escaped'
          })
        ]
      }).then(({x, y}) => {
        Object.assign(this.tooltipWrapper!.style, {
          top: `${y}px`,
          left: `${x}px`
        });
        requestAnimationFrame(() => {
          Object.assign(this.tooltipWrapper!.style, {
            opacity: 1
          });
          this.tooltipWrapper?.querySelector('textarea')?.focus();
        });
      });
    }
  }

  hide() {
    if (this.tooltipWrapper) {
      Object.assign(this.tooltipWrapper.style, {
        opacity: 0
      });
      this.svelteComponent?.onHide();
      this.svelteComponent?.$destroy();
      this.svelteComponent = null;
    }
  }
  destroy() {
    this.svelteComponent?.$destroy();
    this.tooltipWrapper?.remove();
  }
}
