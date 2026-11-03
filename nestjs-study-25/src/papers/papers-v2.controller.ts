import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { PapersService } from './papers.service.js';
import { GeneratePaperV2Dto } from './dto/generate-paper-v2.dto.js';

@Controller({
  path: 'papers',
  version: '2',
})
export class PapersV2Controller {
  constructor(
    private readonly papersService: PapersService,
  ) {}

  // V2：创建异步论文生成任务
  @Post('generate')
  generate(
    @Body() dto: GeneratePaperV2Dto,
  ) {
    return this.papersService.generateV2(dto);
  }

  // V2：查询论文生成任务
  @Get('tasks/:id')
  findTask(
    @Param('id') taskId: string,
  ) {
    return this.papersService.findTask(taskId);
  }
}
