import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor() {
    console.log('[ChatService] 初始化');
  }

  async run(prompt: string) {
    return {
      type: 'chat',
      result: `普通聊天结果：${prompt}`,
    };
  }
}
