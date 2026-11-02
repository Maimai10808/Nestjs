import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  type Product,
  ProductStatus,
} from './interfaces/product.interface.js';

import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro',
      price: 12999,
      stock: 10,
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'iPhone',
      price: 6999,
      stock: 20,
      status: ProductStatus.INACTIVE,
      createdAt: new Date(),
    },
  ];

  private nextId = 3;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find(
      (item) => item.id === id,
    );

    if (!product) {
      throw new NotFoundException(
        `商品 ${id} 不存在`,
      );
    }

    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      ...dto,
      createdAt: new Date(),
    };

    this.products.push(product);

    return product;
  }

  findByStatus(status: ProductStatus): Product[] {
    return this.products.filter(
      (product) => product.status === status,
    );
  }

  findByPrice(minPrice: number): Product[] {
    return this.products.filter(
      (product) => product.price >= minPrice,
    );
  }
}
