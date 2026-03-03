import { GoogleGenAI, Type } from "@google/genai";
import type { AIProvider, ProviderConfig, AiResponse } from "../types.js";
import { streamBlocks } from "../stream-blocks.js";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private client: GoogleGenAI;
  private model: string;

  constructor(config: ProviderConfig = {}) {
    const apiKey = config.apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.client = new GoogleGenAI({ apiKey });
    this.model = config.model || "gemini-2.5-flash";
  }

  async generate(prompt: string): Promise<AiResponse> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: this.buildPrompt(prompt),
    });

    if (!response.text) return [];

    try {
      return JSON.parse(response.text.replace(/```json|```/g, ""));
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return [];
    }
  }

  async *generateStream(prompt: string): AsyncGenerator<AiResponse> {
    const response = await this.client.models.generateContentStream({
      model: this.model,
      contents: this.buildPrompt(prompt),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: ["text", "codeBlock", "list", "quote", "h2", "h3", "h4", "h5", "h6"],
              },
              content: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const streamBlock = streamBlocks();
    streamBlock.next();
    let content: AiResponse = [];

    for await (const chunk of response) {
      const jsonBlocks = streamBlock.next(chunk.text).value;
      content = content.concat(jsonBlocks || []);
      if (jsonBlocks && jsonBlocks.length > 0) {
        yield jsonBlocks;
      }
    }
    streamBlock.next();
  }

  private buildPrompt(prompt: string): string {
    return `
You are a content writer assistant. Help me to "${prompt}".
- The response is a list of items, each item can be a text, code, lists, quotes, headings, etc.
- There are some criteria to follow:
    - Text MUST not contain any escape characters or markdown formatting.
    - If item type is text, can use HTML tags (a,b,strong,i,code,etc...) in the content to emphasize important points.
    - If type is heading (h2, h3, etc.), do NOT use HTML tags in the content.
`;
  }
}
