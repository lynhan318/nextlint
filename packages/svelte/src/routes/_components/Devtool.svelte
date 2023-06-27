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
  import {renderHTML, useEditor} from '@sveltor/core';
  import {Gear, Cross1, EyeOpen, PinBottom, FileText} from 'radix-icons-svelte';
  export let editor;
  let show = false;
  let preview = false;
  let element: HTMLElement;
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
            <ActionIcon>
              <PinBottom size={24} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download HTML">
            <ActionIcon>
              <FileText size={24} />
            </ActionIcon>
          </Tooltip>
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
