import { Module } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { RolesGuard } from './roles.guard.js';

@Module({
  providers: [
    AuthService,
    AuthGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    AuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
