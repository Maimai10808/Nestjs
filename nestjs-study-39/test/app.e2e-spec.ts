import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('JWT authentication and resource ownership', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime({ JWT_SECRET: 'test-only-jwt-secret-at-least-32-characters' }); });
  afterAll(async () => { await runtime?.stop(); });

  it('allows public routes, rejects missing/invalid JWTs, and validates login data', async () => {
    await request(runtime.url).get('/health').expect(200);
    await request(runtime.url).get('/agents').expect(200);
    await request(runtime.url).get('/agents/my').expect(401);
    await request(runtime.url).get('/agents/my').set('Authorization', 'Bearer forged').expect(401);
    await request(runtime.url).post('/auth/login').send({ username: 'robin', password: {} }).expect(400);
    await request(runtime.url).post('/auth/login').send({ username: 'robin', password: 'wrong-password' }).expect(401);
  });

  it('signs a real JWT, hides password hashes, and enforces ownership', async () => {
    const login = await request(runtime.url).post('/auth/login').send({ username: 'robin', password: 'Robin123456!' }).expect(200);
    const bearer = `Bearer ${login.body.access_token}`;
    expect(login.body.expires_in).toBe(60);
    expect(login.body.access_token.split('.')).toHaveLength(3);
    const profile = await request(runtime.url).get('/auth/profile').set('Authorization', bearer).expect(200);
    expect(profile.body).toMatchObject({ id: 1001, username: 'robin' });
    expect(profile.body).not.toHaveProperty('passwordHash');
    const own = await request(runtime.url).get('/agents/my').set('Authorization', bearer).expect(200);
    expect(own.body.map((a: { userId: number }) => a.userId)).toEqual([1001, 1001]);
    await request(runtime.url).get('/agents/3').set('Authorization', bearer).expect(403);
    await request(runtime.url).post('/agents/3/run').set('Authorization', bearer).expect(403);
    const result = await request(runtime.url).post('/agents/1/run').set('Authorization', bearer).expect(201);
    expect(result.body.status).toBe('completed');
  });
});
