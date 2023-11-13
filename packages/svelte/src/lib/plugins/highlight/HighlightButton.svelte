<script lang="ts">
  import {getMarkAttributes} from '@tiptap/core';
  import {onDestroy} from 'svelte';
  import {Popover} from '$lib/components';

  import {useEditor} from '$lib/context';
  import {positionStore} from '$lib/components/Positioner';

  import HighlightPresets from './HighlightPresets.svelte';
  import type {HighlightProps} from './tiptap-highlight';
  import {writable} from 'svelte/store';

  const editor = useEditor();

  let element: HTMLDivElement;

  const dispose = positionStore.subscribe(store => {
    if (!store.selection) {
    }
  });

  $: highlightProps = {
    preset: getMarkAttributes($editor!.state, 'highlight')?.preset,
    node: $editor!.state.doc.nodeAt($editor!.state.selection.anchor) as any,
    pos: $editor!.state.selection.from
  } satisfies HighlightProps;

  let open = writable(false);
  const toggle = () => {
    element?.focus();
  };

  onDestroy(() => {
    dispose();
  });
</script>

<Popover {open}>
  <div slot="trigger">
    <slot {toggle} />
  </div>
  <HighlightPresets {highlightProps} editor={$editor} />
</Popover>
