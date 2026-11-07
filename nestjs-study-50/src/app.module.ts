import { Module } from '@nestjs/common';

import {
  ConfigModule,
} from '@nestjs/config';

import {
  ResearchModule,
} from './research/research.module.js';

import {
  KnowledgeModule,
} from './knowledge/knowledge.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ResearchModule,

    KnowledgeModule,
  ],
})
export class AppModule {}
