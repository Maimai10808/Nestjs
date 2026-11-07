import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function startRuntime(env: NodeJS.ProcessEnv = {}) {
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const address = reservation.address();
  if (!address || typeof address === 'string')
    throw new Error('Expected TCP port');
  const port = address.port;
  await new Promise<void>((resolve, reject) =>
    reservation.close((error) => (error ? reject(error) : resolve())),
  );
  const cwd = await mkdtemp(join(tmpdir(), 'nestjs-runtime-'));
  const child: ChildProcess = spawn(
    process.execPath,
    [fileURLToPath(new URL('../dist/main.js', import.meta.url))],
    {
      cwd,
      env: { ...process.env, NODE_ENV: 'test', PORT: String(port), ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  child.stdout?.on('data', (chunk) => {
    output += String(chunk);
  });
  child.stderr?.on('data', (chunk) => {
    output += String(chunk);
  });
  const url = `http://127.0.0.1:${port}`;
  const stop = async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill('SIGTERM');
      await exited;
    }
    await rm(cwd, { recursive: true, force: true });
  };
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) {
      await stop();
      throw new Error(output);
    }
    try {
      await fetch(url);
      return { url, stop, output: () => output, cwd };
    } catch {
      /* Wait for listening. */
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  await stop();
  throw new Error(`Startup timeout: ${output}`);
}
