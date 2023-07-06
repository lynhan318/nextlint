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
  export const update = (updatedNode: Node) => {
    alt = updatedNode.textContent || '';
    // console.log('isActive', nodeView.editor.isActive('figure'));
  };
  // }}

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
  data-direction={attrs.direction}
  style="position:relative"
>
  {#if hasFocus}
    <Group
      override={{
        position: 'absolute',
        translate: '-50% 0',
        left: '50%',
        borderRadius: 8,
        padding: 4,
        top: -44,
        backgroundColor: 'white',
        boxShadow:
          'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px'
      }}
    >
      <ActionIcon>
        <TextAlignLeft />
      </ActionIcon>
      <ActionIcon>
        <TextAlignCenter />
      </ActionIcon>
      <ActionIcon>
        <TextAlignRight />
      </ActionIcon>
    </Group>
  {/if}
  <img {alt} src={attrs.src} on:mousedown={setFocus} />
  <Box
    root="figcaption"
    css={{width: '100%', textAlign: 'center'}}
    bind:element={contentDOM}
  />
</figure>
