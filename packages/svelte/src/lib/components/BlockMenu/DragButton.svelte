<svelte:options accessors={true} />

<script lang="ts">
  import {setDragImage} from './DragHandler';
  import {getRootNode} from '@nextlint/core';

  import {useEditor} from '$lib/context';
  import {positionStore} from '$lib/components/Positioner';

  const editor = useEditor();

  const onMouseDown = () => {
    const position = $positionStore.blockHover;
    if (position) {
      $editor?.commands.setNodeSelection(position.pos - 1);
    }
  };

  const onDrag = (e: DragEvent) => {
    if (!e.dataTransfer) return;
    const position = $positionStore.blockHover;

    if (position) {
      const {blockDOM, resolver, pos} = position;
      const view = $editor!.view;
      const slice = view.state.selection.content();
      e.dataTransfer.clearData();
      e.dataTransfer.setData('text/html', blockDOM.innerHTML);
      e.dataTransfer.setData('text/plain', resolver.node(1).textContent);
      e.dataTransfer.effectAllowed = 'move';
      view.dragging = {slice, move: true};
    }
  };

  const onDrop = () => {};
</script>

<div draggable="true" on:drag={onDrag}>
  <slot />
</div>
