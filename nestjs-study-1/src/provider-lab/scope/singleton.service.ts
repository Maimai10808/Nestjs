import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SingletonService {
  readonly instanceId = randomUUID();

  constructor() {
    console.log('SingletonService 创建:', this.instanceId);
  }

  getInfo() {
    return {
      scope: 'DEFAULT',
      instanceId: this.instanceId,
    };
  }
}
