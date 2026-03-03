import { Fragment, Node as PMNode, Slice } from "prosekit/pm/model";

import type { AiBlock } from "../../ai.js";
import type { NextlintEditor } from "../editor";

export const contentWithMarks = (text: string) => {
  let lastSlice = 0;
  const nodes = [];
  const regex = /<(\w+)>(.*?)<\/\1>/gm;

  const allMatches = Array.from(text.matchAll(regex));
  if (!allMatches || !allMatches[0]) {
    return {
      type: "paragraph",
      content: [{ type: "text", text }],
    };
  }

  for (const match of allMatches) {
    const [matched, tag, content] = match;
    const textContent = text.slice(lastSlice, Number(match.index));
    if (textContent) {
      nodes.push({
        type: "text",
        text: textContent,
      });
    }
    const markType = (() => {
      const t = tag.toLocaleLowerCase();
      if (t === "b" || t === "strong") {
        return "bold";
      }
      if (t === "i" || t === "em") {
        return "italic";
      }
      if (t === "code") {
        return "code";
      }
    })();

    nodes.push({
      type: "text",
      text: content,
      marks: [{ type: markType }],
    });
    lastSlice = Number(match.index) + matched.length;
  }
  if (lastSlice < text.length) {
    nodes.push({
      type: "text",
      text: text.slice(lastSlice, text.length),
    });
  }
  return {
    type: "paragraph",
    content: nodes,
  };
};

export const aiBlocksPMNode = (
  aiBlocks: AiBlock[],
  schema: NextlintEditor["schema"],
) => {
  const nodeFromJSON = schema.nodeFromJSON;
  let nodes: PMNode[] = [];
  for (const aiNode of aiBlocks) {
    try {
      if (["h2", "h3", "h4", "h5", "h6"].includes(aiNode.type)) {
        const text = aiNode.content.join(" ");
        const node = nodeFromJSON({
          type: "heading",
          attrs: {
            level: parseInt(aiNode.type.slice(1), 10),
            textAlign: "left",
          },
          content: [{ type: "text", text }],
        });
        nodes.push(node);
        continue;
      }
      if (aiNode.type === "text") {
        const node = nodeFromJSON(contentWithMarks(aiNode.content.join(" ")));
        nodes.push(node);
        continue;
      }
      if (aiNode.type === "codeBlock") {
        const node = nodeFromJSON({
          type: "codeBlock",
          attrs: { language: "plaintext" },
          content: [{ text: aiNode.content.join("\n"), type: "text" }],
        });
        nodes.push(node);
        continue;
      }
      if (aiNode.type === "quote") {
        const node = nodeFromJSON({
          type: "blockquote",
          content: aiNode.content.map((text) => contentWithMarks(text)),
        });
        nodes.push(node);
        continue;
      }
      if (aiNode.type === "list") {
        for (const item of aiNode.content) {
          const node = nodeFromJSON({
            attrs: {
              kind: "ordered",
            },
            type: "list",
            content: [contentWithMarks(item)],
          });
          nodes.push(node);
        }
        continue;
      }
    } catch (error) {
      console.error("Error processing AI node:", aiNode);
    }
  }
  return nodes;
};
