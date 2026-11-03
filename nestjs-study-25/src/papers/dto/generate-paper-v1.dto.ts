import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class GeneratePaperV1Dto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  topic!: string;
}
