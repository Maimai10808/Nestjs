import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import type { TenantContext } from './tenant-context.strategy.js';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class TenantService {
  readonly instanceId = randomUUID();

  constructor(@Inject(REQUEST) private readonly context: TenantContext) {}

  getInfo() {
    if (!this.context.tenantId) {
      throw new BadRequestException(
        '本示例仅支持 x-tenant-id: tenant-a 或 tenant-b',
      );
    }

    return { tenantId: this.context.tenantId, instanceId: this.instanceId };
  }
}
