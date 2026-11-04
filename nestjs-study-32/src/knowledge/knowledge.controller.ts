import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { KnowledgeService } from './knowledge.service.js';

import { UploadMetadataDto } from './dto/upload-metadata.dto.js';

@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
  ) {}

  // 上传单个知识库文件
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: UploadMetadataDto,
  ) {
    return this.knowledgeService.saveFile(
      file,
      metadata,
    );
  }

  // 查询全部文件
  @Get('files')
  findAll() {
    return this.knowledgeService.findAll();
  }

  // 查询指定文件
  @Get('files/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.knowledgeService.findOne(id);
  }

  // 删除文件
  @Delete('files/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.knowledgeService.remove(id);
  }
}
