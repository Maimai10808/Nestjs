import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { MaxPasswordBytes } from './password-byte-length.validator.js';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxPasswordBytes(72)
  password!: string;
}
