<script lang="ts">
  import {Box, Group, Text} from '@svelteuidev/core';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import {Image} from 'radix-icons-svelte';
  import {onMount, setContext} from 'svelte';

  export let props: NodeViewRendererProps;
  export let triggerOnMount = false;
  export let onOpen = (domRect: DOMRect) => {};

  let element: HTMLButtonElement;

  onMount(() => {
    //cannot get getBoundingClientRect right in onMount,should wait for a period of time
    if (triggerOnMount) {
      setTimeout(() => {
        onOpen(element.getBoundingClientRect());
      }, 100);
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<Box
  root="button"
  on:mousedown={e => {
    onOpen(element.getBoundingClientRect());
  }}
  bind:element
  css={{
    height: 60,
    backgroundColor: '$gray100',
    bordeRadius: 8,
    marginLeft: 16,
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
    outline: 'none',
    border: 'none'
  }}
>
  <Group override={{height: '100%', width: '100%'}} direction="row">
    <Image />
    <Text>Add an image</Text>
  </Group>
</Box>
