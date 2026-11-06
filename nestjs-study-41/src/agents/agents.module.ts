import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';

import { AgentsService } from './agents.service.js';

import { ProvidersModule } from '../providers/providers.module.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    ProvidersModule,
    AuthModule,
  ],

  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
  ],
})
export class AgentsModule {}
