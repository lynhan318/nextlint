<script lang="ts">
  import {
    Tabs,
    Box,
    Text,
    Input,
    Container,
    Loader,
    Anchor
  } from '@svelteuidev/core';
  import {getContext, onMount} from 'svelte';
  import {createApi} from 'unsplash-js';

  export let unsplash = {accessKey: ''};

  let lists = [];
  let query = '';
  let loading = false;
  export let onInsert = (url: string, alt: string) => {};

  const api = createApi({
    accessKey: unsplash.accessKey
  });
  const onSearch = async () => {
    if (loading) return;
    const cached = localStorage.getItem(`unsplash_${query}`);
    if (cached) {
      lists = JSON.parse(cached);
      return;
    }
    loading = true;
    const {response} = await api.photos.getRandom({count: 12, query});
    if (response) {
      lists = response;
      localStorage.setItem(`unsplash_${query}`, JSON.stringify(lists));
    }
    loading = false;
  };
  onMount(() => {
    onSearch();
  });
</script>

<Container override={{height: '400px', overflow: 'auto'}}>
  <form
    style="position: relative;"
    on:submit={e => {
      e.preventDefault();
      onSearch();
    }}
  >
    <Input
      placeholder="Search on unsplash..."
      override={{marginBottom: 16}}
      disabled={loading}
      bind:value={query}
    />
    {#if loading}
      <Box css={{top: 8, right: 8, position: 'absolute'}}>
        <Loader size="sm" />
      </Box>
    {/if}
  </form>
  <Box css={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
    {#each lists as image}
      <Box
        root="button"
        css={{
          width: 100,
          height: 120,
          gap: 8,
          outline: 'none',
          border: 'none',
          backgroundColor: 'white'
        }}
        on:click={() => {
          onInsert(image.urls.regular, `Unsplash: ${image.user.name}`);
        }}
      >
        <Box
          src={image.urls.small}
          root="img"
          css={{
            width: 100,
            height: 100,
            objectFit: 'cover !important',
            cursor: 'pointer',
            '&:hover': {
              transition: 'opacity 0.3s',
              opacity: 0.8
            }
          }}
        />
        <Text
          override={{fontFamily: 'var(--editor-font)'}}
          size="xs"
          lineClamp={1}
        >
          by
          <Anchor
            override={{fontFamily: 'var(--editor-font)', color: '$gray600'}}
            size="xs">{image.user.name}</Anchor
          >
        </Text>
      </Box>
    {/each}
    <Text
      override={{
        textAlign: 'center',
        padding: '16px 0',
        color: '$gray600',
        width: '100%'
      }}>Search for more results</Text
    >
  </Box>
</Container>
