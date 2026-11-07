import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { MockAuthGuard } from './mock-auth.guard.js';

import {
  CaslAbilityFactory,
} from './casl-ability.factory.js';

import {
  RolesGuard,
} from './roles.guard.js';

import {
  PermissionsGuard,
} from './permissions.guard.js';

import {
  PoliciesGuard,
} from './policies.guard.js';

@Module({
  imports: [UsersModule],
  providers: [
    MockAuthGuard,
    CaslAbilityFactory,
    RolesGuard,
    PermissionsGuard,
    PoliciesGuard,
  ],

  exports: [
    UsersModule,
    MockAuthGuard,
    CaslAbilityFactory,
    RolesGuard,
    PermissionsGuard,
    PoliciesGuard,
  ],
})
export class AuthorizationModule {}
