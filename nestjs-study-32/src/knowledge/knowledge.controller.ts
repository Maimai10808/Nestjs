import type {} from 'multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { KnowledgeService } from './knowledge.service.js';

import { UploadMetadataDto } from './dto/upload-metadata.dto.js';
import { KnowledgeFileValidator } from './validators/knowledge-file.validator.js';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  // 上传单个知识库文件
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new KnowledgeFileValidator({
            allowedExtensions: ['.pdf', '.txt', '.md'],
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() metadata: UploadMetadataDto,
  ) {
    return this.knowledgeService.saveFile(file, metadata);
  }

  // 查询全部文件
  @Get('files')
  findAll() {
    return this.knowledgeService.findAll();
  }

  // 查询指定文件
  @Get('files/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.knowledgeService.findOne(id);
  }

  // 删除文件
  @Delete('files/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.knowledgeService.remove(id);
  }
}
