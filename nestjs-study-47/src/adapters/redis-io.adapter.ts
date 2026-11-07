import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';

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
  private readonly redisLogger = new Logger(RedisIoAdapter.name);
  private adapterConstructor?:
    ReturnType<typeof createAdapter>;

  private pubClient?: RedisClientType;

  private subClient?: RedisClientType;
  private closing = false;

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
      socket: { connectTimeout: 5000 },
    });

    const subClient = pubClient.duplicate();

    for (const [name, client] of [['publisher', pubClient], ['subscriber', subClient]] as const) {
      client.on('error', (error: Error) => {
        this.redisLogger.error(`Redis ${name}: ${error.message}`);
      });
    }

    try {
      await Promise.all([
        pubClient.connect(),
        subClient.connect(),
      ]);
    } catch (error) {
      for (const client of [pubClient, subClient]) {
        if (client.isOpen) client.destroy();
      }

      throw error;
    }

    this.pubClient = pubClient;
    this.subClient = subClient;

    // redis-adapter 8.3 不等待这些命令；观察拒绝，同时保留原 Promise 的结果。
    const pSubscribe = subClient.pSubscribe.bind(subClient);
    subClient.pSubscribe = (...args) => this.observeCommand(pSubscribe(...args));
    const subscribe = subClient.subscribe.bind(subClient);
    subClient.subscribe = (...args) => this.observeCommand(subscribe(...args));
    const pUnsubscribe = subClient.pUnsubscribe.bind(subClient);
    subClient.pUnsubscribe = (...args) => this.observeCommand(pUnsubscribe(...args));
    const unsubscribe = subClient.unsubscribe.bind(subClient);
    subClient.unsubscribe = (...args) => this.observeCommand(unsubscribe(...args));

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

  override dispose(): Promise<void> {
    return this.closeRedis();
  }

  closeRedis(): Promise<void> {
    this.closing = true;
    // Pub/sub 不保存业务写入；销毁连接不需要等待失联服务回复 QUIT。
    for (const client of [this.pubClient, this.subClient]) {
      if (client?.isOpen) client.destroy();
    }
    this.pubClient = undefined;
    this.subClient = undefined;
    return Promise.resolve();
  }

  private observeCommand<T>(pending: Promise<T>): Promise<T> {
    void pending.catch((error: unknown) => {
      if (!this.closing) {
        this.redisLogger.error(error instanceof Error ? error.message : String(error));
      }
    });
    return pending;
  }
}
