<script lang="ts">
  import {Check, Link} from 'lucide-svelte';
  import {createCheckbox, createPopover, melt} from '@melt-ui/svelte';
  import {useEditor} from '$lib/context';
  import {cn} from '$lib/helpers';
  import {onDestroy, onMount} from 'svelte';

  const editor = useEditor();
  let link = '';

  const {
    elements: {trigger, content},
    states: {open}
  } = createPopover({
    portal: null,
    positioning: {
      placement: 'bottom'
    }
  });
  const {
    elements: {root, input},
    helpers: {isChecked}
  } = createCheckbox({});

  const setLink = () => {
    $editor.chain().focus().setLink({href: link}).run();
    open.set(false);
  };

  const onLinkChange = () => {
    link = $editor.getAttributes('link').href || '';
  };
  onMount(() => {
    $editor.on('update', onLinkChange);
    $editor.on('selectionUpdate', onLinkChange);
  });
  onDestroy(() => {
    $editor.off('update', onLinkChange);
    $editor.off('selectionUpdate', onLinkChange);
  });
</script>

<button
  use:melt={$trigger}
  class={cn(link && 'bg-slate-300', 'p-1 rounded-md hover:bg-secondary')}
>
  <Link size={20} />
</button>
{#if $open}
  <div
    class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800"
    use:melt={$content}
  >
    <form
      class="flex gap-2 flex-col min-w-[300px]"
      on:submit|preventDefault={setLink}
    >
      <label class="flex items-center gap-2 rounded-lg cursor-text">
        <Link class="absolute left-4 text-primary" size={16} />
        <input
          class="outline-none border-none bg-accent p-2 rounded-md text-sm w-full pl-8"
          type="url"
          bind:value={link}
          placeholder="Enter URL"
        />
        <button
          class="w-[100px] text-sm bg-muted text-primary p-2 rounded-md"
          type="submit">Set Link</button
        >
      </label>
      <div class="flex items-center">
        <button
          use:melt={$root}
          class="flex appearance-none items-center rounded-md
            bg-background w-5 h-5 hover:opacity-75 border border-border"
          id="checkbox"
        >
          {#if $isChecked}
            <Check class="w-4 h-4a" />
          {/if}
          <input use:melt={$input} />
        </button>
        <label class="pl-2 text-sm" for="checkbox">Open link in new tab</label>
      </div>
    </form>
  </div>
{/if}
