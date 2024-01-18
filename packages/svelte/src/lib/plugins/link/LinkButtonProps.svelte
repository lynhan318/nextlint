<script lang="ts">
  import {createPopover, melt} from '@melt-ui/svelte';
  import {useEditor} from '$lib/context';
  import {onDestroy, onMount} from 'svelte';
  import LinkForm from './LinkForm.svelte';

  const editor = useEditor();
  let link = '';
  let external = true;

  const {
    elements: {trigger, content},
    states: {open}
  } = createPopover({
    portal: null,
    positioning: {
      placement: 'bottom'
    }
  });

  const setLink = () => {
    $editor
      .chain()
      .focus()
      .setLink({
        href: link,
        target: external ? '_blank' : '_self'
      })
      .run();
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

<slot {link} trigger={$trigger} />

{#if $open}
  <div
    class="p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800"
    use:melt={$content}
  >
    <LinkForm bind:link bind:external onSubmit={setLink} />
  </div>
{/if}
