import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionService } from './session.service.js';
import { SessionGuard } from './session.guard.js';

@Module({
  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    SessionService,
    SessionGuard,
  ],

  exports: [
    AuthService,
    SessionGuard,
  ],
})
export class AuthModule {}
