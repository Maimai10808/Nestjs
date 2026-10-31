import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.ordersService.createOrder(
      productId,
      quantity,
    );
  }
}
