export type Role = 'admin' | 'developer' | 'viewer';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}
