import { Injectable } from '@nestjs/common';

interface Agent {
  id: number;
  userId: number;
  name: string;
  model: string;
  enabled: boolean;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      userId: 1001,
      name: 'Deep Research Agent',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      userId: 1001,
      name: 'Coding Agent',
      model: 'claude-sonnet',
      enabled: true,
    },
    {
      id: 3,
      userId: 1002,
      name: 'Customer Support Agent',
      model: 'gpt-4.1-mini',
      enabled: true,
    },
  ];

  findMyAgents(userId: number): Agent[] {
    return this.agents.filter(
      (agent) => agent.userId === userId,
    );
  }
}
