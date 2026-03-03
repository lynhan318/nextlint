<style lang="scss">
:global(inline-suggestion.add) {
  background-color: var(--color-green-100);
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  &:hover {
    border-color: var(--color-green-300);
  }
}
:global(inline-suggestion.remove) {
  background-color: var(--color-red-100);
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  &:hover {
    border-color: var(--color-red-300);
  }
}
</style>

<script lang="ts">
import type { SvelteNodeViewProps } from 'prosekit/svelte';
import type { AiSuggestionAttrs } from './ai-spec.ts';

const { node, contentRef, view, ...rest }: SvelteNodeViewProps = $props();

const attrs = $node.attrs as AiSuggestionAttrs;

const onRemove = () => {
  const nodeStart = rest.getPos();
  if (!nodeStart) return;
  const state = view.state;
  const nodeEnd = $node.nodeSize + nodeStart;
  if (!nodeEnd || !nodeStart) return;
  const tr = state.tr;
  tr.deleteRange(nodeStart, nodeEnd);
  view.dispatch(tr);
};

const onAccept = () => {
  const nodeStart = rest.getPos();
  if (!nodeStart) return;
  const state = view.state;
  const nodeEnd = $node.nodeSize + nodeStart;
  if (!nodeEnd || !nodeStart) return;
  const tr = state.tr;
  tr.replaceRangeWith(
    nodeStart,
    nodeEnd,
    view.state.schema.nodeFromJSON({
      type: 'text',
      text: $node.textContent,
    })
  );
  view.dispatch(tr);
};
</script>

<div contentEditable={false} class="group relative inline">
  <inline-suggestion
    class="inline rounded-sm"
    class:remove={attrs.type === "remove"}
    class:add={attrs.type === "add"}
    use:contentRef></inline-suggestion>
  <div
    class="absolute right-10 -bottom-11 z-10 flex w-fit flex-row items-center rounded-md border border-solid border-slate-200 bg-white p-1 shadow-md transition-opacity duration-200"
    contenteditable="false">
    <div class="ml-auto flex flex-row items-center gap-2 px-1">
      <button
        onclick={onRemove}
        class="cursor-pointer rounded-sm px-2 py-1 text-sm text-black hover:bg-gray-200"
        >Dismiss</button>
      <button
        class="cursor-pointer rounded-sm bg-black px-2 py-1 text-sm text-white"
        onclick={onAccept}>Accept</button>
    </div>
  </div>
</div>
