import { Module } from '@nestjs/common';

import { HomeController } from './home.controller.js';

import { ReportsModule } from '../reports/reports.module.js';

@Module({
  imports: [
    ReportsModule,
  ],

  controllers: [
    HomeController,
  ],
})
export class HomeModule {}
