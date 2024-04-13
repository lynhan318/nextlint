<script lang="ts">
  import {useNodeViewContext} from '@prosemirror-adapter/svelte';
  import {onDestroy} from 'svelte';

  import Languages from './Languages.svelte';

  import type {NextlintCodeBlockAttrs} from './codeBlock';
  import {getHighlighter} from '.';

  const contentRef = useNodeViewContext('contentRef');
  const node = useNodeViewContext('node');

  let highlightCode = '';
  let attrs: NextlintCodeBlockAttrs;

  const dispose = node.subscribe(async newNode => {
    const highlighter = await getHighlighter();
    attrs = newNode.attrs as NextlintCodeBlockAttrs;
    highlightCode = highlighter.codeToHtml(newNode.textContent, {
      lang: attrs.lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    });
  });

  onDestroy(() => {
    dispose();
  });
</script>

<!-- <div contenteditable="false" class="w-full h-full"> -->
<!--   {@html highlightCode} -->
<!-- </div> -->
<Languages />
<pre
  class="absolute top-0 left-0 block inset-0 outline-nonerounded-md overflow-y-hidden"
  use:contentRef></pre>
