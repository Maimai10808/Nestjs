export type AiProviderType =
  | 'openai'
  | 'anthropic';

export interface AiProviderConfig {
  id: number;
  userId: number;
  provider: AiProviderType;

  encryptedApiKey: string;

  createdAt: string;
}

export interface AiProviderPublic {
  id: number;
  provider: AiProviderType;
  hasApiKey: boolean;
  createdAt: string;
}
