<svelte:options accessors={true} />

<script lang="ts">
  import {Box} from '@svelteuidev/core';
  import type {NodeViewRendererProps} from '@tiptap/core';
  import type {Node} from '@tiptap/pm/model';

  export let nodeView: NodeViewRendererProps;
  let attrs = nodeView.node.attrs;
  let alt = nodeView.node.textContent;

  //Implement node view interface {{
  export let dom: HTMLElement;
  export let contentDOM: HTMLElement;

  export const update = (node: Node) => {
    //TODO: workaround sync the image alt
    if (nodeView.editor.state.tr.docChanged) {
      queueMicrotask(() => {
        nodeView.editor.commands.updateAttributes('figure', {
          alt: node.textContent
        });
      });
    }
  };

  const setFocus = e => {
    e.preventDefault();
    e.stopPropagation();
    const {editor, getPos} = nodeView;
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
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
