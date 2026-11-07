import { NestFactory } from '@nestjs/core';

import {
  Logger,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      bufferLogs: true,
    },
  );

  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      whitelist: true,

      forbidNonWhitelisted: true,
    }),
  );

  // 启用优雅退出钩子
  app.enableShutdownHooks();

  const port = Number(
    process.env.PORT ?? 3000,
  );

  await app.listen(
    port,
    '0.0.0.0',
  );

  logger.log(
    `AI Research API listening on ${port}`,
  );
}

void bootstrap();
