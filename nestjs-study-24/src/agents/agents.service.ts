import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AgentEntity } from './entities/agent.entity.js';
import { ModelEntity } from './entities/model.entity.js';

@Injectable()
export class AgentsService {
  private readonly agents: AgentEntity[] = [
    new AgentEntity({
      id: 1,
      name: 'Deep Research Agent',
      description: '自动搜索资料并生成研究报告',

      model: new ModelEntity({
        provider: 'openai',
        name: 'gpt-4.1',
        contextWindow: 1000000,
      }),

      enabled: true,

      apiKey: 'sk-example-agent-secret',
      systemPrompt: '你是一名专业研究助手',
      totalCost: 125.6,
    }),

    new AgentEntity({
      id: 2,
      name: 'Coding Agent',
      description: '帮助开发者编写、分析和修改代码',

      model: new ModelEntity({
        provider: 'anthropic',
        name: 'claude-sonnet',
        contextWindow: 200000,
      }),

      enabled: true,

      apiKey: 'sk-example-coding-secret',
      systemPrompt: '你是一名专业软件工程师',
      totalCost: 89.5,
    }),

    new AgentEntity({
      id: 3,
      name: 'Customer Support Agent',
      description: '自动回答用户问题并处理客户咨询',

      model: new ModelEntity({
        provider: 'openai',
        name: 'gpt-4.1-mini',
        contextWindow: 1000000,
      }),

      enabled: false,

      apiKey: 'sk-example-support-secret',
      systemPrompt: '你是一名专业客服助手',
      totalCost: 36.8,
    }),
  ];

  // 查询所有 Agent
  findAll(): AgentEntity[] {
    return this.agents;
  }

  // 查询指定 Agent
  findOne(id: number): AgentEntity {
    const agent = this.agents.find(
      (item) => item.id === id,
    );

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    return agent;
  }

  // 返回普通 JavaScript 对象
  findOnePlain(id: number) {
    const agent = this.findOne(id);

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      model: agent.model,
      enabled: agent.enabled,
      apiKey: agent.apiKey,
      systemPrompt: agent.systemPrompt,
      totalCost: agent.totalCost,
    };
  }
}
