import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAgentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
