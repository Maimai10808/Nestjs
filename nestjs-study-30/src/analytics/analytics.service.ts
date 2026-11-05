import { Injectable } from '@nestjs/common';

export interface UserAnalytics {
  userId: number;
  totalExecutions: number;
  totalTokens: number;
}

@Injectable()
export class AnalyticsService {
  private readonly analytics = new Map<
    number,
    UserAnalytics
  >();

  recordExecution(
    userId: number,
    tokensUsed: number,
  ): void {
    const current = this.analytics.get(userId);

    if (!current) {
      this.analytics.set(userId, {
        userId,
        totalExecutions: 1,
        totalTokens: tokensUsed,
      });

      return;
    }

    current.totalExecutions += 1;
    current.totalTokens += tokensUsed;
  }

  findAll(): UserAnalytics[] {
    return Array.from(
      this.analytics.values(),
    );
  }
}
