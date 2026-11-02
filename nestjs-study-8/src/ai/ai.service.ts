import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { AI_MODEL, AI_CONFIG, LOGGER } from './tokens/ai.tokens.js';

import type { AIModel } from './interfaces/ai-model.interface.js';
import type { AIConfig } from './interfaces/ai-config.interface.js';

import { LoggerService } from '../common/logger/logger.service.js';

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

  async chat(prompt: unknown) {
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 2000) {
      throw new BadRequestException('prompt 必须是 1～2000 字符的非空字符串');
    }
    // 不把用户的原始 Prompt 写入日志。
    this.logger.log('收到 AI 生成请求');

    const result = await this.model.generate(prompt);

    return {
      model: this.model.name,
      prompt,
      result,
      config: this.config,
    };
  }
}
