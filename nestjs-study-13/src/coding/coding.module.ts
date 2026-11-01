import { Module } from '@nestjs/common';

import { CodingService } from './coding.service.js';

@Module({
  providers: [CodingService],
  exports: [CodingService],
})
export class CodingModule {}
