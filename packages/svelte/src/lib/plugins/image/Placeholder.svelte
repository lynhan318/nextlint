<script lang="ts">
  import type {NodeViewRendererProps} from '@tiptap/core';
  import {Image} from 'lucide-svelte';
  import {onMount, setContext} from 'svelte';

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
  on:mousedown={e => {
    onOpen(element.getBoundingClientRect());
  }}
  bind:this={element}
>
  <div class="h-full w-full flex flex-row">
    <Image />
    <span>Add an image</span>
  </div>
</button>
