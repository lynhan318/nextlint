import {Mark, mergeAttributes} from '@tiptap/core';
import type {Mark as PMMark, Node} from '@tiptap/pm/model';
// eslint-disable-next-line import/named
import {Plugin, PluginKey} from '@tiptap/pm/state';
import HighlightPresets from './HighlightPresets.svelte';
import type {EditorView} from '@tiptap/pm/view';
// eslint-disable-next-line import/no-unresolved
import {FloatingRenderer} from '$lib/node-view';

export type HighlightAttrs = {
  preset: Preset;
};
export type Preset = {
  backgroundColor: string;
  textColor: string;
};
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (attrs?: HighlightAttrs) => ReturnType;
      unsetHighlight: () => ReturnType;
      toggleHighlight: (attrs?: HighlightAttrs) => ReturnType;
    };
  }
}

export interface HighlightOptions {
  presets: Preset[];
  HTMLAttributes: Record<string, any>;
}
export const highlighPresets: Array<Preset> = [
  {backgroundColor: '#f7f1e3', textColor: '#000'},
  {backgroundColor: '#218c74', textColor: '#fff'},
  {backgroundColor: '#40407a', textColor: '#fff'},
  {backgroundColor: '#227093', textColor: '#fff'},
  {backgroundColor: '#8ecae6', textColor: '#000'},
  {backgroundColor: '#dda15e', textColor: '#000'},
  {backgroundColor: '#6d6875', textColor: '#fff'},
  {backgroundColor: '#ffcdb2', textColor: '#000'},
  {backgroundColor: '#c8b6ff', textColor: '#000'}
];

export type HighlightProps = {
  pos: number;
  node: Node;
  preset: Preset;
  dom?: HTMLElement;
};

export const HighlightExtension = Mark.create<HighlightOptions>({
  name: 'highlight',
  addOptions() {
    return {
      presets: highlighPresets,
      HTMLAttributes: {}
    };
  },
  addAttributes() {
    return {
      preset: {
        default: this.options.presets[0],
        parseHTML: element => element.getAttribute('data-color'),
        renderHTML: attrs => {
          return {
            style: `background-color:${attrs.preset.backgroundColor};padding:0px 2px;border-radius:4px;color:${attrs.preset.textColor}`,
            'data-highlight-background': attrs.preset.backgroundColor,
            'data-highlight-color': attrs.preset.textColor
          };
        }
      }
    };
  },
  renderHTML({HTMLAttributes}) {
    return ['mark', mergeAttributes(HTMLAttributes), 0];
  },
  parseHTML() {
    return [
      {
        tag: 'mark',
        getAttrs: element =>
          (element as HTMLElement).hasAttribute('data-highlight-color') && null
      }
    ];
  },
  addCommands() {
    return {
      setHighlight:
        attributes =>
        ({commands}) => {
          return commands.setMark(this.name, attributes);
        },
      toggleHighlight:
        attributes =>
        ({commands}) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetHighlight:
        () =>
        ({commands}) => {
          return commands.unsetMark(this.name);
        }
    };
  }
  // addProseMirrorPlugins() {
  //   const floatingRenderer = new FloatingRenderer({
  //     component: HighlightPresets,
  //     editor: this.editor
  //   });
  //   return [
  //     new Plugin({
  //       key: new PluginKey('link-hover'),
  //       view() {
  //         return {destroy: floatingRenderer.destroy};
  //       },
  //       props: {
  //         handleDOMEvents: {
  //           click: (view: EditorView, event: MouseEvent) => {
  //             const pos = view.posAtDOM(event.target as Node, 0);
  //             if (!pos || (event.target as HTMLElement).tagName !== 'MARK') {
  //               floatingRenderer.unmount();
  //               return;
  //             }
  //             const node = view.state.doc.nodeAt(pos);
  //             if (node && hasHighlight(node.marks || [])) {
  //               const mark = node.marks.find(
  //                 m => m.type.name === this.name
  //               ) as PMMark;
  //
  //               floatingRenderer.mount({
  //                 pos,
  //                 node,
  //                 mark,
  //                 element: event.target as HTMLElement
  //               });
  //             } else {
  //               floatingRenderer.destroy();
  //             }
  //           }
  //         }
  //       }
  //     })
  //   ];
  // }
});
const hasHighlight = (marks: Readonly<PMMark[]>) => {
  return marks.find(m => m.type.name === 'highlight');
};
export type Coordinate = {
  top: number;
  left: number;
  pos: number;
};
