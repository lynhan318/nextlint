<svelte:options accessors={true} />

<script lang="ts">
  import {DragHandleDots2, ArrowUp, ArrowDown, Trash} from 'radix-icons-svelte';
  import {ActionIcon, Menu} from '@svelteuidev/core';
  import {useEditor} from '@sveltor/core';
  import {positionStore} from '$lib/components/Positioner';
  import {isNodeSelection} from '@tiptap/core';
  import DragButton from './DragButton.svelte';

  const editor = useEditor();
  let opened = false;

  const selectNode = () => {
    const posData = $positionStore.blockHover;
    if (posData) {
      const {resolver} = posData;
      const nodeStart = resolver.start(1);
      if (nodeStart) {
        return $editor!
          .chain()
          .focus()
          .setNodeSelection(nodeStart - 1)
          .run();
      }
    }
    return false;
  };

  const onOpen = () => {
    $positionStore.locked.push('blockHover');
    if (selectNode()) {
      opened = true;
    }
  };
  const onHide = () => {
    opened = false;
    $positionStore.locked = $positionStore.locked.filter(
      l => l !== 'blockHover'
    );
  };
  const onRemove = () => {
    if (
      isNodeSelection($editor!.state.selection) &&
      $editor!
        .chain()
        .deleteSelection()
        .focus($editor!.state.selection.from)
        .scrollIntoView()
        .run()
    ) {
      onHide();
    }
  };
</script>

<DragButton>
  <Menu
    position="left"
    {opened}
    on:mousedown={selectNode}
    on:open={onOpen}
    on:close={onHide}
  >
    <ActionIcon slot="control">
      <DragHandleDots2 />
    </ActionIcon>
    <Menu.Label>Block Actions</Menu.Label>
    <Menu.Item on:click={onRemove} color="red" icon={Trash}>
      Delete Block
    </Menu.Item>
  </Menu>
</DragButton>
