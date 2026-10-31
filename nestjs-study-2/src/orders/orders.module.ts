import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

import { ProductsModule } from '../products/products.module.js';
import { PaymentsModule } from '../payments/payments.module.js';

@Module({
  imports: [
    ProductsModule,
    PaymentsModule,
  ],

  controllers: [OrdersController],

  providers: [OrdersService],

  exports: [OrdersService],
})
export class OrdersModule {}
