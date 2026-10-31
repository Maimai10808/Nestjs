import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  sendOrderCreated(orderId: string): void {
    console.log(`订单 ${orderId} 创建成功，发送通知`);
  }

  sendPaymentSuccess(orderId: string): void {
    console.log(`订单 ${orderId} 支付成功，发送通知`);
  }
}
