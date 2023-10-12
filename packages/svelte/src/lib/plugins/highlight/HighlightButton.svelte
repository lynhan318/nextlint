<script lang="ts">
  import {getMarkAttributes} from '@tiptap/core';
  import {onDestroy} from 'svelte';
  import {Popover} from '$lib/components';

  import {useEditor} from '$lib/context';
  import {positionStore} from '$lib/components/Positioner';

  import HighlightPresets from './HighlightPresets.svelte';
  import type {HighlightProps} from './tiptap-highlight';

  const editor = useEditor();

  let element: HTMLDivElement;
  let mounted = false;

  const dispose = positionStore.subscribe(store => {
    if (!store.selection) {
      mounted = false;
    }
  });

  $: highlightProps = {
    preset: getMarkAttributes($editor!.state, 'highlight')?.preset,
    node: $editor!.state.doc.nodeAt($editor!.state.selection.anchor) as any,
    pos: $editor!.state.selection.from
  } satisfies HighlightProps;

  const toggle = () => {
    element?.focus();
    mounted = !mounted;
  };

  onDestroy(() => {
    dispose();
  });
</script>

<Popover>
  <div slot="trigger">
    <slot {toggle} />
  </div>
  <HighlightPresets {highlightProps} editor={$editor} />
</Popover>
