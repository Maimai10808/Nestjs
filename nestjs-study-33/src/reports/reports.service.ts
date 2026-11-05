import {
  Injectable,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';

import {
  mkdir,
  open,
  writeFile,
  stat,
} from 'node:fs/promises';

import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import type { Report } from './report.interface.js';

@Injectable()
export class ReportsService {
  private readonly reports: Report[] = [];

  private nextId = 1;

  private readonly reportsDir = join(
    process.cwd(),
    'reports',
  );

  // 生成模拟 AI 研究报告
  async generateReport(): Promise<Report> {
    await mkdir(this.reportsDir, {
      recursive: true,
    });

    const title = 'LangGraph 技术研究报告';

    const paragraph = `
LangGraph 是一个用于构建有状态 AI Agent 工作流的框架。

在复杂 AI Agent 系统中，开发者通常需要管理多个执行节点、
工具调用、状态转换以及任务执行历史。

一个 Deep Research Agent 可能包含：

1. 用户问题分析
2. 搜索任务规划
3. 外部资料检索
4. 研究资料整理
5. AI 模型分析
6. 研究报告生成

这些节点可以通过状态图组织起来。
`;

    const content = Array.from(
      { length: 1000 },
      (_, index) => {
        return `## 第 ${index + 1} 章\n\n${paragraph}`;
      },
    ).join('\n\n');

    const filename = `${randomUUID()}.md`;

    const filePath = join(
      this.reportsDir,
      filename,
    );

    await writeFile(
      filePath,
      `# ${title}\n\n${content}`,
      {
        encoding: 'utf8',
        flag: 'wx',
      },
    );

    const fileStats = await stat(filePath);

    const report: Report = {
      id: this.nextId++,
      title,
      filename,
      mimeType: 'text/markdown',
      size: fileStats.size,
      path: filePath,
      createdAt: new Date().toISOString(),
    };

    this.reports.push(report);

    return report;
  }

  // 查询全部报告
  findAll(): Report[] {
    return this.reports;
  }

  // 查询指定报告
  findOne(id: number): Report {
    const report = this.reports.find(
      (item) => item.id === id,
    );

    if (!report) {
      throw new NotFoundException(
        '研究报告不存在',
      );
    }

    return report;
  }
  // 路径只来自服务端生成的记录，客户端只能提交报告 ID。
  async downloadReport(id: number): Promise<StreamableFile> {
    const report = this.findOne(id);
    let file: Awaited<ReturnType<typeof open>> | undefined;
    try {
      file = await open(report.path, 'r');
      const info = await file.stat();
      // 流结束、出错或客户端断开后，ReadStream 自动关闭文件句柄。
      return new StreamableFile(file.createReadStream(), {
        type: report.mimeType,
        disposition: `attachment; filename="${report.filename}"`,
        length: info.size,
      });
    } catch (error) {
      await file?.close();
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new NotFoundException('研究报告文件不存在，请重新生成');
      }
      throw error;
    }
  }

}
