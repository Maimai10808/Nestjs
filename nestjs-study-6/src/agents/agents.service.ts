import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Agent } from './interfaces/agent.interface.js';
import type { CreateAgentDto } from './dto/create-agent.dto.js';

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Research Agent',
      description: '负责搜索资料并生成研究报告',
      model: 'gpt-4.1',
      status: 'active',
      createdAt: '2026-10-01T10:00:00.000Z',
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '负责分析代码和执行开发任务',
      model: 'gpt-4.1',
      status: 'active',
      createdAt: '2026-10-02T10:00:00.000Z',
    },
    {
      id: 3,
      name: 'Customer Support Agent',
      description: '负责自动回复客户问题',
      model: 'gpt-4.1-mini',
      status: 'inactive',
      createdAt: '2026-10-03T10:00:00.000Z',
    },
  ];

  findAll(): Agent[] {
    console.log('[Service] 查询 Agent 列表');
    return this.agents;
  }

  findOne(id: number): Agent {
    const agent = this.agents.find((item) => item.id === id);

    if (!agent) {
      throw new NotFoundException(`Agent ${id} 不存在`);
    }

    return agent;
  }

  create(dto: CreateAgentDto): Agent {
    const agent: Agent = {
      id: Math.max(0, ...this.agents.map((item) => item.id)) + 1,
      ...dto,
      createdAt: new Date().toISOString(),
    };

    this.agents.push(agent);

    return agent;
  }

  async findSlow(): Promise<Agent[]> {
    console.log('[Service] 开始模拟慢请求');

    await new Promise((resolve) => {
      setTimeout(resolve, 7000);
    });

    return this.agents;
  }

  throwError(): never {
    throw new Error('模拟数据库连接失败');
  }
}
