import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { OpenAIModelService } from './providers/openai-model.service.js';
import { AnthropicModelService } from './providers/anthropic-model.service.js';
import { aiModelProvider } from './providers/ai-model.provider.js';
import { LoggerService } from '../common/logger/logger.service.js';
import { AI_CONFIG, AI_MODEL, LOGGER } from './tokens/ai.tokens.js';
import type { AIConfig } from './interfaces/ai-config.interface.js';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    // useValue：共享一份配置值，Mock 模型不会把这些参数传给真实 API。
    {
      provide: AI_CONFIG,
      useValue: {
        provider: 'openai',
        maxTokens: 1000,
        temperature: 0.7,
      } satisfies AIConfig,
    },
    // useClass：把类 Token 映射到实现类；也可简写为类名。
    { provide: OpenAIModelService, useClass: OpenAIModelService },
    { provide: AnthropicModelService, useClass: AnthropicModelService },
    // useFactory：读取配置，返回容器已创建的模型实例。
    aiModelProvider,
    LoggerService,
    // useExisting：LOGGER 与 LoggerService 指向同一实例。
    { provide: LOGGER, useExisting: LoggerService },
  ],
  exports: [AiService, AI_CONFIG, AI_MODEL, LOGGER],
})
export class AiModule {}
