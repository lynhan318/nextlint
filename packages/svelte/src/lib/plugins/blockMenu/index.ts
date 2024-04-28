import {Editor, Extension} from '@tiptap/core';
import {PluginKey, Plugin} from '@tiptap/pm/state';
import {Node as PMNode} from '@tiptap/pm/model';
import {throttle} from 'radash';

import BlockMenu from './BlockMenu.svelte';
import {FloatingRenderer} from '$lib/node-view';
import {offset, type VirtualElement} from '@floating-ui/dom';
import {writable} from 'svelte/store';

export const BlockMenuExtension = Extension.create({
  name: 'BlockMenuExtension',
  addProseMirrorPlugins() {
    return [
      new BlockMenuPlugin({
        editor: this.editor
      })
    ];
  }
});

export type BlockMenuData = {
  dom: HTMLElement;
  domIdx: number;
  node: PMNode;
};

class BlockMenuPlugin extends Plugin {
  renderer: FloatingRenderer | null = null;
  renderElement: HTMLElement | null = null;
  data = writable<BlockMenuData | null>(null);

  constructor({editor}: {editor: Editor}) {
    super({
      key: new PluginKey('BlockMenuPlugin'),
      props: {
        handleDOMEvents: {
          mousemove: throttle({interval: 70}, (view, e) => {
            const editorBound = view.dom.getBoundingClientRect();
            console.log('editorBound', editorBound);
            const {pos} =
              view.posAtCoords({
                top: e.y,
                left: (editorBound.right - editorBound.left) / 2
              }) || {};
            if (!pos) return;
            const domAtPos = view.domAtPos(pos, 0);
            const rootNode = findRootNode(
              view.dom,
              domAtPos.node as HTMLElement
            );

            if (!rootNode) {
              this.renderer?.unmount();
              this.renderElement = null;
              this.data.set(null);
              return;
            }
            const [dom, domIdx] = rootNode as [Node, number];
            if (this.renderElement?.isEqualNode(dom)) {
              return;
            }

            this.renderer ||= new FloatingRenderer(
              {
                component: BlockMenu,
                portal: view.dom.offsetParent as HTMLElement,
                editor,
                style: {
                  zIndex: '999'
                }
              },
              {
                placement: 'top-start',
                middleware: [
                  offset({
                    crossAxis: -40,
                    mainAxis: -25
                  })
                ]
              }
            );
            this.data.set({
              dom: dom as HTMLElement,
              domIdx,
              node: editor.state.doc.child(domIdx) as PMNode
            });
            const virtualElement: VirtualElement = {
              getBoundingClientRect() {
                const domRect = (dom as HTMLElement).getBoundingClientRect();
                domRect.x = editorBound.x;
                return domRect;
              }
            };
            this.renderer.updateOrMount({
              element: virtualElement,
              data: this.data
            });
            this.renderElement = dom as HTMLElement;
          })
        }
      }
    });

    editor.on('destroy', () => {
      this.renderer?.destroy();
      this.renderElement = null;
      this.data.set(null);
    });
  }
}

function findRootNode(editorRoot: HTMLElement, target: unknown) {
  const childs = Array.from(editorRoot.childNodes);
  let node: Node = target as Node;

  const findChild = (child: Node) => {
    const index = childs.findIndex(_node => _node.isEqualNode(child));
    if (index >= 0) {
      return [childs.at(index), index];
    }
    return null;
  };

  while (node.parentNode) {
    if (node.isEqualNode(editorRoot)) return null;
    const childIdx = findChild(node);
    if (childIdx) {
      return childIdx;
    }
    if (!node.parentNode) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}
