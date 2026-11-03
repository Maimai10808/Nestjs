import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    new UserEntity({
      id: 1001,
      firstName: 'Robin',
      lastName: 'Mai',
      email: 'robin@example.com',
      passwordHash: 'hashed-password-123',
      apiKey: 'sk-example-user-secret',
    }),

    new UserEntity({
      id: 1002,
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
      passwordHash: 'hashed-password-456',
      apiKey: 'sk-example-another-secret',
    }),
  ];

  findOne(id: number): UserEntity {
    const user = this.users.find(
      (item) => item.id === id,
    );

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }
}
