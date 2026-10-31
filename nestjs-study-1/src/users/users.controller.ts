import {
  All,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';


import { UsersService } from './users.service.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { QueryUsersDto } from './dto/query-users.dto.js';

interface RequestInfo {
  method: string;
  url: string;
  query: Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
}

@Controller('users')
export class UsersController {
  // DI：通过构造函数注入 Service
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =====================================================
  // 1. GET：查询用户列表
  // =====================================================

  // GET /users
  // GET /users?page=1&limit=10
  // GET /users?name=Robin&city=Beijing

  @Get()
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  // =====================================================
  // 2. GET：获取用户数量
  // =====================================================

  // GET /users/count

  @Get('count')
  getCount() {
    return {
      total: this.usersService.count(),
    };
  }

  // =====================================================
  // 3. GET：单独读取 Query 参数
  // =====================================================

  // GET /users/search?keyword=Robin&page=1

  @Get('search')
  search(
    @Query('keyword') keyword?: string,
    @Query('page', new ParseIntPipe({ optional: true }))
    page: number = 1,
  ) {
    return {
      keyword,
      page,
      message: '演示 @Query() 参数装饰器',
    };
  }

  // =====================================================
  // 4. GET：读取 HTTP Headers
  // =====================================================

  // GET /users/request-headers

  @Get('request-headers')
  getHeaders(
    @Headers('user-agent') userAgent?: string,
    @Headers('authorization') authorization?: string,
  ) {
    return {
      userAgent,
      authorization,
    };
  }

  // =====================================================
  // 5. GET：读取客户端 IP
  // =====================================================

  // GET /users/client-ip

  @Get('client-ip')
  getClientIp(@Ip() ip: string) {
    return {
      ip,
    };
  }

  // =====================================================
  // 6. GET：获取原始 Request 对象
  // =====================================================

  // GET /users/request-info

  @Get('request-info')
  getRequestInfo(@Req() req: Request): RequestInfo {
    return {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      query: req.query,
    };
  }

  // =====================================================
  // 7. GET：自定义响应头
  // =====================================================

  // GET /users/custom-header

  @Get('custom-header')
  @Header('X-App-Name', 'NestJS-Study')
  @Header('Cache-Control', 'no-store')
  customHeader() {
    return {
      message: '请检查 HTTP Response Headers',
    };
  }

  // =====================================================
  // 8. GET：自定义状态码
  // =====================================================

  // GET /users/custom-status

  @Get('custom-status')
  @HttpCode(HttpStatus.ACCEPTED)
  customStatus() {
    return {
      message: 'HTTP 202 Accepted',
    };
  }

  // =====================================================
  // 9. GET：重定向
  // =====================================================

  // GET /users/docs

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  redirectToDocs() {
    // 重定向地址由装饰器决定
  }

  // =====================================================
  // 10. GET：动态重定向
  // =====================================================

  // GET /users/dynamic-redirect?version=10

  @Get('dynamic-redirect')
  @Redirect('https://nestjs.com', 302)
  dynamicRedirect(@Query('version') version?: string) {
    if (version === '10') {
      return {
        url: 'https://docs.nestjs.com',
        statusCode: 301,
      };
    }

    return {
      url: 'https://nestjs.com',
    };
  }

  // =====================================================
  // 11. GET：原生 Express Response
  // =====================================================

  // GET /users/native-response

  @Get('native-response')
  nativeResponse(@Res() res: Response) {
    return res
      .status(200)
      .setHeader('X-Response-Type', 'Express')
      .json({
        message: '使用 Express 原生响应',
      });
  }

  // =====================================================
  // 12. GET：Passthrough Response
  // =====================================================

  // GET /users/passthrough

  @Get('passthrough')
  passthrough(
    @Res({ passthrough: true }) res: Response,
  ) {
    res.status(202);

    res.setHeader(
      'X-Response-Type',
      'NestJS-Passthrough',
    );

    // 仍然交给 NestJS 处理返回值
    return {
      message: '同时使用 Response 和 NestJS 标准响应',
    };
  }

  // =====================================================
  // 13. POST：创建用户
  // =====================================================

  // POST /users

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'no-store')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // =====================================================
  // 14. POST：读取 Body 中的指定字段
  // =====================================================

  // POST /users/body-example

  @Post('body-example')
  bodyExample(
    @Body('name') name: string,
    @Body('email') email: string,
  ) {
    return {
      name,
      email,
      message: '演示 @Body(key)',
    };
  }

  // =====================================================
  // 15. POST：返回 204 No Content
  // =====================================================

  // POST /users/no-content

  @Post('no-content')
  @HttpCode(HttpStatus.NO_CONTENT)
  noContent() {
    // 204 响应不应包含响应体
  }

  // =====================================================
  // 16. GET：动态路由参数
  // =====================================================

  // GET /users/1

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.findOne(id);
  }

  // =====================================================
  // 17. GET：多个动态路由参数
  // =====================================================

  // GET /users/1/orders/100

  @Get(':id/orders/:orderId')
  getUserOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return {
      userId: id,
      orderId,
      message: '演示多个 @Param() 参数',
    };
  }

  // =====================================================
  // 18. PUT：完整更新用户
  // =====================================================

  // PUT /users/1

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateUserDto,
  ) {
    // 学习示例：复用更新逻辑
    // 实际 PUT 通常应实现完整替换语义
    return this.usersService.update(id, dto);
  }

  // =====================================================
  // 19. PATCH：部分更新用户
  // =====================================================

  // PATCH /users/1

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // =====================================================
  // 20. DELETE：删除用户
  // =====================================================

  // DELETE /users/1

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      message: '删除成功',
      data: this.usersService.remove(id),
    };
  }

  // =====================================================
  // 21. ALL：匹配所有 HTTP 请求方法
  // =====================================================

  // GET /users/debug/all
  // POST /users/debug/all
  // PUT /users/debug/all

  @All('debug/all')
  allMethods(@Req() req: Request) {
    return {
      method: req.method,
      message: '@All() 可以匹配多种 HTTP 方法',
    };
  }
}
