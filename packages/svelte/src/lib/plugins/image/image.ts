import './Style.scss';

import {Node, mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import {writable} from 'svelte/store';
import {
  computePosition,
  flip,
  shift,
  type VirtualElement
} from '@floating-ui/dom';

import Placeholder from './Placeholder.svelte';
import {SvelteNodeViewRenderer} from '$lib/node-view';

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

let wrapper;
if (typeof document !== 'undefined') {
  wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  Object.assign(wrapper.style, {
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out'
  });
  document.body.appendChild(wrapper);
}

const imageStore = writable<NodeViewRendererProps | null>(null);

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
    return SvelteNodeViewRenderer({
      component: Placeholder,
      domAs: 'select-image'
    });
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
