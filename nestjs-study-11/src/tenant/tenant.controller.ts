import {
  Controller,
  Get,
} from '@nestjs/common';

import { TenantService } from './tenant.service.js';

@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
  ) {}

  @Get('info')
  getInfo() {
    return this.tenantService.getInfo();
  }
}
