<script lang="ts">
  import {Box, Group} from '@svelteuidev/core';

  import DropdownMenu from './DropdownMenu.svelte';
  import FontStyleMenu from './FontStyleMenu.svelte';
  import CustomMenu from './CustomMenu.svelte';
</script>

<Box
  css={{
    borderRadius: 4,
    padding: 4,
    backgroundColor: 'white',
    boxShadow: 'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px'
  }}
>
  <Group
    align="center"
    direction="row"
    override={{width: '100%', flexFlow: 'unset'}}
  >
    <DropdownMenu />
    <FontStyleMenu />
    <CustomMenu />
  </Group>
</Box>
