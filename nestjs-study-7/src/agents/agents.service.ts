import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateAgentDto } from './dto/create-agent.dto.js';
import type { UpdateAgentDto } from './dto/update-agent.dto.js';

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

  private nextId = 4;

  findPublic(): Agent[] {
    return this.agents.filter((agent) => agent.isPublic);
  }

  findByOwner(ownerId: string): Agent[] {
    return this.agents.filter((agent) => agent.ownerId === ownerId);
  }

  create(ownerId: string, dto: CreateAgentDto): Agent {
    const agent: Agent = {
      id: this.nextId++,
      name: dto.name,
      description: dto.description,
      isPublic: dto.isPublic,
      ownerId,
    };
    this.agents.push(agent);
    return agent;
  }

  findOneForUser(id: number, ownerId: string): Agent {
    const agent = this.agents.find(
      (item) => item.id === id && item.ownerId === ownerId,
    );
    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }
    return agent;
  }

  updateForUser(id: number, ownerId: string, dto: UpdateAgentDto): Agent {
    const agent = this.findOneForUser(id, ownerId);
    if (dto.name !== undefined) agent.name = dto.name;
    if (dto.description !== undefined) agent.description = dto.description;
    if (dto.isPublic !== undefined) agent.isPublic = dto.isPublic;
    return agent;
  }

  findAll(): Agent[] {
    return this.agents;
  }

  remove(id: number): { message: string } {
    const index = this.agents.findIndex((agent) => agent.id === id);

    if (index === -1) {
      throw new NotFoundException('Agent 不存在');
    }

    this.agents.splice(index, 1);

    return {
      message: 'Agent 删除成功',
    };
  }
}
