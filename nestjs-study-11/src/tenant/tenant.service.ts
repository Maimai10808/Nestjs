import {
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';

import { REQUEST } from '@nestjs/core';

import { randomUUID } from 'node:crypto';

interface TenantContext {
  tenantId: string;
}

@Injectable({
  scope: Scope.REQUEST,
  durable: true,
})
export class TenantService {
  // 用于观察是否创建了新实例
  readonly instanceId = randomUUID();

  constructor(
    @Inject(REQUEST)
    private readonly context: TenantContext,
  ) {
    console.log(
      '创建 TenantService:',
      this.instanceId,
      '企业:',
      this.context.tenantId,
    );
  }

  getInfo() {
    return {
      tenantId: this.context.tenantId,
      instanceId: this.instanceId,
    };
  }
}
