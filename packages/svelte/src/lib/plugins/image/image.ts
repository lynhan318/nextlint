import './Style.scss';

import {Node, mergeAttributes, type NodeViewRendererProps} from '@tiptap/core';
import {writable} from 'svelte/store';

import Placeholder from './Placeholder.svelte';
import {SvelteNodeViewRenderer} from '$lib/node-view';

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
  selectable: true,
  atom: true,
  addOptions() {
    return {
      triggerOnMount: false
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
