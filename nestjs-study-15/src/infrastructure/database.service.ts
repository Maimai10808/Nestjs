import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';

@Injectable()
export class DatabaseService
  implements OnModuleInit, OnApplicationShutdown
{
  private connected = false;

  constructor() {
    console.log('[Database] constructor 执行');
  }

  async onModuleInit(): Promise<void> {
    console.log('[Database] 开始初始化数据库连接');

    // 模拟数据库连接耗时
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.connected = true;

    console.log('[Database] 数据库连接成功');
  }

  // 所有 beforeApplicationShutdown 排空完成后才释放共享资源。
  onApplicationShutdown(): void {
    console.log('[Database] 开始释放数据库资源');

    this.connected = false;

    console.log('[Database] 数据库资源已释放');
  }

  isConnected(): boolean {
    return this.connected;
  }
}
