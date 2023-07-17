import {
  Node,
  combineTransactionSteps,
  getChangedRanges,
  findChildrenInRange,
  type NodeWithPos,
  type Editor,
  isNodeSelection
} from '@tiptap/core';

import {Node as PMNode} from '@tiptap/pm/model';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';

import FigureWidget from './FigureWidget.svelte';

export const imageRegex =
  /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|jpeg)/g;

export const createImageSettingPlugin = (editor: Editor, extension: Node) => {
  const plugin = new Plugin({
    key: new PluginKey('image-utils'),
    state: {
      init() {
        return {
          disposes: [],
          decorators: DecorationSet.empty
        };
      },
      apply: (tr, oldState) => {
        const content = tr.selection.content().content;
        const nodeSelection =
          isNodeSelection(tr.selection) &&
          content.childCount === 1 &&
          content.firstChild;

        if (nodeSelection && tr.selection.node.type.name === 'figure') {
          const wrapper = document.createElement('div');
          const component = new FigureWidget({
            target: wrapper,
            props: {
              editor: editor
            }
          });
          const decorator = Decoration.widget(tr.selection.anchor + 1, wrapper);

          const newState = {
            disposes: [() => component.$destroy(), () => wrapper.remove()],
            decorators: DecorationSet.create(tr.doc, [decorator])
          };

          return newState;
        }

        oldState.disposes.forEach((dispose: any) => dispose());
        return {disposes: [], decorators: DecorationSet.empty};
      }
    },
    props: {
      decorations(state) {
        return this.getState(state)?.decorators;
      }
    },
    appendTransaction: (transactions, oldState, newState) => {
      const {tr} = newState;

      const docChanged =
        transactions.some(tr => tr.docChanged) &&
        !oldState.doc.eq(newState.doc);

      if (!docChanged) return;

      const transform = combineTransactionSteps(oldState.doc, [
        ...transactions
      ]);
      const changeRanges = getChangedRanges(transform);
      let imageBlocks: NodeWithPos[] = [];

      changeRanges.forEach(({newRange}) => {
        imageBlocks = findChildrenInRange(newState.doc, newRange, node => {
          return node.type.name === 'paragraph' || node.type.name === 'figure';
        });
      });
      imageBlocks.forEach(({pos, node}) => {
        if (node.type.name === 'figure') {
          tr.setNodeAttribute(tr.mapping.map(pos), 'alt', node.textContent);
        } else if (
          node.type.name === 'paragraph' &&
          newState.doc
            .resolve(pos + 1)
            .node(1)
            .eq(node)
        ) {
          const text = node.textContent;
          const [src] = text.match(imageRegex) || [];
          const newPos = tr.mapping.map(pos);
          if (src && src === text) {
            tr.replaceWith(
              newPos, // insert at root block
              newPos + text.length + 1,
              PMNode.fromJSON(editor.schema, {
                type: extension.name,
                attrs: {
                  src
                },
                content: [{type: 'text', text: 'image alt'}]
              })
            );
          }
        }
      });
      if (!tr.steps.length) {
        return;
      }

      return tr;
    }
  });
  return plugin;
};
