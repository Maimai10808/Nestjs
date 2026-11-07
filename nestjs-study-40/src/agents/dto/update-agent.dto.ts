import {
  IsNotEmpty,
  ValidateIf,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAgentDto {
  @ValidateIf((_object: object, value: unknown) => value !== undefined)
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ValidateIf((_object: object, value: unknown) => value !== undefined)
  @IsNotEmpty()
  @IsString()
  model?: string;
}
