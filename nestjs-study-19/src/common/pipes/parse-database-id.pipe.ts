import {
  BadRequestException,
  Injectable,
  ParseIntPipe,
  type ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseDatabaseIdPipe extends ParseIntPipe {
  override async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<number> {
    const id = await super.transform(value, metadata);
    if (typeof id !== 'number' || id < 1 || id > 2_147_483_647) {
      throw new BadRequestException('ID 必须在 1～2147483647 之间');
    }
    return id;
  }
}
