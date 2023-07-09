import {Quote, Text} from 'radix-icons-svelte';
import {
  H2Icon,
  H3Icon,
  H4Icon,
  BulletListIcon,
  OrderListIcon
} from '$lib/icons';

import type {Editor} from '@tiptap/core';

export const BubbleMenuDropdownList = [
  {
    label: 'Paragraph',
    icon: Text,
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
    icon: H2Icon,
    type: 'heading2',
    active: (editor: Editor) => editor.isActive('heading', {level: 2}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 2})
  },
  {
    label: 'Heading 3',
    icon: H3Icon,
    type: 'heading3',
    active: (editor: Editor) => editor.isActive('heading', {level: 3}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 3})
  },
  {
    label: 'Heading 4',
    icon: H4Icon,
    type: 'heading4',
    active: (editor: Editor) => editor.isActive('heading', {level: 4}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 4})
  },
  {
    label: 'Bullet List',
    icon: BulletListIcon,
    type: 'bulletList',
    active: (editor: Editor) => editor.isActive('bulletList'),
    toggle: (editor: Editor) => editor.commands.toggleBulletList()
  },
  {
    label: 'Order List',
    icon: OrderListIcon,
    type: 'orderedList',
    active: (editor: Editor) => editor.isActive('orderedList'),
    toggle: (editor: Editor) => editor.commands.toggleOrderedList()
  }
];
