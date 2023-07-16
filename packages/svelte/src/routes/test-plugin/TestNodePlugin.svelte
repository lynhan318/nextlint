<script lang="ts">
  import {Button} from '@svelteuidev/core';
  import {useNodeViewProps, useContentRef} from '$lib/node-view';

  const props = useNodeViewProps();
  const contentRef = useContentRef();
</script>

<div class={''}>
  {#if $props.selected}
    <Button on:click={() => $props.deleteNode()}>Removfe node</Button>
  {/if}
  <p use:contentRef>This is editable.</p>
</div>

<style lang="scss">
  .selected {
    border: 1px solid teal;
  }
</style>
