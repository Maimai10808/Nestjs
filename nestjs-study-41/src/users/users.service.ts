import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { PasswordService } from '../security/password.service.js';

import type {
  StoredUser,
  User,
} from './user.interface.js';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: StoredUser[] = [];

  constructor(
    private readonly passwordService:
      PasswordService,
  ) {}

  async onModuleInit(): Promise<void> {
    const demoUsers = [
      {
        id: 1001,
        username: 'robin',
        email: 'robin@example.com',
        password: 'Robin123456!',
      },
      {
        id: 1002,
        username: 'alan',
        email: 'alan@example.com',
        password: 'Alan123456!',
      },
    ];

    for (const demoUser of demoUsers) {
      const {
        password,
        ...user
      } = demoUser;

      const passwordHash =
        await this.passwordService.hash(
          password,
        );

      this.users.push({
        ...user,
        passwordHash,
      });
    }
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

    const {
      passwordHash,
      ...user
    } = storedUser;

    return user;
  }
}
