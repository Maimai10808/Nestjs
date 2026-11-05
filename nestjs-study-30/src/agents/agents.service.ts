import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  AgentEventNames,
  AgentStartedEvent,
  AgentCompletedEvent,
  AgentFailedEvent,
} from '../events/agent.events.js';

export interface Agent {
  id: number;
  name: string;
  model: string;
  enabled: boolean;
}

export interface AgentExecution {
  id: number;
  agentId: number;
  userId: number;

  status: 'running' | 'completed' | 'failed';

  result: string | null;

  tokensUsed: number;
  durationMs: number;

  createdAt: string;
}

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(
    AgentsService.name,
  );

  constructor(
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Deep Research Agent',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      name: 'Coding Agent',
      model: 'claude-sonnet',
      enabled: true,
    },
    {
      id: 3,
      name: 'Paper Generation Agent',
      model: 'gpt-4.1-mini',
      enabled: true,
    },
  ];

  private readonly executions: AgentExecution[] = [];

  private nextExecutionId = 1001;

  // 查询 Agent
  findAll(): Agent[] {
    return this.agents;
  }

  // 查询执行历史
  findExecutions(): AgentExecution[] {
    return this.executions;
  }

  // 执行 AI Agent
  async runAgent(
    agentId: number,
    userId: number,
  ): Promise<AgentExecution> {
    const agent = this.agents.find(
      (item) => item.id === agentId && item.enabled,
    );

    if (!agent) {
      throw new NotFoundException(
        'Agent 不存在或未启用',
      );
    }

    const executionId = this.nextExecutionId++;

    const startTime = Date.now();

    const execution: AgentExecution = {
      id: executionId,
      agentId,
      userId,
      status: 'running',
      result: null,
      tokensUsed: 0,
      durationMs: 0,
      createdAt: new Date().toISOString(),
    };

    this.executions.push(execution);

    // 1. 发布 Agent 开始事件
    this.eventEmitter.emit(
      AgentEventNames.STARTED,
      new AgentStartedEvent(
        executionId,
        agentId,
        userId,
        new Date().toISOString(),
      ),
    );

    try {
      this.logger.log(
        `开始执行 Agent：${agent.name}`,
      );

      // 2. 模拟 AI Agent 执行
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1500);
      });

      // 模拟 Token 消耗
      const tokensUsed = 2500;

      const durationMs = Date.now() - startTime;

      execution.status = 'completed';

      execution.result =
        `${agent.name} 已完成 AI 任务`;

      execution.tokensUsed = tokensUsed;

      execution.durationMs = durationMs;

      // 3. 发布 Agent 完成事件
      this.eventEmitter.emit(
        AgentEventNames.COMPLETED,
        new AgentCompletedEvent(
          executionId,
          agentId,
          userId,
          tokensUsed,
          durationMs,
          new Date().toISOString(),
        ),
      );

      this.logger.log(
        `Agent 执行完成：${agent.name}`,
      );

      return execution;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      const reason =
        error instanceof Error
          ? error.message
          : String(error);

      execution.status = 'failed';

      execution.durationMs = durationMs;

      // 4. 发布 Agent 失败事件
      this.eventEmitter.emit(
        AgentEventNames.FAILED,
        new AgentFailedEvent(
          executionId,
          agentId,
          userId,
          reason,
          new Date().toISOString(),
        ),
      );

      this.logger.error(
        `Agent 执行失败：${reason}`,
      );

      throw error;
    }
  }
}
