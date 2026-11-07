import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

export interface User {
  id: number;
  username: string;
  name: string;
}

interface StoredUser extends User {
  password: string;
}

@Injectable()
export class AuthService {
  private readonly users: StoredUser[] = [
    {
      id: 1001,
      username: 'robin',
      name: 'Robin',
      password: 'Robin123456!',
    },
    {
      id: 1002,
      username: 'alan',
      name: 'Alan',
      password: 'Alan123456!',
    },
  ];

  validateUser(
    username: string,
    password: string,
  ): User {
    const user = this.users.find(
      (item) =>
        item.username === username &&
        item.password === password,
    );

    if (!user) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  findById(userId: number): User {
    const user = this.users.find(
      (item) => item.id === userId,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }
}
