import {mergeAttributes, Node} from '@tiptap/core';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Node as PMNode} from '@tiptap/pm/model';
import {Plugin, PluginKey} from '@tiptap/pm/state';
import {Decoration, DecorationSet} from '@tiptap/pm/view';

import {renderHTML, setFocusNode} from './utils';

export interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

export type ImageOptions = FigureOptions;

export const imageRegex =
  /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp|svg)/g;

export type ImageAttributes = {
  src: string;
  direction?: 'left' | 'right' | 'center';
  alt?: string;
  title?: string;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      toggleFigure: (options: ImageAttributes) => ReturnType;
    };
  }
}

export const FigureExtension = Node.create<FigureOptions>({
  name: 'figure',
  group: 'block',
  content: 'inline*',
  draggable: false,
  isolating: true,
  addAttributes: () => ({
    src: {
      default: null,
      parseHTML: (dom: HTMLElement) => {
        return dom.querySelector('img')?.src;
      }
    },
    alt: {
      default: 'image alt',
      parseHTML: (dom: HTMLElement) => {
        return (
          dom.querySelector('figcaption')?.textContent ||
          dom.querySelector('img')?.alt ||
          ''
        );
      }
    },
    title: {
      default: 'next image',
      parseHTML: (dom: HTMLElement) => {
        return (
          dom.querySelector('figcaption')?.textContent ||
          dom.querySelector('img')?.title ||
          ''
        );
      }
    },
    direction: {
      default: 'left',
      parseHTML: (dom: HTMLElement) => {
        return dom.getAttribute('data-direction') || 'left';
      }
    }
  }),

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption'
      }
    ];
  },
  renderHTML({HTMLAttributes}) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes || {}),
      [
        'img',
        mergeAttributes(HTMLAttributes, {
          draggable: true,
          contenteditable: false
        })
      ],
      ['figcaption', 0]
    ];
  },

  addNodeView() {
    return nodeView => {
      const {dom, contentDOM} = renderHTML({
        HTMLAttributes: nodeView.HTMLAttributes,
        node: nodeView.node
      });
      const img = dom.querySelector('img');
      if (img) {
        img.onclick = event => {
          event.stopPropagation();
          setFocusNode(nodeView);
        };
      }
      setTimeout(() => {
        contentDOM.innerText = nodeView.HTMLAttributes.alt || 'image alt';
      }, 50);

      return {dom, contentDOM};
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({editor}) => {
        const {state, commands} = editor;
        if (state.selection.from === state.selection.to) {
          const currentNode = state.selection.$anchor.node(1);
          if (currentNode.type.name === this.name) {
            const endPos = state.selection.$anchor.end(1);
            commands.setTextSelection(endPos);
            return commands.insertContentAt(endPos + 1, {
              type: Paragraph.name,
              text: ''
            });
          }
        }
        return false;
      }
    };
  },

  addCommands() {
    return {
      toggleFigure:
        attrs =>
        ({chain}) => {
          return chain()
            .insertContent({
              type: this.name,
              content: [{type: 'text', text: attrs.alt || 'image alt'}],
              attrs
            })
            .run();
        }
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('image-utils'),
        props: {
          decorations: ({doc, tr}) => {
            const decorations: Decoration[] = [];
            doc.forEach((node, offset) => {
              if (new RegExp(imageRegex).test(node.textContent || '')) {
                const src = node.textContent;
                tr.deleteRange(offset, src.length + offset + 1);
                const fragment = PMNode.fromJSON(this.editor.schema, {
                  type: this.name,
                  attrs: {
                    src,
                    alt: 'image alt'
                  },
                  content: [{type: 'text', text: 'image alt'}]
                });
                tr.insert(offset, fragment);
                this.editor.view.dispatch(tr);
              }
            });
            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
});
