import {
  ContextIdFactory,
  type ContextId,
  type ContextIdStrategy,
  type HostComponentInfo,
} from '@nestjs/core';

import type { Request } from 'express';

// 保存每个企业对应的 DI 上下文 ID
const tenantContexts = new Map<string, ContextId>();

export class TenantContextStrategy implements ContextIdStrategy {
  attach(contextId: ContextId, request: Request) {
    // 从请求中获取企业 ID
    const tenantId = request.headers['x-tenant-id'];

    if (typeof tenantId !== 'string' || !tenantId) {
      // 学习示例：没有企业 ID 时不复用持久子树
      return () => contextId;
    }

    // 查找企业对应的上下文
    let tenantContextId = tenantContexts.get(tenantId);

    if (!tenantContextId) {
      // 第一次出现这个企业，创建新的上下文
      tenantContextId = ContextIdFactory.create();

      tenantContexts.set(tenantId, tenantContextId);
    }

    // 为持久依赖树返回企业专属上下文
    return {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantContextId : contextId,

      // 为持久子树提供稳定的企业上下文
      payload: {
        tenantId,
      },
    };
  }
}
