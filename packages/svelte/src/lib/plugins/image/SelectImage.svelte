<script lang="ts">
  import {Tabs} from '@svelteuidev/core';
  import {lockscroll, createLockScrollStore} from '@svelte-put/lockscroll';
  import {createTabs, melt} from '@melt-ui/svelte';
  import {cubicInOut} from 'svelte/easing';
  import {crossfade} from 'svelte/transition';

  import UploadTab from './UploadTab.svelte';
  import EmbedTab from './EmbedTab.svelte';
  import UnplashTab from './UnplashTab.svelte';
  import {getContext, onDestroy, onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import type {SelectImageOptions} from './image';
  import {X} from 'lucide-svelte';

  const store = getContext<Writable<NodeViewRendererProps>>('store');
  const options = getContext<SelectImageOptions>('options');

  export let onHide = () => {};

  const triggers = [
    {id: 'tab-1', title: 'Account'},
    {id: 'tab-2', title: 'Password'},
    {id: 'tab-3', title: 'Settings'}
  ];

  const {
    elements: {root, list, content, trigger},
    states: {value}
  } = createTabs({
    defaultValue: 'tab-1'
  });

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });

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

  const locked = createLockScrollStore();

  onMount(() => {
    console.log('onMount');
    $locked = true;
  });
  onDestroy(() => {
    console.log('onDestroy');
    $locked = false;
  });
</script>

<svelte:body use:lockscroll={locked} />

<div
  use:melt={$root}
  class="w-[480px] bg-background rounded-lg border border-border shadow-md z-10"
>
  <button
    on:click={() => onHide()}
    class="absolute top-[2px] right-[2px] hover:bg-secondary rounded-lg p-2"
  >
    <X size={16} />
  </button>
  <div
    use:melt={$list}
    class="flex shrink-0 overflow-x-auto bg-neutral-100
    data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
    aria-label="Manage your account"
  >
    <button use:melt={$trigger('tab-1')} class="trigger relative">
      {#if $value === 'tab-1'}
        <div
          in:send={{key: 'trigger'}}
          out:receive={{key: 'trigger'}}
          class="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-magnum-400"
        >
          Hello
        </div>
      {/if}
    </button>
    <button use:melt={$trigger('tab-2')} class="trigger relative">
      {#if $value === 'tab-2'}
        <div
          in:send={{key: 'trigger'}}
          out:receive={{key: 'trigger'}}
          class="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-magnum-400"
        >
          Hello
        </div>
      {/if}
    </button>
  </div>
  <!-- <Tabs override={{color: 'teal'}}> -->
  <!--   {#if options.handleUpload} -->
  <!--     <UploadTab {onInsert} onUploadFile={options.handleUpload} /> -->
  <!--   {/if} -->
  <!--   <EmbedTab {onInsert} /> -->
  <!--   {#if options.unsplash} -->
  <!--     <UnplashTab {onInsert} unsplash={options.unsplash} /> -->
  <!--   {/if} -->
  <!-- </Tabs> -->
</div>
