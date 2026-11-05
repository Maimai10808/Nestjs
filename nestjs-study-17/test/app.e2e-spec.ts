import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const main = fileURLToPath(new URL('../dist/main.js', import.meta.url));
let child: ChildProcess | undefined;
let cwd: string;
let output: string;
async function freePort() {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Cannot allocate port');
  await new Promise<void>((resolve, reject) => server.close((e) => e ? reject(e) : resolve()));
  return address.port;
}
async function start(extra: Record<string, string> = {}) {
  cwd = await mkdtemp(join(tmpdir(), 'study17-test-'));
  await writeFile(join(cwd, '.env.test'), 'AI_PROVIDER=claude\nAI_MODEL=fixture-model\nDATABASE_HOST=example.invalid\nDATABASE_NAME=demo\nREDIS_HOST=example.invalid\n');
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (/^(AI_|DATABASE_|REDIS_)/.test(key)) delete env[key];
  const port = await freePort(); output = '';
  child = spawn(process.execPath, [main], { cwd, env: { ...env, NODE_ENV: 'test', PORT: String(port), ...extra }, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout?.on('data', (chunk: Buffer) => { output += chunk.toString(); });
  child.stderr?.on('data', (chunk: Buffer) => { output += chunk.toString(); });
  return `http://127.0.0.1:${port}`;
}
async function ready(base: string) {
  for (let i = 0; i < 100; i++) {
    if (child?.exitCode !== null) throw new Error(output);
    try { const result = await fetch(`${base}/agents/config`); if (result.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  throw new Error(output || 'Startup timed out');
}
afterEach(async () => {
  if (child && child.exitCode === null) {
    const exited = new Promise<void>((resolve) => child!.once('exit', () => resolve()));
    child.kill('SIGTERM'); await exited;
  }
  await rm(cwd, { recursive: true, force: true });
});
it('loads .env.test, honors process overrides and exposes only public config', async () => {
  const base = await start({ AI_MODEL: 'override-model', AI_API_KEY: 'fixture-secret' }); await ready(base);
  const config = await (await fetch(`${base}/agents/config`)).json();
  expect(config).toMatchObject({ provider: 'claude', model: 'override-model', temperature: 0.7, timeout: 30000 });
  expect(JSON.stringify(config)).not.toContain('fixture-secret');
  const success = await fetch(`${base}/agents/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: 'Explain configuration' }) });
  expect(success.status).toBe(201); expect((await success.json()).result).toContain('Explain configuration');
  const invalid = await fetch(`${base}/agents/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: 4 }) });
  expect(invalid.status).toBe(400);
});
it('fails startup when environment validation rejects temperature', async () => {
  await start({ AI_TEMPERATURE: '99' });
  await new Promise<void>((resolve) => child!.once('exit', () => resolve()));
  expect(child?.exitCode).not.toBe(0); expect(output).toContain('AI_TEMPERATURE');
});
