import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [AiModule],
})
export class AppModule {}
