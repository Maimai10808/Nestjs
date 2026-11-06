import { Module } from '@nestjs/common';

import {
  AgentsController,
} from './agents.controller.js';

import {
  AgentsService,
} from './agents.service.js';

import {
  AuthorizationModule,
} from '../authorization/authorization.module.js';

@Module({
  imports: [
    AuthorizationModule,
  ],

  controllers: [
    AgentsController,
  ],

  providers: [
    AgentsService,
  ],

  exports: [
    AgentsService,
  ],
})
export class AgentsModule {}
