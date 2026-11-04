import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentsService {
  private readonly agents = [
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
      description: '自动分析代码并生成修改建议',
    },
    {
      id: 3,
      name: 'Paper Generation Agent',
      model: 'gpt-4.1-mini',
      description: '自动生成学术论文',
    },
  ];

  findAll() {
    return this.agents;
  }
}
