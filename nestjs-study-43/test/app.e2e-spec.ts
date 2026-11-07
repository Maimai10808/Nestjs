import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('session-bound CSRF tokens and CORS', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime({ SESSION_SECRET: 'test-only-session-secret-at-least-32-characters', CSRF_SECRET: 'test-only-csrf-secret-at-least-32-characters' }); });
  afterAll(async () => { await runtime?.stop(); });

  it('rejects missing tokens, renews tokens after login, and protects resource ownership', async () => {
    const client = request.agent(runtime.url);
    const before = await client.get('/security/csrf-token').expect(200);
    expect(typeof before.body.csrfToken).toBe('string');
    await client.post('/auth/login').send({ username: 'robin', password: 'Robin123456!' }).expect(403);
    await client.post('/auth/login').set('X-CSRF-Token', before.body.csrfToken).send({ username: 'robin', password: 'Robin123456!' }).expect(201);
    await client.post('/agents').set('X-CSRF-Token', before.body.csrfToken).send({ name: 'new', model: 'mock' }).expect(403);
    const after = await client.get('/security/csrf-token').expect(200);
    expect(after.body.csrfToken).not.toBe(before.body.csrfToken);
    const token = after.body.csrfToken;
    await client.patch('/agents/1').set('X-CSRF-Token', token).send({ name: {} }).expect(400);
    await client.patch('/agents/3').set('X-CSRF-Token', token).send({ name: 'stolen' }).expect(403);
    await client.post('/agents').set('X-CSRF-Token', token).send({ name: 'CSRF checked', model: 'mock' }).expect(201);
    const own = await client.get('/agents/my').expect(200);
    expect(own.body.every((a: { ownerId: number }) => a.ownerId === 1001)).toBe(true);
    await client.post('/auth/logout').set('X-CSRF-Token', token).expect(201);
    await client.get('/auth/me').expect(401);
  });

  it('allows the configured origin and rejects a token from another session', async () => {
    const a = request.agent(runtime.url);
    const b = request.agent(runtime.url);
    const first = await a.get('/security/csrf-token').expect(200);
    await b.get('/security/csrf-token').expect(200);
    await b.post('/auth/login').set('X-CSRF-Token', first.body.csrfToken).send({ username: 'robin', password: 'Robin123456!' }).expect(403);
    const allowed = await request(runtime.url).get('/security/cors-info').set('Origin', 'http://localhost:8888').expect(200);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:8888');
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');
    const other = await request(runtime.url).get('/security/cors-info').set('Origin', 'https://untrusted.invalid').expect(200);
    expect(other.headers['access-control-allow-origin']).not.toBe('https://untrusted.invalid');
  });
});
