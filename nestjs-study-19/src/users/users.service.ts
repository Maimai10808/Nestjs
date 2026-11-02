import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 查询所有用户
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 查询单个用户
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },

      relations: {
        agents: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // 创建用户
  async create(
    name: string,
    email: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      name,
      email,
    });

    return this.userRepository.save(user);
  }

  // 删除用户
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('用户不存在');
    }
  }
}
