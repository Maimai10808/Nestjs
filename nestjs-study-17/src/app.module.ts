import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import aiConfig from './config/ai.config.js';
import databaseConfig from './config/database.config.js';
import redisConfig from './config/redis.config.js';

import { envValidationSchema } from './config/env.validation.js';

import { AgentsModule } from './agents/agents.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,

      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env',
      ],

      load: [
        aiConfig,
        databaseConfig,
        redisConfig,
      ],

      validationSchema: envValidationSchema,

      cache: true,

      expandVariables: true,
    }),

    AgentsModule,
  ],
})
export class AppModule {}
