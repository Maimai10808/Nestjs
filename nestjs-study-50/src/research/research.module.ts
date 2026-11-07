import { Module } from '@nestjs/common';

import { ModelsModule } from '../models/models.module.js';

import { ResearchService } from './research.service.js';

import { ReportStorageService } from './report-storage.service.js';

@Module({
  imports: [
    ModelsModule,
  ],

  providers: [
    ResearchService,
    ReportStorageService,
  ],

  exports: [
    ResearchService,
  ],
})
export class ResearchModule {}
