<script lang="ts">
  import type {Editor} from '@tiptap/core';
  import {onMount} from 'svelte';

  import {FLOATBAR_ICONS} from './menu';
  import FloatButton from './FloatButton.svelte';

  export let editor: Editor;

  onMount(() => {
    editor?.on('selectionUpdate', ({editor: newEditor}) => {
      editor = newEditor;
    });
  });

  $: newEditor = editor;
</script>

{#if editor}
  <div class="wrapper">
    <div class="icon-wrapper">
      {#each FLOATBAR_ICONS as { onClick, icon }}
        {#if !!onClick}
          <FloatButton onClick={() => onClick(newEditor)}
            ><svelte:component this={icon} /></FloatButton
          >
        {:else}
          <svelte:component this={icon} {editor} />
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .icon-wrapper {
    display: block;
    display: flex;
    flex-direction: row;
    padding: 4px;
  }
  .seperate {
    &::before {
      content: '';
      width: 1px;
      display: block;
      height: 100%;
      background-color: #ccc;
    }
  }
  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: white;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    z-index: 1;
    border-radius: 8px;
  }
</style>
