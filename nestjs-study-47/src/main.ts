import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

import {
  RedisIoAdapter,
} from './adapters/redis-io.adapter.js';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  const redisAdapter = new RedisIoAdapter(
    app,
  );

  await redisAdapter.connectToRedis(
    process.env.REDIS_URL ??
      'redis://127.0.0.1:6379',
  );

  app.useWebSocketAdapter(
    redisAdapter,
  );

  const port = Number(
    process.env.PORT ?? 3000,
  );

  app.enableShutdownHooks();

  await app.listen(port);

  console.log(
    `NestJS running on port ${port}`,
  );
}

void bootstrap();
