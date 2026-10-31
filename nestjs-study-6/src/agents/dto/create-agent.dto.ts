import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsIn(['active', 'inactive'])
  status!: 'active' | 'inactive';
}
