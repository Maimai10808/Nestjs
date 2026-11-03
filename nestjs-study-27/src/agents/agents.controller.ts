import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';

import { RunAgentDto } from './dto/run-agent.dto.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
  ) {}

  // 1. 提交 AI Agent 任务
  @Post('run')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  runAgent(@Body() dto: RunAgentDto) {
    return this.agentsService.runAgent(dto);
  }

  // 2. 查询队列统计
  @Get('queue/stats')
  getQueueStats() {
    return this.agentsService.getQueueStats();
  }

  // 3. 查询任务状态
  @Get('jobs/:id')
  getJob(@Param('id') id: string) {
    return this.agentsService.getJob(id);
  }

  // 4. 查询任务结果
  @Get('jobs/:id/result')
  getJobResult(@Param('id') id: string) {
    return this.agentsService.getJobResult(id);
  }

  // 5. 手动重试失败任务
  @Post('jobs/:id/retry')
  retryJob(@Param('id') id: string) {
    return this.agentsService.retryJob(id);
  }

  // 6. 暂停队列
  @Post('queue/pause')
  pauseQueue() {
    return this.agentsService.pauseQueue();
  }

  // 7. 恢复队列
  @Post('queue/resume')
  resumeQueue() {
    return this.agentsService.resumeQueue();
  }
}
