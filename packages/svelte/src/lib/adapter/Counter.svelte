<script context="module" lang="ts">
</script>

<script lang="ts">
  import {useEditor} from '$lib/context';

  import {useNodeViewContext} from '@prosemirror-adapter/svelte';
  import {onMount} from 'svelte';
  let selected = false;

  const contentRef = useNodeViewContext('contentRef');
  const selectedStore = useNodeViewContext('selected');
  selectedStore.subscribe(value => {
    selected = value;
  });
  const editor = useEditor();
  onMount(() => {});
</script>

<div use:contentRef class:selected />

<style>
  .selected {
    outline: blue solid 1px;
  }
</style>
