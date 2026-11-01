import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { RedisModule } from '../redis/redis.module.js';

@Module({
  imports: [RedisModule],

  controllers: [AgentsController],

  providers: [AgentsService],
})
export class AgentsModule {}
