import { Module } from '@nestjs/common';

import {
  OrdersController,
} from './orders.controller.js';

import {
  OrdersService,
} from './orders.service.js';

import {
  ProductsModule,
} from '../products/products.module.js';

import {
  PaymentsModule,
} from '../payments/payments.module.js';

import {
  NotificationsModule,
} from '../notifications/notifications.module.js';

@Module({
  imports: [
    ProductsModule,
    PaymentsModule,
    NotificationsModule,
  ],

  controllers: [
    OrdersController,
  ],

  providers: [
    OrdersService,
  ],
})
export class OrdersModule {}
