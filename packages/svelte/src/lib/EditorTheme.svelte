<script lang="ts">
  import './EditorTheme.scss';
  import './CodeTheme.scss';

  export let theme: 'dark' | 'light' = 'light';
</script>

<div class={theme}>
  <slot />
</div>
