import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
    this.validateInput(data, false);
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
    this.validateInput(data, true);
    const agent = this.agents.find((item) => item.id === id);

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    Object.assign(agent, data);

    return agent;
  }
  private validateInput(data: unknown, partial: boolean): void {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new BadRequestException('请求体必须是对象');
    }
    const fields = ['name', 'description', 'model'] as const;
    if (Object.keys(data).some((key) => !fields.includes(key as typeof fields[number]))) {
      throw new BadRequestException('只允许 name、description、model');
    }
    for (const field of fields) {
      const value: unknown = Reflect.get(data, field);
      if (partial && value === undefined) continue;
      if (typeof value !== 'string' || (field !== 'description' && !value.trim())) {
        throw new BadRequestException(`${field} 必须是字符串，name 和 model 不能为空`);
      }
    }
  }

}
