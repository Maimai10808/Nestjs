import { Module } from '@nestjs/common';

import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [
    AiModule.register({
      provider: 'openai',
      timeout: 30000,
      maxRetries: 3,
    }),
  ],
})
export class AppModule {}
