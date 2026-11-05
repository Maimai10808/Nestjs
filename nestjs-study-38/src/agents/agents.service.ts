import { Injectable } from '@nestjs/common';
import type {
  Agent,
  AgentStage,
} from './agent.interface.js';

@Injectable()
export class AgentsService {
  private readonly agents: Agent[] = [
    {
      id: 1,
      name: 'Deep Research Agent',
      description: '自动搜索资料并生成研究报告',
      model: 'gpt-4.1',
      enabled: true,
    },
    {
      id: 2,
      name: 'Coding Agent',
      description: '自动分析代码并提供修改建议',
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

  getResearchStages(): {
    stage: AgentStage;
    message: string;
  }[] {
    return [
      {
        stage: 'planning',
        message: '正在制定研究计划',
      },
      {
        stage: 'searching',
        message: '正在搜索 LangGraph 相关资料',
      },
      {
        stage: 'analyzing',
        message: '正在分析搜索结果',
      },
      {
        stage: 'generating',
        message: '正在生成研究报告',
      },
      {
        stage: 'completed',
        message: '研究任务已完成',
      },
    ];
  }

  getResearchTokens(): string[] {
    return [
      'LangGraph ',
      '是一个 ',
      '用于构建 ',
      '有状态 ',
      'AI Agent ',
      '工作流的框架。',
      '\n\n',
      '它通过状态图 ',
      '组织复杂的 ',
      'Agent 执行流程。',
    ];
  }
}
