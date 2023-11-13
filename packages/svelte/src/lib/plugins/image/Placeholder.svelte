<script lang="ts">
  import type {NodeViewRendererProps} from '@tiptap/core';
  import {ImageIcon} from 'lucide-svelte';
  import {onMount} from 'svelte';

  export let props: NodeViewRendererProps;
  export let triggerOnMount = false;
  export let onOpen = (domRect: DOMRect) => {};

  let element: HTMLButtonElement;

  onMount(() => {
    //cannot get getBoundingClientRect right in onMount,should wait for a period of time
    if (triggerOnMount) {
      setTimeout(() => {
        onOpen(element.getBoundingClientRect());
      }, 100);
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  on:click={e => {
    e.stopPropagation();
    onOpen(element.getBoundingClientRect());
  }}
  bind:this={element}
  class="h-[100px] w-full flex flex-row justify-center items-center text-muted-foreground"
>
  <ImageIcon class="mr-2" />
  <span>Add an image</span>
</button>
