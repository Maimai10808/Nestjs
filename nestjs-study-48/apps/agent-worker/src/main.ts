import { NestFactory } from '@nestjs/core';

import {
  Transport,
  type MicroserviceOptions,
} from '@nestjs/microservices';

import { AppModule } from './agent-worker.module.js';

async function bootstrap() {
  const app =
    await NestFactory.createMicroservice<
      MicroserviceOptions
    >(
      AppModule,
      {
        transport: Transport.TCP,

        options: {
          host: '127.0.0.1',

          port: 4001,
        },
      },
    );

  await app.listen();

  console.log(
    'AI Agent Worker listening on TCP 4001',
  );
}

void bootstrap();
