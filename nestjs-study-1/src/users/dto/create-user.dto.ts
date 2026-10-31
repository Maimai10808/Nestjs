import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  // 必填，至少两个字符
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  // 必填，必须符合邮箱格式
  @IsEmail()
  email!: string;

  // 可选，年龄限制 1～120
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  // 可选，普通字符串
  @IsOptional()
  @IsString()
  city?: string;
}
