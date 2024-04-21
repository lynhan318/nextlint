<script lang="ts">
  import {useNodeViewContext} from '$lib/node-view';

  const deleteNode = useNodeViewContext('deleteNode');
  const getPos = useNodeViewContext('getPos');
  const editor = useNodeViewContext('editor');

  let value = '';

  $: onInsert = () => {
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
  };
</script>

<form class="bg-background text-foreground" on:submit|preventDefault={onInsert}>
  <input
    on:paste={e => {
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
