import type { FactoryProvider } from '@nestjs/common';
import type { AIModel } from '../interfaces/ai-model.interface.js';
import type { AIConfig } from '../interfaces/ai-config.interface.js';
import { AI_MODEL, AI_CONFIG } from '../tokens/ai.tokens.js';
import { OpenAIModelService } from './openai-model.service.js';
import { AnthropicModelService } from './anthropic-model.service.js';

export const aiModelProvider: FactoryProvider<AIModel> = {
  provide: AI_MODEL,
  useFactory: (
    config: AIConfig,
    openAI: OpenAIModelService,
    anthropic: AnthropicModelService,
  ): AIModel => (config.provider === 'anthropic' ? anthropic : openAI),
  inject: [AI_CONFIG, OpenAIModelService, AnthropicModelService],
};
