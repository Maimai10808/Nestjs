import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResearchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  topic!: string;

  @IsIn([
    'gpt-4.1',
    'claude-sonnet',
  ])
  model!: 'gpt-4.1' | 'claude-sonnet';
}
