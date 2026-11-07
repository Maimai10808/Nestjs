import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service.js';

describe('authenticated encryption', () => {
  it('uses fresh IVs, restores plaintext, and rejects tampered ciphertext', () => {
    const service = new EncryptionService(new ConfigService({ ENCRYPTION_KEY: 'b'.repeat(64) }));
    const first = service.encrypt('demo-not-real');
    const second = service.encrypt('demo-not-real');
    expect(first).not.toBe(second);
    expect(service.decrypt(first)).toBe('demo-not-real');
    const parts = first.split(':');
    parts[2] = '0'.repeat(32);
    expect(() => service.decrypt(parts.join(':'))).toThrow('敏感数据解密失败');
  });
});
