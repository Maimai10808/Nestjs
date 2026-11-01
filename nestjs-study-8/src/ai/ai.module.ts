import { Module } from '@nestjs/common';

import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';

import { OpenAiModelService } from './models/openai-model.service.js';
import { AnthropicModelService } from './models/anthropic-model.service.js';
import { LoggerService } from './logger/logger.service.js';

import {
  AI_CONFIG,
  AI_MODEL,
  AI_LOGGER,
} from './constants/ai.tokens.js';

const isDevelopment =
  process.env.NODE_ENV !== 'production';

@Module({
  controllers: [AiController],

  providers: [
    AiService,

    // 1. useValue
    {
      provide: AI_CONFIG,
      useValue: {
        defaultModel: 'gpt-4.1',
        temperature: 0.7,
      },
    },

    // 2. useClass
    {
      provide: AI_MODEL,
      useClass: isDevelopment
        ? OpenAiModelService
        : AnthropicModelService,
    },

    // 3. 标准 Provider
    LoggerService,

    // 4. useExisting
    {
      provide: AI_LOGGER,
      useExisting: LoggerService,
    },
  ],

  exports: [
    AiService,
    AI_CONFIG,
    AI_MODEL,
    AI_LOGGER,
  ],
})
export class AiModule {}
