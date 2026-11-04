import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ModelsController } from './models.controller.js';
import { ModelsService } from './models.service.js';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
