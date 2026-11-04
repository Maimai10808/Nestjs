import { Module } from '@nestjs/common';

import { AuditController } from './audit.controller.js';
import { AuditService } from './audit.service.js';
import { AuditListener } from './audit.listener.js';

@Module({
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditListener,
  ],
})
export class AuditModule {}
