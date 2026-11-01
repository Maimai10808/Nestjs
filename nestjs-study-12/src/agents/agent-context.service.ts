import {
  Injectable,
  Scope,
} from '@nestjs/common';

import { randomUUID } from 'node:crypto';

@Injectable({
  scope: Scope.REQUEST,
})
export class AgentContextService {
  readonly instanceId = randomUUID();

  constructor() {
    console.log('创建 AgentContextService:', this.instanceId);
  }

  getInfo() {
    return {
      instanceId: this.instanceId,
    };
  }
}
