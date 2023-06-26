<script lang="ts">
  import {useNodeViewContext} from '@prosemirror-adapter/svelte';

  const contentRef = useNodeViewContext('contentRef');
  const nodeStore = useNodeViewContext('node');
  const selected = useNodeViewContext('selected');
  const view = useNodeViewContext('view');
</script>

<img src={$nodeStore.attrs.src} />
<div use:contentRef />

<style lang="scss">
  .wrapper {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  :global(.ProseMirror-selectednode) {
    img {
      outline: 2px solid #2ecc71;
      border-radius: 4px;
    }
  }
</style>
