import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PaymentsService {
  createPayment(amount: number) {
    return {
      paymentId: randomUUID(),
      amount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }
}
