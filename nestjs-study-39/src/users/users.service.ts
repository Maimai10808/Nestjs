import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';

import { promisify } from 'node:util';

import type {
  User,
  StoredUser,
} from './user.interface.js';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: StoredUser[] = [];

  async onModuleInit(): Promise<void> {
    const demoUsers: Array<
      User & { password: string }
    > = [
      {
        id: 1001,
        username: 'robin',
        email: 'robin@example.com',
        role: 'user',
        password: 'Robin123456!',
      },
      {
        id: 1002,
        username: 'alan',
        email: 'alan@example.com',
        role: 'user',
        password: 'Alan123456!',
      },
      {
        id: 1003,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        password: 'Admin123456!',
      },
    ];

    for (const demoUser of demoUsers) {
      const { password, ...user } = demoUser;

      const passwordHash =
        await this.hashPassword(password);

      this.users.push({
        ...user,
        passwordHash,
      });
    }
  }

  private async hashPassword(
    password: string,
  ): Promise<string> {
    const salt = randomBytes(16).toString('hex');

    const derivedKey = (await scrypt(
      password,
      salt,
      64,
    )) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [salt, hash] = storedHash.split(':');

    if (!salt || !hash) {
      return false;
    }

    const originalHash = Buffer.from(hash, 'hex');

    if (originalHash.length !== 64) {
      return false;
    }

    const derivedKey = (await scrypt(
      password,
      salt,
      64,
    )) as Buffer;

    return timingSafeEqual(
      originalHash,
      derivedKey,
    );
  }

  findByUsername(
    username: string,
  ): StoredUser | undefined {
    return this.users.find(
      (user) => user.username === username,
    );
  }

  findById(
    id: number,
  ): User | undefined {
    const storedUser = this.users.find(
      (user) => user.id === id,
    );

    if (!storedUser) {
      return undefined;
    }

    const { passwordHash, ...user } = storedUser;

    return user;
  }
}
