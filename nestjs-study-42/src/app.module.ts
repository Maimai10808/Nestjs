import { Module } from '@nestjs/common';

import { ReportsModule } from './reports/reports.module.js';

import { SecurityModule } from './security/security.module.js';

import { HealthModule } from './health/health.module.js';

import { HomeController } from './home.controller.js';

@Module({
  imports: [
    ReportsModule,
    SecurityModule,
    HealthModule,
    HomeController,
  ],
})
export class AppModule {}
