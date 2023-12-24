<script lang="ts">
  import {getMarkAttributes} from '@tiptap/core';
  import {onDestroy, setContext} from 'svelte';
  import {Popover} from '$lib/components';

  import {useEditor} from '$lib/context';
  import {FLOATING_CONTEXT_KEY, type SvelteFloatingProps} from '$lib/node-view';
  import {positionStore} from '$lib/components/Positioner';

  import HighlightPresets from './HighlightPresets.svelte';
  import {writable} from 'svelte/store';
  import type {Mark, Node} from '@tiptap/pm/model';

  const editor = useEditor();

  let element: HTMLDivElement;

  const dispose = positionStore.subscribe(store => {
    if (!store.selection) {
    }
  });

  let open = writable(false);
  const toggle = () => {
    element?.focus();
  };

  setContext(FLOATING_CONTEXT_KEY, {
    element: '',
    node: $editor!.state.doc.nodeAt($editor!.state.selection.anchor) as any,
    pos: $editor!.state.selection.from,
    mark: getMarkAttributes($editor!.state, 'highlight')?.preset,
    onHide: () => ($open = false),
    editor: $editor
  } satisfies SvelteFloatingProps<Node, Mark>);

  onDestroy(() => {
    dispose();
  });
</script>

<Popover {open}>
  <div slot="trigger">
    <slot {toggle} />
  </div>
  <HighlightPresets />
</Popover>
