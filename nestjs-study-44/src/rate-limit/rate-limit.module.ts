import { Module } from '@nestjs/common';

import { RateLimitController } from './rate-limit.controller.js';

@Module({
  controllers: [
    RateLimitController,
  ],
})
export class RateLimitModule {}
