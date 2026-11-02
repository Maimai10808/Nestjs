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

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  create(name: unknown, price: unknown): Product {
    if (typeof name !== 'string' || !name.trim() || typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      throw new BadRequestException('商品名称不能为空，价格必须是非负有限数字');
    }
    const product: Product = {
      id: this.products.length + 1,
      name: name.trim(),
      price,
      stock: 0,
    };

    this.products.push(product);

    return product;
  }
}
