import {Node, mergeAttributes} from '@tiptap/core';

import {SvelteNodeViewRenderer} from '$lib/node-view';

import TestNodePlugin from './TestNodePlugin.svelte';

export const TestNode = Node.create({
  name: 'svelteComponent',
  group: 'block',
  // atom: true,
  content: 'inline*',
  renderHTML({HTMLAttributes}) {
    return ['test-node', mergeAttributes(HTMLAttributes), 0];
  },
  parseHTML() {
    return [
      {
        tag: 'test-node'
      }
    ];
  },
  addNodeView() {
    return SvelteNodeViewRenderer({component: TestNodePlugin, contentAs: 'p'});
  }
});
