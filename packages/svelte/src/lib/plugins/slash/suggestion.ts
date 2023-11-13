import {
  CurlyBraces,
  Type,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Pencil,
  SeparatorHorizontal,
  List,
  Trash,
  Code,
  Image,
  ListOrdered,
  AlignLeft,
  AlignRight,
  AlignCenter
} from 'lucide-svelte';
import {getMarksBetween} from '@tiptap/core';

import type {SlashMenuItem} from './slash-menu';

const suggestionItem = [
  {
    title: 'Text',
    icon: Type,
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
    icon: Bold,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setBold().run();
    }
  },
  {
    title: 'Italic',
    description: 'Start with italic text',
    icon: Italic,
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
    icon: Pencil,
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
    icon: Heading2,
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
    icon: Heading3,
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
    icon: Heading4,
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
    icon: CurlyBraces,
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
    icon: SeparatorHorizontal,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    }
  },
  {
    title: 'Bulleted List',
    description: 'Create a bulleted list',
    icon: List,
    command({editor, range}) {
      return editor.chain().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: 'Numbered List',
    description: 'Create a Numbererd list',
    icon: ListOrdered,
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
    icon: AlignLeft
  },
  {
    title: 'Text Align Center',
    description: 'Align current text block to Center',
    command: ({editor, range}) => {
      return editor.chain().setTextAlign('center').deleteRange(range).run();
    },
    icon: AlignCenter
  },
  {
    title: 'Text Align Right',
    description: 'Align current text block to Right',
    command: ({editor, range}) => {
      return editor.chain().setTextAlign('right').deleteRange(range).run();
    },
    icon: AlignRight
  },
  {
    title: 'Image',
    description: 'Insert an image block',
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
