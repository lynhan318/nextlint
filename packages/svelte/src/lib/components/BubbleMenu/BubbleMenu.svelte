<script lang="ts">
  import {Box, Group} from '@svelteuidev/core';

  import DropdownMenu from './DropdownMenu.svelte';
  import FontStyleMenu from './FontStyleMenu.svelte';
  import CustomMenu from './CustomMenu.svelte';
  import {positionStore} from '../Positioner';

  const IGNORE_BLOCK_MENU = ['figure', 'codeBlock'];

  $: visibleNode = (() => {
    const resolver = $positionStore.selection?.resolver;
    if (!resolver) return;
    let node = resolver.node(resolver.depth);
    let i = resolver.depth - 1;
    while (i > 0) {
      const parent = resolver.node(i);
      if (parent.type.name === 'listItem') {
        i--;
        continue;
      }
      node = parent;
      break;
    }

    if (IGNORE_BLOCK_MENU.includes(node.type.name)) {
      return;
    }
    return node;
  })();
</script>

{#if !!visibleNode}
  <Box
    css={{
      borderRadius: 4,
      padding: 4,
      backgroundColor: 'white',
      boxShadow:
        'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px'
    }}
  >
    <Group
      align="center"
      direction="row"
      override={{width: '100%', flexFlow: 'unset'}}
    >
      <DropdownMenu {visibleNode} />
      <FontStyleMenu />
      <CustomMenu />
    </Group>
  </Box>
{/if}
