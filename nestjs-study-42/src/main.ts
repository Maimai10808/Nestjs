import { NestFactory } from '@nestjs/core';

import type {
  NestExpressApplication,
} from '@nestjs/platform-express';

import helmet from 'helmet';

import { join } from 'node:path';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  // 1. 优先注册 Helmet
  app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'"],

        styleSrc: ["'self'"],

        imgSrc: [
          "'self'",
          'data:',
        ],

        fontSrc: ["'self'"],

        connectSrc: ["'self'"],

        objectSrc: ["'none'"],

        frameAncestors: ["'none'"],

        baseUri: ["'self'"],

        formAction: ["'self'"],
      },
    },

    frameguard: {
      action: 'deny',
    },

    referrerPolicy: {
      policy: 'no-referrer',
    },
  }),
);

  // 2. 配置静态资源
  app.useStaticAssets(
    join(import.meta.dirname, 'public'),
  );

  // 3. 配置模板目录
  app.setBaseViewsDir(
    join(import.meta.dirname, 'views'),
  );

  // 4. 配置 Handlebars
  app.setViewEngine('hbs');

  // 5. 配置默认布局
  app.setLocal(
    'layout',
    'layouts/app',
  );

  // 6. 启动服务
  await app.listen(
    Number(process.env.PORT ?? 3000),
    '127.0.0.1',
  );
}

void bootstrap();
