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

    const extension = extname(
      file.originalname,
    ).toLowerCase();

    if (
      !this.validationOptions.allowedExtensions.includes(
        extension,
      )
    ) {
      return false;
    }

    // PDF 文件头检查
    if (extension === '.pdf') {
      return (
        file.buffer.length >= 5 &&
        file.buffer.subarray(0, 5).toString() ===
          '%PDF-'
      );
    }

    // 其他格式在本学习项目中按扩展名进行初步验证
    return true;
  }

  buildErrorMessage(): string {
    return '不支持的知识库文件格式';
  }
}
