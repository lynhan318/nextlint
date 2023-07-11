import {Node, mergeAttributes} from '@tiptap/core';

import {SvelteNodeView} from '$lib/helpers';

import TestNodePlugin from './TestNodePlugin.svelte';

export const TestNode = Node.create({
  name: 'testPlugin',
  group: 'block',
  content: 'inline*',
  renderHTML({HTMLAttributes}) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-node-view-root': true
      }),
      ['p', 0]
    ];
  },
  parseHTML() {
    return [
      {
        tag: 'div',
        contentElement: 'p',
        getAttrs: element => {
          if (
            typeof element === 'string' ||
            !element.hasAttribute('data-node-view-root')
          )
            return false;
          return {'data-node-view-root': true};
        }
      }
    ];
  },
  addNodeView() {
    return props =>
      SvelteNodeView.create({
        nodeViewProps: props,
        component: TestNodePlugin
      });
  }
});
