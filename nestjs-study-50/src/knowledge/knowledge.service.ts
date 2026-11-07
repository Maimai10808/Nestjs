import {
  Injectable,
  Logger,
} from '@nestjs/common';

import { documents } from './documents.js';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(
    KnowledgeService.name,
  );

  async buildIndex() {
    this.logger.log(
      '开始构建 AI 知识库索引',
    );

    const chunks = documents.flatMap(
      (document) => {
        return [
          {
            documentId: document.id,
            title: document.title,
            text: document.content,
          },
        ];
      },
    );

    const embeddings = chunks.map(
      (chunk, index) => ({
        ...chunk,

        // 教学用模拟向量，不是真实 Embedding
        embedding: [
          index * 0.1,
          index * 0.2,
          index * 0.3,
        ],
      }),
    );

    this.logger.log(
      `已处理 ${documents.length} 个文档`,
    );

    this.logger.log(
      `生成 ${chunks.length} 个 Chunk`,
    );

    this.logger.log(
      `生成 ${embeddings.length} 个模拟向量`,
    );

    return embeddings;
  }
}
