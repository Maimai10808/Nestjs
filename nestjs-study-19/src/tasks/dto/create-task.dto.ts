import { IsInt, IsString, Matches, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  agentId!: number;

  @IsString()
  @Matches(/\S/)
  input!: string;
}
