import {
  Logger,
} from '@nestjs/common';

import {
  NestFactory,
} from '@nestjs/core';

import {
  AppModule,
} from '../app.module.js';

import {
  ResearchService,
} from '../research/research.service.js';

import {
  KnowledgeService,
} from '../knowledge/knowledge.service.js';

async function bootstrap() {
  const app =
    await NestFactory.createApplicationContext(
      AppModule,
    );

  const logger = new Logger('AI-CLI');

  try {
    const [command, ...args] =
      process.argv.slice(2);

    switch (command) {
      case 'research': {
        const topic = args.join(' ').trim();

        if (!topic) {
          throw new Error(
            '请提供研究主题',
          );
        }

        const researchService =
          app.get(ResearchService);

        const filePath =
          await researchService.generateReport(
            topic,
          );

        logger.log(
          `报告生成成功：${filePath}`,
        );

        break;
      }

      case 'knowledge:build': {
        const knowledgeService =
          app.get(KnowledgeService);

        const result =
          await knowledgeService.buildIndex();

        logger.log(
          `知识库构建完成：${result.length} 个向量`,
        );

        break;
      }

      default: {
        throw new Error(
          '未知命令。支持：research、knowledge:build',
        );
      }
    }
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );

  process.exitCode = 1;
});
