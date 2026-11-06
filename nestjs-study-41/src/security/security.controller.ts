import {
  Controller,
  Get,
} from '@nestjs/common';

import { EncryptionService } from './encryption.service.js';

import { PasswordService } from './password.service.js';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly encryptionService:
      EncryptionService,

    private readonly passwordService:
      PasswordService,
  ) {}

  @Get('demo')
  async demo() {
    // 使用固定的教学字符串
    const plaintext =
      'demo-api-key-not-real';

    // 1. 两次加密相同明文
    const encrypted1 =
      this.encryptionService.encrypt(
        plaintext,
      );

    const encrypted2 =
      this.encryptionService.encrypt(
        plaintext,
      );

    // 2. 解密
    const decrypted =
      this.encryptionService.decrypt(
        encrypted1,
      );

    // 3. bcrypt 哈希
    const password = 'DemoPassword123!';

    const hash1 =
      await this.passwordService.hash(
        password,
      );

    const hash2 =
      await this.passwordService.hash(
        password,
      );

    // 4. 验证密码
    const valid =
      await this.passwordService.verify(
        password,
        hash1,
      );

    const invalid =
      await this.passwordService.verify(
        'WrongPassword123!',
        hash1,
      );

    return {
      encryption: {
        samePlaintext:
          true,

        differentCiphertext:
          encrypted1 !== encrypted2,

        decryptMatchesOriginal:
          decrypted === plaintext,
      },

      hashing: {
        differentHashes:
          hash1 !== hash2,

        correctPassword:
          valid,

        wrongPassword:
          invalid,
      },
    };
  }
}
