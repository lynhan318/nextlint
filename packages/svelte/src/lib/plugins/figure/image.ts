import {mergeAttributes, Node} from '@tiptap/core';
import {Paragraph} from '@tiptap/extension-paragraph';

import {SvelteNodeViewRenderer} from '$lib/node-view';

import Figure from './Figure.svelte';
import {createImageSettingPlugin} from './image-setting-plugin';

export interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

export type FigureAttributes = {
  src: string;
  alt?: string;
  fit?: 'contain' | 'cover' | 'fill';
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      toggleFigure: (options: FigureAttributes) => ReturnType;
    };
  }
}

export const FigureExtension = Node.create<FigureOptions>({
  name: 'figure',
  group: 'block',
  content: 'inline*',
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
        return dom.querySelector('figcaption')?.innerText;
      }
    },
    fit: {
      default: 'contain',
      renderHTML: (attrs: FigureAttributes) => {
        return {
          'data-fit': attrs.fit
        };
      },
      parseHTML: (dom: HTMLElement) => {
        return dom.getAttribute('data-fit') || 'contain';
      }
    }
  }),

  parseHTML() {
    return [
      {
        tag: 'figure',
        content: 'figcaption'
      }
    ];
  },
  renderHTML({HTMLAttributes}) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes),
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
    return SvelteNodeViewRenderer({
      component: Figure,
      contentAs: 'figcaption'
    });
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
          FigureExtension.options.triggerOnMount = true;
          return chain()
            .insertContent({
              type: this.name,
              content: [{type: 'text', text: 'image alt'}],
              attrs
            })
            .run();
        }
    };
  },

  addProseMirrorPlugins() {
    return [createImageSettingPlugin(this.editor, FigureExtension)];
  }
});
