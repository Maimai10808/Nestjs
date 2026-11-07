import { IoAdapter } from '@nestjs/platform-socket.io';

import type {
  INestApplicationContext,
} from '@nestjs/common';

import {
  createAdapter,
} from '@socket.io/redis-adapter';

import {
  createClient,
  type RedisClientType,
} from 'redis';

import type {
  Server,
  ServerOptions,
} from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?:
    ReturnType<typeof createAdapter>;

  private pubClient?: RedisClientType;

  private subClient?: RedisClientType;

  constructor(
    app: INestApplicationContext,
  ) {
    super(app);
  }

  async connectToRedis(
    redisUrl: string,
  ): Promise<void> {
    const pubClient = createClient({
      url: redisUrl,
    });

    const subClient = pubClient.duplicate();

    try {
      await Promise.all([
        pubClient.connect(),
        subClient.connect(),
      ]);
    } catch (error) {
      await Promise.allSettled([
        pubClient.quit(),
        subClient.quit(),
      ]);

      throw error;
    }

    this.pubClient = pubClient;
    this.subClient = subClient;

    this.adapterConstructor = createAdapter(
      pubClient,
      subClient,
    );
  }

  override createIOServer(
    port: number,
    options?: ServerOptions,
  ): Server {
    if (!this.adapterConstructor) {
      throw new Error(
        'Redis Adapter 尚未初始化',
      );
    }

    const server = super.createIOServer(
      port,
      options,
    ) as Server;

    server.adapter(
      this.adapterConstructor,
    );

    return server;
  }

  async closeRedis(): Promise<void> {
    await Promise.allSettled([
      this.pubClient?.quit(),
      this.subClient?.quit(),
    ]);
  }
}
