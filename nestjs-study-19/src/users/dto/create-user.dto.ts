import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;
}
