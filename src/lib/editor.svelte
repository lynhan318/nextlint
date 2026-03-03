<script module lang="ts">
export const defaultDoc: NodeJSON = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hello world 👋👋👋!",
        },
      ],
    },
  ],
};
</script>

<script lang="ts">
import "./style.css";

import { createEditor, type NodeJSON } from "prosekit/core";
import { ProseKit } from "prosekit/svelte";
import { DropIndicator } from "prosekit/svelte/drop-indicator";

import SlashMenu from "./slash-menu/slash-menu.svelte";
import BlockHandler from "./block-handler/block-handler.svelte";
import InlineMenu from "./inline-menu/inline-menu.svelte";

import {
  defineNextlintExtension,
  type EditorContent,
  type NextlintExtensionOptions,
} from "./editor/editor.js";

import { useDocChange } from "prosekit/svelte";
import Prompt from "./prompt/prompt.svelte";

interface Props extends NextlintExtensionOptions {
  content: EditorContent;
  onCreated?: (editor: ReturnType<typeof createEditor>) => void;
  onAsk?: (value: string) => Promise<void>;
}

let {
  readonly,
  content = $bindable(defaultDoc),
  onCreated,
  onAsk,
}: Props = $props();

const extension = defineNextlintExtension({ readonly });
const editor = createEditor({ extension, defaultContent: content });
const mount = (element: HTMLElement) => {
  editor.mount(element);
  onCreated?.(editor);
  return { destroy: () => editor.unmount() };
};
useDocChange(
  (doc) => {
    content = doc as unknown as NodeJSON;
  },
  { editor },
);
$effect(() => {
  editor.setContent(content);
});
</script>

<div class="relative">
  <ProseKit editor={editor}>
    <div use:mount class="p-4 outline-none"></div>
    <SlashMenu />
    <BlockHandler />
    <InlineMenu onAsk={async (v) => onAsk?.(v)} />
    <Prompt onAsk={async (v) => onAsk?.(v)} />
    <DropIndicator class="z-50 bg-blue-300 transition-all" />
  </ProseKit>
</div>
