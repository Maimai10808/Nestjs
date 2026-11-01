import {
  Injectable,
  Inject,
} from '@nestjs/common';

import {
  AI_MODEL,
  AI_CONFIG,
  LOGGER,
} from './tokens/ai.tokens.js';

import type { AIModel } from './interfaces/ai-model.interface.js';

import { LoggerService } from '../common/logger/logger.service.js';

interface AIConfig {
  provider: 'openai' | 'anthropic';
  maxTokens: number;
  temperature: number;
}

@Injectable()
export class AiService {
  constructor(
    // 注入 AI 模型
    @Inject(AI_MODEL)
    private readonly model: AIModel,

    // 注入配置对象
    @Inject(AI_CONFIG)
    private readonly config: AIConfig,

    // 注入日志服务
    @Inject(LOGGER)
    private readonly logger: LoggerService,
  ) {}

  async chat(prompt: string) {
    this.logger.log(`收到 AI 请求：${prompt}`);

    const result = await this.model.generate(prompt);

    return {
      model: this.model.name,
      prompt,
      result,
      config: this.config,
    };
  }
}
