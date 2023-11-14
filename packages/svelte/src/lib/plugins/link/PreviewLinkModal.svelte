<script lang="ts">
  import type {Editor} from '@tiptap/core';
  import {Link2Off} from 'lucide-svelte';

  import type {LinkProps} from './tiptap-link-v2';

  // PreviewModal init via svelte component constructor,
  // it's not in svelte context
  // cannot use useEditor here
  export let editor: Editor;
  export let onHide = () => {};
  export let linkProps: LinkProps;

  let input: HTMLInputElement;

  const onSubmit = e => {
    e.preventDefault();
    const {pos, node} = linkProps;
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
  const unsetLink = e => {
    e.preventDefault();
    const {pos, node} = linkProps;
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
    on:click={e => e.stopPropagation()}
    bind:this={input}
    value={linkProps.mark.attrs.href}
    class="bg-background text-foreground rounded-md w-full focus:outline-none"
  />
  <a
    on:mousedown|stopPropagation={unsetLink}
    class="w-8 h-8 flex items-center justify-center pointer text-red-500 hover:bg-red-100 transition-colors p-1 rounded-md ml-2"
  >
    <Link2Off size={16} />
  </a>
</form>
