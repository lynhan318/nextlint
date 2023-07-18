import {
  Code,
  DividerHorizontal,
  FontBold,
  Trash,
  FontItalic,
  Image,
  Quote,
  Strikethrough,
  Text,
  Pencil2,
  Underline,
  AlignLeft,
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight
} from 'radix-icons-svelte';
import {getMarksBetween} from '@tiptap/core';

import {
  BulletListIcon,
  CodeBlockIcon,
  H2Icon,
  H3Icon,
  H4Icon,
  OrderListIcon
} from '$lib/icons';

import type {SlashMenuItem} from './slash-menu';

const suggestionItem = [
  {
    title: 'Text',
    icon: Text,
    description: 'Start with plain text',
    command: ({editor, range}) => {
      const marks = getMarksBetween(range.from, range.to, editor.state.doc);
      const chain = editor.chain();
      if (marks.length > 0) {
        chain
          .setTextSelection(range)
          .unsetAllMarks()
          .insertContentAt(range, ' ');
      } else {
        chain.deleteRange(range);
      }

      chain.run();
    }
  },
  {
    title: 'Bold',
    description: 'Start with bold text',
    icon: FontBold,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setBold().run();
    }
  },
  {
    title: 'Italic',
    description: 'Start with italic text',
    icon: FontItalic,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setItalic().run();
    }
  },
  {
    title: 'Strikethrough',
    description: 'Start with strikethrough text',
    icon: Strikethrough,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setStrike().run();
    }
  },
  {
    title: 'Underline',
    description: 'Start with underline text',
    icon: Underline,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setUnderline().run();
    }
  },
  {
    title: 'Highlight',
    description: 'Start with highlight text',
    icon: Pencil2,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setHighlight().run();
    }
  },
  {
    title: 'Code',
    description: 'Start with code text',
    icon: Code,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setCode().run();
    }
  },
  {
    title: 'Heading 2',
    description: 'Set current block text to heading 2',
    icon: H2Icon,
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', {level: 2})
        .run();
    }
  },
  {
    title: 'Heading 3',
    description: 'Set current block text to heading 3',
    icon: H3Icon,
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', {level: 3})
        .run();
    }
  },
  {
    title: 'Heading 4',
    description: 'Set current block text to heading 4',
    icon: H4Icon,
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', {level: 4})
        .run();
    }
  },
  {
    title: 'CodeBlock',
    description: 'Set current block text to CodeBlock',
    icon: CodeBlockIcon,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    }
  },
  {
    title: 'BlockQuote',
    description: 'Set current block text to BlockQuote',
    icon: Quote,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    }
  },
  {
    title: 'Divider',
    description: 'Add Divider at current block',
    icon: DividerHorizontal,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    }
  },
  {
    title: 'Bulleted List',
    description: 'Create a bulleted list',
    icon: BulletListIcon,
    command({editor, range}) {
      return editor.chain().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: 'Numbered List',
    description: 'Create a Numbererd list',
    icon: OrderListIcon,
    command({editor, range}) {
      return editor.chain().deleteRange(range).toggleOrderedList().run();
    }
  },
  {
    title: 'Text Align Left',
    description: 'Align current text block to Left',
    command: ({editor, range}) => {
      return editor.chain().setTextAlign('left').deleteRange(range).run();
    },
    icon: TextAlignLeft
  },
  {
    title: 'Text Align Center',
    description: 'Align current text block to Center',
    command: ({editor, range}) => {
      return editor.chain().setTextAlign('center').deleteRange(range).run();
    },
    icon: TextAlignCenter
  },
  {
    title: 'Text Align Right',
    description: 'Align current text block to Right',
    command: ({editor, range}) => {
      return editor.chain().setTextAlign('right').deleteRange(range).run();
    },
    icon: TextAlignRight
  },
  {
    title: 'Image',
    description: 'Add image, upload, or select from Unsplash',
    command: ({editor, range}) => {
      return editor.chain().deleteRange(range).toggleSelectImage().run();
    },
    icon: Image
  },
  {
    title: 'RemoveBlock',
    description: 'Remove current block',
    icon: Trash,
    command({editor}) {
      const {$anchor} = editor.state.selection;
      const node = $anchor.node(1);
      return editor.chain().deleteNode(node.type).run();
    }
  }
] satisfies Array<SlashMenuItem>;
export const querySuggestion = ({query}) => {
  return suggestionItem.filter(item =>
    item.title.toLowerCase().match(`${query.toLowerCase()}`)
  );
};
