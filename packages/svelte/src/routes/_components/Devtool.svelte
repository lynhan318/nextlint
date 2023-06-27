<script lang="ts">
  import {
    Portal,
    Box,
    Popper,
    ActionIcon,
    Tooltip,
    Group,
    Modal,
    Container
  } from '@svelteuidev/core';

  import {renderHTML} from '@nextlint/core';
  import type {Editor} from '@tiptap/core';
  import {Gear, Cross1, EyeOpen, PinBottom, FileText} from 'radix-icons-svelte';
  export let editor: Editor;
  let show = false;
  let preview = false;
  let element: HTMLElement;
  const downloadHTML = () => {
    const html = renderHTML(editor);
    const a = document.getElementById('download_html') as HTMLAnchorElement;
    const downloadUrl = URL.createObjectURL(
      new Blob([html], {type: 'text/html'})
    );
    a.download = 'sveltor.html';
    a.href = downloadUrl;
    a.click();
  };
  const downloadJSON = () => {
    const json = editor.getJSON();
    const a = document.getElementById('download_json') as HTMLAnchorElement;
    const downloadUrl = URL.createObjectURL(
      new Blob([JSON.stringify(json)], {type: 'application/json'})
    );
    a.download = 'sveltor.json';
    a.href = downloadUrl;
    a.click();
  };
</script>

<Portal zIndex={5}>
  <Box css={{position: 'fixed', bottom: 30, right: 30}}>
    <ActionIcon bind:element on:click={() => (show = !show)}>
      {#if show}
        <Cross1 size={24} />
      {:else}
        <Gear size={24} />
      {/if}
    </ActionIcon>
    {#if show}
      <Popper mounted={show} reference={element} position="left">
        <Group>
          <Tooltip label="Preview">
            <ActionIcon on:click={() => (preview = !preview)}>
              <EyeOpen size={24} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download JSON">
            <ActionIcon on:click={downloadJSON}>
              <PinBottom size={24} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download HTML">
            <ActionIcon on:click={downloadHTML}>
              <FileText size={24} />
            </ActionIcon>
          </Tooltip>
          <a id="download_json" />
          <a id="download_html" />
        </Group>
      </Popper>
    {/if}
  </Box>
</Portal>

<Modal opened={preview} size="100%" on:close={() => (preview = false)}>
  <Container fluid override={{width: 860}}>
    {@html renderHTML(editor)}
  </Container>
</Modal>
