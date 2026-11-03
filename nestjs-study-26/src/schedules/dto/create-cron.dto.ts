import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateCronDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  name!: string;

  @IsInt()
  @Min(1)
  agentId!: number;

  @IsString()
  @IsNotEmpty()
  cronExpression!: string;
}
