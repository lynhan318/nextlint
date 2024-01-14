<script lang="ts" context="module">
  let highlighter: HighlighterGeneric<string, string>;

  export async function getHighlighter() {
    highlighter ||= await shikijiHighlighter({
      langs: NextlintCodeBlock.options.langs,
      themes: NextlintCodeBlock.options.themes
    });
    return highlighter;
  }
</script>

<script lang="ts">
  import {
    getHighlighter as shikijiHighlighter,
    type HighlighterGeneric
  } from 'shikiji';
  import {useContentRef, useNodeViewProps} from '$lib/node-view';
  import {onDestroy} from 'svelte';

  import {type NextlintCodeBlockAttrs, NextlintCodeBlock} from './codeBlock';

  const contentRef = useContentRef();
  const props = useNodeViewProps();

  let highlightCode = '';
  let attrs: NextlintCodeBlockAttrs;

  const dispose = props.subscribe(async ({node}) => {
    const highlighter = await getHighlighter();
    highlightCode = highlighter.codeToHtml(node.textContent, {
      lang: 'js',
      theme: 'github-light'
    });
    attrs = node.attrs as NextlintCodeBlockAttrs;
  });

  onDestroy(() => {
    dispose();
  });
</script>

<div contenteditable="false" class="w-full h-full">
  {@html highlightCode}
</div>

<pre
  class="absolute top-0 left-0 block inset-0 caret-primary text-transparent bg-transparent outline-none border-none overflow-y-hidden">
  <code
    class="absolute top-0 left-0 block inset-0 caret-primary text-transparent bg-transparent z-[2] py-4 pl-4"
    use:contentRef
  />
</pre>

<style lang="scss">
  :global(code-block) {
    width: 100%;
    min-height: 100px;
    height: 100%;
    display: block;
    position: relative;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid theme('colors.muted.DEFAULT');
    border-radius: 4px;
  }

  :global(.shiki) {
    position: relative;
    z-index: 1;
    overflow-x: auto;
    background: transparent;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    cursor: text;
    border-radius: 4px;
    outline: none;
    padding-top: 16px;
    padding-left: 16px;
  }
</style>
