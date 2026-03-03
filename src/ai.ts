import { GoogleGenAI, Type } from "@google/genai";
import { streamBlocks } from "./stream-result";

const ai = new GoogleGenAI({
  apiKey: "",
});

export async function generateArticleOutlineStream(prompt: string) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `
You are a content writer assistant. Help me create a structured article outline based on the given topic "how to install archlinux with archinstall".
Generate a structured article outline with sections and subsections that
- Clear, concise, and well-organized. 
- Include the main topic, subtopics, and key points to cover in each section.
- Prioritize clarity and logical flow and the newest information.
- Can use HTML tags (a,b,strong,i,etc...) in the content to emphasize important points.

The response MUST be in a json Array<Node> with Node following this structure:
${"```"}
type Node = {
  "type": text | codeBlock | list | quote | h2 | h3 | h4 | h5 | h6 ,
  "content": Array<string>
}
${"```"}
`,
  });

  for await (const chunk of response) {
  }
}

export type AiBlock = {
  type:
    | "text"
    | "codeBlock"
    | "list"
    | "quote"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";
  content: Array<string>;
};

export type AiResponse = Array<AiBlock>;

export async function generateArticleOutline(
  prompt: string,
): Promise<AiResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a content writer assistant. Help me create a structured article outline based on the given topic "${prompt}".
Generate a structured article outline with sections and subsections that
- Clear, concise, and well-organized. 
- Include the main topic, subtopics, and key points to cover in each section.
- Prioritize clarity and logical flow and the newest information.
- Text MUST not contain any escape characters or markdown formatting.
- If Node type is text, can use HTML tags (a,b,strong,i,code,etc...) in the content to emphasize important points. Do NOT use these tags in heading types (h2, h3, etc.).

The response MUST be in a json Array<Node> with Node following this structure:
${"```"}
type Node = {
  "type": text | codeBlock | list | quote | h2 | h3 | h4 | h5 | h6 ,
  "content": Array<string>
}
${"```"}
`,
  });

  if (!response.text) return [];
  try {
    return JSON.parse(response.text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return [];
  }
}

export async function writingAssistant1(prompt: string): Promise<AiResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
You are a content writer assistant. Help me to "${prompt}".
The response is a list of Blocks, each Block can be a text, code, lists, quotes, headings, etc and MUST be a shape of this structure:
There are some rules to follow:
- Text MUST not contain any escape characters or markdown formatting.
- If Block type is text, can use HTML tags (a,b,strong,i,code,etc...) in the content to emphasize important points. Do NOT use these tags in heading types (h2, h3, etc.).

Produce JSON matching this specification:
Block = {
  "type": text | codeBlock | list | quote | h2 | h3 | h4 | h5 | h6 ,
  "content": array<string>
}
Return: array<Block>


`,
  });

  if (!response.text) return [];
  try {
    return JSON.parse(response.text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return [];
  }
}
export async function* writingAssistantStream(prompt: string) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `
You are a content writer assistant. Help me to "${prompt}". 
- The response is a list of items, each item can be a text, code, lists, quotes, headings, etc.
- There are some criteria to follow:
    - Text MUST not contain any escape characters or markdown formatting.
    - If item type is text, can use HTML tags (a,b,strong,i,code,etc...) in the content to emphasize important points.
    - If type is heading (h2, h3, etc.), do NOT use HTML tags in the content.
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              enum: [
                "text",
                "codeBlock",
                "list",
                "quote",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
              ],
            },
            content: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    },
  });

  let content: Array<AiBlock> = [];
  const streamBlock = streamBlocks();
  streamBlock.next();
  for await (const chunk of response) {
    const jsonBlocks = streamBlock.next(chunk.text).value;
    content = content.concat(jsonBlocks || []);
    if (jsonBlocks && jsonBlocks.length > 0) {
      yield jsonBlocks;
    }
  }
  streamBlock.next();
}
