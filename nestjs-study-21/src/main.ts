import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // 自动转换 DTO 对象
      transform: true,

      // 删除未声明验证规则的字段
      whitelist: true,

      // 遇到额外字段直接报错
      forbidNonWhitelisted: true,

      // 禁止未知对象通过验证
      forbidUnknownValues: true,

      // 不跳过缺失字段的验证
      skipMissingProperties: false,

      // 显示详细验证错误
      disableErrorMessages: false,

      // 返回所有字段的验证错误
      stopAtFirstError: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
