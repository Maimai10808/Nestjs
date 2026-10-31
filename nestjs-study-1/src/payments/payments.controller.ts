import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';

import {
  PaymentsService,
} from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  // POST /payments
  @Post()
  pay(@Body('amount') amount: number) {
    return this.paymentsService.pay(amount);
  }
}
