<script lang="ts" module>
  const themeStore: Writable<Theme> = writable('light');
  export const useEditorTheme = () => themeStore;
</script>

<script lang="ts">
  import { run } from 'svelte/legacy';

  import type {Theme} from '$lib/node-view';
  import './EditorTheme.scss';
  import {writable, type Writable} from 'svelte/store';
  interface Props {
    theme?: Theme;
    children?: import('svelte').Snippet;
  }

  let { theme = 'light', children }: Props = $props();
  run(() => {
    themeStore.set(theme);
  });
</script>

{@render children?.()}
