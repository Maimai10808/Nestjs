import { Module } from '@nestjs/common';

import { PapersService } from './papers.service.js';

import { PapersV1Controller } from './papers-v1.controller.js';
import { PapersV2Controller } from './papers-v2.controller.js';
import { PapersCommonController } from './papers-common.controller.js';

@Module({
  controllers: [
    PapersV1Controller,
    PapersV2Controller,
    PapersCommonController,
  ],

  providers: [
    PapersService,
  ],

  exports: [
    PapersService,
  ],
})
export class PapersModule {}
