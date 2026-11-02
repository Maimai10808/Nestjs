export interface AIConfig {
  provider: 'openai' | 'anthropic';
  maxTokens: number;
  temperature: number;
}
