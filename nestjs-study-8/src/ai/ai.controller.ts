import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
} from '@nestjs/common';

import { AiService } from './ai.service.js';

import {
  AI_CONFIG,
  AI_LOGGER,
  AI_MODEL,
} from './constants/ai.tokens.js';

import type {
  AiConfig,
  AiLogger,
  AiModel,
} from './interfaces/ai.interface.js';

@Controller('ai')
export class AiController {
  constructor(
    // 标准 Provider：通过类注入
    private readonly aiService: AiService,

    // useValue：注入配置对象
    @Inject(AI_CONFIG)
    private readonly config: AiConfig,

    // useClass / useFactory：注入模型实现
    @Inject(AI_MODEL)
    private readonly model: AiModel,

    // useExisting：通过别名注入日志服务
    @Inject(AI_LOGGER)
    private readonly logger: AiLogger,
  ) {}

  // ==========================================
  // 1. 查看 AI 配置
  // ==========================================

  @Get('config')
  getConfig() {
    return {
      provider: 'useValue',
      config: this.config,
    };
  }

  // ==========================================
  // 2. 查看当前 AI 模型
  // ==========================================

  @Get('model')
  getModel() {
    return {
      provider: 'useClass / useFactory',
      model: this.model.getName(),
    };
  }

  // ==========================================
  // 3. 测试 AI 生成
  // ==========================================

  @Post('generate')
  async generate(
    @Body('prompt') prompt: string,
  ) {
    this.logger.log(`收到 AI 生成请求`);

    return this.aiService.generate(prompt);
  }

  // ==========================================
  // 4. 测试日志 Provider
  // ==========================================

  @Get('logger')
  testLogger() {
    this.logger.log('测试 AI Logger');

    return {
      message: '日志已输出',
      provider: 'useExisting',
    };
  }
}
