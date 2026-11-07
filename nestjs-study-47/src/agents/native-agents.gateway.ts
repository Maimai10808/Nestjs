import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import type {
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway({
  path: '/agents-ws',
})
export class NativeAgentsGateway {
  @SubscribeMessage('agent.ping')
  ping(
    @MessageBody()
    data: { message: string },
  ): WsResponse<unknown> {
    return {
      event: 'agent.pong',

      data: {
        received: data.message,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @SubscribeMessage('agent.start')
  start(
    @MessageBody()
    data: { taskId: string },
  ): WsResponse<unknown> {
    return {
      event: 'agent.started',

      data: {
        taskId: data.taskId,
        status: 'started',
      },
    };
  }
}
