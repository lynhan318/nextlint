export type AiBlock = {
  type: "text" | "codeBlock" | "list" | "quote" | "h2" | "h3" | "h4" | "h5" | "h6";
  content: string[];
};

export type AiResponse = AiBlock[];

export type ProviderConfig = {
  model?: string;
  apiKey?: string;
  baseUrl?: string;
};

export interface AIProvider {
  name: string;
  generate(prompt: string): Promise<AiResponse>;
  generateStream(prompt: string): AsyncGenerator<AiResponse>;
}

export interface AIProviderClass {
  new (config?: ProviderConfig): AIProvider;
}
