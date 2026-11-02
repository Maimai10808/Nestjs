import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { AI_CONFIG, AI_MODEL, LOGGER } from './tokens/ai.tokens.js';
import type { AIConfig } from './interfaces/ai-config.interface.js';
import type { AIModel } from './interfaces/ai-model.interface.js';
import { LoggerService } from '../common/logger/logger.service.js';
import { ChatDto } from './dto/chat.dto.js';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    @Inject(AI_CONFIG) private readonly config: AIConfig,
    @Inject(AI_MODEL) private readonly model: AIModel,
    @Inject(LOGGER) private readonly logger: LoggerService,
    private readonly classLogger: LoggerService,
  ) {}

  @Get('config')
  getConfig() {
    return { provider: 'useValue', config: this.config };
  }

  @Get('model')
  getModel() {
    return { provider: 'useFactory', model: this.model.name };
  }

  @Post('generate')
  generate(@Body() dto: ChatDto) {
    return this.aiService.chat(dto?.prompt);
  }

  @Get('logger')
  testLogger() {
    this.logger.log('测试 AI Logger');
    return {
      provider: 'useExisting',
      sameInstance: this.logger === this.classLogger,
      aliasInstanceId: this.logger.getInstanceId(),
      classInstanceId: this.classLogger.getInstanceId(),
    };
  }
}
