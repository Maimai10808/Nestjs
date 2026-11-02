import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CacheInvalidationService } from '../cache/cache-invalidation.service.js';

import type { Agent } from './agent.interface.js';

@Injectable()
export class AgentsService {
  constructor(
    private readonly cacheInvalidation: CacheInvalidationService,
  ) {}

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
      userId: 1002,
      name: 'Coding Agent',
      model: 'claude-sonnet',
      enabled: true,
    },
  ];

  findAll(): Agent[] {
    console.log('[AgentsService] 查询公开 Agent');

    return this.agents.filter(
      (agent) => agent.enabled,
    );
  }

  findOne(id: number): Agent {
    console.log(`[AgentsService] 查询 Agent ${id}`);

    const agent = this.agents.find(
      (item) => item.id === id && item.enabled,
    );

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    return agent;
  }

  findByUser(userId: number): Agent[] {
  console.log(
    `[AgentsService] 查询用户 ${userId} 的 Agent`,
  );

  return this.agents.filter(
    (agent) => agent.userId === userId,
  );
}

  async update(
    id: number,
    data: Partial<Pick<Agent, 'name' | 'model' | 'enabled'>>,
  ): Promise<Agent> {
    const agent = this.agents.find(
      (item) => item.id === id,
    );

    if (!agent) {
      throw new NotFoundException('Agent 不存在');
    }

    // 更新业务数据
    Object.assign(agent, data);

    // 数据更新成功后，清除相关缓存
    await this.cacheInvalidation.invalidateAgent(
      agent.id,
      agent.userId,
    );

    return agent;
  }

  async remove(id: number): Promise<void> {
    const index = this.agents.findIndex(
      (agent) => agent.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Agent 不存在');
    }

    const agent = this.agents[index];

    this.agents.splice(index, 1);

    await this.cacheInvalidation.invalidateAgent(
      agent.id,
      agent.userId,
    );
  }
}
