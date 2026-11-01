import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用系统信号触发的关闭钩子
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);

  console.log('AI Agent Server 已启动');
}

void bootstrap();
