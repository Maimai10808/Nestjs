import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ExecuteAgentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  prompt!: string;

  @IsIn([
    'gpt-4.1',
    'claude-sonnet',
  ])
  model!: 'gpt-4.1' | 'claude-sonnet';
}
