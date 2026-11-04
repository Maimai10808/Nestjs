import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { AiService } from './ai.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
