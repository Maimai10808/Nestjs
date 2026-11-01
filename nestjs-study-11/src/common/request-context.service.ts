import {
  Injectable,
  Scope,
  Inject,
} from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { randomUUID } from 'node:crypto';

import type { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class RequestContextService {
  readonly instanceId = randomUUID();

  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    console.log('RequestContext 创建：', this.instanceId);
  }

  getInfo() {
    return {
      scope: 'REQUEST',
      instanceId: this.instanceId,
      requestId: this.request.headers['x-request-id'] ?? null,
      path: this.request.url,
    };
  }
}
