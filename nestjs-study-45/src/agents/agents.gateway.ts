import {
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import {
  WsException,
} from '@nestjs/websockets';

import type {
  Server,
  Socket,
} from 'socket.io';

import { AgentsService } from './agents.service.js';

import { StartAgentDto } from './dto/start-agent.dto.js';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class AgentsGateway
  implements
    OnGatewayInit,
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

  // Gateway 初始化
  afterInit() {
    this.logger.log(
      'AI Coding Agent Gateway 初始化完成',
    );
  }

  // 客户端连接
  handleConnection(client: Socket) {
    this.logger.log(
      `客户端连接：${client.id}`,
    );

    client.emit('connected', {
      clientId: client.id,
      message: '已连接 AI Agent 平台',
    });
  }

  // 客户端断开
  handleDisconnect(client: Socket) {
    this.logger.log(
      `客户端断开：${client.id}`,
    );
    // 本章任务由连接拥有，断开时取消，避免永远停留在人工审批。
    for (const task of this.agentsService.findByClient(client.id)) {
      this.agentsService.abortTask(task.id);
      this.agentsService.cancelTask(task.id);
    }
  }

  // 启动 Agent
  @SubscribeMessage('agent.start')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) =>
        new WsException(
          errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        ),
    }),
  )
  async startAgent(
    @MessageBody() dto: StartAgentDto,
    @ConnectedSocket() client: Socket,
  ) {
    const task =
      this.agentsService.createTask(
        client.id,
        dto.prompt,
      );

    await client.join(`task:${task.id}`);

    client.emit('agent.started', {
      taskId: task.id,
      message: 'AI Coding Agent 已启动',
    });

    void this.executeAgent(task.id);

    return {
      taskId: task.id,
      status: 'started',
    };
  }

  // 查询任务状态
  @SubscribeMessage('agent.status')
  getStatus(
    @MessageBody()
    data: { taskId: string },

    @ConnectedSocket()
    client: Socket,
  ) {
    const task =
      this.agentsService.findOne(
        data.taskId,
      );

    this.assertOwner(task.clientId, client.id);

    return task;
  }

  // 批准任务
  @SubscribeMessage('agent.approve')
  approve(
    @MessageBody()
    data: { taskId: string },

    @ConnectedSocket()
    client: Socket,
  ) {
    const task =
      this.agentsService.findOne(
        data.taskId,
      );

    this.assertOwner(task.clientId, client.id);

    this.agentsService.approveTask(
      data.taskId,
    );

    return {
      taskId: data.taskId,
      approved: true,
    };
  }

  // 取消任务
  @SubscribeMessage('agent.cancel')
  cancel(
    @MessageBody()
    data: { taskId: string },

    @ConnectedSocket()
    client: Socket,
  ) {
    const task =
      this.agentsService.findOne(
        data.taskId,
      );

    this.assertOwner(task.clientId, client.id);

    this.agentsService.abortTask(
      data.taskId,
    );

    this.agentsService.cancelTask(
      data.taskId,
    );

    return {
      taskId: data.taskId,
      cancelled: true,
    };
  }

  private assertOwner(
    ownerClientId: string,
    currentClientId: string,
  ) {
    if (ownerClientId !== currentClientId) {
      throw new WsException(
        '无权操作该任务',
      );
    }
  }

  private async executeAgent(
    taskId: string,
  ) {
    const signal =
      this.agentsService.registerExecution(
        taskId,
      );

    try {
      await this.runStage(
        taskId,
        'planning',
        20,
        '正在制定代码修复计划',
        signal,
      );

      await this.runStage(
        taskId,
        'analyzing',
        40,
        '正在分析 TypeScript 错误',
        signal,
      );

      this.agentsService.updateStatus(
        taskId,
        'waiting_approval',
        50,
      );

      this.emitToTask(
        taskId,
        'agent.approval_required',
        {
          taskId,
          message:
            'Agent 准备修改代码，请确认',
        },
      );

      await this.agentsService.waitForApproval(
        taskId,
      );

      signal.throwIfAborted();

      await this.runStage(
        taskId,
        'modifying',
        70,
        '正在模拟修改代码',
        signal,
      );

      await this.runStage(
        taskId,
        'testing',
        90,
        '正在模拟运行测试',
        signal,
      );

      signal.throwIfAborted();

      this.agentsService.updateStatus(
        taskId,
        'completed',
        100,
      );

      this.emitToTask(
        taskId,
        'agent.completed',
        {
          taskId,
          message: 'AI Coding Agent 执行完成',
        },
      );
    } catch (error) {
      if (signal.aborted) {
        this.agentsService.cancelTask(taskId);

        this.emitToTask(
          taskId,
          'agent.cancelled',
          {
            taskId,
            message: '任务已取消',
          },
        );
      } else {
        this.agentsService.updateStatus(
          taskId,
          'failed',
          0,
        );

        this.emitToTask(
          taskId,
          'agent.failed',
          {
            taskId,
            message: '任务执行失败',
          },
        );

        this.logger.error(
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    } finally {
      this.agentsService.finishExecution(
        taskId,
      );
    }
  }

  private async runStage(
    taskId: string,
    status:
      | 'planning'
      | 'analyzing'
      | 'modifying'
      | 'testing',
    progress: number,
    message: string,
    signal: AbortSignal,
  ) {
    signal.throwIfAborted();

    this.agentsService.updateStatus(
      taskId,
      status,
      progress,
    );

    this.emitToTask(
      taskId,
      'agent.progress',
      {
        taskId,
        status,
        progress,
        message,
      },
    );

    await new Promise<void>(
      (resolve, reject) => {
        const timer = setTimeout(
          () => {
            signal.removeEventListener(
              'abort',
              onAbort,
            );
            resolve();
          },
          1500,
        );

        const onAbort = () => {
          clearTimeout(timer);
          reject(new Error('任务已取消'));
        };

        signal.addEventListener(
          'abort',
          onAbort,
          { once: true },
        );

        if (signal.aborted) {
          onAbort();
        }
      },
    );
  }

  private emitToTask(
    taskId: string,
    event: string,
    data: unknown,
  ) {
    this.server
      .to(`task:${taskId}`)
      .emit(event, data);
  }
}
