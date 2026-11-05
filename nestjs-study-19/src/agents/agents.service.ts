import { UsersService } from '../users/users.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity.js';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly usersService: UsersService,
  ) {}

  findAll(): Promise<Agent[]> {
    return this.agentRepository.find({ relations: { user: true } });
  }

  async findOne(id: number): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: { user: true, tasks: true },
    });
    if (!agent) throw new NotFoundException('Agent 不存在');
    return agent;
  }

  async assertExists(id: number): Promise<void> {
    if (!(await this.agentRepository.existsBy({ id }))) {
      throw new NotFoundException('Agent 不存在');
    }
  }

  async create(
    name: string,
    description: string,
    model: string,
    userId: number,
  ): Promise<Agent> {
    await this.usersService.assertExists(userId);
    return this.agentRepository.save(
      this.agentRepository.create({ name, description, model, userId }),
    );
  }

  async update(
    id: number,
    data: Partial<Pick<Agent, 'name' | 'description' | 'model' | 'enabled'>>,
  ): Promise<Agent> {
    const patch: Partial<
      Pick<Agent, 'name' | 'description' | 'model' | 'enabled'>
    > = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.description !== undefined) patch.description = data.description;
    if (data.model !== undefined) patch.model = data.model;
    if (data.enabled !== undefined) patch.enabled = data.enabled;
    // 只写标量列，避免 save 陈旧的 tasks 关系图触发 ORM 孤儿处理。
    if (Object.keys(patch).length > 0) {
      const result = await this.agentRepository.update(id, patch);
      if (!result.affected) throw new NotFoundException('Agent 不存在');
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.agentRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Agent 不存在');
  }
}
