import './Style.scss';

import {Node, mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import {SvelteNodeViewRenderer} from '$lib/node-view';
import {writable} from 'svelte/store';

import Placeholder from './Placeholder.svelte';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    placeholder: {
      createImageBlock: () => ReturnType;
    };
  }
}

export interface SelectImageOptions {
  handleUpload?: (file: File) => Promise<string>;
  unsplash?: {
    accessKey: string;
  };
  triggerOnMount: boolean;
}

const imageStore = writable<NodeViewRendererProps | null>(null);

export const SelectImageExtension = Node.create<SelectImageOptions>({
  name: 'selectImage',
  group: 'block',
  atom: true,
  selectable: true,
  addOptions() {
    return {
      triggerOnMount: false
    };
  },

  parseHTML() {
    return [
      {
        tag: 'image-placeholder'
      }
    ];
  },

  renderHTML({HTMLAttributes}) {
    return ['image-placeholder', mergeAttributes(HTMLAttributes), '*'];
  },

  addNodeView() {
    return SvelteNodeViewRenderer({
      component: Placeholder,
      domAs: 'image-placeholder'
    });
  },

  addCommands() {
    return {
      createImageBlock:
        () =>
        ({commands, editor}) => {
          SelectImageExtension.options.triggerOnMount = true;
          const curSelection = editor.state.selection.$head.node(1);
          const content = [{type: this.name}];
          if (editor.state.doc.lastChild?.eq(curSelection)) {
            content.push({
              type: 'paragraph'
            });
          }
          return commands.insertContent(content);
        }
    };
  }
});
export {imageStore};
