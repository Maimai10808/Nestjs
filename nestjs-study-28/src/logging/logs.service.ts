import { Injectable } from '@nestjs/common';

export type BusinessLogLevel =
  | 'log'
  | 'warn'
  | 'error'
  | 'debug';

export interface BusinessLog {
  id: number;
  level: BusinessLogLevel;
  context: string;
  message: string;
  timestamp: string;
}

@Injectable()
export class LogsService {
  private readonly logs: BusinessLog[] = [];

  private nextId = 1;

  add(
    level: BusinessLogLevel,
    context: string,
    message: string,
  ): BusinessLog {
    const log: BusinessLog = {
      id: this.nextId++,
      level,
      context,
      message,
      timestamp: new Date().toISOString(),
    };

    this.logs.push(log);

    return log;
  }

  findAll(): BusinessLog[] {
    return [...this.logs];
  }

  findByLevel(
    level: BusinessLogLevel,
  ): BusinessLog[] {
    return this.logs.filter(
      (log) => log.level === level,
    );
  }

  getStats() {
    return {
      total: this.logs.length,

      errors: this.logs.filter(
        (log) => log.level === 'error',
      ).length,

      warnings: this.logs.filter(
        (log) => log.level === 'warn',
      ).length,

      info: this.logs.filter(
        (log) => log.level === 'log',
      ).length,

      debug: this.logs.filter(
        (log) => log.level === 'debug',
      ).length,
    };
  }
}
