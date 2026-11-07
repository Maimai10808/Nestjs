import {
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  mkdir,
  writeFile,
} from 'node:fs/promises';

import { join } from 'node:path';

import { randomUUID } from 'node:crypto';

@Injectable()
export class ReportStorageService {
  private readonly logger = new Logger(
    ReportStorageService.name,
  );

  async saveMarkdown(
    content: string,
  ): Promise<string> {
    const reportsDir = join(
      process.cwd(),
      'reports',
    );

    await mkdir(reportsDir, {
      recursive: true,
    });

    const filename = `research-${randomUUID()}.md`;

    const filePath = join(
      reportsDir,
      filename,
    );

    await writeFile(
      filePath,
      content,
      'utf8',
    );

    this.logger.log(
      `研究报告已保存：${filePath}`,
    );

    return filePath;
  }
}
