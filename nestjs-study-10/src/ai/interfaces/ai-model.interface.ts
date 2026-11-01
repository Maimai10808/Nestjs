export interface AiModel {
  getName(): string;

  generate(prompt: string): Promise<string>;
}
