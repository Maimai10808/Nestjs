import { Module } from '@nestjs/common';

import {
  ConfigModule,
} from '@nestjs/config';

import {
  ResearchModule,
} from './research/research.module.js';

import {
  HealthModule,
} from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ResearchModule,

    HealthModule,
  ],
})
export class AppModule {}
