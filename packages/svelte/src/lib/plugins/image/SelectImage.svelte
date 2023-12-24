<script lang="ts">
  import {lockscroll, createLockScrollStore} from '@svelte-put/lockscroll';
  import {clickoutside} from '@svelte-put/clickoutside';
  import {createTabs, melt} from '@melt-ui/svelte';
  import {cubicInOut} from 'svelte/easing';
  import {crossfade} from 'svelte/transition';
  import {onDestroy, onMount} from 'svelte';
  import {X} from 'lucide-svelte';

  import UploadTab from './UploadTab.svelte';
  import EmbedTab from './EmbedTab.svelte';
  import UnplashTab from './UnplashTab.svelte';
  import {SelectImageExtension} from './image';

  const options = SelectImageExtension.options;

  export let onHide = () => {};

  const triggers = [
    options?.handleUpload && {id: 'tab-1', title: 'Upload'},
    {id: 'tab-2', title: 'From URL'},
    options?.unsplash && {id: 'tab-3', title: 'Unsplash'}
  ].filter(Boolean) as any;

  const {
    elements: {root, list, content, trigger},
    states: {value}
  } = createTabs({orientation: 'horizontal'});

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });

  const locked = createLockScrollStore();

  onMount(() => {
    $locked = true;
  });
  onDestroy(() => {
    $locked = false;
  });
</script>

<svelte:body use:lockscroll={locked} />

<div
  use:melt={$root}
  use:clickoutside
  on:clickoutside={onHide}
  class="flex w-[460px] max-h-[400px] flex-col overflow-hidden
  shadow-lg data-[orientation=vertical]:flex-row
  border border-border rounded-xl bg-background text-foreground"
>
  <button on:click={onHide} class="absolute w-8 h-8 top-[1px] right-[1px]">
    <X size={24} />
  </button>
  <div
    use:melt={$list}
    class="flex shrink-0 overflow-x-auto relative bg-background
    data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
    aria-label="Upload image plugin"
  >
    {#each triggers as triggerItem}
      <button use:melt={$trigger(triggerItem.id)} class="trigger relative">
        {triggerItem.title}
        {#if $value === triggerItem.id}
          <div
            in:send={{key: 'trigger'}}
            out:receive={{key: 'trigger'}}
            class="absolute bottom-1 bg-primary left-1/2 h-1 w-6 -translate-x-1/2 rounded-full"
          />
        {/if}
      </button>
    {/each}
  </div>

  {#if options.handleUpload}
    <div use:melt={$content('tab-1')} class="grow p-5">
      <UploadTab {onInsert} onUploadFile={options.handleUpload} />
    </div>
  {/if}
  <div use:melt={$content('tab-2')} class="grow p-5">
    <EmbedTab />
  </div>
  {#if options.unsplash}
    <div use:melt={$content('tab-3')} class="grow p-5">
      <UnplashTab {onInsert} unsplash={options.unsplash} />
    </div>
  {/if}
</div>

<style lang="postcss">
  .trigger {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: default;
    user-select: none;

    border-radius: 0;
    background-color: theme(colors.background);

    color: theme(colors.foreground);
    font-weight: 500;
    line-height: 1;

    flex: 1;
    height: theme(spacing.12);
    padding-inline: theme(spacing.2);

    &:focus {
      position: relative;
    }

    &:focus-visible {
      @apply z-10 ring-2;
    }

    &[data-state='active'] {
      @apply focus:relative;
      background-color: theme('colors.secondary.DEFAULT');
      color: theme('colors.secondary.foreground');
    }
  }

  input {
    height: theme(spacing.8);
    flex-shrink: 0;
    flex-grow: 1;
    border-radius: theme(borderRadius.md);
    border: 1px solid theme(colors.border);
    padding-inline: theme(spacing[2.5]);
    line-height: 1;
    color: theme(colors.foreground);
  }

  .save {
    display: inline-flex;
    height: theme(spacing.8);
    cursor: default;
    align-items: center;
    justify-content: center;
    border-radius: theme(borderRadius.md);
    background-color: theme(colors.background);
    padding-inline: theme(spacing.4);
    line-height: 1;
    font-weight: theme(fontWeight.semibold);
    color: theme(colors.foreground);
    @apply transition;
    &:hover {
      opacity: 0.75;
    }

    &:focus {
      @apply !ring-green-600;
    }
  }
</style>
