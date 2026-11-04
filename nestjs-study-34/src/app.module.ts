import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { ExternalModule } from './external/external.module.js';

import { SearchModule } from './search/search.module.js';

import { ModelsModule } from './models/models.module.js';

import { AiModule } from './ai/ai.module.js';

import { AgentsModule } from './agents/agents.module.js';

import { HttpDemoModule } from './http-demo/http-demo.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ExternalModule,

    SearchModule,

    ModelsModule,

    AiModule,

    AgentsModule,

    HttpDemoModule,
  ],
})
export class AppModule {}
