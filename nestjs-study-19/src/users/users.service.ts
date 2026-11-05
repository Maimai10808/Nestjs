import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, QueryFailedError } from 'typeorm';

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

  async assertExists(id: number): Promise<void> {
    if (!(await this.userRepository.existsBy({ id }))) {
      throw new NotFoundException('用户不存在');
    }
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

    try {
      return await this.userRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError && 'code' in error.driverError && error.driverError.code === '23505') {
        throw new ConflictException('邮箱已存在');
      }
      throw error;
    }
  }

  // 删除用户
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('用户不存在');
    }
  }
}
