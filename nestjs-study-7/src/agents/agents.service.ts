import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export interface Agent {
  id: number;
  name: string;
  description: string;
  ownerId: string;
  isPublic: boolean;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Research Agent',
      description: 'AI 研究助手',
      ownerId: 'user_001',
      isPublic: true,
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: 'AI 编程助手',
      ownerId: 'user_001',
      isPublic: false,
    },
    {
      id: 3,
      name: 'Writing Agent',
      description: 'AI 写作助手',
      ownerId: 'user_002',
      isPublic: true,
    },
  ];

  findPublic(): Agent[] {
    return this.agents.filter((agent) => agent.isPublic);
  }

  findByOwner(ownerId: string): Agent[] {
    return this.agents.filter(
      (agent) => agent.ownerId === ownerId,
    );
  }

  findAll(): Agent[] {
    return this.agents;
  }

  remove(id: number): { message: string } {
    const index = this.agents.findIndex(
      (agent) => agent.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Agent 不存在');
    }

    this.agents.splice(index, 1);

    return {
      message: 'Agent 删除成功',
    };
  }
}
