import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

export interface PaymentResult {
  paymentId: string;
  amount: number;
  status: 'success';
}

@Injectable()
export class PaymentsService {
  // 模拟支付
  pay(amount: number): PaymentResult {
    if (amount <= 0) {
      throw new BadRequestException('支付金额必须大于 0');
    }

    console.log(`正在支付 ${amount} 元`);

    return {
      paymentId: crypto.randomUUID(),
      amount,
      status: 'success',
    };
  }
}
