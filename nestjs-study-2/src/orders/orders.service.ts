import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import { ProductsService } from '../products/products.service.js';
import { PaymentsService } from '../payments/payments.service.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  createOrder(productId: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('商品数量必须为正整数');
    }

    // 1. 查询商品
    const product = this.productsService.findOne(productId);

    // 2. 计算金额
    const totalAmount = product.price * quantity;

    // 3. 创建支付记录
    const payment =
      this.paymentsService.createPayment(totalAmount);

    // 4. 返回订单
    return {
      orderId: randomUUID(),
      product,
      quantity,
      totalAmount,
      payment,
    };
  }
}
