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
import type {SlashMenuItem} from './slash-menu';
import {
  BulletListIcon,
  CodeBlockIcon,
  H2Icon,
  H3Icon,
  H4Icon,
  OrderListIcon
} from '$lib/icons';

const suggestionItem = [
  {
    title: 'Text',
    icon: Text,
    command: ({editor, range}) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(' ')
        .setTextSelection({from: range.from, to: range.to + 1})
        .unsetAllMarks()
        .selectTextblockEnd()
        .run();
    }
  },
  {
    title: 'Bold',
    icon: FontBold,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setBold().run();
    }
  },
  {
    title: 'Italic',
    icon: FontItalic,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setItalic().run();
    }
  },
  {
    title: 'Strikethrough',
    icon: Strikethrough,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setStrike().run();
    }
  },
  {
    title: 'Underline',
    icon: Underline,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setUnderline().run();
    }
  },
  {
    title: 'Highlight',
    icon: Pencil2,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setHighlight().run();
    }
  },
  {
    title: 'Code',
    icon: Code,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setCode().run();
    }
  },
  {
    title: 'Heading 2',
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
    icon: CodeBlockIcon,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    }
  },
  {
    title: 'BlockQuote',
    icon: Quote,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    }
  },
  {
    title: 'Divider',
    icon: DividerHorizontal,
    command: ({editor, range}) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    }
  },
  {
    title: 'Bulleted List',
    icon: BulletListIcon,
    command({editor, range}) {
      return editor.chain().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: 'Numbered List',
    icon: OrderListIcon,
    command({editor, range}) {
      return editor.chain().deleteRange(range).toggleOrderedList().run();
    }
  },
  {
    title: 'Text Align Left',
    command: ({editor}) => {
      return editor.commands.setTextAlign('left');
    },
    icon: TextAlignLeft
  },
  {
    title: 'Text Align Center',
    command: ({editor}) => {
      return editor.commands.setTextAlign('center');
    },
    icon: TextAlignCenter
  },
  {
    title: 'Text Align Right',
    command: ({editor}) => {
      return editor.commands.setTextAlign('right');
    },
    icon: TextAlignRight
  },
  {
    title: 'Image',
    command: ({editor, range}) => {
      return editor.chain().deleteRange(range).toggleSelectImage().run();
    },
    icon: Image
  },
  {
    title: 'RemoveBlock',
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
