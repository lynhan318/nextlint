<script lang="ts">
  import {createEditorContext} from '@nextlint/core';
  import type {Content, Editor} from '@tiptap/core';
  import {Stack, SvelteUIProvider} from '@svelteuidev/core';

  import FontStyleMenu from './components/BubbleMenu/FontStyleMenu.svelte';

  export let content: Content;
  export let placeholder = 'Share your thought...';
  export let editable = true;
  export let onCreated = (editor: Editor) => {};

  const {render, ready} = createEditorContext({
    editable,
    content,
    onCreated,
    placeholder,
    starterKit: {
      placeholder: {
        placeholder,
        emptyNodeClass: 'is-block-empty'
      }
    }
  });
</script>

<SvelteUIProvider>
  <Stack override={{gap: 0}}>
    <div use:render />
    {#if editable}
      {#await ready then _}
        <div style="display:flex;height:32px;">
          <FontStyleMenu />
        </div>
      {/await}
    {/if}
  </Stack>
</SvelteUIProvider>
