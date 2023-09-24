<script lang="ts">
  import DropdownMenu from './DropdownMenu.svelte';
  import FontStyleMenu from './FontStyleMenu.svelte';
  import CustomMenu from './CustomMenu.svelte';
  import {positionStore} from '../Positioner';

  const IGNORE_BLOCK_MENU = ['figure', 'codeBlock'];

  $: visibleNode = (() => {
    const resolver = $positionStore.selection?.resolver;
    if (!resolver) return;
    let node = resolver.node(resolver.depth);
    let i = resolver.depth - 1;
    while (i > 0) {
      const parent = resolver.node(i);
      if (parent.type.name === 'listItem') {
        i--;
        continue;
      }
      node = parent;
      break;
    }

    if (IGNORE_BLOCK_MENU.includes(node.type.name)) {
      return;
    }
    return node;
  })();
</script>

{#if !!visibleNode}
  <div class="rounded py-[6px] bg-popover border shadow-md pr-4">
    <div class="flex flex-row w-full justify-center">
      <DropdownMenu {visibleNode} />
      <FontStyleMenu />
      <CustomMenu />
    </div>
  </div>
{/if}
