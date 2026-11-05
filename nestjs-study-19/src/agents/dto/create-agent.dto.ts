import { IsInt, IsString, Matches, MaxLength, Min, Max } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  model!: string;

  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  userId!: number;
}
