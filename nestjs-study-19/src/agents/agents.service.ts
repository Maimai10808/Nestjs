import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Agent } from './entities/agent.entity.js';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) {}

  // 查询全部 Agent
  findAll(): Promise<Agent[]> {
    return this.agentRepository.find({
      relations: {
        user: true,
      },
    });
  }

  // 查询指定 Agent
  async findOne(id: number): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: {
        user: true,
        tasks: true,
      },
    });

    if (!agent) {
      throw new NotFoundException('Agent 不
