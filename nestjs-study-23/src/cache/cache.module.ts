import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { CacheInvalidationService } from './cache-invalidation.service.js';
import { CacheStatsService } from './cache-stats.service.js';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60_000,
    }),
  ],
  providers: [
    CacheInvalidationService,
    CacheStatsService,
  ],
  exports: [
    CacheModule,
    CacheInvalidationService,
    CacheStatsService,
  ],
})
export class AppCacheModule {}
