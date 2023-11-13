<script lang="ts">
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

<div class="h-[400px] overflow-y-auto bg-background">
  <form
    style="position: relative;"
    on:submit={e => {
      e.preventDefault();
      onSearch();
    }}
  >
    <input
      placeholder="Search on unsplash..."
      disabled={loading}
      bind:value={query}
    />
    {#if loading}
      <div>
        <Spinner size="sm" />
      </div>
    {/if}
  </form>
  <div class="grid grid-cols-3 gap-4 grid-flow-row-dense">
    {#each lists as image}
      <figure
        class=" outline-none border-none"
        on:click={() => {
          onInsert(image.urls.regular, `Unsplash: ${image.user.name}`);
        }}
      >
        <img src={image.urls.small} class="rounded-md" />
        <figcaption>
          by
          <a>{image.user.name}</a>
        </figcaption>
      </figure>
    {/each}
    <span> Search for more results </span>
  </div>
</div>
