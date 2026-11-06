export interface User {
  id: number;
  username: string;
  email: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}
