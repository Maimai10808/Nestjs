import {
  applyDecorators,
  UseGuards,
} from '@nestjs/common';

import { Roles } from './roles.decorator.js';

import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

export function Auth(...roles: string[]) {
  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
