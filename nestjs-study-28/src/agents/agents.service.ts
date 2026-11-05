import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AppLogger } from '../logging/app-logger.service.js';

import { AiService } from '../ai/ai.service.js';

import type {
  Agent,
  AgentExecution,
} from './agent.interface.js';

@Injectable()
export class AgentsService {


  constructor(
  private readonly aiService: AiService,
  private readonly logger: AppLogger,
) {
  this.logger.setContext(
    AgentsService.name,
  );
}

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



  findAll(): Agent[] {
    this.logger.debug('查询 Agent 列表');

    return this.agents;
  }

  findExecutions(): AgentExecution[] {
    return this.executions;
  }

  async runAgent(
    agentId: number,
  ): Promise<AgentExecution> {
    const agent = this.agents.find(
      (item) => item.id === agentId,
    );

    if (!agent) {
      this.logger.warn(
        `Agent 不存在，agentId=${agentId}`,
      );

      throw new NotFoundException(
        'Agent 不存在',
      );
    }

    if (!agent.enabled) {
      this.logger.warn(
        `Agent 已禁用，agentId=${agentId}`,
      );

      throw new NotFoundException(
        'Agent 不存在或未启用',
      );
    }

    this.logger.logAgentEvent(agentId, 'execution_started');

    const startTime = Date.now();

    this.logger.log(
      `Agent 开始执行：${agent.name}`,
    );

    try {
      const result = await this.aiService.generate(
        agent.id,
        '生成一份 AI 技术研究报告',
      );

      const durationMs =
        Date.now() - startTime;

      const execution: AgentExecution = {
        id: this.nextExecutionId++,
        agentId,
        status: 'completed',
        result,
        durationMs,
        executedAt: new Date().toISOString(),
      };

      this.executions.push(execution);

      this.logger.log(
        `Agent 执行成功，agentId=${agentId}，耗时=${durationMs}ms`,
      );

      return execution;
    } catch (error) {
      const durationMs =
        Date.now() - startTime;

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      this.logger.error(
        `Agent 执行失败，agentId=${agentId}，原因=${message}`,
        error instanceof Error
          ? error.stack
          : undefined,
      );

      const execution: AgentExecution = {
        id: this.nextExecutionId++,
        agentId,
        status: 'failed',
        result: null,
        durationMs,
        executedAt: new Date().toISOString(),
      };

      this.executions.push(execution);

      throw error;
    }
  }
}
