import { union, type Union } from "prosekit/core";
import { defineFigureSpec, type FigureSpecExtension } from "./figure-spec";

import {
  defineFigureCommands,
  type FigureCommandsExtension,
} from "./figure-commands";

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
