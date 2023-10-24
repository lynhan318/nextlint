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

const wrapper = document.createElement('div');
Object.assign(wrapper.style, {
  position: 'absolute',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out'
});
document.body.appendChild(wrapper);

let component: SelectImage | null;
const imageStore = writable<NodeViewRendererProps | null>(null);
function createImageModal(options: SelectImageOptions) {
  component ||= new SelectImage({
    target: wrapper,
    props: {
      onHide: () => {
        Object.assign(wrapper.style, {
          opacity: 0
        });
        component?.$destroy();
        component = null;
      }
    },
    context: new Map().set('options', options).set('store', imageStore)
  });
  return () => {
    component?.$destroy();
    component = null;
  };
}

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
    return (props: NodeViewRendererProps) => {
      const sveltorImage = document.createElement('select-image');
      sveltorImage.setAttribute('data-node-type', this.name);
      sveltorImage.classList.add(Styles.selectImage);

      const placeholder = new Placeholder({
        target: sveltorImage,
        context: new Map().set('options', this.options),
        props: {
          props,
          triggerOnMount: Boolean(props.HTMLAttributes.triggerOnMount),
          onOpen: (domRect: DOMRect) => {
            imageStore.set(props);
            component?.$destroy();
            component = new SelectImage({
              target: wrapper,
              props: {
                onHide: () => {
                  Object.assign(wrapper.style, {
                    opacity: 0
                  });
                  component?.$destroy();
                }
              },
              context: new Map()
                .set('options', this.options)
                .set('store', imageStore)
            });

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
    component = null;
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
export {imageStore};
