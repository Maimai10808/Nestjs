import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
