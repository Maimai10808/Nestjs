import type { Server } from 'node:net';
import { NestFactory } from '@nestjs/core';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

it('handles a real TCP models request and closes the transport', async () => {
  const { AppModule } = await import('../../../dist/agent-worker/apps/agent-worker/src/agent-worker.module.js');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP, options: { host: '127.0.0.1', port: 0 }, logger: false,
  });
  await app.listen();
  const address = app.unwrap<Server>().address();
  if (!address || typeof address === 'string') throw new Error('No TCP port');
  const client = ClientProxyFactory.create({ transport: Transport.TCP, options: { host: '127.0.0.1', port: address.port } });
  try {
    const models = await firstValueFrom(client.send<unknown[]>('research.models', {}).pipe(timeout(3000)));
    expect(models).toHaveLength(2);
  } finally {
    client.close();
    await app.close();
  }
});
