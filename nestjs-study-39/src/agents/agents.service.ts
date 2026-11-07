import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export interface Agent {
  id: number;
  userId: number;
  name: string;
  description: string;
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
      description: '自动搜索资料并生成研究报告',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      userId: 1001,
      name: 'Coding Agent',
      description: '分析代码并生成修改建议',
      model: 'claude-sonnet',
      enabled: true,
    },
    {
      id: 3,
      userId: 1002,
      name: 'Paper Generation Agent',
      description: '自动生成学术论文',
      model: 'gpt-4.1-mini',
      enabled: true,
    },
  ];

  // 1. 查询公开 Agent 目录
  findAll() {
    return this.agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
    }));
  }

  // 2. 查询当前用户的 Agent
  findMyAgents(userId: number): Agent[] {
    return this.agents.filter(
      (agent) => agent.userId === userId,
    );
  }

  // 3. 查询指定 Agent，并检查所有权
  findOne(
    agentId: number,
    userId: number,
  ): Agent {
    const agent = this.agents.find(
      (item) => item.id === agentId,
    );

    if (!agent) {
      throw new NotFoundException(
        'Agent 不存在',
      );
    }

    if (agent.userId !== userId) {
      throw new ForbiddenException(
        '你没有权限访问这个 Agent',
      );
    }

    return agent;
  }

  // 4. 执行自己的 Agent
  async runAgent(
    agentId: number,
    userId: number,
  ) {
    // 先检查资源所有权
    const agent = this.findOne(
      agentId,
      userId,
    );

    if (!agent.enabled) {
      throw new ForbiddenException(
        '当前 Agent 已被禁用',
      );
    }

    // 模拟 AI 执行
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    return {
      agentId: agent.id,
      userId,
      agentName: agent.name,
      status: 'completed',
      result: `${agent.name} 已完成 AI 任务`,
      completedAt: new Date().toISOString(),
    };
  }
}
