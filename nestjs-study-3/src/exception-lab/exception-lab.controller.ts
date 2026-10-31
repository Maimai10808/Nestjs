import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';

import { ExceptionLabService } from './exception-lab.service.js';

import { AgentQuotaException } from './exceptions/agent-quota.exception.js';

import { HttpExceptionFilter } from './filters/http-exception.filter.js';

@Controller('exception-lab')
export class ExceptionLabController {
  constructor(
    private readonly exceptionLabService: ExceptionLabService,
  ) {}

  // 1. 正常请求
  @Get('agents')
  findAll() {
    return this.exceptionLabService.findAll();
  }

  // 2. 标准异常：404
  @Get('agents/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exceptionLabService.findOne(id);
  }

  // 3. 标准异常：400 / 409
  @Post('agents')
  create(@Body('name') name: string) {
    return this.exceptionLabService.create(name);
  }

  // 4. 标准异常：503
  @Get('llm-error')
  callLLM() {
    return this.exceptionLabService.callLLM();
  }

  // 5. 未知异常：500
  @Get('crash')
  simulateCrash() {
    return this.exceptionLabService.simulateCrash();
  }

  // 6. 手动创建 HttpException
  @Get('custom-http')
  customHttpException() {
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: '当前用户没有访问权限',
        errorCode: 'ACCESS_DENIED',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  // 7. 自定义业务异常
  @Get('quota')
  quotaError() {
    throw new AgentQuotaException(100, 150);
  }

  // 8. 方法级异常过滤器
  @Get('filtered')
  @UseFilters(HttpExceptionFilter)
  filteredError() {
    throw new HttpException(
      '这是由自定义过滤器处理的异常',
      HttpStatus.BAD_REQUEST,
    );
  }
}
