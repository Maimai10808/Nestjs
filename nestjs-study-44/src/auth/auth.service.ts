import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  login(
    username: string,
    password: string,
  ) {
    if (
      username !== 'robin' ||
      password !== 'Robin123456!'
    ) {
      throw new UnauthorizedException(
        '用户名或密码错误',
      );
    }

    return {
      message: '登录成功',
      user: {
        id: 1001,
        username: 'robin',
      },
    };
  }
}
