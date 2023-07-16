<script lang="ts">
  import {useContentRef, useNodeViewProps} from '$lib/node-view';

  export let contentAs = 'p';

  const contentRef = useContentRef();
  const props = useNodeViewProps();

  let {node, selected, editor, getPos} = $props;
  $: ({node, selected} = $props);
  $: attrs = node.attrs;

  const onSelect = e => {
    e.stopPropagation();
    editor.commands.setNodeSelection(getPos());
  };
</script>

<figure
  data-node-type="figure"
  data-align={attrs.direction}
  style="position:relative;"
  class="figure"
  class:selected
>
  <img
    alt={attrs.alt}
    src={attrs.src}
    style="object-fit: {attrs.fit};"
    on:mousedown={onSelect}
  />
  <svelte:element this={contentAs} use:contentRef
    >{node.textContent}</svelte:element
  >
</figure>

<style lang="scss">
  .figure {
    border: 2px solid transparent;
    border-radius: 4px;
  }
  .selected {
    border-color: var(--svelteui-colors-green300);
  }
</style>
