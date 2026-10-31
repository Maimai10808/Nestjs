export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  createdAt: Date;
}
