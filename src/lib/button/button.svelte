<script lang="ts">
import {
	TooltipContent,
	TooltipRoot,
	TooltipTrigger,
} from "prosekit/svelte/tooltip";
import type { Snippet } from "svelte";

interface Props {
	pressed?: boolean;
	disabled?: boolean;
	tooltip?: string;
	onClick?: VoidFunction;
	children?: Snippet;
}

let {
	pressed = false,
	disabled = false,
	tooltip = "",
	onClick = undefined,
	children,
}: Props = $props();
</script>

<TooltipRoot>
  <TooltipTrigger class="block">
    <button
      data-state={pressed ? 'on' : 'off'}
      {disabled}
      onclick={() => onClick?.()}
      onmousedown={(event) => event.preventDefault()}
      class="outline-unset focus-visible:outline-unset flex items-center justify-center rounded-md p-2 font-medium transition focus-visible:ring-2 text-sm focus-visible:ring-gray-900  disabled:pointer-events-none min-w-9 min-h-9 disabled:opacity-50 hover:disabled:opacity-50 bg-transparent hover:bg-gray-100  data-[state=on]:bg-gray-200 "
    >
      {@render children?.()}
      {#if tooltip}
        <span class="sr-only">{tooltip}</span>
      {/if}
    </button>
  </TooltipTrigger>
  {#if tooltip}
    <TooltipContent class="z-50 overflow-hidden rounded-md border border-gray-200  px-3 py-1.5 text-xs shadow-sm [&:not([data-state])]:hidden will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:slide-out-to-top-2 data-[side=left]:slide-in-from-right-2 data-[side=left]:slide-out-to-right-2 data-[side=right]:slide-in-from-left-2 data-[side=right]:slide-out-to-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=top]:slide-out-to-bottom-2">
      {tooltip}
    </TooltipContent>
  {/if}
</TooltipRoot>
