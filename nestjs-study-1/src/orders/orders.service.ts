import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

import {
  ProductsService,
} from '../products/products.service.js';

import {
  PaymentsService,
} from '../payments/payments.service.js';

import {
  NotificationsService,
} from '../notifications/notifications.service.js';

export interface Order {
  id: string;
  productId: number;
  quantity: number;
  totalPrice: number;
  paymentId: string;
  status: 'paid';
}

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [];

  constructor(
    private readonly productsService: ProductsService,

    private readonly paymentsService: PaymentsService,

    private readonly notificationsService: NotificationsService,
  ) {}

  // 创建订单
  create(productId: number, quantity: number): Order {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('购买数量必须是正整数');
    }

    // 1. 调用 ProductsService 查询商品
    const product = this.productsService.findOne(productId);

    // 2. 检查库存
    if (product.stock < quantity) {
      throw new BadRequestException('商品库存不足');
    }

    // 3. 计算金额
    const totalPrice = product.price * quantity;

    // 4. 调用 PaymentsService 支付
    const payment = this.paymentsService.pay(totalPrice);

    // 5. 扣减库存
    this.productsService.decreaseStock(productId, quantity);

    // 6. 创建订单
    const order: Order = {
      id: randomUUID(),
      productId,
      quantity,
      totalPrice,
      paymentId: payment.paymentId,
      status: 'paid',
    };

    this.orders.push(order);

    // 7. 调用 NotificationsService
    this.notificationsService.sendOrderCreated(order.id);
    this.notificationsService.sendPaymentSuccess(order.id);

    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }
}
