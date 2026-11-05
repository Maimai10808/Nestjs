import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsDefined,
  IsObject,
} from 'class-validator';

import { Type } from 'class-transformer';

export class PaperConfigDto {
  @IsIn(['research', 'review', 'essay'])
  paperType!: string;

  @IsInt()
  @Min(500)
  @Max(20000)
  wordCount!: number;

  @IsIn(['APA', 'MLA', 'Chicago'])
  citationStyle!: string;

  @IsIn([
    'gpt-4.1',
    'gpt-4.1-mini',
    'claude-sonnet',
  ])
  model!: string;
}

export class GeneratePaperV2Dto {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => PaperConfigDto)
  config!: PaperConfigDto;
}
