import { NestFactory } from '@nestjs/core';

import compression from 'compression';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 注册 HTTP 响应压缩中间件
  app.use(compression());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
