import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'node:net';
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { AppModule } from '../dist/app.module.js';
import { get } from 'node:http';
import { gunzipSync } from 'node:zlib';
import { startApp } from './runtime.js';

function read(url: string, encoding: string) {
  return new Promise<{
    encoding: string | undefined;
    vary: string | undefined;
    body: Buffer;
  }>((resolve, reject) => {
    get(url, { headers: { 'Accept-Encoding': encoding } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () =>
        resolve({
          encoding: res.headers['content-encoding'],
          vary: res.headers.vary,
          body: Buffer.concat(chunks),
        }),
      );
      res.on('error', reject);
    }).on('error', reject);
  });
}

describe('真实压缩中间件', () => {
  let server: Awaited<ReturnType<typeof startApp>>;
  beforeAll(async () => {
    server = await startApp();
  });
  afterAll(async () => {
    await server?.close();
  });
  it('大报告实际 gzip 编码且可解码', async () => {
    const response = await read(`${server.baseUrl}/reports/large`, 'gzip');
    expect(response.encoding).toBe('gzip');
    expect(response.vary).toContain('Accept-Encoding');
    const decoded = JSON.parse(gunzipSync(response.body).toString()) as {
      metadata: { paragraphs: number };
    };
    expect(decoded.metadata.paragraphs).toBe(500);
  });
  it('no-transform 使同一大报告保持原文', async () => {
    const app = await NestFactory.create(AppModule, { logger: false });
    app.use((_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Cache-Control', 'no-transform');
      next();
    });
    app.use(compression());
    await app.listen(0, '127.0.0.1');
    try {
      const port = (app.getHttpServer().address() as AddressInfo).port;
      const response = await read(
        `http://127.0.0.1:${port}/reports/large`,
        'gzip',
      );
      expect(response.encoding).toBeUndefined();
      expect(JSON.parse(response.body.toString()).metadata.paragraphs).toBe(
        500,
      );
    } finally {
      await app.close();
    }
  });
  it('identity 保持 JSON 原文', async () => {
    const response = await read(`${server.baseUrl}/reports/large`, 'identity');
    expect(response.encoding).toBeUndefined();
    const decoded = JSON.parse(response.body.toString()) as {
      metadata: { paragraphs: number };
    };
    expect(decoded.metadata.paragraphs).toBe(500);
  });
});
