<script lang="ts">
  import {ActionIcon, Box, Group} from '@svelteuidev/core';
  import type {Editor} from '@tiptap/core';
  import {TrashIcon} from '$lib/icons';

  export let editor: Editor;
  const removeBlock = () => {
    editor.chain().deleteSelection().selectTextblockStart().run();
  };
</script>

<Box
  css={{
    position: 'absolute',
    top: -44,
    left: '50%',
    translate: '-50% 0',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 4,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
  }}
>
  <Group>
    <ActionIcon color="red" on:mousedown={removeBlock}>
      <TrashIcon />
    </ActionIcon>
  </Group>
</Box>
