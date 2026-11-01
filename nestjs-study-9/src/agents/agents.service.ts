import {
  Inject,
  Injectable,
} from '@nestjs/common';

import type { RedisClientType } from 'redis';

import { REDIS_CLIENT } from '../redis/redis.tokens.js';

@Injectable()
export class AgentsService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
  ) {
    console.log('AgentsService 创建成功');
  }

  async createTask(taskId: string) {
    await this.redis.set(
      `agent:task:${taskId}`,
      'pending',
    );

    return {
      taskId,
      status: 'pending',
    };
  }

  async getTask(taskId: string) {
    const status = await this.redis.get(
      `agent:task:${taskId}`,
    );

    return {
      taskId,
      status,
    };
  }
}
