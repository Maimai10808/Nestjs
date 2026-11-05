import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppCacheModule } from './cache/cache.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { UsersModule } from './users/users.module.js';
import { ModelsModule } from './models/models.module.js';
import { CacheAdminModule } from './cache-admin/cache-admin.module.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    AppCacheModule,
    AgentsModule,
    UsersModule,
    ModelsModule,
    CacheAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
