import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

export async function startApp(
  cwd = process.cwd(),
  env: NodeJS.ProcessEnv = {},
) {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const address = socket.address();
  if (!address || typeof address === 'string') throw new Error('No port');
  const port = address.port;
  await new Promise<void>((resolveClose) => socket.close(() => resolveClose()));
  const child = spawn(process.execPath, [resolve('dist/main.js')], {
    cwd,
    env: { ...process.env, ...env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk: Buffer) => {
    output += chunk.toString();
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null) throw new Error(output);
    try {
      await fetch(baseUrl);
      return {
        baseUrl,
        output: () => output,
        close: async () => {
          if (child.exitCode === null) {
            child.kill('SIGTERM');
            await once(child, 'exit');
          }
        },
      };
    } catch {
      await delay(40);
    }
  }
  child.kill('SIGKILL');
  throw new Error(`Server did not start: ${output}`);
}
