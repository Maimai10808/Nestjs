import { Module } from '@nestjs/common';

import { SecurityModule } from '../security/security.module.js';

import { AuthModule } from '../auth/auth.module.js';

import { ProvidersController } from './providers.controller.js';

import { ProvidersService } from './providers.service.js';

@Module({
  imports: [
    SecurityModule,
    AuthModule,
  ],

  controllers: [
    ProvidersController,
  ],

  providers: [
    ProvidersService,
  ],

  exports: [
    ProvidersService,
  ],
})
export class ProvidersModule {}
