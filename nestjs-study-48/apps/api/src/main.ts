import { NestFactory } from '@nestjs/core';

import {
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      whitelist: true,

      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(
    Number(process.env.PORT ?? 3000),
    '127.0.0.1',
  );

  console.log(
    'AI API listening on HTTP 3000',
  );
}

void bootstrap();
