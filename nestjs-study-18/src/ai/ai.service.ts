import {
  Inject,
  Injectable,
} from '@nestjs/common';

import type { ConfigType } from '@nestjs/config';

import aiConfig from '../config/ai.config.js';

@Injectable()
export class AiService {
  constructor(
    @Inject(aiConfig.KEY)
    private readonly config: ConfigType<typeof aiConfig>,
  ) {}

  getModelInfo() {
    return {
      provider: this.config.provider,
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    };
  }

  async generate(prompt: string) {
    // 教学用模拟模型，不调用真实 API
    return {
      model: this.config.model,
      provider: this.config.provider,
      content: `AI 模拟回复：${prompt}`,
    };
  }
}
