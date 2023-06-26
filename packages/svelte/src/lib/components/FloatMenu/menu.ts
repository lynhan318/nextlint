import type {ComponentType} from 'svelte';

import {
  CodeBlockIcon,
  BlockquoteIcon,
  H2Icon,
  H3Icon,
  H4Icon,
  BulletListIcon,
  OrderListIcon
} from '../../icons';

import ImageButton from './ImageButton.svelte';

const BlockIcons: Array<ToolbarIcon> = [
  {
    type: 'image',
    icon: ImageButton
  },
  {
    type: 'blockquote',
    icon: BlockquoteIcon,
    onClick: editor => editor.chain().focus().toggleBlockquote().run()
  },
  {
    type: 'code_block',
    icon: CodeBlockIcon,
    onClick: editor => editor.chain().focus().toggleCodeBlock().run()
  },
  {
    type: 'bullet-list',
    icon: BulletListIcon,
    onClick: editor => editor.chain().focus().toggleBulletList().run()
  },
  {
    type: 'ordered-list',
    icon: OrderListIcon,
    onClick: editor => editor.chain().focus().toggleOrderedList().run()
  },
  {
    type: 'h2',
    icon: H2Icon,
    onClick: editor => editor.chain().focus().toggleHeading({level: 2}).run()
  },
  {
    type: 'h3',
    icon: H3Icon,
    onClick: editor => editor.chain().focus().toggleHeading({level: 3}).run()
  },
  {
    type: 'h4',
    icon: H4Icon,
    onClick: editor => editor.chain().focus().toggleHeading({level: 4}).run()
  }
];

export const FLOATBAR_ICONS = BlockIcons;

export type ToolbarIcon = {
  type: string;
  icon: ComponentType;
  onClick?: (editor: any) => boolean;
};
