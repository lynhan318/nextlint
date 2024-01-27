<script lang="ts">
  import {useContentRef, useNodeViewProps} from '$lib/node-view';
  import {onDestroy} from 'svelte';

  import Languages from './Languages.svelte';

  import {type NextlintCodeBlockAttrs} from './codeBlock';
  import {getHighlighter} from '.';

  const contentRef = useContentRef();
  const props = useNodeViewProps();

  let highlightCode = '';
  let attrs: NextlintCodeBlockAttrs;

  const dispose = props.subscribe(async ({node}) => {
    const highlighter = await getHighlighter();
    attrs = node.attrs as NextlintCodeBlockAttrs;
    highlightCode = highlighter.codeToHtml(node.textContent, {
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

<div contenteditable="false" class="w-full h-full">
  {@html highlightCode}
</div>
<Languages />
<pre
  class="absolute top-0 left-0 block inset-0 outline-nonerounded-md overflow-y-hidden">
  <code
    class="absolute top-0 left-0 block inset-0 caret-primary text-transparent bg-transparent z-[1] p-4"
    use:contentRef
  />
</pre>
