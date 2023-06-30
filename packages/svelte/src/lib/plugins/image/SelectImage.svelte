<script lang="ts">
  import {Box, Tabs} from '@svelteuidev/core';
  import UploadTab from './UploadTab.svelte';
  import EmbedTab from './EmbedTab.svelte';
  import UnplashTab from './UnplashTab.svelte';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import type {SelectImageOptions} from './image';

  const store = getContext<Writable<NodeViewRendererProps>>('store');
  const options = getContext<SelectImageOptions>('options');

  export let onHide = () => {};

  const onInsert = (src: string, alt: string) => {
    if (!$store) return;
    const {editor, getPos} = $store;

    if (typeof getPos === 'function') {
      editor
        .chain()
        .setNodeSelection(getPos()!)
        .deleteNode('selectImage')
        .toggleFigure({
          src,
          alt
        })
        .scrollIntoView()
        .run();
      onHide();
    }
  };
</script>

<Box
  css={{
    width: '480px',
    borderRadius: 8,
    boxShadow: 'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px',
    backgroundColor: 'white'
  }}
>
  <Tabs override={{color: 'teal'}}>
    {#if options.handleUpload}
      <UploadTab {onInsert} onUploadFile={options.handleUpload} />
    {/if}
    <EmbedTab {onInsert} />
    {#if options.unsplash}
      <UnplashTab {onInsert} unsplash={options.unsplash} />
    {/if}
  </Tabs>
</Box>
