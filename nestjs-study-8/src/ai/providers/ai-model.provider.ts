import type { AIModel } from '../interfaces/ai-model.interface.js';

import {
  AI_MODEL,
  AI_CONFIG,
} from '../tokens/ai.tokens.js';

import { OpenAIModelService } from './openai-model.service.js';
import { AnthropicModelService } from './anthropic-model.service.js';

interface AIConfig {
  provider: 'openai' | 'anthropic';
  maxTokens: number;
  temperature: number;
}

export const aiModelProvider = {
  provide: AI_MODEL,

  useFactory: (config: AIConfig): AIModel => {
    console.log('正在初始化 AI Model...');

    if (config.provider === 'anthropic') {
      return new AnthropicModelService();
    }

    return new OpenAIModelService();
  },

  inject: [AI_CONFIG],
};
