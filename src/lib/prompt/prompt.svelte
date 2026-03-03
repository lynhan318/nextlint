<script module lang="ts">
function definePromptTriggerPlugin(cb: (p: { start: number }) => void) {
  return definePlugin(
    new Plugin<{ isEmpty: boolean }>({
      key: new PluginKey("prompt"),
      state: {
        apply: (_, prev, oldState, state) => {
          const node = state.selection.$head.node(1);
          const isEmpty =
            node &&
            !node.isLeaf &&
            !node.childCount &&
            node.type.name === "paragraph";

          const startIdx = oldState.selection.anchor;
          const endIdx = state.selection.anchor;

          const lastCharactor = state.doc.textBetween(startIdx, endIdx);
          if (prev.isEmpty && lastCharactor === " ") {
            cb({ start: startIdx });
          }
          return {
            isEmpty,
          };
        },
        init() {
          return {
            isEmpty: true,
          };
        },
      },
    }),
  );
}
</script>

<script lang="ts">
import { definePlugin } from "prosekit/core";
import { Plugin, PluginKey } from "prosekit/pm/state";
import { useEditor } from "prosekit/svelte";
import { onDestroy, tick } from "svelte";

import type { EditorExtension } from "../editor";
import { BrainCircuit } from "@lucide/svelte";
import Spinner from "../components/spinner.svelte";

type Props = {
  onAsk: (prompt: string) => Promise<void>;
};
const { onAsk }: Props = $props();

let value = $state("");
let textarea = $state<HTMLTextAreaElement | null>(null);
let position = $state<{ top: number; left: number }>({
  top: -9999,
  left: 20,
});
const editor = useEditor<EditorExtension>({ update: true });
let loading = $state(false);
const dispose = $editor.use(
  definePromptTriggerPlugin(async ({ start }) => {
    const {
      view,
      state: { selection },
    } = $editor;

    const selectionDOM = view.domAtPos(selection.from);
    if (selectionDOM.node) {
      position.top = (selectionDOM.node as HTMLElement).offsetTop + 30;
      await tick();
      $editor.view.dispatch(
        $editor.view.state.tr.deleteRange(start, start + 1),
      );
    }
    textarea?.focus();
  }),
);
const handleEscape = async (e: KeyboardEvent) => {
  if (e.key === "Escape" && position.top >= 0) {
    position.top = -9999;
    await tick();
    $editor.focus();
    value = "";
  }
};
const onSubmit = async (e: Event) => {
  e.preventDefault();
  if (loading) return;
  loading = true;
  onAsk(value);
  loading = false;
  position.top = -9999;
};
document.addEventListener("keydown", handleEscape);
onDestroy(() => {
  dispose();
  document.removeEventListener("keydown", handleEscape);
});
</script>

<div
  style="translate: 0 {position.top}px;"
  class="absolute top-0 left-0 z-10 box-border rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg">
  <form
    class="relative flex size-full w-150 flex-col items-center"
    onsubmit={onSubmit}>
    <textarea
      disabled={loading}
      placeholder="Type here..."
      class="field-sizing-content h-full min-h-15 w-full p-2 outline-none disabled:text-gray-400"
      bind:this={textarea}
      bind:value={value}></textarea>
    <button
      type="submit"
      disabled={loading}
      style="background-color:#000;z-index:15"
      class="mt-2 ml-auto flex shrink-0 cursor-pointer flex-row items-center gap-1 rounded px-4 py-2 text-sm text-white">
      {#if loading}
        <Spinner class="size-4" />
      {:else}
        <BrainCircuit size={16} />
      {/if}
      {#if !loading}
        <span>Ask AI</span>
      {:else}
        <span>Thinking...</span>
      {/if}
    </button>
  </form>
  {#if loading}
    <div
      class="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center"
      contenteditable="false">
      <span>Thinking...</span>
    </div>
  {/if}
</div>
