export { useExtension, useEditor } from "prosekit/svelte";
export type { NodeJSON } from "prosekit/core";
export type { EditorState, Selection } from "prosekit/pm/state";
export { default as Editor } from "./editor.svelte";
export { defaultDoc } from "./default-doc.js";

export type {
  EditorExtension,
  EditorContent,
  NextlintEditor,
} from "./editor/editor.js";

export * from "./ai/index.js";
