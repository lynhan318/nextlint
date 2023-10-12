<script lang="ts">
  import {createPopover, melt} from '@melt-ui/svelte';
  import {fade} from 'svelte/transition';

  const {
    elements: {trigger, content},
    states: {open}
  } = createPopover({});
</script>

<div use:melt={$trigger}>
  <slot name="trigger" />
</div>

{#if $open}
  <div use:melt={$content} transition:fade={{duration: 100}}>
    <slot />
  </div>
{/if}
