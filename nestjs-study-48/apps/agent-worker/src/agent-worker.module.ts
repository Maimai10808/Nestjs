import { Module } from '@nestjs/common';

import { ResearchModule } from './research/research.module.js';

@Module({
  imports: [
    ResearchModule,
  ],
})
export class AppModule {}
