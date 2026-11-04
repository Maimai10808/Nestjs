import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { SearchService } from './search.service.js';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Get()
  search(
    @Query('q') query: string,
  ) {
    if (
      typeof query !== 'string' ||
      query.trim().length === 0
    ) {
      throw new BadRequestException(
        '搜索关键词不能为空',
      );
    }

    return this.searchService.search(query);
  }
}
