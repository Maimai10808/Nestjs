import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  mkdir,
  writeFile,
  unlink,
} from 'node:fs/promises';

import { randomUUID } from 'node:crypto';

import { extname, join } from 'node:path';

import type { KnowledgeFile } from './knowledge.interface.js';

import type { UploadMetadataDto } from './dto/upload-metadata.dto.js';

@Injectable()
export class KnowledgeService {
  private readonly files: KnowledgeFile[] = [];

  private nextId = 1;

  private readonly uploadDir = join(
    process.cwd(),
    'uploads',
  );

  // 保存单个文件
  async saveFile(
    file: Express.Multer.File,
    metadata: UploadMetadataDto,
  ): Promise<KnowledgeFile> {
    await mkdir(this.uploadDir, {
      recursive: true,
    });

    const extension = extname(
      file.originalname,
    ).toLowerCase();

    const storedName = `${randomUUID()}${extension}`;

    const filePath = join(
      this.uploadDir,
      storedName,
    );

    await writeFile(
      filePath,
      file.buffer,
      { flag: 'wx' },
    );

    const knowledgeFile: KnowledgeFile = {
      id: this.nextId++,
      agentId: metadata.agentId,
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      description: metadata.description,
      uploadedAt: new Date().toISOString(),
    };

    this.files.push(knowledgeFile);

    return knowledgeFile;
  }

  // 查询全部文件
  findAll(): KnowledgeFile[] {
    return this.files;
  }

  // 查询单个文件
  findOne(id: number): KnowledgeFile {
    const file = this.files.find(
      (item) => item.id === id,
    );

    if (!file) {
      throw new NotFoundException(
        '知识库文件不存在',
      );
    }

    return file;
  }

  // 删除文件
  async remove(id: number): Promise<void> {
    const file = this.findOne(id);

    await unlink(file.path);

    const index = this.files.findIndex(
      (item) => item.id === id,
    );

    this.files.splice(index, 1);
  }
}
