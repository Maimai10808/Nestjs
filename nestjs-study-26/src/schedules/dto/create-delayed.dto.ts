import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDelayedDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  name!: string;

  @IsInt()
  @Min(1)
  agentId!: number;

  @IsInt()
  @Min(1000)
  @Max(3600000)
  delayMs!: number;
}
