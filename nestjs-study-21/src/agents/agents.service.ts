import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Agent } from './interfaces/agent.interface.js';

import type { CreateAgentDto } from './dto/create-agent.dto.js';
import type { UpdateAgentDto } from './dto/update-agent.dto.js';
import type { QueryAgentsDto } from './dto/query-agents.dto.js';
import type { RunAgentDto } from './dto/run-agent.dto.js';

@Injectable()
export class AgentsService {
  // 使用内存数组模拟数据库
  private readonly agents: Agent[] = [];

  // 模拟自增 ID
  private nextId = 1;

  // ==============================
  // 创建 Agent
  // ==============================

  create(dto: CreateAgentDto): Agent {
    const now = new Date();

    const agent: Agent = {
      id: this.nextId++,

      name: dto.name,

      description: dto.description ?? '',

      model: dto.model,

      temperature: dto.temperature,

      maxSteps: dto.maxSteps,

      tools: [...dto.tools],

      enabled: dto.enabled ?? true,

      createdAt: now,

      updatedAt: now,
    };

    this.agents.push(agent);

    return agent;
  }

  // ==============================
  // 查询 Agent 列表
  // ==============================

  findAll(query: QueryAgentsDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword,
      enabled,
    } = query;

    let result = [...this.agents];

    // 根据名称搜索
    if (keyword) {
      result = result.filter((agent) =>
        agent.name
          .toLowerCase()
          .includes(keyword.toLowerCase()),
      );
    }

    // 根据启用状态筛选
    if (enabled !== undefined) {
      result = result.filter(
        (agent) => agent.enabled === enabled,
      );
    }

    const total = result.length;

    // 分页
    const start = (page - 1) * pageSize;

    const data = result.slice(
      start,
      start + pageSize,
    );

    return {
      data,

      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // ==============================
  // 查询单个 Agent
  // ==============================

  findOne(id: number): Agent {
    const agent = this.agents.find(
      (item) => item.id === id,
    );

    if (!agent) {
      throw new NotFoundException(
        `Agent ${id} 不存在`,
      );
    }

    return agent;
  }

  // ==============================
  // 更新 Agent
  // ==============================

  update(
    id: number,
    dto: UpdateAgentDto,
  ): Agent {
    const agent = this.findOne(id);

    Object.assign(agent, dto, {
      updatedAt: new Date(),
    });

    return agent;
  }

  // ==============================
  // 删除 Agent
  // ==============================

  remove(id: number) {
    this.findOne(id);

    const index = this.agents.findIndex(
      (agent) => agent.id === id,
    );

    this.agents.splice(index, 1);

    return {
      message: `Agent ${id} 删除成功`,
    };
  }

  // ==============================
  // 批量创建 Agent
  // ==============================

  createBulk(dtos: CreateAgentDto[]): Agent[] {
    return dtos.map((dto) => this.create(dto));
  }

  // ==============================
  // 根据多个 ID 查询 Agent
  // ==============================

  findByIds(ids: number[]): Agent[] {
    return this.agents.filter((agent) =>
      ids.includes(agent.id),
    );
  }

  // ==============================
  // 模拟执行 Agent
  // ==============================

  run(id: number, dto: RunAgentDto) {
    const agent = this.findOne(id);

    if (!agent.enabled) {
      return {
        success: false,
        message: 'Agent 当前未启用',
      };
    }

    // 这里只模拟 Agent 执行
    // 不调用真实 AI 模型

    return {
      success: true,

      agentId: agent.id,

      agentName: agent.name,

      model: agent.model,

      input: dto.input,

      options: {
        stream: dto.options?.stream ?? false,

        maxTokens: dto.options?.maxTokens ?? 4096,
      },

      tags: dto.tags ?? [],

      output: `模拟执行成功：${dto.input}`,

      executedAt: new Date(),
    };
  }
}
