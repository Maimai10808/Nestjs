import { Module } from '@nestjs/common';
import { PerformanceModule } from './performance/performance.module.js';
import { ModelsModule } from './models/models.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [AgentsModule, ModelsModule, PerformanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
