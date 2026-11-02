import { Reflector } from '@nestjs/core';

export type Role = 'user' | 'admin';

// 装饰器本身携带元数据 Key，Guard 使用同一引用读取角色。
export const Roles = Reflector.createDecorator<Role[]>();
