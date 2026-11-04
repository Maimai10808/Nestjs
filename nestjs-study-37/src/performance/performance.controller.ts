import {
  Controller,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import type {
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import { HttpAdapterHost } from '@nestjs/core';

import { PerformanceService } from './performance.service.js';

@Controller('performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  // 1. 小型 JSON
  @Get('json')
  getJson() {
    return this.performanceService.getSmallJson();
  }

  // 2. 大型 JSON
  @Get('large')
  getLargeJson() {
    return this.performanceService.getLargeJson();
  }

  // 3. 当前 HTTP 平台
  @Get('info')
  getInfo() {
    const adapter =
      this.adapterHost.httpAdapter.getType();

    return this.performanceService.getInfo(adapter);
  }

  // 4. Fastify Request 演示
  @Get('request')
  getRequest(
    @Req() request: FastifyRequest,
  ) {
    return {
      method: request.method,
      url: request.url,
      userAgent:
        request.headers['user-agent'] ?? null,
    };
  }

  // 5. Fastify Reply 演示
  @Get('reply')
  getReply(
    @Res() reply: FastifyReply,
  ) {
    return reply
      .code(200)
      .header('X-AI-Platform', 'Fastify')
      .send({
        message: 'Fastify Reply Example',
      });
  }
}
