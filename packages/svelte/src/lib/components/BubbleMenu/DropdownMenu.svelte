<script lang="ts">
  import {createDropdownMenu, melt} from '@melt-ui/svelte';
  import type {Node as PMNode} from '@tiptap/pm/model';
  import {ChevronDown, Check} from 'lucide-svelte';

  import {BubbleMenuDropdownList} from './constants';
  import {useEditor} from '$lib/context';

  const editor = useEditor();

  const {
    elements: {menu, item, trigger}
  } = createDropdownMenu({
    positioning: {
      placement: 'bottom-end',
      offset: {
        mainAxis: 100
      }
    }
  });

  export let visibleNode: PMNode;

  const formatHeadingSlug = (visibleNode: PMNode) =>
    visibleNode.type.name === 'heading'
      ? visibleNode.type.name + visibleNode.attrs.level
      : visibleNode.type.name;

  $: currentNode =
    BubbleMenuDropdownList.find(
      item => item.type === formatHeadingSlug(visibleNode)
    ) || BubbleMenuDropdownList[0];
</script>

<button
  use:melt={$trigger}
  class="flex flex-row items-center text-popover-foreground px-4"
>
  <span class="">
    {currentNode.label}
  </span>
  <ChevronDown class="ml-2" size={16} />
</button>

<div
  use:melt={$menu}
  class="flex flex-col bg-popover text-popover-foreground
  max-w-[280px] w-full rounded shadow-md mt-2 mb-2 bord
  border border-border z-[99]
  "
>
  {#each BubbleMenuDropdownList as i}
    <button
      class="flex flex-row items-center px-2 py-2 hover:bg-secondary transition rounded-md"
      use:melt={$item}
      on:click|stopPropagation={e => {
        i.toggle($editor);
      }}
    >
      <span class="w-6 h-6 p-1">
        <svelte:component this={i.icon} size={20} />
      </span>
      <span class="px-4">
        {i.label}
      </span>
      {#if formatHeadingSlug(visibleNode) === i.type}
        <div class="absolute right-4">
          <Check size={20} />
        </div>
      {/if}
    </button>
  {/each}
</div>
