import {
  Injectable,
  Logger,
  BadGatewayException,
} from '@nestjs/common';

import {
  HttpService,
} from '@nestjs/axios';

import {
  AxiosError,
} from 'axios';

import {
  firstValueFrom,
  catchError,
} from 'rxjs';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(
    SearchService.name,
  );

  private readonly baseUrl =
    'http://127.0.0.1:3000';

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async search(
    query: string,
  ): Promise<SearchResponse> {
    this.logger.log(
      `开始搜索：${query}`,
    );

    const { data } = await firstValueFrom(
      this.httpService
        .get<SearchResponse>(
          `${this.baseUrl}/external/search`,
          {
            params: {
              q: query,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `外部搜索 API 调用失败：${error.message}`,
            );

            throw new BadGatewayException(
              '外部搜索服务暂时不可用',
            );
          }),
        ),
    );

    this.logger.log(
      `搜索完成，共 ${data.results.length} 条结果`,
    );

    return data;
  }
}
