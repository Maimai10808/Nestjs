import {
  Module,
  Inject,
  Injectable,
  OnApplicationShutdown,
} from '@nestjs/common';

import { redisProvider } from './redis.provider.js';
import { REDIS_CLIENT } from './redis.tokens.js';

import type { RedisClientType } from 'redis';

@Injectable()
class RedisShutdownService implements OnApplicationShutdown {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
  ) {}

  async onApplicationShutdown() {
    if (this.redis.isOpen) {
      await this.redis.quit();
    }
  }
}

@Module({
  providers: [
    redisProvider,
    RedisShutdownService,
  ],

  exports: [REDIS_CLIENT],
})
export class RedisModule {}
