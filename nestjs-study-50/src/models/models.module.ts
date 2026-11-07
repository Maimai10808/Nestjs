import { Module } from '@nestjs/common';

import { ModelsService } from './models.service.js';

@Module({
  providers: [
    ModelsService,
  ],

  exports: [
    ModelsService,
  ],
})
export class ModelsModule {}
