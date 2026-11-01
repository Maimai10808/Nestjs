import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

import { ModelsModule } from '../models/models.module.js';

@Module({
  imports: [ModelsModule],

  controllers: [AgentsController],

  providers: [AgentsService],
})
export class AgentsModule {}
