import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { Queue } from 'bullmq';

// Exercise the real CLI entry instead of replacing signal handling with app.close().
export async function verifyWorkerShutdown() {
  if (!process.env.REDIS_PORT)
    throw new Error('请提供独立测试 Redis 的 REDIS_PORT');
  const probe = createServer();
  await new Promise<void>((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const address = probe.address();
  if (!address || typeof address === 'string')
    throw new Error('无法申请测试端口');
  const port = address.port;
  await new Promise<void>((resolve, reject) =>
    probe.close((error) => (error ? reject(error) : resolve())),
  );
  const child = spawn(process.execPath, ['dist/main.js'], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', (chunk) => {
    logs += String(chunk);
  });
  child.stderr.on('data', (chunk) => {
    logs += String(chunk);
  });
  const exit = new Promise<void>((resolve, reject) => {
    child.once('exit', () => resolve());
    child.once('error', reject);
  });
  const queue = new Queue('agent-tasks', {
    connection: {
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT),
    },
  });
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try {
        const response = await fetch(
          `http://127.0.0.1:${port}/agents/queue/stats`,
        );
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {
        /* Server is still bootstrapping. */
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (!ready) throw new Error(`main 未成功启动: ${logs}`);
    const response = await fetch(`http://127.0.0.1:${port}/agents/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: 2,
        userId: 1001,
        input: 'SIGTERM lifecycle proof',
      }),
    });
    if (response.status !== 201) throw new Error('任务未提交成功');
    const body = (await response.json()) as { jobId: string };
    const job = await queue.getJob(body.jobId);
    if (!job) throw new Error('任务未写入 Redis');
    let active = false;
    for (let i = 0; i < 100; i++) {
      if ((await job.getState()) === 'active') {
        active = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    if (!active) throw new Error('Worker 未开始执行任务');
    child.kill('SIGTERM');
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        exit,
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('SIGTERM 后未能退出')),
            10000,
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
    const state = await job.getState();
    if (state !== 'completed')
      throw new Error(`SIGTERM 后任务仍为 ${state}，Worker 未等待在途工作完成`);
    const finished = await queue.getJob(body.jobId);
    if (finished?.progress !== 100) throw new Error('关闭前任务进度未完成');
    await finished.remove();
    return { state, progress: finished.progress };
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
      await exit;
    }
    await queue.close();
  }
}
