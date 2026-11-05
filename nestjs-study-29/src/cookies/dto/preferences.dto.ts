import { IsIn } from 'class-validator';

export class PreferencesDto {
  @IsIn(['light', 'dark'])
  theme!: 'light' | 'dark';

  @IsIn(['zh-CN', 'en-US'])
  language!: 'zh-CN' | 'en-US';
}
