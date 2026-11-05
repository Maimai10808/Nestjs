import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateAgentDto {
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  enabled?: boolean;
}
