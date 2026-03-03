import {
  defineCommands,
  defineNodeSpec,
  insertNode,
  union,
  type Extension,
  type Union,
} from "prosekit/core";

export type FigureAttrs = {
  src?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export type FigureSpecExtension = Extension<{
  Nodes: {
    figure: FigureAttrs;
  };
}>;

export function defineFigureSpec(): FigureSpecExtension {
  return defineNodeSpec({
    name: "figure",
    group: "block",
    attrs: {
      width: { default: null, validate: "null|number" },
      height: { default: null, validate: "null|number" },
      src: { default: null, validate: "string|null" },
      alt: { default: "", validate: "string" },
    },
    content: "inline*",
    draggable: true,
    toDOM({ attrs }) {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = attrs.src || "";
      img.alt = attrs.alt || "";

      const caption = document.createElement("figcaption");
      // Don't set innerText here - ProseMirror will render content via contentDOM
      // Setting innerText would cause duplicate content

      figure.append(img, caption);

      return {
        dom: figure,
        contentDOM: caption,
      };
    },
    parseDOM: [
      {
        tag: "figure",
        contentElement: "figcaption",
        getAttrs: (dom: HTMLElement) => {
          const img = dom.querySelector("img");
          return {
            src: img?.getAttribute("src") || "",
            width: img?.getAttribute("width") || null,
            height: img?.getAttribute("height") || null,
            alt: dom.innerText || img?.getAttribute("alt") || "",
          };
        },
      },
    ],
  });
}

export type FigureCommandsExtension = Extension<{
  Commands: {
    insertFigure: [FigureAttrs];
  };
}>;
export function defineFigureCommands(): FigureCommandsExtension {
  return defineCommands({
    insertFigure: (attrs: FigureAttrs) =>
      insertNode({
        type: "figure",
        attrs,
      }),
  });
}

/**
 * @internal
 */
export type FigureExtension = Union<
  [FigureSpecExtension, FigureCommandsExtension]
>;

/**
 * @public
 */
export function defineFigure(): FigureExtension {
  return union(defineFigureSpec(), defineFigureCommands());
}
