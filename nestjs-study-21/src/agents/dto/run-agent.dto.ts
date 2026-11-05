import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsInt,
  IsOptional,
  IsObject,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

import { Type } from 'class-transformer';

// Agent 执行选项
export class AgentRunOptionsDto {
  // 是否启用流式响应
  @IsOptional()
  @IsBoolean()
  stream?: boolean;

  // 最大生成 Token 数量
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  maxTokens?: number;
}

// Agent 执行请求
export class RunAgentDto {
  // 用户输入
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10000)
  input!: string;

  // 嵌套执行选项
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AgentRunOptionsDto)
  options?: AgentRunOptionsDto;

  // 任务标签
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}
