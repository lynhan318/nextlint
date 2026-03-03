import type { AiBlock } from "./types.js";

export function* streamBlocks(): Generator<AiBlock[] | undefined, undefined, string | undefined> {
  const stack: string[] = [];
  let acc = "";
  let text = "";
  let startIdx = -1;

  function consumeChars(): AiBlock[] | undefined {
    if (!text) return;
    if (text && startIdx === -1) {
      startIdx = text.indexOf("[") + 1;
    }
    if (startIdx >= text.length) {
      return undefined;
    }
    const result: AiBlock[] = [];
    while (startIdx < text.length) {
      const char = text[startIdx];
      const topChar = stack.at(-1);
      if (char === "[") {
        stack.push(char);
      } else if (char === "{") {
        stack.push(char);
      } else if (char === "]") {
        if (topChar === "[") {
          stack.pop();
        }
      } else if (char === "}") {
        if (topChar === "{") {
          stack.pop();
          if (stack.length === 0) {
            startIdx += 1;
            acc += char;
            result.push(JSON.parse(acc));
            acc = "";
            continue;
          }
        }
      }
      if (stack.length === 0 && char === ",") {
        startIdx += 1;
        continue;
      }
      acc += char;
      startIdx += 1;
    }
    return result;
  }

  while (true) {
    const nextChunk = yield consumeChars();
    if (nextChunk === undefined) {
      return undefined;
    }
    text += nextChunk;
  }
}
