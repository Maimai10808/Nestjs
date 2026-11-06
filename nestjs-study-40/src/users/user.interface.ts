import { Role } from '../authorization/role.enum.js';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface StoredUser extends User {
  passwordHash: string;
}
