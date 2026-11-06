import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CaslAbilityFactory,
} from '../authorization/casl-ability.factory.js';

import type {
  CurrentUser,
} from '../authorization/casl-ability.factory.js';

import {
  Action,
} from '../authorization/action.enum.js';

import { Agent } from './agent.entity.js';

import type {
  CreateAgentDto,
} from './dto/create-agent.dto.js';

import type {
  UpdateAgentDto,
} from './dto/update-agent.dto.js';

@Injectable()
export class AgentsService {
  constructor(
    private readonly caslAbilityFactory:
      CaslAbilityFactory,
  ) {}

  private readonly agents: Agent[] = [
    Object.assign(new Agent(), {
      id: 1,
      name: 'Deep Research Agent',
      ownerId: 1001,
      model: 'gpt-4.1',
      status: 'idle',
    }),

    Object.assign(new Agent(), {
      id: 2,
      name: 'Coding Agent',
      ownerId: 1001,
      model: 'claude-sonnet',
      status: 'running',
    }),

    Object.assign(new Agent(), {
      id: 3,
      name: 'Paper Generation Agent',
      ownerId: 1002,
      model: 'gpt-4.1-mini',
      status: 'idle',
    }),
  ];

  private nextId = 4;

  // 1. 查询当前用户有权读取的 Agent
  findAll(user: CurrentUser): Agent[] {
    const ability =
      this.caslAbilityFactory.createForUser(user);

    return this.agents.filter((agent) =>
      ability.can(Action.Read, agent),
    );
  }

  // 2. 查询自己的 Agent
  findMyAgents(userId: number): Agent[] {
    return this.agents.filter(
      (agent) => agent.ownerId === userId,
    );
  }

  // 3. 查询指定 Agent
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

  // 4. 创建 Agent
  create(
    user: CurrentUser,
    dto: CreateAgentDto,
  ): Agent {
    const ability =
      this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Create, Agent)) {
      throw new ForbiddenException(
        '没有创建 Agent 的权限',
      );
    }

    const agent = Object.assign(
      new Agent(),
      {
        id: this.nextId++,
        name: dto.name,
        ownerId: user.id,
        model: dto.model,
        status: 'idle',
      },
    );

    this.agents.push(agent);

    return agent;
  }

  // 5. 更新 Agent
  update(
    user: CurrentUser,
    id: number,
    dto: UpdateAgentDto,
  ): Agent {
    const agent = this.findOne(id);

    const ability =
      this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Update, agent)) {
      throw new ForbiddenException(
        '没有修改该 Agent 的权限',
      );
    }

    if (dto.name !== undefined) {
      agent.name = dto.name;
    }

    if (dto.model !== undefined) {
      agent.model = dto.model;
    }

    return agent;
  }

  // 6. 删除 Agent
  remove(
    user: CurrentUser,
    id: number,
  ) {
    const agent = this.findOne(id);

    const ability =
      this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Delete, agent)) {
      throw new ForbiddenException(
        '没有删除该 Agent 的权限',
      );
    }

    const index = this.agents.findIndex(
      (item) => item.id === id,
    );

    this.agents.splice(index, 1);

    return {
      message: 'Agent 删除成功',
      id,
    };
  }

  // 7. 执行 Agent
  async run(
    user: CurrentUser,
    id: number,
  ) {
    const agent = this.findOne(id);

    const ability =
      this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Execute, agent)) {
      throw new ForbiddenException(
        '没有执行该 Agent 的权限',
      );
    }

    if (agent.status === 'running') {
      throw new ForbiddenException(
        'Agent 正在运行中',
      );
    }

    agent.status = 'running';

    try {
      // 模拟 AI Agent 执行
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });

      return {
        agentId: agent.id,
        name: agent.name,
        result: 'AI Agent 已完成任务',
      };
    } finally {
      agent.status = 'idle';
    }
  }
}
