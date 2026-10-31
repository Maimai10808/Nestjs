import { Reflector } from '@nestjs/core';
import type { Role } from './auth.types.js';

export const Roles = Reflector.createDecorator<Role[]>();
