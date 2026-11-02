import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import aiConfig from './config/ai.config.js';
import agentConfig from './config/agent.config.js';
import quotaConfig from './config/quota.config.js';

import { AiModule } from './ai/ai.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { QuotaModule } from './quota/quota.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 全局配置模块
      isGlobal: true,

      // 环境变量文件
      envFilePath: '.env',

      // 加载三个业务配置命名空间
      load: [
        aiConfig,
        agentConfig,
        quotaConfig,
      ],

      // 使用 Joi 验证环境变量
      validationSchema: Joi.object({
        // ==============================
        // AI 模型配置
        // ==============================

        AI_PROVIDER: Joi.string()
          .valid('openai', 'claude')
          .default('openai'),

        AI_MODEL: Joi.string()
          .min(1)
          .default('gpt-4.1'),

        AI_API_KEY: Joi.string()
          .allow('')
          .default(''),

        AI_TEMPERATURE: Joi.number()
          .min(0)
          .max(2)
          .default(0.7),

        AI_MAX_TOKENS: Joi.number()
          .integer()
          .min(1)
          .max(1000000)
          .default(4096),

        // ==============================
        // Agent 执行配置
        // ==============================

        AGENT_MAX_STEPS: Joi.number()
          .integer()
          .min(1)
          .max(1000)
          .default(20),

        AGENT_TIMEOUT_MS: Joi.number()
          .integer()
          .min(1)
          .max(3600000)
          .default(30000),

        AGENT_MAX_CONCURRENT: Joi.number()
          .integer()
          .min(1)
          .max(10000)
          .default(5),

        // ==============================
        // 用户配额配置
        // ==============================

        QUOTA_DAILY_LIMIT: Joi.number()
          .integer()
          .min(1)
          .max(1000000)
          .default(100),

        QUOTA_MAX_TOKENS_PER_REQUEST: Joi.number()
          .integer()
          .min(1)
          .max(1000000)
          .default(8192),
      }),

      // 显式声明验证选项
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
        convert: true,
      },
    }),

    AiModule,
    QuotaModule,
    AgentsModule,
  ],
})
export class AppModule {}
