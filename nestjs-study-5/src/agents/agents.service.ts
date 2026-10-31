import { Injectable, NotFoundException } from '@nestjs/common';

interface Agent {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: '1',
      name: 'Research Agent',
      description: '自动研究与报告生成',
    },
    {
      id: '2',
      name: 'Coding Agent',
      description: '代码分析与开发辅助',
    },
  ];

  findAll(): Agent[] {
    return this.agents;
  }

  findOne(id: string): Agent {
    const agent = this.agents.find((item) => item.id === id);

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    return agent;
  }

  create(): Agent {
    const agent: Agent = {
      id: String(this.agents.length + 1),
      name: 'New Agent',
      description: '新创建的 Agent',
    };

    this.agents.push(agent);

    return agent;
  }

  remove(id: string): { deleted: boolean } {
    const index = this.agents.findIndex(
      (agent) => agent.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Agent 不存在');
    }

    this.agents.splice(index, 1);

    return { deleted: true };
  }
}
