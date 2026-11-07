import request from 'supertest';
import { startRuntime } from './runtime.js';

describe('Helmet headers on rendered reports', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => { runtime = await startRuntime(); });
  afterAll(async () => { await runtime?.stop(); });

  it('renders packaged templates and serves styles outside the source cwd', async () => {
    const home = await request(runtime.url).get('/').expect(200);
    expect(home.text).toContain('AI Deep Research Platform');
    const reports = await request(runtime.url).get('/reports').expect(200);
    expect(reports.text).toContain('LangGraph 技术研究报告');
    await request(runtime.url).get('/reports/1/preview').expect(200);
    await request(runtime.url).get('/css/style.css').expect(200);
    await request(runtime.url).get('/reports/999').expect(404);
  });

  it('sets CSP, frame restrictions, nosniff, and referrer policy for real HTTP responses', async () => {
    const response = await request(runtime.url).get('/security/headers').expect(200);
    expect(response.headers['content-security-policy']).toContain("script-src 'self'");
    expect(response.headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response.headers['x-frame-options']).toBe('DENY');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['referrer-policy']).toBe('no-referrer');
    await request(runtime.url).get('/health').expect(200);
  });
});
