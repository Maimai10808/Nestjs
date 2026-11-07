import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';

import { AgentsService } from './agents.service.js';

import { AgentsGateway } from './agents.gateway.js';

import { WsValidationPipe } from '../common/pipes/ws-validation.pipe.js';

import { WsLoggingInterceptor } from '../common/interceptors/ws-logging.interceptor.js';

import { WsExceptionFilter } from '../common/filters/ws-exception.filter.js';

@Module({
  imports: [
    AuthModule,
  ],

  providers: [
    AgentsService,
    AgentsGateway,
    WsValidationPipe,
    WsLoggingInterceptor,
    WsExceptionFilter,
  ],
})
export class AgentsModule {}
