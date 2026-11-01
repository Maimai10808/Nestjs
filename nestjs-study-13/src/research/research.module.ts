import { Module } from '@nestjs/common';

import { ResearchService } from './research.service.js';

@Module({
  providers: [ResearchService],
  exports: [ResearchService],
})
export class ResearchModule {}
