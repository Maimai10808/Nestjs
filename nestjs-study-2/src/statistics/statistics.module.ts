import { Module } from '@nestjs/common';

import { ProductsModule } from '../products/products.module.js';
import { StatisticsService } from './statistics.service.js';

@Module({
  imports: [ProductsModule],

  providers: [StatisticsService],

  exports: [StatisticsService],
})
export class StatisticsModule {}
