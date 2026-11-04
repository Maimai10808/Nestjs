import { Module } from '@nestjs/common';

import { HomeModule } from './home/home.module.js';

import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [
    ReportsModule,
    HomeModule,
  ],
})
export class AppModule {}
