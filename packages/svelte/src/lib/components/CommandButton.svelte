<script lang="ts">
  import {Box, ActionIcon, Tooltip} from '@svelteuidev/core';
  export let element: HTMLElement;
  export let toggle = () => {};
  export let active = false;
  export let label = '';
  export let cmd = '';
</script>

<Tooltip wrapLines override={{display: 'flex', '& span': {display: 'flex'}}}>
  <Box
    slot="label"
    css={{
      fontSize: '12px',
      fontFamily: 'var(--editor-font-heading)',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: 100
    }}
  >
    <Box css={{color: '$gray300'}} root="span">{label}</Box>
    {#if cmd}
      <Box css={{color: '$gray600', fontWeight: 'bold'}} root="span">{cmd}</Box>
    {/if}
  </Box>
  <ActionIcon
    bind:element
    color={active ? 'teal' : ''}
    on:click={e => {
      toggle();
    }}
    override={{
      display: 'flex',
      '&:hover': {
        transition: 'all 0.15s ease-in-out',
        backgroundColor: '$gray300'
      }
    }}
  >
    <slot />
  </ActionIcon>
</Tooltip>
