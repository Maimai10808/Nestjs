import { Module } from '@nestjs/common';
import { KnowledgeModule } from './knowledge/knowledge.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [KnowledgeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
