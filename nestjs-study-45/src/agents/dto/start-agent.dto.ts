import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StartAgentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  prompt!: string;
}
