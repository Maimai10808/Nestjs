import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro',
      price: 14999,
      stock: 10,
    },
    {
      id: 2,
      name: 'iPhone',
      price: 6999,
      stock: 20,
    },
  ];

  // 查询全部商品
  findAll(): Product[] {
    return this.products;
  }

  // 根据 ID 查询商品
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  // 扣减库存
  decreaseStock(id: number, quantity: number): void {
    const product = this.findOne(id);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('购买数量必须是正整数');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('库存不足');
    }

    product.stock -= quantity;
  }
}
