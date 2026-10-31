import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private readonly products = [
    { id: 1, name: 'MacBook Pro', price: 15000 },
    { id: 2, name: 'iPhone', price: 8000 },
    { id: 3, name: 'iPad', price: 5000 },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find(
      (item) => item.id === id,
    );

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }
}
