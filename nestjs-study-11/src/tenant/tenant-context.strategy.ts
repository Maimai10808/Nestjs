import {
  ContextIdFactory,
  type ContextId,
  type ContextIdStrategy,
  type HostComponentInfo,
} from '@nestjs/core';
import type { Request } from 'express';

export interface TenantContext {
  tenantId: 'tenant-a' | 'tenant-b' | null;
}

// 这两个公开标签只用于观察 DI 实例分组，不代表已认证的企业身份。
export class TenantContextStrategy implements ContextIdStrategy {
  private readonly tenantContexts = new Map<string, ContextId>();

  attach(contextId: ContextId, request: Request) {
    const header = request.headers['x-tenant-id'];
    const tenantId = header === 'tenant-a' || header === 'tenant-b' ? header : null;
    const payload: TenantContext = { tenantId };

    if (!tenantId) {
      // 即使没有合法标签也注入明确 payload，让 Service 返回 400。
      return { resolve: () => contextId, payload };
    }

    let tenantContextId = this.tenantContexts.get(tenantId);
    if (!tenantContextId) {
      tenantContextId = ContextIdFactory.create();
      this.tenantContexts.set(tenantId, tenantContextId);
    }

    return {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantContextId : contextId,
      payload,
    };
  }
}
