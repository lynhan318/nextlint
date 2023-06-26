<script lang="ts">
  import {Group, Center, Container, Box} from '@svelteuidev/core';
  import type {Editor} from '@tiptap/core';
  import {Check} from 'radix-icons-svelte';

  import {
    HighlightExtension,
    type Preset,
    type HighlightProps
  } from './tiptap-highlight';

  export let highlightProps: HighlightProps;
  export let editor: Editor;

  $: selectPreset = highlightProps?.preset || {};

  const toggleColor = (preset: Preset) => {
    const {pos, node} = highlightProps;
    if (preset.backgroundColor === selectPreset?.backgroundColor) {
      if (
        editor
          .chain()
          .setTextSelection({
            from: pos,
            to: pos + node.textContent.length
          })
          .unsetHighlight()
          .run()
      ) {
        selectPreset = {};
      }
      return;
    }
    if (!editor.state.selection.empty) {
      editor?.commands.setHighlight({preset});
    } else {
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length
        })
        .setHighlight({preset})
        .setTextSelection(pos)
        .run();
    }
    selectPreset = preset;
  };

  $: presets = HighlightExtension.options.presets.map(p => ({
    ...p,
    isSelect: p.backgroundColor === selectPreset?.backgroundColor
  }));
</script>

<Container override={{padding: 16}}>
  <Group
    direction="row"
    override={{
      backgroundColor: 'white',
      flexFlow: 'unset',
      padding: 8,
      borderRadius: 8,
      gap: 8,
      boxShadow:
        'rgb(223, 225, 230) 0px 4px 8px, rgb(223, 225, 230) 0px 0px 1px'
    }}
  >
    {#each presets as preset (preset.backgroundColor)}
      <Box
        on:mousedown={e => {
          e.preventDefault();
          toggleColor(preset);
        }}
        css={{
          cursor: 'pointer',
          backgroundColor: preset.backgroundColor,
          color: preset.textColor,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `2px solid transparent`,
          '&:hover': {
            borderColor: '#000',
            transition: 'all 0.15s ease-in-out'
          }
        }}
      >
        {#if preset.isSelect}
          <Center override={{height: '100%'}}>
            <Check size={20} color={preset.textColor} />
          </Center>
        {/if}
      </Box>
    {/each}
  </Group>
</Container>
