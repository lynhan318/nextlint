import type { NodeJSON } from "prosekit/core";

export const defaultDoc: NodeJSON = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hello world!",
        },
      ],
    },
  ],
};
