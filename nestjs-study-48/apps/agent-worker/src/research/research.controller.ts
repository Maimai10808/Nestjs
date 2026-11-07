import { Controller } from '@nestjs/common';

import {
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import {
  RESEARCH_PATTERNS,
  type ResearchRequest,
  type ResearchSubmittedEvent,
} from '@app/contracts';

import { ResearchService } from './research.service.js';

@Controller()
export class ResearchController {
  constructor(
    private readonly researchService:
      ResearchService,
  ) {}

  // 请求—响应
  @MessagePattern(
    RESEARCH_PATTERNS.ANALYZE,
  )
  analyze(
    @Payload() data: ResearchRequest,
  ) {
    return this.researchService.analyze(
      data,
    );
  }

  // 查询模型
  @MessagePattern(
    RESEARCH_PATTERNS.MODELS,
  )
  getModels() {
    return this.researchService.getModels();
  }

  // 模拟慢任务
  @MessagePattern(
    RESEARCH_PATTERNS.SLOW,
  )
  slow() {
    return this.researchService.slowTask();
  }

  // 事件模式
  @EventPattern(
    RESEARCH_PATTERNS.SUBMITTED,
  )
  handleSubmitted(
    @Payload()
    event: ResearchSubmittedEvent,
  ) {
    this.researchService.handleSubmitted(
      event,
    );
  }
}
