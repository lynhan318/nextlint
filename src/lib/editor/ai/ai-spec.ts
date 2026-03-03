import { defineNodeSpec, union, type Extension } from "@prosekit/core";
import { defineSvelteNodeView } from "prosekit/svelte";
import BlockSuggestionNode from "./block-suggestion.svelte";
import InlineSuggestionNode from "./inline-suggestion.svelte";

export type AiSuggestionStatus = "idle" | "streaming" | "approval" | "error";

export type AiSuggestionAttrs = {
  type: "remove" | "add";
  prompt: string;
  status?: AiSuggestionStatus;
};

export type AiInlineSuggestion = Extension<{
  Nodes: {
    aiInlineSuggestion: AiSuggestionAttrs;
  };
}>;

export function defineAiInlineSuggestion() {
  return union(
    defineSvelteNodeView({
      name: "aiInlineSuggestion",
      component: InlineSuggestionNode,
    }),
    defineNodeSpec({
      name: "aiInlineSuggestion",
      group: "inline",
      content: "text*",
      inline: true,
      attrs: {
        type: { default: "add", validate: "string" },
        prompt: { default: "", validate: "string" },
        status: { default: "idle", validate: "string" },
      },
      toDOM({ attrs }) {
        const isAdd = attrs.type === "add";
        return [
          "inline-suggestion",
          {
            style: `background-color: ${isAdd ? "#d4f5d4" : "#f5d4d4"};`,
            "data-prompt": attrs.prompt,
            "data-type": attrs.type,
            "data-status": attrs.status || "idle",
          },
          0,
        ];
      },
      parseDOM: [
        {
          tag: "inline-suggestion",
          getAttrs: (dom: HTMLElement) => {
            return {
              type: dom.getAttribute("data-type"),
              prompt: dom.getAttribute("data-prompt") || "",
              status: dom.getAttribute("data-status") || "approval",
            } as AiSuggestionAttrs;
          },
        },
      ],
    }),
  );
}

export type AiBlockSuggestion = Extension<{
  Nodes: {
    aiBlockSuggestion: AiSuggestionAttrs;
  };
}>;

export function defineAiBlockNodeView() {
  return defineSvelteNodeView({
    name: "aiBlockSuggestion",
    component: BlockSuggestionNode,
  });
}

export function defineAiBlockSuggestion() {
  return union(
    defineNodeSpec({
      name: "aiBlockSuggestion",
      group: "block",
      content: "block+",
      attrs: {
        type: { default: "add", validate: "string" },
        prompt: { default: "", validate: "string" },
        status: { default: "idle", validate: "string" },
      },
      toDOM({ attrs }) {
        const isAdd = attrs.type === "add";
        return [
          "block-suggestion",
          {
            style: `background-color: ${isAdd ? "#d6f5d4" : "#f5d4d4"}`,
            "data-prompt": attrs.prompt,
            "data-type": attrs.type,
            "data-status": attrs.status || "idle",
          },
          0,
        ];
      },
      parseDOM: [
        {
          tag: "block-suggestion",
          getAttrs: (dom: HTMLElement) => {
            return {
              type: dom.getAttribute("data-type") || "add",
              prompt: dom.getAttribute("data-prompt") || "",
              status: dom.getAttribute("data-status") || "approval",
            } as AiSuggestionAttrs;
          },
        },
      ],
    }) as AiBlockSuggestion,
    defineAiBlockNodeView(),
  );
}
