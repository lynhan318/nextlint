<script lang="ts">
  import {createPopover, melt} from '@melt-ui/svelte';
  import {fade} from 'svelte/transition';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import {ImageIcon} from 'lucide-svelte';

  import {SelectImageExtension} from './image';
  import SelectImage from './SelectImage.svelte';

  export let props: NodeViewRendererProps;
  const triggerOnMount = SelectImageExtension.options.triggerOnMount;
  export let onOpen = (domRect: DOMRect) => {};
  console.log('triggerOnMount', triggerOnMount);

  let element: HTMLButtonElement;
  const {
    elements: {trigger, content, arrow, close},
    states: {open}
  } = createPopover({
    defaultOpen: triggerOnMount,
    positioning: {
      placement: 'top'
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  use:melt={$trigger}
  bind:this={element}
  class="h-[100px] w-full flex flex-row justify-center items-center bg-secondary text-secondary-foreground"
>
  <ImageIcon class="mr-2" />
</button>

{#if $open}
  <div use:melt={$content} transition:fade={{duration: 100}}>
    <SelectImage />
  </div>
{/if}
