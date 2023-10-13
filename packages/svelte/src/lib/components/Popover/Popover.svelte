<script lang="ts">
  import {createPopover, melt} from '@melt-ui/svelte';
  import {writable} from 'svelte/store';
  import {fade} from 'svelte/transition';

  export let open = writable(false);
  const {
    elements: {trigger, content}
  } = createPopover({
    closeOnOutsideClick: true,
    closeOnEscape: true,
    open
  });
</script>

<div use:melt={$trigger}>
  <slot name="trigger" />
</div>

{#if $open}
  <div use:melt={$content} transition:fade={{duration: 100}}>
    <slot />
  </div>
{/if}
