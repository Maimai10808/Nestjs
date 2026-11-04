import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class UploadMetadataDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  agentId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
