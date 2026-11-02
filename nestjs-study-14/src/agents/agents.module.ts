import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { MockAuthGuard } from '../common/guards/mock-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { ContextInterceptor } from '../common/interceptors/context.interceptor.js';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, MockAuthGuard, RolesGuard, ContextInterceptor],
})
export class AgentsModule {}
