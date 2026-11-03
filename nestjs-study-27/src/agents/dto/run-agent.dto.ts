import {
  IsInt,
  IsString,
  IsNotEmpty,
  Min,
  MaxLength,
  IsOptional,
  MinLength,
} from 'class-validator';

export class RunAgentDto {
  @IsInt()
  @Min(1)
  agentId!: number;

  @IsInt()
  @Min(1)
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(2000)
  input!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  delay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;
}
