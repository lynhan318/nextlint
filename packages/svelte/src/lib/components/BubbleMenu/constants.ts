import {
  Type,
  Quote,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered
} from 'lucide-svelte';

import type {Editor} from '@tiptap/core';
export const BubbleMenuDropdownList = [
  {
    label: 'Paragraph',
    icon: Type,
    type: 'paragraph',
    active: (editor: Editor) => editor.isActive('paragraph'),
    toggle: (editor: Editor) =>
      editor.chain().clearNodes().scrollIntoView().run()
  },
  {
    label: 'Blockquote',
    icon: Quote,
    type: 'blockquote',
    active: (editor: Editor) => editor.isActive('blockquote'),
    toggle: (editor: Editor) =>
      editor.chain().toggleBlockquote().scrollIntoView().run()
  },
  {
    label: 'Heading 2',
    icon: Heading2,
    type: 'heading2',
    active: (editor: Editor) => editor.isActive('heading', {level: 2}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 2})
  },
  {
    label: 'Heading 3',
    icon: Heading3,
    type: 'heading3',
    active: (editor: Editor) => editor.isActive('heading', {level: 3}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 3})
  },
  {
    label: 'Heading 4',
    icon: Heading4,
    type: 'heading4',
    active: (editor: Editor) => editor.isActive('heading', {level: 4}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 4})
  },
  {
    label: 'Bullet List',
    icon: List,
    type: 'bulletList',
    active: (editor: Editor) => editor.isActive('bulletList'),
    toggle: (editor: Editor) => editor.commands.toggleBulletList()
  },
  {
    label: 'Order List',
    icon: ListOrdered,
    type: 'orderedList',
    active: (editor: Editor) => editor.isActive('orderedList'),
    toggle: (editor: Editor) => editor.commands.toggleOrderedList()
  }
];
