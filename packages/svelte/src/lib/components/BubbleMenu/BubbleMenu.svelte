<script lang="ts">
  import DropdownMenu from './DropdownMenu.svelte';
  import FontStyleMenu from './FontStyleMenu.svelte';
  import CustomMenu from './CustomMenu.svelte';
  import {createToolbar, melt} from '@melt-ui/svelte';
  import {lockscroll, createLockScrollStore} from '@svelte-put/lockscroll';
  import {diff} from 'radash';

  import {positionStore} from '../Positioner';

  // Icons
  import {
    Bold,
    Italic,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Underline
  } from 'lucide-svelte';
  import {useEditor} from '$lib/context';
  import {onMount} from 'svelte';

  const editor = useEditor();

  const {
    elements: {root, button, link, separator},
    builders: {createToolbarGroup}
  } = createToolbar();
  const {
    elements: {group: fontGroup, item: fontItem},
    states: {value}
  } = createToolbarGroup({
    type: 'multiple'
  });

  $: {
    console.log('$value', $value);
  }
  const {
    elements: {group: alignGroup, item: alignItem}
  } = createToolbarGroup();

  const locked = createLockScrollStore();

  const IGNORE_BLOCK_MENU = ['figure', 'codeBlock'];

  $: visibleNode = (() => {
    const resolver = $positionStore.selection?.resolver;
    if (!resolver) return;
    let node = resolver.node(resolver.depth);
    let i = resolver.depth - 1;
    while (i > 0) {
      const parent = resolver.node(i);
      if (parent.type.name === 'listItem') {
        i--;
        continue;
      }
      node = parent;
      break;
    }

    if (IGNORE_BLOCK_MENU.includes(node.type.name)) {
      return;
    }
    return node;
  })();

  $: {
    locked.set(!!visibleNode);
  }
  onMount(() => {
    $editor!.on('update', props => {
      console.log('isActiveBold', props.editor.isActive('bold'));
    });
    $editor!.on('selectionUpdate', props => {
      console.log('isActiveBold', props.editor.isActive('bold'));
    });
  });
</script>

<svelte:body use:lockscroll={locked} />

<div
  use:melt={$root}
  class="flex min-w-max items-center gap-4 rounded-md bg-background px-2 py-1 text-neutral-700 dark:text-slate-800 shadow-md lg:w-[35rem]"
>
  <div class="flex items-center gap-1" use:melt={$fontGroup}>
    <button class="item" use:melt={$fontItem('Bold')}>
      <Bold class="square-5" />
    </button>
    <button class="item" use:melt={$fontItem('Italic')}>
      <Italic class="square-5" />
    </button>
    <button class="item" use:melt={$fontItem('Underline')}>
      <Underline class="square-5" />
    </button>
    <button class="item" use:melt={$fontItem('Strikethrough')}>
      <Strikethrough class="square-5" />
    </button>
  </div>
  <div class="separator" use:melt={$separator} />
  <div class="flex items-center gap-1" use:melt={$alignGroup}>
    <button class="item" use:melt={$alignItem('left')}>
      <AlignLeft class="square-5" />
    </button>
    <button class="item" use:melt={$alignItem('center')}>
      <AlignCenter class="square-5" />
    </button>
    <button class="item" use:melt={$alignItem('right')}>
      <AlignRight class="square-5" />
    </button>
  </div>
  <div class="separator" use:melt={$separator} />
  <a href="/" class="link nowrap flex-shrink-0" use:melt={$link}>
    Edited 2 hours ago
  </a>
  <button
    class="ml-auto rounded-md bg-slate-600 px-2 py-2 font-medium text-slate-100 hover:opacity-75 active:opacity-50"
    use:melt={$button}>Save</button
  >
</div>

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');

    &:hover {
      background-color: theme('colors.slate.200');
    }

    &[data-state='on'] {
      background-color: theme('colors.slate.300');
      color: theme('colors.slate.900');
    }

    &:focus {
      @apply ring-2 ring-slate-400;
    }
  }

  .separator {
    width: 1px;
    background-color: theme('colors.neutral.300');
    align-self: stretch;
  }
</style>
