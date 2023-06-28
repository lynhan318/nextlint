import Styles from './Style.module.scss';
import {Node, mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import tippy, {type Instance, type Props} from 'tippy.js';
import {writable} from 'svelte/store';

import SelectImage from './SelectImage.svelte';
import Placeholder from './Placeholder.svelte';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    placeholder: {
      toggleSelectImage: () => ReturnType;
    };
  }
}

export interface SelectImageOptions {
  handleUpload?: (file: File) => Promise<string>;
  unsplash?: {
    accessKey: string;
  };
}

let popup: Instance<Props>;
let wrapper: HTMLElement;
let component: SelectImage;
export const imageStore = writable<NodeViewRendererProps | null>(null);
export const SelectImageExtension = Node.create<SelectImageOptions>({
  name: 'selectImage',
  group: 'block',
  selectable: true,
  atom: true,
  addAttributes() {
    return {
      triggerOnMount: {
        default: false
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'select-image'
      }
    ];
  },

  renderHTML({HTMLAttributes}) {
    return ['select-image', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    wrapper ||= (() => {
      const element = document.createElement('div');
      component = new SelectImage({
        target: element,
        props: {
          onHide: () => {
            popup.hide();
          }
        },
        context: new Map().set('options', this.options).set('store', imageStore)
      });
      return element;
    })();
    popup ||= tippy('body', {
      getReferenceClientRect: null,
      animation: 'fade',
      interactive: true,
      trigger: 'manual',
      content: wrapper
    })[0];

    return (props: NodeViewRendererProps) => {
      const sveltorImage = document.createElement('select-image');
      sveltorImage.setAttribute('data-node-type', this.name);
      sveltorImage.classList.add(Styles.selectImage);

      const placeholder = new Placeholder({
        target: sveltorImage,
        context: new Map().set('options', this.options),
        props: {
          props,
          triggerOnMount: props.HTMLAttributes.triggerOnMount || false,
          onOpen: (domRect: DOMRect) => {
            popup.setProps({
              getReferenceClientRect: () => domRect
            });
            imageStore.set(props);
            popup.show();
          }
        }
      });
      return {
        dom: sveltorImage,
        destroy: () => {
          placeholder.$destroy();
        }
      };
    };
  },
  onDestroy: () => {
    wrapper?.remove?.();
    component?.$destroy?.();
    popup?.destroy?.();
  },

  addCommands() {
    return {
      toggleSelectImage:
        () =>
        ({commands}) => {
          commands.insertContent({
            type: this.name,
            attrs: {triggerOnMount: true}
          });
        }
    };
  }
});
