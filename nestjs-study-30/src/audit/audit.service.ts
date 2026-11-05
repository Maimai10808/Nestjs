import { Injectable } from '@nestjs/common';

export interface AuditRecord {
  id: number;
  executionId: number;
  userId: number;
  agentId: number;
  action: string;
  details: string;
  createdAt: string;
}

@Injectable()
export class AuditService {
  private readonly records: AuditRecord[] = [];

  private nextId = 1;

  record(
    executionId: number,
    userId: number,
    agentId: number,
    action: string,
    details: string,
  ): AuditRecord {
    const record: AuditRecord = {
      id: this.nextId++,
      executionId,
      userId,
      agentId,
      action,
      details,
      createdAt: new Date().toISOString(),
    };

    this.records.push(record);

    return record;
  }

  findAll(): AuditRecord[] {
    return this.records;
  }
}
