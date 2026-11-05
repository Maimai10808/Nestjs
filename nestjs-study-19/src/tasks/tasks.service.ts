import { AgentsService } from '../agents/agents.service.js';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  AgentTask,
  AgentTaskStatus,
} from './entities/agent-task.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(AgentTask)
    private readonly taskRepository: Repository<AgentTask>,
    private readonly agentsService: AgentsService,
  ) {}

  // 查询所有任务
  findAll(): Promise<AgentTask[]> {
    return this.taskRepository.find({
      relations: {
        agent: true,
      },
    });
  }

  // 查询单个任务
  async findOne(id: number): Promise<AgentTask> {
    const task = await this.taskRepository.findOne({
      where: { id },

      relations: {
        agent: true,
      },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return task;
  }

  // 创建任务
  async create(
    agentId: number,
    input: string,
  ): Promise<AgentTask> {
    await this.agentsService.assertExists(agentId);
    const task = this.taskRepository.create({
      agentId,
      input,
      status: AgentTaskStatus.PENDING,
      output: null,
    });

    return this.taskRepository.save(task);
  }

  // 更新任务状态
  async updateStatus(
    id: number,
    status: AgentTaskStatus,
    output?: string,
  ): Promise<AgentTask> {
    const task = await this.findOne(id);

    task.status = status;

    if (output !== undefined) {
      task.output = output;
    }

    return this.taskRepository.save(task);
  }

  // 删除任务
  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('任务不存在');
    }
  }
}
