import {
  Controller,
  Get,
} from '@nestjs/common';

import { AuditService } from './audit.service.js';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Get()
  findAll() {
    return this.auditService.findAll();
  }
}
