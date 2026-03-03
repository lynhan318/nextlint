<script lang="ts">
import type { EditorState } from "prosekit/pm/state";
import { useEditor } from "prosekit/svelte";
import { InlinePopover } from "prosekit/svelte/inline-popover";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  BrainCircuit,
  Code,
  Italic,
  Link,
  Strikethrough,
  Underline,
} from "@lucide/svelte";
import type { Editor, NodeAction } from "prosekit/core";

import Button from "../button/button.svelte";
import type { EditorExtension } from "../editor";
import { onDestroy, tick } from "svelte";

type Props = {
  onAsk: (prompt: string) => Promise<void>;
};

const { onAsk }: Props = $props();

const editor = useEditor<EditorExtension>({ update: true });
let askOpen = $state(false);
let ask = $state("");
let textarea = $state<HTMLTextAreaElement | null>(null);

let linkMenuOpen = $state(false);

const setLinkMenuOpen = (value: boolean) => {
  linkMenuOpen = value;
};
const toggleLinkMenuOpen = () => {
  linkMenuOpen = !linkMenuOpen;
};

const getCurrentLink = (state: EditorState): string | undefined => {
  const from = state.selection.$from;
  const marks = from.marksAcross(from);
  if (!marks) {
    return;
  }
  for (const mark of marks) {
    if (mark.type.name === "link") {
      return mark.attrs.href;
    }
  }
};

const handleLinkUpdate = (href?: string) => {
  if (href) {
    $editor.commands.addLink({ href });
  } else {
    $editor.commands.removeLink();
  }

  linkMenuOpen = false;
  $editor.focus();
};

const handleSubmit = (event: Event) => {
  event.preventDefault();
  const target = event.target as HTMLFormElement | null;
  const href = target?.querySelector("input")?.value?.trim();
  handleLinkUpdate(href);
};
const isTextAlignActive = (editor: Editor<EditorExtension>, value: string) => {
  return Object.values(editor.nodes).some((node: NodeAction<any>) => {
    return node.isActive({ textAlign: value });
  });
};
const handleEscape = async (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    askOpen = false;
    $editor.focus();
    ask = "";
  }
};
document.addEventListener("keydown", handleEscape);
onDestroy(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<InlinePopover
  data-testid="inline-menu-main"
  class="relative z-10 box-border flex min-w-[8rem] space-x-1 overflow-auto rounded-md border border-gray-200 bg-white p-1 whitespace-nowrap shadow-lg [&:not([data-state])]:hidden">
  <Button
    pressed={$editor.marks.bold.isActive()}
    disabled={!$editor.commands.toggleBold.canExec()}
    tooltip="Bold"
    onClick={() => $editor.commands.toggleBold()}>
    <Bold class="size-5" />
  </Button>

  <Button
    pressed={$editor.marks.italic.isActive()}
    disabled={!$editor.commands.toggleItalic.canExec()}
    onClick={() => $editor.commands.toggleItalic()}
    tooltip="Italic">
    <Italic class="size-5" />
  </Button>

  <Button
    pressed={$editor.marks.underline.isActive()}
    disabled={!$editor.commands.toggleUnderline.canExec()}
    onClick={() => $editor.commands.toggleUnderline()}
    tooltip="Underline">
    <Underline class="size-5" />
  </Button>

  <Button
    pressed={$editor.marks.strike.isActive()}
    disabled={!$editor.commands.toggleStrike.canExec()}
    onClick={() => $editor.commands.toggleStrike()}
    tooltip="Strike">
    <Strikethrough class="size-5" />
  </Button>

  <Button
    pressed={$editor.marks.code.isActive()}
    disabled={!$editor.commands.toggleCode.canExec()}
    onClick={() => $editor.commands.toggleCode()}
    tooltip="Code">
    <Code class="size-5" />
  </Button>

  <Button
    pressed={isTextAlignActive($editor, "left")}
    disabled={!$editor.commands.setTextAlign.canExec("left")}
    onClick={() => $editor.commands.setTextAlign("left")}
    tooltip="Text Align Left">
    <AlignLeftIcon class="size-5" />
  </Button>

  <Button
    pressed={isTextAlignActive($editor, "center")}
    disabled={!$editor.commands.setTextAlign.canExec("center")}
    onClick={() => $editor.commands.setTextAlign("center")}
    tooltip="Text Align Center">
    <AlignCenterIcon class="size-5" />
  </Button>

  <Button
    pressed={isTextAlignActive($editor, "right")}
    disabled={!$editor.commands.setTextAlign.canExec("right")}
    onClick={() => $editor.commands.setTextAlign("right")}
    tooltip="Text Align Right">
    <AlignRightIcon class="size-5" />
  </Button>
  <!-- <Button -->
  <!--   disabled={false} -->
  <!--   onClick={() => { -->
  <!--     askOpen = !askOpen; -->
  <!--     tick().then(() => { -->
  <!--       if (askOpen) { -->
  <!--         textarea?.focus(); -->
  <!--       } -->
  <!--     }); -->
  <!--   }} -->
  <!--   tooltip="Open Prompt"> -->
  <!--   <BrainCircuit class="size-5" /> -->
  <!-- </Button> -->
  {#if $editor.commands.addLink.canExec({ href: "" })}
    <Button
      pressed={$editor.marks.link.isActive()}
      onClick={() => {
        $editor.commands.expandLink();
        toggleLinkMenuOpen();
      }}
      tooltip="Link">
      <Link class="size-5" />
    </Button>
  {/if}
</InlinePopover>

<InlinePopover
  placement="bottom"
  defaultOpen={false}
  open={linkMenuOpen}
  onOpenChange={setLinkMenuOpen}
  data-testid="inline-menu-link"
  class="relative z-10 box-border flex w-xs flex-col items-stretch gap-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg [&:not([data-state])]:hidden">
  {#if linkMenuOpen}
    <form onsubmit={handleSubmit}>
      <input
        placeholder="Paste the link..."
        value={getCurrentLink($editor.state) || ""}
        class="box-border flex h-9 w-full rounded-md border border-solid border-gray-200 bg-white px-3 py-2 text-sm ring-0 ring-transparent transition outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
    </form>
  {/if}

  {#if $editor.marks.link.isActive()}
    <button
      type="button"
      onclick={() => handleLinkUpdate()}
      onmousedown={(e) => e.preventDefault()}
      class="inline-flex h-9 items-center justify-center rounded-md border-0 bg-gray-200 px-3 text-sm font-medium whitespace-nowrap text-gray-50 ring-offset-white transition-colors hover:bg-gray-200/90 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
      Remove link
    </button>
  {/if}
</InlinePopover>

<InlinePopover
  placement="bottom"
  defaultOpen={false}
  open={askOpen}
  onOpenChange={(v) => (askOpen = v)}
  data-testid="inline-ask"
  class="relative z-10 box-border flex flex-col items-stretch gap-y-2 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-lg [&:not([data-state])]:hidden">
  <div style="width:400px;height:200px">
    <textarea
      placeholder="Type here..."
      class="h-full w-full pb-4 text-sm outline-none"
      bind:this={textarea}
      bind:value={ask}>
    </textarea>
    <button
      type="submit"
      style="bottom:1rem;right:1rem;background-color:#000;z-index:15"
      class="absolute flex cursor-pointer flex-row items-center gap-1 rounded px-4 py-1 text-sm text-white"
      onclick={() => onAsk?.(ask)}>
      <BrainCircuit size={16} />
      Ask AI</button>
  </div>
</InlinePopover>
