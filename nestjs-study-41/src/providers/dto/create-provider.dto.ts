import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProviderDto {
  @IsIn(['openai', 'anthropic'])
  provider!: 'openai' | 'anthropic';

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  apiKey!: string;
}
