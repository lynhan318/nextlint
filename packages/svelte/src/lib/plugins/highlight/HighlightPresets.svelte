<script lang="ts">
  import type {Editor} from '@tiptap/core';

  import {
    HighlightExtension,
    type Preset,
    type HighlightProps
  } from './tiptap-highlight';
  import {Check} from 'lucide-svelte';
  import {createEventDispatcher} from 'svelte';

  const dispatcher = createEventDispatcher<{toggle: void}>();

  export let highlightProps: HighlightProps;
  export let editor: Editor;

  $: selectPreset = highlightProps?.preset || {};

  const toggleColor = (preset: Preset) => {
    const {pos, node} = highlightProps;
    dispatcher('toggle');
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
      <a
        on:mousedown|stopPropagation={e => {
          toggleColor(preset);
        }}
        class="cursor-pointer square-6 rounded-full"
        style="background-color:{preset.backgroundColor}"
      >
        {#if preset.isSelect}
          <div class="flex justify-center items-center h-full">
            <Check size={20} color={preset.textColor} />
          </div>
        {/if}
      </a>
    {/each}
  </div>
</div>
