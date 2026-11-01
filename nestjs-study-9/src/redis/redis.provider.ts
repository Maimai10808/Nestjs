import type { Provider } from '@nestjs/common';
import { createClient } from 'redis';

import { REDIS_CLIENT } from './redis.tokens.js';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,

  useFactory: async () => {
    console.log('开始连接 Redis...');

    const client = createClient({
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: false,
      },
    });

    client.on('error', (error) => {
      console.error('Redis 错误：', error);
    });

    try {
      // 关键：等待 Redis 连接完成
      await client.connect();

      console.log('Redis 连接成功');

      // 返回已经连接的客户端
      return client;
    } catch (error) {
      client.destroy();
      throw error;
    }
  },
};
