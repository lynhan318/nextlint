import {Node, mergeAttributes} from '@tiptap/core';

import {SvelteNodeViewRenderer} from '$lib/helpers';

import TestNodePlugin from './TestNodePlugin.svelte';

export const TestNode = Node.create({
  name: 'svelteComponent',
  group: 'block',
  // atom: true,
  content: 'inline*',
  renderHTML({HTMLAttributes}) {
    return ['svelte-component', mergeAttributes(HTMLAttributes), 0];
  },
  parseHTML() {
    return [
      {
        tag: 'svelte-component'
      }
    ];
  },
  addNodeView() {
    return SvelteNodeViewRenderer(TestNodePlugin);
  }
});
