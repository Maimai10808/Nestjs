import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import type {
  Agent,
  AgentExecution,
} from './agent.interface.js';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Deep Research Agent',
      description: '自动生成研究报告',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '自动分析代码',
      model: 'claude-sonnet',
      enabled: true,
    },
    {
      id: 3,
      name: 'Market Analysis Agent',
      description: '自动分析市场动态',
      model: 'gpt-4.1-mini',
      enabled: true,
    },
  ];

  private readonly executions: AgentExecution[] = [];

  private nextExecutionId = 1001;

  findAll(): Agent[] {
    return this.agents;
  }

  findExecutions(): AgentExecution[] {
    return this.executions;
  }

  async runAgent(
    agentId: number,
    trigger: AgentExecution['trigger'],
  ): Promise<AgentExecution> {
    const agent = this.agents.find(
      (item) => item.id === agentId && item.enabled,
    );

    if (!agent) {
      throw new NotFoundException('Agent 不存在或未启用');
    }

    this.logger.log(
      `开始执行 Agent: ${agent.name}, trigger=${trigger}`,
    );

    // 模拟 AI Agent 执行耗时
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    const execution: AgentExecution = {
      id: this.nextExecutionId++,
      agentId: agent.id,
      agentName: agent.name,
      trigger,
      status: 'completed',
      result: `${agent.name} 执行完成`,
      executedAt: new Date().toISOString(),
    };

    this.executions.push(execution);

    this.logger.log(
      `Agent 执行完成: ${agent.name}`,
    );

    return execution;
  }
}
