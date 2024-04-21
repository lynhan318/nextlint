<script lang="ts">
  import {cn} from '$lib/helpers';
  import {useNodeViewContext} from '$lib/node-view';

  import {
    AlignVerticalSpaceAround,
    GalleryVertical,
    Trash2
  } from 'lucide-svelte';

  const contentDOM = useNodeViewContext('contentDOM');
  const node = useNodeViewContext('node');
  const selected = useNodeViewContext('selected');
  const deleteNode = useNodeViewContext('deleteNode');
  const selectNode = useNodeViewContext('selectNode');
  const updateAttributes = useNodeViewContext('updateAttributes');
  $: attrs = $node.attrs;
  $: visible = $selected;
</script>

<figure
  data-node-type="figure"
  data-align={attrs?.direction}
  style="position:relative;"
  class="relative"
>
  {#if visible}
    <div class="absolute inset-x-0 flex justify-center top-[-24px]">
      <div
        class="flex flex-row items-center bg-background shadow-md rounded-md z-[1px] py-1 px-2 gap-2"
      >
        <button
          aria-label="Fit Image"
          on:mousedown={() => updateAttributes({fit: 'contain'})}
          class={cn(
            attrs?.fit === 'contain' ? 'bg-accent' : 'bg-background',
            'p-[6px] rounded-md hover:bg-secondary'
          )}
        >
          <AlignVerticalSpaceAround size={16} />
        </button>
        <button
          aria-label="Fit View"
          on:mousedown={() => updateAttributes({fit: 'cover'})}
          class={cn(
            attrs?.fit === 'cover' ? 'bg-accent' : 'bg-background',
            'p-[6px] rounded-md hover:bg-secondary'
          )}
        >
          <GalleryVertical size={16} />
        </button>
        <div class="w-[1px] h-6 bg-border" />
        <button
          color="red"
          class="p-1 text-destructive"
          on:mousedown|preventDefault={deleteNode}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  {/if}
  <img
    alt={attrs?.alt}
    src={attrs?.src}
    style="object-fit: {attrs?.fit};cursor:pointer;"
    on:mousedown|preventDefault={selectNode}
    class={cn(
      'border-none rounded-md',
      visible && 'outline outline-offset-1 outline-primary'
    )}
  />
  <figcaption
    contenteditable="true"
    use:contentDOM
    style="white-space: inherit;"
    bind:textContent={$node.textContent}
  ></figcaption>
</figure>

<style lang="scss">
  .figure {
    border: 2px solid transparent;
    border-radius: 4px;
  }
</style>
