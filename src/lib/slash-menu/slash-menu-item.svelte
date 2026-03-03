<script lang="ts">
import { AutocompleteItem } from "prosekit/svelte/autocomplete";

export let onSelect: () => void;
export let label: string;
export let kbd: string | undefined = undefined;
</script>

<AutocompleteItem {onSelect} class="relative flex items-center justify-between min-w-[8rem] scroll-my-1 rounded px-3 py-1.5 box-border cursor-default select-none whitespace-nowrap outline-none data-focused:bg-gray-100 ">
  <span>{label}</span>
  {#if kbd}
    <kbd class="text-xs font-mono text-gray-400 ">{kbd}</kbd>
  {/if}
</AutocompleteItem>
