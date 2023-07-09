<svelte:options accessors={true} />

<script lang="ts">
  import {ActionIcon, Box, Group} from '@svelteuidev/core';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import {
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight
  } from 'radix-icons-svelte';

  export let nodeView: NodeViewRendererProps;
  let attrs = nodeView.node.attrs;
  let alt = nodeView.node.textContent;

  let hasFocus = false;

  //Implement node view interface {{
  export let dom: HTMLElement;
  export let contentDOM: HTMLElement;

  const setFocus = e => {
    e.preventDefault();
    e.stopPropagation();
    const {editor, getPos} = nodeView;
    if (typeof getPos === 'function') {
      hasFocus = editor.commands.setNodeSelection(getPos());
    }
  };
</script>

<figure
  bind:this={dom}
  data-node-type="figure"
  data-align={attrs.direction}
  style="position:relative;"
>
  <img
    {alt}
    src={attrs.src}
    on:mousedown={setFocus}
    style="object-fit: {attrs.fit};"
  />
  <Box
    root="figcaption"
    css={{width: '100%', textAlign: 'center'}}
    bind:element={contentDOM}
  />
</figure>
