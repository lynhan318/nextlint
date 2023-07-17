<script lang="ts">
  import {type ComponentType, createEventDispatcher} from 'svelte';
  import {Text, Box, Center} from '@svelteuidev/core';

  const dispatcher = createEventDispatcher<{
    active: HTMLElement;
  }>();
  export let text = '';
  export let description = '';
  export let icon: ComponentType | null = null;
  export let active = false;
  export let onClick = () => {};
  let element: HTMLElement;
  $: {
    if (active) {
      // wait for next tick make sure layout is ready
      queueMicrotask(() => {
        dispatcher('active', element);
      });
    }
  }
  $: cls = active ? 'slash-item-actived' : '';
</script>

<Box
  on:click={onClick}
  class={cls}
  bind:element
  root="button"
  css={{
    display: 'flex',
    alignItems: 'center',
    outline: 'none',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'unset',
    color: '$dark500',
    borderRadius: 4,
    marginBottom: 8,
    '&:hover': {
      backgroundColor: '$gray200'
    }
  }}
>
  {#if icon}
    <Box
      css={{
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
        border: '1px solid $gray300'
      }}
    >
      <Center override={{width: 40, height: 40}}>
        <svelte:component this={icon} size={24} />
      </Center>
    </Box>
  {/if}
  <div style="margin-left:12px;padding:4px;width:100%">
    <Text
      color="$dark500"
      override={{fontFamily: 'var(--editor-font)'}}
      size="md"
    >
      {text}
    </Text>
    <Text color="$dark300" size="xs" override={{marginTop: 8}}>
      {description}
    </Text>
  </div>
</Box>

<style lang="scss">
  :global(.slash-item-actived) {
    background-color: var(--svelteui-colors-gray200) !important;
  }
</style>
