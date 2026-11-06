import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

interface Agent {
  id: number;
  ownerId: number;
  name: string;
  model: string;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      ownerId: 1001,
      name: 'Deep Research Agent',
      model: 'gpt-4.1',
    },
    {
      id: 2,
      ownerId: 1001,
      name: 'Coding Agent',
      model: 'claude-sonnet',
    },
    {
      id: 3,
      ownerId: 1002,
      name: 'Paper Generation Agent',
      model: 'gpt-4.1-mini',
    },
  ];

  private nextId = 4;

  findAll(): Agent[] {
    return this.agents;
  }

  findMyAgents(userId: number): Agent[] {
    return this.agents.filter(
      (agent) => agent.ownerId === userId,
    );
  }

  create(
    userId: number,
    name: string,
    model: string,
  ): Agent {
    const agent: Agent = {
      id: this.nextId++,
      ownerId: userId,
      name,
      model,
    };

    this.agents.push(agent);

    return agent;
  }

  update(
    userId: number,
    id: number,
    name: string,
  ): Agent {
    const agent = this.findOwned(userId, id);

    agent.name = name;

    return agent;
  }

  remove(
    userId: number,
    id: number,
  ) {
    const agent = this.findOwned(userId, id);

    const index = this.agents.indexOf(agent);

    this.agents.splice(index, 1);

    return {
      message: 'Agent 已删除',
    };
  }

  private findOwned(
    userId: number,
    id: number,
  ): Agent {
    const agent = this.agents.find(
      (item) => item.id === id,
    );

    if (!agent) {
      throw new NotFoundException();
    }

    if (agent.ownerId !== userId) {
      throw new ForbiddenException();
    }

    return agent;
  }
}
