# NestJS Study 47：自定义 WebSocket Adapter 与 Redis 广播

当两个 NestJS 实例分别接收客户端连接时，仅使用进程内 Room 无法把实例 A 的任务进度推送给实例 B 的订阅者。本章通过 Socket.IO Redis Adapter 解决这个消息分发问题，业务仍是模拟 Deep Research。

## 核心知识

- `app.useWebSocketAdapter()` 决定 Gateway 使用哪种底层连接方式。
- 自定义 [RedisIoAdapter](./src/adapters/redis-io.adapter.ts) 继承 IoAdapter，在创建 Socket.IO Server 后安装 Redis Adapter。
- Redis 的 pub/sub 两条连接负责跨实例分发广播，不负责保存业务任务。
- Service 的 `onModuleDestroy()` 取消本实例的模拟延时，防止 Adapter 关闭后继续发布。
- Adapter 的 `dispose()` 销毁两条 pub/sub 连接，不等待失联 Redis 对 `QUIT` 的回复；这些连接没有需要持久化的业务写入。
- 已安装的 Redis Adapter 8.3 不等待订阅命令的 Promise；本章为这些命令补充拒绝观察，正常运行时记录错误，关闭时消化主动销毁产生的拒绝，仍将原 Promise 返回给调用方。

## 结构与阅读顺序

```text
src/
├── main.ts
├── app.module.ts
├── adapters/redis-io.adapter.ts
├── agents/
│   ├── agents.gateway.ts
│   ├── agents.service.ts
│   ├── agents.module.ts
│   ├── agent.interface.ts
│   └── native-agents.gateway.ts
└── health/
    ├── health.module.ts
    └── health.controller.ts
client/socket-client.ts
docker-compose.yml
```

先读 [main.ts](./src/main.ts) 的连接、安装 Adapter、监听顺序；再读自定义 Adapter 和 [Gateway](./src/agents/agents.gateway.ts) 的 Room；最后读 [Service](./src/agents/agents.service.ts) 和客户端。

`native-agents.gateway.ts` 保留了原生 ws 的消息响应对照代码，但**当前 AgentsModule 没有注册它，main.ts 也没有安装 WsAdapter**。因此本章实际运行入口为 Socket.IO，`/agents-ws` 不是已开放的接口。

## 运行流程

```mermaid
flowchart LR
    A[实例 A 的订阅客户端] --> B[agent.subscribe 加入 Room]
    C[实例 B 的启动客户端] --> D[agent.start]
    D --> E[模拟研究五阶段]
    E --> F[实例 B Socket.IO 广播]
    F --> G[Redis pub/sub]
    G --> H[实例 A Socket.IO]
    H --> A
```

`agent.subscribe` 和 `agent.start` 接受 `{"taskId":"research-1001"}`，都加入 `task:research-1001`。执行实例每秒推送一次 `agent.progress`，依次为 planning、searching、analyzing、generating、completed，进度到 100。

同名 Room 是公开演示频道；taskId 由客户端选择，没有登录、资源权限和分布式任务去重。Redis Adapter 只传播消息，不会让多个 Nest 实例共享 Service 的 JavaScript 对象，也不提供任务持久化、补发和 Worker 调度。

## 启动两个实例

要求 Node.js 24、pnpm 12、Redis。依赖锁定的 NestJS 为 12.3.3。可以使用本章提供的 Redis 容器：

```bash
pnpm install --frozen-lockfile
docker compose up -d redis
```

该配置只向本机暴露 6379，关闭持久化。已有 Redis 时可以直接指定 `REDIS_URL`，不要覆盖其他项目的数据或进程。

终端 A：

```bash
INSTANCE_ID=A PORT=3000 REDIS_URL=redis://127.0.0.1:6379 pnpm start:dev
```

终端 B：

```bash
INSTANCE_ID=B PORT=3001 REDIS_URL=redis://127.0.0.1:6379 pnpm start:dev
```

终端 C 订阅实例 A，终端 D 从实例 B 启动相同频道：

```bash
PORT=3000 TASK_ID=research-1001 MODE=subscribe pnpm exec tsx client/socket-client.ts
```

```bash
PORT=3001 TASK_ID=research-1001 MODE=start pnpm exec tsx client/socket-client.ts
```

预期两个客户端都收到五次进度，100 时断开。若 taskId 不同，应互相看不到频道事件。

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
pnpm build
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm test
REDIS_URL=redis://127.0.0.1:6379 pnpm test:e2e
```

E2E 在随机 HTTP 端口启动两个真实应用，共用指定 Redis，跨实例订阅、广播并关闭；另通过本地 TCP 代理模拟连接仍在但服务不回复的情况，验证应用能完成关闭；还在接受任务后立即关闭应用并等待原五阶段时长，确认没有延迟发布引发的未处理拒绝。单元测试验证应用销毁时停止模拟流程，且不再产生进度回调。它不 Mock Redis。Redis 不可用意味着这条核心验证受阻，不能仅凭类型检查宣称广播通过。

## 常见问题与边界

- Redis 未启动或 URL 错误时应用无法完成 Adapter 初始化；先确认容器或本地 Redis 可达。
- 客户端强制 WebSocket transport，因此不会演示多实例 HTTP polling 的粘性会话配置。
- Gateway 中的开放 CORS 是公开频道演示配置，不是权限控制。生产私有任务应在认证之后验证订阅权限。
- 模拟流程不随单个订阅者断开取消；本实例应用关闭时会取消本地延时。这不等于持久后台任务或真实模型调用的取消，也没有任务恢复；重复 `agent.start` 会启动多条模拟执行。
- 所有研究内容由定时器产生，没有收费 API。

练习：用不同 taskId 对比 Room 隔离；停掉其中一个客户端观察另一个；给广播加 instanceId；阅读未注册的 NativeAgentsGateway，说明切换到原生 ws 还需要修改哪些注册和客户端协议。

本章应掌握的是消息传输与业务任务两个层次的区别。Redis Adapter 的作用是分发 Socket.IO 广播，下一章则使用 TCP Transport 执行服务间请求。

参考：[NestJS WebSocket Adapter](https://docs.nestjs.com/websockets/adapter)。
