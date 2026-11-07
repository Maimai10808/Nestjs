import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import type { Socket } from 'socket.io-client';
import request from 'supertest';
import { connect, ack } from './runtime.js';
import { createServer, createConnection, type Socket as NetSocket } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

it('broadcasts room progress between two Redis-backed instances and closes adapters', async () => {
  const { AppModule } = await import('../dist/app.module.js');
  const { RedisIoAdapter } = await import('../dist/adapters/redis-io.adapter.js');
  const apps: INestApplication[] = [];
  const sockets: Socket[] = [];
  try {
    for (let i = 0; i < 2; i++) {
      const app = await NestFactory.create(AppModule, { logger: false });
      apps.push(app);
      const adapter = new RedisIoAdapter(app);
      await adapter.connectToRedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');
      app.useWebSocketAdapter(adapter);
      await app.listen(0, '127.0.0.1');
      await request(app.getHttpServer()).get('/health').expect(200);
    }
    const [first, second] = apps;
    if (!first || !second) throw new Error('Both instances must start');
    const subscriber = await connect(await first.getUrl()); sockets.push(subscriber);
    const producer = await connect(await second.getUrl()); sockets.push(producer);
    expect(await ack(subscriber, 'agent.subscribe', { taskId: 'research-e2e' })).toMatchObject({ subscribed: true });
    const completed = new Promise<{ progress: number; stage: string }>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('No cross-instance completion')), 10000);
      subscriber.on('agent.progress', (progress: { progress: number; stage: string }) => {
        if (progress.progress === 100) { clearTimeout(timer); resolve(progress); }
      });
    });
    expect(await ack(producer, 'agent.start', { taskId: 'research-e2e' })).toMatchObject({ started: true });
    expect(await completed).toMatchObject({ progress: 100, stage: 'completed' });
  } finally {
    for (const socket of sockets) socket.disconnect();
    for (const app of apps) await app.close();
  }
}, 20000);

it('closes when connected Redis stops replying to commands', async () => {
  const { AppModule } = await import('../dist/app.module.js');
  const { RedisIoAdapter } = await import('../dist/adapters/redis-io.adapter.js');
  const upstreamUrl = new URL(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');
  const connections = new Set<NetSocket>();
  let stalled = false;
  const proxy = createServer((downstream) => {
    const upstream = createConnection({
      host: upstreamUrl.hostname,
      port: Number(upstreamUrl.port || 6379),
    });
    for (const socket of [downstream, upstream]) connections.add(socket);
    downstream.on('data', (data) => { if (!stalled) upstream.write(data); });
    upstream.on('data', (data) => { if (!stalled) downstream.write(data); });
    downstream.on('error', () => upstream.destroy());
    upstream.on('error', () => downstream.destroy());
    downstream.on('close', () => { connections.delete(downstream); upstream.destroy(); });
    upstream.on('close', () => { connections.delete(upstream); downstream.destroy(); });
  });
  await new Promise<void>((resolve) => proxy.listen(0, '127.0.0.1', resolve));
  const address = proxy.address();
  if (!address || typeof address === 'string') throw new Error('Proxy must listen on TCP');
  const proxyUrl = new URL(upstreamUrl);
  proxyUrl.hostname = '127.0.0.1';
  proxyUrl.port = String(address.port);
  const app = await NestFactory.create(AppModule, { logger: false });
  let closing: Promise<void> | undefined;
  try {
    const adapter = new RedisIoAdapter(app);
    await adapter.connectToRedis(proxyUrl.toString());
    app.useWebSocketAdapter(adapter);
    await app.listen(0, '127.0.0.1');
    await request(app.getHttpServer()).get('/health').expect(200);
    stalled = true;
    closing = app.close();
    expect(await Promise.race([
      closing.then(() => true),
      delay(500).then(() => false),
    ])).toBe(true);
  } finally {
    for (const socket of connections) socket.destroy();
    await new Promise<void>((resolve) => proxy.close(() => resolve()));
    await (closing ?? app.close());
  }
}, 10000);

it('stops accepted work before closing its Redis publisher', async () => {
  const { AppModule } = await import('../dist/app.module.js');
  const { RedisIoAdapter } = await import('../dist/adapters/redis-io.adapter.js');
  const app = await NestFactory.create(AppModule, { logger: false });
  const rejected: unknown[] = [];
  const observeRejection = (error: unknown) => rejected.push(error);
  let socket: Socket | undefined;
  process.on('unhandledRejection', observeRejection);
  try {
    const adapter = new RedisIoAdapter(app);
    await adapter.connectToRedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');
    app.useWebSocketAdapter(adapter);
    await app.listen(0, '127.0.0.1');
    socket = await connect(await app.getUrl());
    expect(await ack(socket, 'agent.start', { taskId: 'active-close' }))
      .toMatchObject({ started: true });
    socket.disconnect();
    await app.close();
    await delay(5300);
    expect(rejected).toEqual([]);
  } finally {
    socket?.disconnect();
    await app.close();
    process.off('unhandledRejection', observeRejection);
  }
}, 10000);
