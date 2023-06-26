import {Text} from 'radix-icons-svelte';
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
    slug: 'paragraph',
    active: (editor: Editor) => editor.isActive('paragraph'),
    toggle: (editor: Editor) => editor.commands.setNode('paragraph')
  },
  {
    label: 'Heading 2',
    icon: H2Icon,
    slug: 'heading2',
    active: (editor: Editor) => editor.isActive('heading', {level: 2}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 2})
  },
  {
    label: 'Heading 3',
    icon: H3Icon,
    slug: 'heading3',
    active: (editor: Editor) => editor.isActive('heading', {level: 3}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 3})
  },
  {
    label: 'Heading 4',
    icon: H4Icon,
    slug: 'heading4',
    active: (editor: Editor) => editor.isActive('heading', {level: 4}),
    toggle: (editor: Editor) => editor.commands.toggleHeading({level: 4})
  },
  {
    label: 'Bullet List',
    icon: BulletListIcon,
    slug: 'bulletList',
    active: (editor: Editor) => editor.isActive('bulletList'),
    toggle: (editor: Editor) => editor.commands.toggleList('bulletList')
  },
  {
    label: 'Order List',
    icon: OrderListIcon,
    slug: 'orderedList',
    active: (editor: Editor) => editor.isActive('orderedList'),
    toggle: (editor: Editor) => editor.commands.toggleList('orderedList')
  }
];
