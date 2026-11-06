import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';

  private readonly key: Buffer;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const keyHex =
      this.configService.get<string>(
        'ENCRYPTION_KEY',
      );

    if (
      !keyHex ||
      !/^[0-9a-fA-F]{64}$/.test(keyHex)
    ) {
      throw new Error(
        'ENCRYPTION_KEY 必须是 64 位十六进制字符串',
      );
    }

    this.key = Buffer.from(keyHex, 'hex');
  }

  // 1. 加密
  encrypt(plaintext: string): string {
    // GCM 推荐使用 12 字节随机 IV
    const iv = randomBytes(12);

    const cipher = createCipheriv(
      this.algorithm,
      this.key,
      iv,
    );

    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
      'v1',
      iv.toString('hex'),
      authTag.toString('hex'),
      ciphertext.toString('hex'),
    ].join(':');
  }

  // 2. 解密
  decrypt(encrypted: string): string {
    const parts = encrypted.split(':');

    if (parts.length !== 4) {
      throw new InternalServerErrorException(
        '加密数据格式无效',
      );
    }

    const [version, ivHex, tagHex, dataHex] =
      parts;

    if (
      version !== 'v1' ||
      !/^[0-9a-fA-F]{24}$/.test(ivHex) ||
      !/^[0-9a-fA-F]{32}$/.test(tagHex) ||
      !/^(?:[0-9a-fA-F]{2})*$/.test(dataHex)
    ) {
      throw new InternalServerErrorException(
        '加密数据格式无效',
      );
    }

    try {
      const iv = Buffer.from(ivHex, 'hex');

      const authTag = Buffer.from(
        tagHex,
        'hex',
      );

      const ciphertext = Buffer.from(
        dataHex,
        'hex',
      );

      const decipher = createDecipheriv(
        this.algorithm,
        this.key,
        iv,
      );

      decipher.setAuthTag(authTag);

      const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);

      return plaintext.toString('utf8');
    } catch {
      throw new InternalServerErrorException(
        '敏感数据解密失败',
      );
    }
  }
}
