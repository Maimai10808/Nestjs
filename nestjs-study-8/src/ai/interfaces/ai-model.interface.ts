export interface AIModel {
  name: string;

  generate(prompt: string): Promise<string>;
}
