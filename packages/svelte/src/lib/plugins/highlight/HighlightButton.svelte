<script lang="ts">
  import {useEditor} from '@nextlint/core';
  import {Popper, Group, Box} from '@svelteuidev/core';
  import {Pencil1} from 'radix-icons-svelte';

  import {CommandButton} from '$lib/components';

  import HighlightPresets from './HighlightPresets.svelte';
  import type {HighlightProps} from './tiptap-highlight';
  import {getMarkAttributes} from '@tiptap/core';
  import {positionStore} from '$lib/components/Positioner';
  import {onDestroy} from 'svelte';

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

  onDestroy(() => {
    dispose();
  });
</script>

<CommandButton
  bind:element
  toggle={() => {
    element?.focus();
    mounted = !mounted;
  }}
  label="Highlight text"
  active={$editor?.isActive('highlight')}
>
  <Pencil1 size={20} />
</CommandButton>

<Popper {mounted} reference={element} override={{padding: 8}} withArrow>
  <HighlightPresets {highlightProps} editor={$editor} />
</Popper>
