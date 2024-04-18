<script lang="ts">
  import Languages from './Languages.svelte';
  import {useNodeViewContext} from '$lib/node-view';
  const contentDOM = useNodeViewContext('contentDOM');
</script>

<div contenteditable="false">
  <Languages />
</div>

<code use:contentDOM style="white-space:inherit" />
