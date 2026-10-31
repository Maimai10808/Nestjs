import { Injectable, Scope } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable({
  scope: Scope.REQUEST,
})
export class RequestService {
  readonly instanceId = randomUUID();

  constructor() {
    console.log('RequestService 创建:', this.instanceId);
  }

  getInfo() {
    return {
      scope: 'REQUEST',
      instanceId: this.instanceId,
    };
  }
}
