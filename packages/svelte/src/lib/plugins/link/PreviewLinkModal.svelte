<script lang="ts">
  import {Link2Off} from 'lucide-svelte';
  import {useFloatingProps} from '$lib/node-view';

  const {mark, pos, node, editor, onHide} = useFloatingProps();

  let input: HTMLInputElement;

  const onSubmit = () => {
    if (
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length
        })
        .setLink({
          href: input.value
        })
        .scrollIntoView()
        .run()
    ) {
      onHide();
    }
  };
  const unsetLink = () => {
    if (
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length + 1
        })
        .unsetLink()
        .scrollIntoView()
        .run()
    ) {
      onHide();
    }
  };
</script>

<form
  class="flex flex-row items-center py-1 px-2 pl-4 shadow-md z-10 rounded-md border-border border bg-background"
  on:submit|preventDefault={onSubmit}
>
  <input
    placeholder="Link..."
    bind:this={input}
    value={mark.attrs.href}
    class="bg-background text-foreground rounded-md w-full focus:outline-none"
  />
  <a
    aria-label="Unset link"
    on:mousedown|stopPropagation={unsetLink}
    class="w-8 h-8 flex items-center justify-center pointer text-red-500 hover:bg-red-100 transition-colors p-1 rounded-md ml-2"
  >
    <Link2Off size={16} />
  </a>
</form>
