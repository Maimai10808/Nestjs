import { Injectable } from '@nestjs/common';

import { ProductsService } from '../products/products.service.js';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  getProductCount() {
    return {
      count: this.productsService.findAll().length,
    };
  }
}
