import { Injectable, Scope } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class TransientService {
  readonly instanceId = randomUUID();

  constructor() {
    console.log('TransientService 创建:', this.instanceId);
  }

  getInfo() {
    return {
      scope: 'TRANSIENT',
      instanceId: this.instanceId,
    };
  }
}
