import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
