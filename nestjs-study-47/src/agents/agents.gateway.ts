import {
  Logger,
} from '@nestjs/common';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import type {
  Server,
  Socket,
} from 'socket.io';

import { AgentsService } from './agents.service.js';

@WebSocketGateway({
  cors: {
    origin: '*',
  },

  transports: ['websocket'],
})
export class AgentsGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  private readonly logger = new Logger(
    AgentsGateway.name,
  );

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly agentsService:
      AgentsService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(
      `Client connected: ${client.id}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client disconnected: ${client.id}`,
    );
  }

  @SubscribeMessage('agent.subscribe')
  async subscribe(
    @MessageBody()
    data: { taskId: string },

    @ConnectedSocket()
    client: Socket,
  ) {
    const room = `task:${data.taskId}`;

    await client.join(room);

    return {
      subscribed: true,
      room,
    };
  }

  @SubscribeMessage('agent.start')
  async start(
    @MessageBody()
    data: { taskId: string },

    @ConnectedSocket()
    client: Socket,
  ) {
    const room = `task:${data.taskId}`;

    await client.join(room);

    void this.agentsService.execute(
      data.taskId,
      (progress) => {
        this.server
          .to(room)
          .emit(
            'agent.progress',
            progress,
          );
      },
    );

    return {
      started: true,
      taskId: data.taskId,
    };
  }
}
