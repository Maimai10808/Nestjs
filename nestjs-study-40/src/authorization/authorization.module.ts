import { Module } from '@nestjs/common';

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
  providers: [
    CaslAbilityFactory,
    RolesGuard,
    PermissionsGuard,
    PoliciesGuard,
  ],

  exports: [
    CaslAbilityFactory,
    RolesGuard,
    PermissionsGuard,
    PoliciesGuard,
  ],
})
export class AuthorizationModule {}
