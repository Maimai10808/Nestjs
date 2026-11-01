import {
  Injectable,
  Scope,
  Inject,
} from '@nestjs/common';

import { INQUIRER } from '@nestjs/core';
import { randomUUID } from 'node:crypto';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  readonly instanceId = randomUUID();

  private readonly consumerName: string;

  constructor(
    @Inject(INQUIRER)
    parent: object | undefined,
  ) {
    this.consumerName =
      parent?.constructor?.name ?? 'Unknown';

    console.log(
      `Logger 创建：${this.consumerName}`,
      this.instanceId,
    );
  }

  getInfo() {
    return {
      scope: 'TRANSIENT',
      instanceId: this.instanceId,
      consumer: this.consumerName,
    };
  }

  log(message: string) {
    console.log(
      `[${this.consumerName}] ${message}`,
    );
  }
}
