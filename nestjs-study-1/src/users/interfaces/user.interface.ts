export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;

  // 用户所在城市
  city?: string;

  // 用户创建时间
  createdAt: Date;
}
