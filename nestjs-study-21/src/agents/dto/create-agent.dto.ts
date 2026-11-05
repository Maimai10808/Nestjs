import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsInt,
  ValidateIf,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateAgentDto {
  // Agent 名称：必须是字符串，长度 3～50
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  // Agent 描述：可选，最长 500 字符
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  @MaxLength(500)
  description?: string;

  // 只允许使用指定模型
  @IsString()
  @IsIn([
    'gpt-4.1',
    'gpt-4.1-mini',
    'claude-sonnet',
  ])
  model!: string;

  // Temperature：0～2
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature!: number;

  // Agent 最大执行步数：1～100
  @IsInt()
  @Min(1)
  @Max(100)
  maxSteps!: number;

  // 工具列表
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsIn(
    ['web_search', 'calculator', 'code_executor'],
    { each: true },
  )
  tools!: string[];

  // 是否启用
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  enabled?: boolean;
}
