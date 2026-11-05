import type {} from 'multer';
import { Injectable, NotFoundException } from '@nestjs/common';

import { mkdir, open, unlink } from 'node:fs/promises';

import { randomUUID } from 'node:crypto';

import { extname, join } from 'node:path';

import type { KnowledgeFile } from './knowledge.interface.js';

import type { UploadMetadataDto } from './dto/upload-metadata.dto.js';

@Injectable()
export class KnowledgeService {
  private readonly files: KnowledgeFile[] = [];

  private nextId = 1;

  private readonly uploadDir = join(process.cwd(), 'uploads');

  // 保存单个文件
  async saveFile(
    file: Express.Multer.File,
    metadata: UploadMetadataDto,
  ): Promise<KnowledgeFile> {
    await mkdir(this.uploadDir, {
      recursive: true,
    });

    const extension = extname(file.originalname).toLowerCase();

    const storedName = `${randomUUID()}${extension}`;

    const filePath = join(this.uploadDir, storedName);

    // open 成功后才拥有这个文件；EEXIST 时不能删除已有文件。
    const handle = await open(filePath, 'wx');
    try {
      await handle.writeFile(file.buffer);
    } catch (error) {
      await handle.close();
      await unlink(filePath);
      throw error;
    }
    await handle.close();

    const knowledgeFile: KnowledgeFile = {
      id: this.nextId++,
      agentId: metadata.agentId,
      originalName: file.originalname,
      storedName,
      // Content-Type 来自客户端，存储使用已验证扩展名对应的类型。
      mimeType:
        extension === '.pdf'
          ? 'application/pdf'
          : extension === '.md'
            ? 'text/markdown'
            : 'text/plain',
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
    const file = this.files.find((item) => item.id === id);

    if (!file) {
      throw new NotFoundException('知识库文件不存在');
    }

    return file;
  }

  // 删除文件
  async remove(id: number): Promise<void> {
    const file = this.findOne(id);

    await unlink(file.path);

    const index = this.files.findIndex((item) => item.id === id);

    this.files.splice(index, 1);
  }
}
