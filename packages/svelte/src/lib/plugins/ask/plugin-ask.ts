import {Node} from '@tiptap/core';
import {Plugin, PluginKey} from '@tiptap/pm/state';

import {Renderer} from './Renderer';

export interface AskOptions {
  query: (question: string) => Promise<string>;
}

export const PluginAsk = Node.create<AskOptions>({
  name: 'ask',

  addProseMirrorPlugins() {
    const renderer = new Renderer(this.editor.view, this.editor, this.options);
    return [
      new Plugin<{isEmpty: boolean}>({
        key: new PluginKey('ask'),
        state: {
          apply: (tr, prev, oldState, state) => {
            const node = state.selection.$head.node(1);
            const isEmpty =
              node &&
              !node.isLeaf &&
              !node.childCount &&
              node.type.name === 'paragraph';

            const startIdx = oldState.selection.anchor;
            const endIdx = state.selection.anchor;

            const lastCharactor = state.doc.textBetween(startIdx, endIdx);
            if (prev.isEmpty && lastCharactor === ' ') {
              const domAtNode = this.editor.view.domAtPos(startIdx, -1);

              if (domAtNode && domAtNode.node) {
                renderer.show({
                  node: domAtNode.node as HTMLElement
                });
                requestAnimationFrame(() => {
                  this.editor.commands.deleteRange({
                    from: oldState.selection.from,
                    to: oldState.selection.from + 1
                  });
                });
              }
            }

            return {
              isEmpty
            };
          },
          init() {
            return {
              isEmpty: true
            };
          }
        }
      })
    ];
  }
});
