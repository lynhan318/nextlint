<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import {
    HighlightExtension,
    type Preset,
    type HighlightProps
  } from './tiptap-highlight';
  import {Check} from 'lucide-svelte';

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
        selectPreset = {} as any;
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

<div class="p-4">
  <div class="flex flex-row bg-background p-2 rounded-md gap-2 shadow-sm">
    {#each presets as preset (preset.backgroundColor)}
      <div
        on:mousedown={e => {
          e.preventDefault();
          toggleColor(preset);
        }}
        class="pointer square-6 rounded-full"
        style="background-color:{preset.backgroundColor}"
      >
        {#if preset.isSelect}
          <div class="flex justify-center items-center h-full">
            <Check size={20} color={preset.textColor} />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
