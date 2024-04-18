<script lang="ts" context="module">
  const themeStore: Writable<Theme> = writable('light');
  export const useEditorTheme = () => themeStore;
</script>

<script lang="ts">
  import type {Theme} from '$lib/node-view';
  import './EditorTheme.scss';
  import {writable, type Writable} from 'svelte/store';
  export let theme: Theme = 'light';
  $: {
    themeStore.set(theme);
  }
</script>

<slot />
