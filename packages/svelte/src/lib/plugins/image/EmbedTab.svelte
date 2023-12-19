<script lang="ts">
  import {useNodeViewProps} from '$lib/node-view';

  const props = useNodeViewProps();

  let value = '';

  $: onInsert = () => {
    const {editor, getPos} = $props;

    if (typeof getPos === 'function') {
      editor
        .chain()
        .setNodeSelection(getPos()!)
        .deleteNode('selectImage')
        .toggleFigure({
          src: value,
          alt: 'nextlint'
        })
        .scrollIntoView()
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
