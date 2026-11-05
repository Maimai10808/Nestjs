import { Module } from '@nestjs/common';
import { AgentsModule } from '../agents/agents.module.js';
import { StreamingController } from './streaming.controller.js';
import { StreamingService } from './streaming.service.js';

@Module({
  imports: [AgentsModule],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
