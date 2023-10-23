import Styles from './Style.module.scss';
import {Node, mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import {writable} from 'svelte/store';
import {
  computePosition,
  flip,
  shift,
  type VirtualElement
} from '@floating-ui/dom';

import SelectImage from './SelectImage.svelte';
import Placeholder from './Placeholder.svelte';
import {ImportIcon, LucideImport} from 'lucide-svelte';

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
      Object.assign(element.style, {
        position: 'absolute',
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out'
      });
      component = new SelectImage({
        target: element,
        props: {
          onHide: () => {
            component.$destroy();
            Object.assign(wrapper.style, {
              opacity: 0
            });
          }
        },
        context: new Map().set('options', this.options).set('store', imageStore)
      });
      document.body.appendChild(element);
      return element;
    })();

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
            imageStore.set(props);
            const virtualElement: VirtualElement = {
              getBoundingClientRect: () => domRect
            };
            computePosition(virtualElement, wrapper, {
              placement: 'top',
              middleware: [shift(), flip()]
            }).then(({x, y}) => {
              Object.assign(wrapper.style, {
                top: `${y}px`,
                left: `${x}px`,
                opacity: 1
              });
            });
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
