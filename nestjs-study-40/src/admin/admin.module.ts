import { Module } from '@nestjs/common';

import {
  AdminController,
} from './admin.controller.js';

import {
  AuthorizationModule,
} from '../authorization/authorization.module.js';

import {
  UsersModule,
} from '../users/users.module.js';

import {
  AgentsModule,
} from '../agents/agents.module.js';

@Module({
  imports: [
    AuthorizationModule,
    UsersModule,
    AgentsModule,
  ],

  controllers: [
    AdminController,
  ],
})
export class AdminModule {}
