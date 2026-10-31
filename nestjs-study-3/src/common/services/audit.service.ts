import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  record(method: string, url: string) {
    console.log(`[AuditService] ${method} ${url}`);
  }
}
