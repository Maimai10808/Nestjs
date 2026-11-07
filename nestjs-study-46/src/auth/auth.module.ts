import { Module } from '@nestjs/common';

import { AuthService } from './auth.service.js';

import { WsAuthGuard } from './ws-auth.guard.js';

import { WsAdminGuard } from './ws-admin.guard.js';

@Module({
  providers: [
    AuthService,
    WsAuthGuard,
    WsAdminGuard,
  ],
  exports: [
    AuthService,
    WsAuthGuard,
    WsAdminGuard,
  ],
})
export class AuthModule {}
