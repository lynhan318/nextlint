export declare function generateArticleOutlineStream(prompt: string): Promise<void>;
export type AiBlock = {
    type: "text" | "codeBlock" | "list" | "quote" | "h2" | "h3" | "h4" | "h5" | "h6";
    content: Array<string>;
};
export type AiResponse = Array<AiBlock>;
export declare function generateArticleOutline(prompt: string): Promise<AiResponse>;
export declare function writingAssistant1(prompt: string): Promise<AiResponse>;
export declare function writingAssistantStream(prompt: string): AsyncGenerator<AiBlock[], void, unknown>;
