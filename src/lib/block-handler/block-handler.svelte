<script lang="ts">
import { GripVertical, Plus } from "@lucide/svelte";
import {
	BlockHandleAdd,
	BlockHandleDraggable,
	BlockHandlePopover,
} from "prosekit/svelte/block-handle";
</script>

<BlockHandlePopover
  class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 box-border flex flex-row items-center justify-center border-0 transition will-change-transform [&:not([data-state])]:hidden">
  <BlockHandleAdd
    class="box-border flex h-[1.5em] w-[1.5em] cursor-pointer items-center justify-center rounded text-gray-500/50 hover:bg-gray-100 dark:text-gray-500/50 dark:hover:bg-gray-800">
    <Plus class="h-5 w-5" />
  </BlockHandleAdd>
  <BlockHandleDraggable
    class="box-border flex h-[1.5em] w-[1.2em] cursor-grab items-center justify-center rounded text-gray-500/50 hover:bg-gray-100 dark:text-gray-500/50 dark:hover:bg-gray-800">
    <GripVertical class="h-5 w-5" />
  </BlockHandleDraggable>
</BlockHandlePopover>
