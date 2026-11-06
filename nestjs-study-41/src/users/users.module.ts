import { Module } from '@nestjs/common';

import { UsersService } from './users.service.js';

import { SecurityModule } from '../security/security.module.js';

@Module({
  imports: [
    SecurityModule,
  ],

  providers: [
    UsersService,
  ],

  exports: [
    UsersService,
  ],
})
export class UsersModule {}
