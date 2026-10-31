import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

import { AuditService } from '../services/audit.service.js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly auditService: AuditService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.auditService.record(req.method, req.originalUrl);

    next();
  }
}
