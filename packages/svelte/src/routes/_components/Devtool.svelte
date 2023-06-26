<script lang="ts">
  import {Checkbox, Container, Group} from '@svelteuidev/core';
  export let options = {
    preview: false
  };
  let checked = 'check';
</script>

<Container override={{width: '100%'}}>
  <Group
    override={{
      margin: 'auto',
      boxShadow: '$shadows$lg',
      maxWidth: 500,
      padding: 16,
      borderRadius: 16,
      marginTop: 32
    }}
  >
    <Checkbox label="Preview" bind:checked={options.preview} />
    <Checkbox label="TOC" bind:checked={options.toc} />
  </Group>
</Container>
