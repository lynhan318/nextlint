<script lang="ts">
  import {createPopover, melt} from '@melt-ui/svelte';
  import {fade} from 'svelte/transition';
  import {ImageIcon, Trash2} from 'lucide-svelte';

  import SelectImage from './SelectImage.svelte';
  import {useNodeViewProps} from '$lib/node-view';

  const props = useNodeViewProps();
  const triggerOnMount = $props.extension.options.triggerOnMount;

  const {
    elements: {trigger, content},
    states: {open}
  } = createPopover({
    defaultOpen: triggerOnMount,
    positioning: {
      placement: 'top'
    }
  });
  const removeNode = () => $props.deleteNode();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div class="relative">
  <button
    use:melt={$trigger}
    class="h-[100px] w-full flex flex-row justify-center items-center bg-secondary relative"
  >
    <ImageIcon class="mr-2 text-muted-foreground" />
  </button>
  <button
    class="w-10 h-10 cursor-pointer !text-red-400 absolute bottom-1 right-1"
    on:click|stopPropagation={() => removeNode()}
  >
    <Trash2 size={16} />
  </button>
</div>
{#if $open}
  <div use:melt={$content} transition:fade={{duration: 100}} class="z-20">
    <SelectImage />
  </div>
{/if}

<style lang="scss">
  :global(select-image) {
    position: relative;
  }
</style>
