import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import session from 'express-session';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module.js';

import {
  createCsrfProtection,
} from './security/csrf.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendOrigin =
    process.env.FRONTEND_ORIGIN ??
    'http://localhost:8888';

  const sessionSecret =
    process.env.SESSION_SECRET;

  const csrfSecret =
    process.env.CSRF_SECRET;

  if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error(
      'SESSION_SECRET 配置无效',
    );
  }

  if (!csrfSecret || csrfSecret.length < 32) {
    throw new Error(
      'CSRF_SECRET 配置无效',
    );
  }

  // 1. 启用 CORS
  app.enableCors({
    origin: frontendOrigin,

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'X-CSRF-Token',
    ],
  });

  // 2. 解析 Cookie
  app.use(cookieParser());

  // 3. 注册 Session
  app.use(
    session({
      name: 'agent.sid',

      secret: sessionSecret,

      resave: false,

      saveUninitialized: false,

      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/',
      },
    }),
  );

  // 4. 注册 CSRF 防护
  const {
    doubleCsrfProtection,
  } = createCsrfProtection(csrfSecret);

  app.use(doubleCsrfProtection);

  // 5. 全局 DTO 验证
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(
    Number(process.env.PORT ?? 3000),
  );
}

void bootstrap();
