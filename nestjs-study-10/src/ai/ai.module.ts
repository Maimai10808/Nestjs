import {
  DynamicModule,
  Module,
} from '@nestjs/common';

import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';

import { OpenAiService } from './models/openai.service.js';
import { ClaudeService } from './models/claude.service.js';

import {
  AI_MODEL,
  AI_OPTIONS,
} from './constants/ai.tokens.js';

import type { AiModuleOptions } from './interfaces/ai-options.interface.js';

@Module({})
export class AiModule {
  static register(options: AiModuleOptions): DynamicModule {
    // 1. 根据配置选择具体的模型实现
    const modelClass =
      options.provider === 'openai'
        ? OpenAiService
        : ClaudeService;

    // 2. 返回动态模块定义
    return {
      module: AiModule,

      controllers: [
        AiController,
      ],

      providers: [
        // 注册模块配置
        {
          provide: AI_OPTIONS,
          useValue: options,
        },

        // 注册模型实现
        {
          provide: AI_MODEL,
          useClass: modelClass,
        },

        // 注册业务 Service
        AiService,
      ],

      exports: [
        AiService,
        AI_MODEL,
        AI_OPTIONS,
      ],
    };
  }
}
