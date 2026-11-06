import { Module } from '@nestjs/common';

import { EncryptionService } from './encryption.service.js';

import { PasswordService } from './password.service.js';

import { SecurityController } from './security.controller.js';

@Module({
  controllers: [
    SecurityController,
  ],

  providers: [
    EncryptionService,
    PasswordService,
  ],

  exports: [
    EncryptionService,
    PasswordService,
  ],
})
export class SecurityModule {}
