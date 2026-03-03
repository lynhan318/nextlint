import {
  defineBaseCommands,
  defineBaseKeymap,
  defineHistory,
  type Editor,
  union,
  type EditorOptions,
} from "prosekit/core";

import { defineBlockquote } from "prosekit/extensions/blockquote";
import { defineBold } from "prosekit/extensions/bold";
import { defineCode } from "prosekit/extensions/code";
import { defineCodeBlock } from "prosekit/extensions/code-block";
import { defineDoc } from "prosekit/extensions/doc";
import { defineGapCursor } from "prosekit/extensions/gap-cursor";
import { defineHeading } from "prosekit/extensions/heading";
import { defineHorizontalRule } from "prosekit/extensions/horizontal-rule";
import { defineImage } from "prosekit/extensions/image";
import { defineItalic } from "prosekit/extensions/italic";
import { defineLink } from "prosekit/extensions/link";
import { defineList } from "prosekit/extensions/list";
import { defineModClickPrevention } from "prosekit/extensions/mod-click-prevention";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { defineStrike } from "prosekit/extensions/strike";
import { defineTable } from "prosekit/extensions/table";
import { defineText } from "prosekit/extensions/text";
import { defineUnderline } from "prosekit/extensions/underline";
import { defineCodeBlockShiki } from "prosekit/extensions/code-block";
import { defineVirtualSelection } from "prosekit/extensions/virtual-selection";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineTextAlign } from "prosekit/extensions/text-align";

import { defineFigure } from "./figure/index.js";
import {
  defineAiInlineSuggestion,
  defineAiBlockSuggestion,
} from "./ai/index.js";

export type NextlintExtensionOptions = {
  readonly?: boolean;
  placeholder?: string;
};

export function defineNextlintExtension(opts: NextlintExtensionOptions) {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHeading(),
    defineList(),
    defineBlockquote(),
    defineImage(),
    defineHorizontalRule(),
    defineTable(),
    defineCodeBlock(),
    // Marks
    defineItalic(),
    defineBold(),
    defineUnderline(),
    defineStrike(),
    defineCode(),
    defineLink(),
    // Others
    defineBaseKeymap(),
    defineBaseCommands(),
    defineCodeBlockShiki({
      langs: [
        "javascript",
        "typescript",
        "python",
        "java",
        "csharp",
        "go",
        "rust",
      ],
    }),
    defineTextAlign({
      types: ["paragraph", "heading"],
      // An optional default alignment value. Defaults to `left`.
      default: "left",
    }),
    defineHistory(),
    defineGapCursor(),
    defineVirtualSelection(),
    defineModClickPrevention(),

    definePlaceholder({
      placeholder:
        opts.placeholder ||
        "Press 'Space' for AI, '/' for commands, 'Tab' for suggestions",
    }),

    //custom extension
    defineFigure(),
    defineAiInlineSuggestion(),
    defineAiBlockSuggestion(),
  );
}

export type EditorExtension = ReturnType<typeof defineNextlintExtension>;
export type EditorContent = EditorOptions<EditorExtension>["defaultContent"];
export type NextlintEditor = Editor<EditorExtension>;
