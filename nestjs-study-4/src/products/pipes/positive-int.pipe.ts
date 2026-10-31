import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveIntPipe
  implements PipeTransform<string, number>
{
  transform(
    value: string,
    metadata: ArgumentMetadata,
  ): number {
    console.log('原始参数：', value);

    console.log('参数元数据：', metadata);

    const number = Number(value);

    if (
      !Number.isSafeInteger(number) ||
      number <= 0
    ) {
      throw new BadRequestException(
        '参数必须是正整数',
      );
    }

    return number;
  }
}
