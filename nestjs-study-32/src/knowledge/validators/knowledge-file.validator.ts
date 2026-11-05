import type {} from 'multer';
import { FileValidator } from '@nestjs/common';
import { extname } from 'node:path';

interface KnowledgeFileValidatorOptions {
  allowedExtensions: string[];
}

export class KnowledgeFileValidator extends FileValidator<KnowledgeFileValidatorOptions> {
  isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    const extension = extname(file.originalname).toLowerCase();

    if (!this.validationOptions.allowedExtensions.includes(extension)) {
      return false;
    }

    // PDF 文件头检查
    if (extension === '.pdf') {
      return (
        file.buffer.length >= 5 &&
        file.buffer.subarray(0, 5).toString() === '%PDF-'
      );
    }

    // 文本必须是非空 UTF-8，拒绝伪装为 txt/md 的二进制内容。
    if (file.buffer.length === 0 || file.buffer.includes(0)) return false;
    try {
      new TextDecoder('utf-8', { fatal: true }).decode(file.buffer);
      return true;
    } catch {
      return false;
    }
  }

  buildErrorMessage(): string {
    return '不支持的知识库文件格式';
  }
}
