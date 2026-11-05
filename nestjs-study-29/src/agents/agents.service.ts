import { Injectable } from '@nestjs/common';

export interface Agent {
  id: number;
  userId: number;
  name: string;
  model: string;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      userId: 1001,
      name: 'Deep Research Agent',
      model: 'gpt-4.1',
    },
    {
      id: 2,
      userId: 1001,
      name: 'Coding Agent',
      model: 'claude-sonnet',
    },
    {
      id: 3,
      userId: 1002,
      name: 'Customer Support Agent',
      model: 'gpt-4.1-mini',
    },
  ];

  findMyAgents(userId: number): Agent[] {
    return this.agents.filter(
      (agent) => agent.userId === userId,
    );
  }
}
