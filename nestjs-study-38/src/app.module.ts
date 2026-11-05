import { Module } from '@nestjs/common';
import { StreamingModule } from './streaming/streaming.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [StreamingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
