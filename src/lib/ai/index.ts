export type { AIProvider, ProviderConfig, AiBlock, AiResponse, AIProviderClass } from "./types.js";
export { GeminiProvider } from "./providers/gemini.js";

import { GeminiProvider } from "./providers/gemini.js";
import type { AIProvider, ProviderConfig } from "./types.js";

export function createAIProvider(type: "gemini" | "openai" = "gemini", config?: ProviderConfig): AIProvider {
  switch (type) {
    case "gemini":
      return new GeminiProvider(config);
    default:
      return new GeminiProvider(config);
  }
}
