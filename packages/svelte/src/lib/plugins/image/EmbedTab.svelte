<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import {useNodeViewContext} from '$lib/node-view';

  const deleteNode = useNodeViewContext('deleteNode');
  const getPos = useNodeViewContext('getPos');
  const editor = useNodeViewContext('editor');

  let value = $state('');

  let onInsert = $derived(() => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      deleteNode();
      editor
        .chain()
        .setTextSelection(pos)
        .focus()
        .toggleFigure({
          src: value,
          alt: 'nextlint image'
        })
        .run();
    }
  });
</script>

<form class="bg-background text-foreground" onsubmit={preventDefault(onInsert)}>
  <input
    onpaste={e => {
      //prevent paste fire in editor
      e.stopPropagation();
    }}
    class="w-full px-4 py-2 border-input border rounded-md bg-secondary text-foreground outline-none"
    type="text"
    bind:value
    placeholder="Paste link here..."
  />
  <button class="w-full bg-secondary mt-4 py-2 rounded-md">Submit</button>
</form>
