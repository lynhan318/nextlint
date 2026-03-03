import { defineCommands, insertNode, type Extension } from "prosekit/core";

import type { FigureAttrs } from "./figure-spec";

export type FigureCommandsExtension = Extension<{
  Commands: {
    insertFiguare: [FigureAttrs];
  };
}>;
export function defineFigureCommands(): FigureCommandsExtension {
  return defineCommands({
    insertFiguare: (attrs: FigureAttrs) =>
      insertNode({
        type: "figure",
        attrs,
      }),
  });
}
