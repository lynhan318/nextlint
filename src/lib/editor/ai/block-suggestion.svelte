<style lang="scss">
:global(block-suggestion.add) {
  background-color: var(--color-slate-100);
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  &:hover {
    border-color: var(--color-green-300);
  }
}
:global(block-suggestion.remove) {
  background-color: var(--color-slate-100);
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  &:hover {
    border-color: var(--color-red-300);
  }
}
</style>

<script lang="ts">
import { Brain } from "@lucide/svelte";
import type { SvelteNodeViewProps } from "prosekit/svelte";
import type { AiSuggestionAttrs } from "./ai-spec.ts";
import Spinner from "../../components/spinner.svelte";
import { Slice } from "prosekit/pm/model";

const { node, contentRef, view, ...rest }: SvelteNodeViewProps = $props();

const attrs = $derived($node.attrs) as AiSuggestionAttrs;

const onAccept = () => {
  const nodeStart = rest.getPos();
  const state = view.state;
  const tr = state.tr;
  const sliceContent = new Slice($node.content, 0, 0);
  tr.replaceRange(nodeStart, nodeStart + $node.nodeSize, sliceContent);
  view.dispatch(tr);
};
const onRemove = () => {
  const nodeStart = rest.getPos();
  const state = view.state;
  const nodeEnd = $node.nodeSize + nodeStart;
  const tr = state.tr;
  tr.deleteRange(nodeStart, nodeEnd);
  view.dispatch(tr);
};
</script>

<div class="group relative">
  <block-suggestion
    class="relative rounded-sm"
    class:remove={attrs.type === "remove"}
    class:add={attrs.type === "add"}
    use:contentRef></block-suggestion>
  <div
    class="absolute -bottom-2 z-10 flex w-full flex-row items-center rounded-md border border-slate-200 bg-white p-1 shadow-md"
    contenteditable="false">
    {#if attrs.status !== "approval"}
      <Spinner class="mx-1" />
    {:else}
      <Brain size={20} class="mx-1 mt-2.5 self-start" />
    {/if}
    <p class="min-h-5 !pl-2 text-sm">{attrs.prompt}</p>
    <div
      class="absolute right-1 bottom-2 ml-auto flex flex-row items-center gap-2 px-1">
      <button
        class="cursor-pointer rounded-sm bg-gray-200 px-2 py-1 text-sm text-black"
        onclick={onRemove}>Dismiss</button>
      <button
        class="cursor-pointer rounded-sm bg-black px-2 py-1 text-sm text-white"
        onclick={onAccept}>Accept</button>
    </div>
  </div>
</div>
