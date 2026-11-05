import request from 'supertest';
import { readFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { startRuntime } from './runtime.js';

describe('Report file streaming', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => {
    runtime = await startRuntime();
  });
  afterAll(async () => {
    await runtime?.stop();
  });

  it('generates, lists, and streams the exact file with download headers', async () => {
    const created = await request(runtime.url)
      .post('/reports/generate')
      .expect(201);
    expect(created.body).not.toHaveProperty('path');
    const id = created.body.id as number;
    const filename = created.body.filename as string;
    await request(runtime.url)
      .get('/reports')
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));
    await request(runtime.url)
      .get(`/reports/${id}`)
      .expect(200)
      .expect((res) => expect(res.body).not.toHaveProperty('path'));
    const response = await request(runtime.url)
      .get(`/reports/${id}/download`)
      .expect(200);
    expect(response.headers['content-type']).toContain('text/markdown');
    expect(response.headers['content-disposition']).toBe(
      `attachment; filename="${filename}"`,
    );
    const content = await readFile(
      join(runtime.cwd, 'reports', filename),
      'utf8',
    );
    expect(response.text).toBe(content);
    expect(Number(response.headers['content-length'])).toBe(
      Buffer.byteLength(content),
    );
    await unlink(join(runtime.cwd, 'reports', filename));
    await request(runtime.url).get(`/reports/${id}/download`).expect(404);
  });

  it('rejects invalid and missing report IDs', async () => {
    await request(runtime.url).get('/reports/abc/download').expect(400);
    await request(runtime.url).get('/reports/999/download').expect(404);
  });
});
