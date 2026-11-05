import request from 'supertest';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { startRuntime } from './runtime.js';

describe('HTTP Module over real local HTTP', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  let upstream: Server;
  let fail = false;
  beforeAll(async () => {
    upstream = createServer((req, res) => {
      if (fail) {
        res.writeHead(503).end();
        return;
      }
      res.setHeader('content-type', 'application/json');
      if (req.url?.startsWith('/external/models'))
        res.end(
          JSON.stringify([
            { id: 'local-test', provider: 'mock', contextWindow: 2048 },
          ]),
        );
      else if (req.url?.startsWith('/external/search'))
        res.end(
          JSON.stringify({
            query: 'NestJS',
            results: [
              {
                title: 'Source',
                url: 'https://example.com',
                snippet: 'Local fixture',
              },
            ],
          }),
        );
      else if (req.url === '/external/ai/generate')
        res.end(
          JSON.stringify({
            model: 'local-test',
            output: 'Local report',
            tokensUsed: 12,
          }),
        );
      else res.writeHead(404).end();
    });
    upstream.listen(0, '127.0.0.1');
    await once(upstream, 'listening');
    const address = upstream.address();
    if (!address || typeof address === 'string')
      throw new Error('Expected TCP port');
    runtime = await startRuntime({
      EXTERNAL_API_BASE_URL: `http://127.0.0.1:${address.port}`,
    });
  });
  afterAll(async () => {
    await runtime?.stop();
    await new Promise<void>((resolve) => upstream.close(() => resolve()));
  });
  it('uses configured upstream for axiosRef, Observable, and research composition', async () => {
    await request(runtime.url)
      .get('/models')
      .expect(200)
      .expect((res) => expect(res.body[0].id).toBe('local-test'));
    await request(runtime.url)
      .get('/search?q=NestJS')
      .expect(200)
      .expect((res) => expect(res.body.results).toHaveLength(1));
    await request(runtime.url)
      .post('/agents/research')
      .send({ topic: 'NestJS HTTP' })
      .expect(201)
      .expect((res) => {
        expect(res.body.report).toBe('Local report');
        expect(res.body.metadata.referenceCount).toBe(1);
      });
  });
  it('validates inputs and consistently maps upstream failures to 502', async () => {
    await request(runtime.url).get('/search').expect(400);
    await request(runtime.url)
      .post('/agents/research')
      .send({ topic: 'x' })
      .expect(400);
    fail = true;
    await request(runtime.url).get('/models').expect(502);
    await request(runtime.url).get('/search?q=NestJS').expect(502);
    await request(runtime.url)
      .post('/agents/research')
      .send({ topic: 'NestJS HTTP' })
      .expect(502);
  });
});
