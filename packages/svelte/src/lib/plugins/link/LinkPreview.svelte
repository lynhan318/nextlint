<script lang="ts">
  import {useFloatingProps} from '$lib/node-view';
  import {Link, Pen, Trash2} from 'lucide-svelte';
  import LinkForm from './LinkForm.svelte';

  let update = false;
  const props = useFloatingProps();
  let link = props.mark?.attrs.href;
  let external = true;

  const removeLink = () => {
    const editor = props.editor;
    if (props.pos && props.node) {
      editor
        .chain()
        .setTextSelection({
          from: props.pos,
          to: props.pos + props.node.nodeSize
        })
        .unsetLink()
        .run();
      props.onHide();
    }
  };

  const updateLink = () => {
    const editor = props.editor;
    if (props.pos && props.node) {
      editor
        .chain()
        .setTextSelection({
          from: props.pos,
          to: props.pos + props.node.nodeSize
        })
        .setLink({href: link, target: external ? '_blank' : '_self'})
        .run();
      props.onHide();
    }
  };

  const visibleUpdateForm = () => {
    update = true;
  };
</script>

{#if update}
  <div
    class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border
    border-neutral-200 dark:border-neutral-800 -translate-y-8"
  >
    <LinkForm bind:link bind:external onSubmit={updateLink} />
  </div>
{:else}
  <div
    class="flex items-center p-2 shadow border border-border rounded-md bg-background z-10 gap-1"
  >
    <Link class="absolute left-4 text-primary" size={16} />
    <input
      class="outline-none border-none bg-accent p-1 rounded-md text-sm w-full pl-8 mr-3"
      readonly
      value={link}
    />
    <button on:click={visibleUpdateForm} class="hover:bg-accent p-1 rounded-md">
      <Pen size={18} />
    </button>
    <button on:click={removeLink} class="hover:bg-accent p-1 rounded-md mr-2">
      <Trash2 size={18} class="text-destructive" />
    </button>
  </div>
{/if}
