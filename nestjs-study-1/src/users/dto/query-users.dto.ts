import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QueryUsersDto {
  // GET /users?page=1
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  // GET /users?limit=10
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  // GET /users?name=Robin
  @IsOptional()
  @IsString()
  name?: string;

  // GET /users?city=Beijing
  @IsOptional()
  @IsString()
  city?: string;
}
