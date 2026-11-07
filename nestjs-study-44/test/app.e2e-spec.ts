import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('named rate-limit windows', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime(); });
  afterAll(async () => { await runtime?.stop(); });

  it('rejects rapid repeat requests while health and explicit skip routes remain available', async () => {
    await request(runtime.url).get('/rate-limit/test').expect(200);
    const blocked = await request(runtime.url).get('/rate-limit/test').expect(429);
    expect(Number(blocked.headers['retry-after-short'])).toBeGreaterThan(0);
    for (let index = 0; index < 5; index++) {
      await request(runtime.url).get('/health').expect(200);
      await request(runtime.url).get('/rate-limit/skip').expect(200);
    }
  });

  it('validates research requests and keeps login as an explicit credential mock', async () => {
    await request(runtime.url).post('/agents/research').send({ topic: {} }).expect(400);
    const login = await request(runtime.url).post('/auth/login').send({ username: 'robin', password: 'Robin123456!' }).expect(200);
    expect(login.body.user.id).toBe(1001);
    expect(login.body).not.toHaveProperty('access_token');
    await request(runtime.url).get('/agents/999').expect(404);
    await request(runtime.url).get('/models').expect(200);
  });
});
