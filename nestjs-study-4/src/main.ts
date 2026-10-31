import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // 删除 DTO 中未声明验证规则的额外字段
      whitelist: true,

      // 遇到额外字段直接报错，而不是删除
      forbidNonWhitelisted: true,

      // 根据 DTO 元数据执行支持的类型转换
      transform: true,

      // 返回详细验证错误
      disableErrorMessages: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
