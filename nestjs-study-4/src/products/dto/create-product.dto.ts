import {
  IsString,
  IsNumber,
  IsInt,
  IsEnum,
  Min,
  MinLength,
} from 'class-validator';

import { ProductStatus } from '../interfaces/product.interface.js';

export class CreateProductDto {
  // 商品名称必须是字符串，至少两个字符
  @IsString()
  @MinLength(2)
  name: string;

  // 商品价格必须是数字，且不能为负数
  @IsNumber()
  @Min(0)
  price: number;

  // 库存必须是整数，且不能为负数
  @IsInt()
  @Min(0)
  stock: number;

  // 商品状态必须是枚举中的值
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
