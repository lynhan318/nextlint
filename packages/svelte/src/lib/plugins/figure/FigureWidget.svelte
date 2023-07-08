<script lang="ts">
  import {onDestroy, onMount} from 'svelte';
  import {ActionIcon, Box, Group} from '@svelteuidev/core';
  import {
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight
  } from 'radix-icons-svelte';
</script>

<Box
  css={{
    position: 'absolute',
    top: -40,
    left: '50%',
    translate: '-50% 0',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 4,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
  }}
>
  <Group>
    <ActionIcon><TextAlignLeft size={20} /></ActionIcon>
    <ActionIcon><TextAlignCenter size={20} /></ActionIcon>
    <ActionIcon><TextAlignRight size={20} /></ActionIcon>
  </Group>
</Box>
