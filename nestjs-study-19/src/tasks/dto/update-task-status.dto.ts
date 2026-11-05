import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { AgentTaskStatus } from '../entities/agent-task.entity.js';

export class UpdateTaskStatusDto {
  @IsEnum(AgentTaskStatus)
  status!: AgentTaskStatus;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  output?: string;
}
