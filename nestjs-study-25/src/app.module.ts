import { Module } from '@nestjs/common';

import { PapersModule } from './papers/papers.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    PapersModule,
    HealthModule,
  ],
})
export class AppModule {}
