<script lang="ts">
  import Languages from './Languages.svelte';
  import {useNodeViewContext} from '$lib/node-view';
  const contentDOM = useNodeViewContext('contentDOM');
  const focus = useNodeViewContext('selected');
  $: {
    console.log('focus', $focus);
  }
</script>

<div contenteditable="false">
  <Languages />
</div>

<code use:contentDOM style="white-space:inherit" />
