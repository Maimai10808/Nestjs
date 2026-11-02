import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { ProductsService } from './products.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { PositiveIntPipe } from './pipes/positive-int.pipe.js';

import {
  type Product,
  ProductStatus,
} from './interfaces/product.interface.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // 1. 查询所有商品
  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  // 2. ParseIntPipe：将字符串 ID 转换成整数
  @Get('detail/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Product {
    return this.productsService.findOne(id);
  }

  @Get('positive/:id')
  findPositive(@Param('id', PositiveIntPipe) id: number): Product {
    return this.productsService.findOne(id);
  }

  // 3. DefaultValuePipe + ParseIntPipe
  @Get('pagination')
  getPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,
  ) {
    return {
      page,
      limit,
      message: '分页参数解析成功',
    };
  }

  // 4. ParseBoolPipe：转换布尔值
  @Get('filter/active')
  filterActive(
    @Query('active', ParseBoolPipe)
    // 全局 ValidationPipe 会提前转换 Boolean 元数据；unknown 保留原始输入给 ParseBoolPipe。
    active: unknown,
  ) {
    return {
      active,
      type: typeof active,
    };
  }

  // 5. ParseEnumPipe：验证枚举值
  @Get('filter/status')
  filterStatus(
    @Query(
      'status',
      new ParseEnumPipe(ProductStatus),
    )
    status: ProductStatus,
  ): Product[] {
    return this.productsService.findByStatus(status);
  }

  // 6. ParseIntPipe：价格筛选
  @Get('filter/price')
  filterPrice(
    @Query('minPrice', ParseIntPipe)
    minPrice: number,
  ): Product[] {
    return this.productsService.findByPrice(minPrice);
  }

  // 7. ValidationPipe：验证 DTO
  @Post()
  create(
    @Body() dto: CreateProductDto,
  ): Product {
    return this.productsService.create(dto);
  }
}
