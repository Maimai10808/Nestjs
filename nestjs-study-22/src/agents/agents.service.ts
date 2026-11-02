import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Agent } from './interfaces/agent.interface.js';

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Deep Research Agent',
      description: '执行深度研究任务',
      model: 'gpt-4.1',
      enabled: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '帮助用户编写代码',
      model: 'claude-sonnet',
      enabled: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Customer Support Agent',
      description: '自动处理客户咨询',
      model: 'gpt-4.1-mini',
      enabled: false,
      createdAt: new Date().toISOString(),
    },
  ];

  private nextId = 4;

  // 查询公开 Agent
  findAll(): Agent[] {
    console.log('[AgentsService] 查询 Agent 列表');

    return this.agents.filter((agent) => agent.enabled);
  }

  // 查询单个 Agent
  findOne(id: number): Agent {
    console.log(`[AgentsService] 查询 Agent ${id}`);

    const agent = this.agents.find(
      (item) => item.id === id && item.enabled,
    );

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    return agent;
  }

  // 创建 Agent
  create(data: Pick<Agent, 'name' | 'description' | 'model'>): Agent {
    const agent: Agent = {
      id: this.nextId++,
      name: data.name,
      description: data.description,
      model: data.model,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    this.agents.push(agent);

    return agent;
  }

  // 修改 Agent
  update(
    id: number,
    data: Partial<Pick<Agent, 'name' | 'description' | 'model'>>,
  ): Agent {
    const agent = this.agents.find((item) => item.id === id);

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    Object.assign(agent, data);

    return agent;
  }
}
