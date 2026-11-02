import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContextIdFactory } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../dist/app.module.js';
import { TenantContextStrategy } from '../dist/tenant/tenant-context.strategy.js';

describe('Provider scopes', () => {
  let app: INestApplication;

  beforeEach(async () => {
    ContextIdFactory.apply(new TenantContextStrategy());
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    // ContextIdFactory is process-global; remove this test's tenant grouping.
    ContextIdFactory.apply({ attach: (contextId) => () => contextId });
  });

  it('reuses the singleton, isolates requests, and gives consumers separate loggers', async () => {
    const first = await request(app.getHttpServer())
      .get('/agents/run?prompt=first')
      .set('x-request-id', 'r1')
      .expect(200);
    const second = await request(app.getHttpServer())
      .get('/agents/run?prompt=second')
      .set('x-request-id', 'r2')
      .expect(200);
    expect(first.body.singleton.instanceId).toBe(second.body.singleton.instanceId);
    expect(first.body.request.instanceId).not.toBe(second.body.request.instanceId);
    expect(first.body.request.requestId).toBe('r1');
    expect(second.body.request.requestId).toBe('r2');
    expect(first.body.logger.instanceId).not.toBe(first.body.auditLogger.instanceId);
    expect(first.body.logger.consumer).toBe('AgentsService');
    expect(first.body.auditLogger.consumer).toBe('AgentsAuditService');
  });

  it('reuses durable providers only within the same demo tenant', async () => {
    const first = await request(app.getHttpServer()).get('/tenant/info').set('x-tenant-id', 'tenant-a').expect(200);
    const repeated = await request(app.getHttpServer()).get('/tenant/info').set('x-tenant-id', 'tenant-a').expect(200);
    const other = await request(app.getHttpServer()).get('/tenant/info').set('x-tenant-id', 'tenant-b').expect(200);
    expect(first.body.tenantId).toBe('tenant-a');
    expect(first.body.instanceId).toBe(repeated.body.instanceId);
    expect(first.body.instanceId).not.toBe(other.body.instanceId);
    await request(app.getHttpServer()).get('/tenant/info').expect(400);
    await request(app.getHttpServer()).get('/tenant/info').set('x-tenant-id', 'untrusted-tenant').expect(400);
  });
});
