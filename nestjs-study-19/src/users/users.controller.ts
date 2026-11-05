import { ParseDatabaseIdPipe } from '../common/pipes/parse-database-id.pipe.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/1
  @Get(':id')
  findOne(
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.usersService.findOne(id);
  }

  // POST /users
  @Post()
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.usersService.create(
      body.name,
      body.email,
    );
  }

  // DELETE /users/1
  @Delete(':id')
  remove(
    @Param('id', ParseDatabaseIdPipe) id: number,
  ) {
    return this.usersService.remove(id);
  }
}
