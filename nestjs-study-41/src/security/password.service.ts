import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  // 1. 哈希密码
  async hash(
    password: string,
  ): Promise<string> {
    return bcrypt.hash(
      password,
      this.saltRounds,
    );
  }

  // 2. 验证密码
  async verify(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(
      password,
      hash,
    );
  }
}
