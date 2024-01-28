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

export interface ImagePluginOptions {
  handleUpload?: (file: File) => Promise<string>;
  unsplash?: {
    accessKey: string;
  };
  triggerOnMount: boolean;
}

const imageStore = writable<NodeViewRendererProps | null>(null);

export const SelectImageExtension = Node.create<ImagePluginOptions>({
  name: 'selectImage',
  group: 'block',
  atom: true,
  selectable: true,

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
      domAs: 'image-placeholder',
      stopEvent() {
        return true;
      }
    });
  },

  addCommands() {
    return {
      createImageBlock:
        () =>
        ({commands, editor}) => {
          this.options.triggerOnMount = true;
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
