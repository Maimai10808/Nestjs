import { Injectable, NotFoundException } from '@nestjs/common';

export interface Agent {
  id: number;
  name: string;
  description: string;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Research Agent',
      description: '负责深度研究',
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '负责代码生成',
    },
    {
      id: 3,
      name: 'Office Agent',
      description: '负责办公自动化',
    },
  ];

  findAll(): Agent[] {
    return this.agents;
  }

  create(name: string): Agent {
    const agent: Agent = {
      id: Math.max(0, ...this.agents.map((item) => item.id)) + 1,
      name,
      description: '新创建的 Agent',
    };

    this.agents.push(agent);

    return agent;
  }

  remove(id: number): Agent {
    const index = this.agents.findIndex(
      (agent) => agent.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Agent 不存在');
    }

    const [removed] = this.agents.splice(index, 1);

    return removed;
  }
}
