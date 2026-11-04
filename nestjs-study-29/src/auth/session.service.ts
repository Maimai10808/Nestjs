import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

interface Session {
  userId: number;
  expiresAt: number;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, Session>();

  private readonly sessionDuration = 60 * 60 * 1000;

  createSession(userId: number): string {
    const sessionId = randomBytes(32).toString('hex');

    this.sessions.set(sessionId, {
      userId,
      expiresAt: Date.now() + this.sessionDuration,
    });

    return sessionId;
  }

  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
