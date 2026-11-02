import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUsersDto } from './dto/query-users.dto.js';

import type { User } from './interfaces/user.interface.js';


@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'Robin',
      email: 'robin@example.com',
      age: 22,
      city: 'Beijing',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Alice',
      email: 'alice@example.com',
      age: 25,
      city: 'Shanghai',
      createdAt: new Date(),
    },
  ];

  private nextId = 3;

  // 查询用户列表：支持过滤与分页
  findAll(query: QueryUsersDto) {
    const { page, limit, name, city } = query;

    let result = [...this.users];

    if (name) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (city) {
      result = result.filter((user) => user.city === city);
    }

    const total = result.length;
    const start = (page - 1) * limit;

    return {
      data: result.slice(start, start + limit),
      total,
      page,
      limit,
    };
  }

  // 查询单个用户
  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }

    return user;
  }

  // 创建用户
  create(dto: CreateUserDto) {
    const user: User = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  // 更新用户
  update(id: number, dto: UpdateUserDto) {
    const user = this.findOne(id);

    Object.assign(user, dto);

    return user;
  }

  // PUT 保留服务端字段，但移除本次请求未提供的可选业务字段。
  replace(id: number, dto: CreateUserDto): User {
    const existing = this.findOne(id);
    const replacement: User = { ...dto, id, createdAt: existing.createdAt };
    this.users = this.users.map((user) => user.id === id ? replacement : user);
    return replacement;
  }

  // 删除用户
  remove(id: number) {
    const user = this.findOne(id);

    this.users = this.users.filter((item) => item.id !== id);

    return user;
  }

  // 获取用户总数
  count() {
    return this.users.length;
  }
}
