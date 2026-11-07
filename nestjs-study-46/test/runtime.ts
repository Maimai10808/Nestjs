import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { io, type Socket } from 'socket.io-client';

export async function startApp(): Promise<INestApplication> {
  const { AppModule } = await import('../dist/app.module.js');
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0, '127.0.0.1');
  return app;
}

export function event<T>(socket: Socket, name: string, timeoutMs = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const listener = (value: T) => {
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => {
      socket.off(name, listener);
      reject(new Error(`Timed out waiting for ${name}`));
    }, timeoutMs);
    socket.once(name, listener);
  });
}

export async function connect(url: string, token?: string): Promise<Socket> {
  const socket = io(url, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: false,
    auth: token ? { token } : {},
  });
  const connected = event(socket, 'connect');
  socket.connect();
  await connected;
  return socket;
}

export async function ack(socket: Socket, name: string, data?: unknown): Promise<unknown> {
  return socket.timeout(6000).emitWithAck(name, data);
}
