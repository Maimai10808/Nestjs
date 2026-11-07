import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('encrypted provider credentials', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime({ JWT_SECRET: 'a'.repeat(64), ENCRYPTION_KEY: 'b'.repeat(64) }); }, 15000);
  afterAll(async () => { await runtime?.stop(); });

  it('demonstrates randomized authenticated encryption and salted hashes', async () => {
    const demo = await request(runtime.url).get('/security/demo').expect(200);
    expect(demo.body.encryption).toEqual({ samePlaintext: true, differentCiphertext: true, decryptMatchesOriginal: true });
    expect(demo.body.hashing).toEqual({ differentHashes: true, correctPassword: true, wrongPassword: false });
    await request(runtime.url).post('/auth/login').send({ username: 'robin', password: '字'.repeat(25) }).expect(400);
  });

  it('hides keys and ciphertext, isolates owners, and only simulates model calls', async () => {
    const login = async (username: string, password: string) => {
      const res = await request(runtime.url).post('/auth/login').send({ username, password }).expect(200);
      return `Bearer ${res.body.access_token}`;
    };
    const robin = await login('robin', 'Robin123456!');
    const alan = await login('alan', 'Alan123456!');
    await request(runtime.url).get('/providers').expect(401);
    const key = 'demo-provider-key-not-real';
    const saved = await request(runtime.url).post('/providers').set('Authorization', robin).send({ provider: 'openai', apiKey: key }).expect(201);
    expect(saved.body.hasApiKey).toBe(true);
    expect(JSON.stringify(saved.body)).not.toContain(key);
    expect(saved.body).not.toHaveProperty('encryptedApiKey');
    await request(runtime.url).get(`/providers/${saved.body.id}`).set('Authorization', alan).expect(403);
    const run = await request(runtime.url).post('/agents/run').set('Authorization', robin).send({ providerId: saved.body.id }).expect(201);
    expect(run.body.apiKeyAvailable).toBe(true);
    expect(JSON.stringify(run.body)).not.toContain(key);
    await request(runtime.url).delete(`/providers/${saved.body.id}`).set('Authorization', robin).expect(200);
    await request(runtime.url).get(`/providers/${saved.body.id}`).set('Authorization', robin).expect(404);
  });
});
