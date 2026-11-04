import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // 静态资源目录
  app.useStaticAssets(
    join(process.cwd(), 'public'),
  );

  // 模板目录
  app.setBaseViewsDir(
    join(process.cwd(), 'views'),
  );

  // 模板引擎
  app.setViewEngine('hbs');

  // 全局 Layout
  app.setLocal('layout', 'layouts/app');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
