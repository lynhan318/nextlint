<script lang="ts">
  import type {Content, Editor} from '@tiptap/core';
  import {Stack, SvelteUIProvider, Box} from '@svelteuidev/core';

  import {createEditorContext} from '$lib/context';

  import {Positioner} from './components/Positioner';

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
        <Positioner position="selection">
          <Box
            style="display:flex;height:32px;"
            css={{
              display: 'flex',
              height: '32px',
              background: 'white',
              boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              padding: 4
            }}
          ></Box>
        </Positioner>
      {/await}
    {/if}
  </Stack>
</SvelteUIProvider>
