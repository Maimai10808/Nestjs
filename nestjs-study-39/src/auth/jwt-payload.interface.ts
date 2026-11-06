export interface JwtPayload {
  sub: number;
  username: string;
  role: 'user' | 'admin';
}

export interface AuthenticatedUser
  extends JwtPayload {
  iat?: number;
  exp?: number;
}
