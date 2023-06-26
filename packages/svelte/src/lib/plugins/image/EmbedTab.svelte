<script lang="ts">
  import {Tabs, Input, Container, Button} from '@svelteuidev/core';
  import {getContext} from 'svelte';

  export let onInsert = (url: string, alt: string) => {};
  let value = '';
</script>

<Tabs.Tab label="Embed link">
  <Container override={{height: '100px'}}>
    <Input
      on:paste={e => {
        //prevent paste fire in editor
        e.stopPropagation();
      }}
      bind:value
      placeholder="Paste link here..."
    />
    <Button
      on:click={() => onInsert(value, 'image alt')}
      override={{marginTop: 16, width: '100%'}}
      size="sm">Submit</Button
    >
  </Container>
</Tabs.Tab>
