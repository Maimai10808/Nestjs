import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createHttpOptions } from '../http-options.js';

import { AiService } from './ai.service.js';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createHttpOptions,
    }),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
