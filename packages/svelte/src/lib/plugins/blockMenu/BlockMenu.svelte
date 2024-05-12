<script lang="ts">
  import {GripVertical} from 'lucide-svelte';
  import type {BlockMenuData} from '.';
  import {getContext} from 'svelte';
  import {derived, type Readable, type Writable} from 'svelte/store';
  import {useFloatingProps} from '$lib/node-view';
  import type {Content} from '@tiptap/core';

  const dataStore = getContext<Writable<BlockMenuData>>('data');
  const {editor} = useFloatingProps();

  const nodePos: Readable<number> = derived(dataStore, $store => {
    let pos = -1;
    editor.state.doc.descendants((_node, _pos) => {
      if (_node.eq($store.node)) {
        pos = _pos;
        return false;
      }
    });
    return pos;
  });
  const dragStart = (e: DragEvent) => {
    if (!e.dataTransfer) return;
    const {dom} = $dataStore;
    e.dataTransfer.clearData();
    e.dataTransfer.setDragImage(dom, 0, 0);
  };
  const setNodeSelection = () => {
    if ($nodePos > -1) {
      editor.commands.setNodeSelection($nodePos);
    }
  };

  const dragEnd = (e: DragEvent) => {
    if (!e.dataTransfer || $nodePos < 0) return;
    const posAtCoords = editor.view.posAtCoords({
      left: e.x,
      top: e.y
    });

    if (posAtCoords?.pos) {
      const {node} = $dataStore;
      const dropPos = posAtCoords.pos;
      editor
        .chain()
        .insertContentAt(dropPos, node.toJSON() as Content)
        .command(({tr}) => {
          const removePos =
            dropPos > $nodePos ? $nodePos : tr.mapping.map($nodePos);
          tr.deleteRange(removePos, removePos + node.nodeSize);
          return true;
        })
        .run();
    }
  };
</script>

<div
  on:dragstart={dragStart}
  on:dragend={dragEnd}
  on:mousedown={setNodeSelection}
  draggable="true"
  class="cursor-pointer z-10 text-accent-foreground active:bg-accent rounded-sm"
>
  <GripVertical size={18} />
</div>
