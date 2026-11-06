import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

interface Agent {
  id: number;
  name: string;
  model: string;
  description: string;
}

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Deep Research Agent',
      model: 'gpt-4.1',
      description: '自动搜索资料并生成研究报告',
    },
    {
      id: 2,
      name: 'Coding Agent',
      model: 'claude-sonnet',
      description: '分析代码并生成修改建议',
    },
    {
      id: 3,
      name: 'Paper Generation Agent',
      model: 'gpt-4.1-mini',
      description: '自动生成学术论文',
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

    // 模拟 AI Agent 执行
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });

    return {
      topic,
      model: 'gpt-4.1',
      result: `已完成关于《${topic}》的研究`,
      durationMs: Math.round(
        performance.now() - startTime,
      ),
    };
  }
}
