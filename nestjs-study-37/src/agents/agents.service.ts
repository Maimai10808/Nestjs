import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

interface Agent {
  id: number;
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
      name: 'Deep Research Agent',
      description: '自动生成技术研究报告',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '分析代码并提供修改建议',
      model: 'claude-sonnet',
      enabled: true,
    },
    {
      id: 3,
      name: 'Paper Generation Agent',
      description: '自动生成学术论文',
      model: 'gpt-4.1-mini',
      enabled: true,
    },
  ];

  findAll(): Agent[] {
    return this.agents;
  }

  findOne(id: number): Agent {
    const agent = this.agents.find(
      (item) => item.id === id,
    );

    if (!agent) {
      throw new NotFoundException(
        'Agent 不存在',
      );
    }

    return agent;
  }

  async research(topic: string) {
    const startTime = performance.now();

    // 模拟 AI 模型调用
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    return {
      topic,
      model: 'gpt-4.1',
      result:
        `AI Agent 已完成关于《${topic}》的研究`,
      durationMs:
        Math.round(performance.now() - startTime),
    };
  }
}
