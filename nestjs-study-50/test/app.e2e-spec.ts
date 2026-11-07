import { spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../dist/cli/main.js', import.meta.url));
let directory: string;
beforeAll(async () => { directory = await mkdtemp(join(tmpdir(), 'nestjs-study-50-e2e-')); });
afterAll(async () => { await rm(directory, { recursive: true, force: true }); });

function run(args: string[]): Promise<{ code: number | null; output: string }> {
  return new Promise((resolve, reject) => {
    const process = spawn(globalThis.process.execPath, [cli, ...args], { cwd: directory });
    let output = '';
    const timer = setTimeout(() => { process.kill(); reject(new Error('CLI did not exit')); }, 10000);
    process.stdout.on('data', (data: Buffer) => { output += data.toString(); });
    process.stderr.on('data', (data: Buffer) => { output += data.toString(); });
    process.on('error', error => { clearTimeout(timer); reject(error); });
    process.on('close', code => { clearTimeout(timer); resolve({ code, output }); });
  });
}

it('writes a mock report and exits without an HTTP server', async () => {
  const result = await run(['research', 'NestJS application context']);
  expect(result.code).toBe(0);
  const files = await readdir(join(directory, 'reports'));
  expect(files).toHaveLength(1);
  const report = await readFile(join(directory, 'reports', String(files[0])), 'utf8');
  expect(report).toContain('# NestJS application context');
  expect(report).toContain('本报告由模拟 AI Research Agent 生成');
}, 15000);

it('builds three deterministic mock embeddings and exits', async () => {
  const result = await run(['knowledge:build']);
  expect(result.code).toBe(0);
  expect(result.output).toContain('3 个向量');
});

it('returns a nonzero exit code for missing input and unknown commands', async () => {
  const missing = await run(['research']);
  expect(missing.code).toBe(1);
  expect(missing.output).toContain('请提供研究主题');
  const unknown = await run(['unknown']);
  expect(unknown.code).toBe(1);
  expect(unknown.output).toContain('未知命令');
});

it('runs documented package shortcuts with working dependency injection', async () => {
  const project = fileURLToPath(new URL('../', import.meta.url));
  const fixture = join(directory, 'shortcut-project');
  await mkdir(fixture);
  for (const name of ['src', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'nest-cli.json', 'tsconfig.json', 'tsconfig.build.json']) {
    await cp(join(project, name), join(fixture, name), { recursive: true });
  }
  await symlink(join(project, 'node_modules'), join(fixture, 'node_modules'), 'dir');
  const shortcut = (name: string, args: string[] = []) =>
    new Promise<{ code: number | null; output: string }>((resolve, reject) => {
      const child = spawn('pnpm', [name, ...args], { cwd: fixture });
      let output = '';
      const timer = setTimeout(() => { child.kill(); reject(new Error('Shortcut did not exit')); }, 15000);
      child.stdout.on('data', (data: Buffer) => { output += data.toString(); });
      child.stderr.on('data', (data: Buffer) => { output += data.toString(); });
      child.on('error', (error) => { clearTimeout(timer); reject(error); });
      child.on('close', (code) => { clearTimeout(timer); resolve({ code, output }); });
    });
  const research = await shortcut('research', ['Documented CLI alias']);
  expect(research.code, research.output).toBe(0);
  const files = await readdir(join(fixture, 'reports'));
  expect(files).toHaveLength(1);
  expect(await readFile(join(fixture, 'reports', String(files[0])), 'utf8'))
    .toContain('# Documented CLI alias');
  const knowledge = await shortcut('knowledge:build');
  expect(knowledge.code, knowledge.output).toBe(0);
  expect(knowledge.output).toContain('3 个向量');
}, 35000);
