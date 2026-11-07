import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import type { Socket } from 'socket.io';

import { AgentsService } from './agents.service.js';

import {
  WsAuthGuard,
  type AuthenticatedSocket,
} from '../auth/ws-auth.guard.js';

import {
  WsAdminGuard,
} from '../auth/ws-admin.guard.js';

import {
  WsValidationPipe,
} from '../common/pipes/ws-validation.pipe.js';

import {
  WsLoggingInterceptor,
} from '../common/interceptors/ws-logging.interceptor.js';

import {
  WsExceptionFilter,
} from '../common/filters/ws-exception.filter.js';

import {
  ExecuteAgentDto,
} from './dto/execute-agent.dto.js';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthGuard)
@UseInterceptors(WsLoggingInterceptor)
export class AgentsGateway {
  constructor(
    private readonly agentsService:
      AgentsService,
  ) {}

  // 执行 AI Agent
  @SubscribeMessage('agent.execute')
  @UsePipes(WsValidationPipe)
  async execute(
    @MessageBody() dto: ExecuteAgentDto,

    @ConnectedSocket()
    client: AuthenticatedSocket,
  ) {
    const user = client.data.user!;

    const result =
      await this.agentsService.execute(
        user.id,
        dto.prompt,
        dto.model,
      );

    client.emit('agent.result', result);

    return {
      success: true,
      taskId: result.id,
    };
  }

  // 查询自己的任务
  @SubscribeMessage('agent.status')
  status(
    @ConnectedSocket()
    client: AuthenticatedSocket,
  ) {
    const user = client.data.user!;

    return this.agentsService.findByUser(
      user.id,
    );
  }

  // 管理员统计
  @SubscribeMessage('agent.admin.stats')
  @UseGuards(WsAdminGuard)
  adminStats() {
    return this.agentsService.getStats();
  }
}
