<script lang="ts">
  import {createToolbar, melt} from '@melt-ui/svelte';
  import {lockscroll, createLockScrollStore} from '@svelte-put/lockscroll';
  import {LinkButton} from '$lib/plugins/link';
  import {HighlightButton} from '$lib/plugins/highlight';

  import {positionStore} from '../Positioner';

  // Icons
  import {
    Bold,
    Italic,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Underline,
    Code,
    Link,
    Pencil
  } from 'lucide-svelte';
  import {onMount} from 'svelte';
  import {writable} from 'svelte/store';

  import {useEditor} from '$lib/context';
  import {cn} from '$lib/helpers';
  import type {Editor} from '@tiptap/core';
  import {getRootNode} from '@nextlint/core';

  import DropdownMenu from './DropdownMenu.svelte';

  const editor = useEditor();

  const {
    elements: {root, separator, button},
    builders: {createToolbarGroup}
  } = createToolbar();

  const {
    elements: {group: fontGroup, item: fontItem},
    states: {value: fontValues}
  } = createToolbarGroup({
    type: 'multiple'
  });

  const alignValues = writable<string>('');
  const {
    elements: {group: alignGroup, item: alignItem}
  } = createToolbarGroup({
    value: alignValues
  });

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

  const collectFontValues = (updatedEditor: Editor) => {
    const values = [
      updatedEditor.isActive('bold') && 'Bold',
      updatedEditor.isActive('italic') && 'Italic',
      updatedEditor.isActive('underline') && 'Underline',
      updatedEditor.isActive('strike') && 'Strike',
      updatedEditor.isActive('code') && 'Code',
      updatedEditor.isActive('link') && 'Link',
      updatedEditor.isActive('highlight') && 'Highlight'
    ].filter(Boolean) as Array<string>;
    fontValues.set(values);
  };

  const collectAlignValues = (editor: Editor) => {
    let align = '';
    const rootNode = getRootNode(editor);
    if (rootNode) {
      const {node} = rootNode;
      align = node.attrs.align;
    }
    alignValues.set(align);
  };

  const keyPress = (cb: any) => (key: any) => {
    const code = key.detail.originalEvent?.code;
    if (code === 'Space') {
      cb();
    }
  };

  onMount(() => {
    $editor!.on('update', props => {
      // NOTED: this is a bit hacky way make sure the updated happend after
      // toggle dont it behavior
      requestAnimationFrame(() => {
        collectFontValues(props.editor);
        collectAlignValues(props.editor);
      });
    });

    $editor!.on('selectionUpdate', props => {
      // NOTED: this is a bit hacky way make sure the updated happend after
      // toggle dont it behavior
      requestAnimationFrame(() => {
        collectFontValues(props.editor);
        collectAlignValues(props.editor);
      });
    });
  });
</script>

<svelte:body use:lockscroll={locked} />

<div
  use:melt={$root}
  class={cn(`border border-border
    flex min-w-max items-center gap-4 rounded-md bg-background text-foreground
    px-2 py-1 shadow-md`)}
>
  <div class="flex items-center gap-1" use:melt={$fontGroup}>
    <button
      class="item"
      use:melt={$fontItem('Bold')}
      on:m-click={() => {
        $editor.commands.toggleBold();
      }}
      on:m-keydown={keyPress(() => $editor.commands.toggleBold())}
    >
      <Bold class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$fontItem('Italic')}
      on:m-click={() => {
        $editor.commands.toggleItalic();
      }}
      on:m-keydown={keyPress(() => $editor.commands.toggleItalic())}
    >
      <Italic class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$fontItem('Underline')}
      on:m-click={() => {
        $editor.commands.toggleUnderline();
      }}
      on:m-keydown={keyPress(() => $editor.commands.toggleUnderline())}
    >
      <Underline class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$fontItem('Strike')}
      on:m-click={() => {
        $editor.commands.toggleStrike();
      }}
      on:m-keydown={keyPress(() => $editor.commands.toggleStrike())}
    >
      <Strikethrough class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$fontItem('Code')}
      on:m-click={() => {
        $editor.commands.toggleCode();
      }}
      on:m-keydown={keyPress(() => $editor.commands.toggleCode())}
    >
      <Code class="square-5" />
    </button>
    <LinkButton let:toggle>
      <button class="item" on:click={toggle} use:melt={$fontItem('Link')}>
        <Link class="square-5" />
      </button>
    </LinkButton>
    <HighlightButton let:toggle>
      <button class="item" on:click={toggle} use:melt={$fontItem('Highlight')}>
        <Pencil class="square-5" />
      </button>
    </HighlightButton>
  </div>
  <div class="separator" use:melt={$separator} />
  <div class="flex items-center gap-1" use:melt={$alignGroup}>
    <button
      class="item"
      use:melt={$alignItem('left')}
      on:m-click={() => {
        $editor.commands.setTextAlign('left');
      }}
      on:m-keydown={keyPress(() => $editor.commands.setTextAlign('left'))}
    >
      <AlignLeft class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$alignItem('center')}
      on:m-click={() => {
        $editor.commands.setTextAlign('center');
      }}
      on:m-keydown={keyPress(() => $editor.commands.setTextAlign('center'))}
    >
      <AlignCenter class="square-5" />
    </button>
    <button
      class="item"
      use:melt={$alignItem('right')}
      on:m-click={() => {
        $editor.commands.setTextAlign('right');
      }}
      on:m-keydown={keyPress(() => $editor.commands.setTextAlign('right'))}
    >
      <AlignRight class="square-5" />
    </button>
  </div>
  <div class="separator" use:melt={$separator} />
  {#if visibleNode}
    <DropdownMenu {visibleNode} {button} />
  {/if}
</div>

<style lang="postcss">
  .item {
    padding: theme('spacing.1');
    border-radius: theme('borderRadius.md');

    &:hover {
      background-color: theme('colors.secondary.DEFAULT');
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
