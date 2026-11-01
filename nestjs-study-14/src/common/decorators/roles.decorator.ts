import { SetMetadata } from '@nestjs/common';

// 元数据 Key

export const ROLES_KEY = 'roles';

// 自定义角色装饰器

export const Roles = (...roles: string[]) =>

  SetMetadata(ROLES_KEY, roles);
