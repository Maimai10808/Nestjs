export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface StoredUser extends User {
  passwordHash: string;
}
