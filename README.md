# NestJS 中文实战学习仓库

基于 NestJS 官方文档、围绕真实业务场景组织的 TypeScript 后端学习项目。仓库目前包含 16 个独立 Study，适合能阅读 JavaScript、TypeScript、React、了解基本 HTTP，但尚未系统学习后端架构的开发者。

你将从用户接口、商品下单走到 Agent 管理、模型 Provider、请求作用域、懒加载和工具发现。业务代码尽量小，让每一个框架机制都能通过阅读、运行和修改得到验证。

## 怎样学习

官方文档用于确认概念、API 和使用限制；**当前项目源码是本仓库实现事实的依据**。目录编号不等于官方章节编号，Study 1 也保留了一些进阶实验。

1. 先看下面的路线，选择一章，阅读该章 README 的介绍和边界。
2. 按“推荐阅读顺序”打开源码，先确认模块注册，再沿一条请求跟到 Service。
3. 独立安装依赖、启动项目，执行 README 中成功和失败两类请求。
4. 观察响应、终端日志、实例 ID；对照解释判断框架机制是否真正触发。
5. 修改代码完成练习，运行本章检查，然后进入下一章。

推荐顺序为 1–16。初次读 Study 1 可以先完成用户接口，把作用域和订单实验留到 Study 2、11 后再回看。Study 8、10、12 分别展示容器 Provider、启动配置和运行时选择模型，它们是不同问题的解法。

## 学习路线

以下主题根据全部项目的实际源码整理，不按官方目录猜测。

| Study | 学习主题 | 真实业务场景 | 核心知识 | 项目入口 |
| --- | --- | --- | --- | --- |
| 1 | Controller 与 Provider 入门 | 用户 CRUD、Provider 实验、模拟下单 | HTTP 参数和响应、DTO、DI、可选依赖、Scope 初探 | [阅读](./nestjs-study-1/README.md) |
| 2 | 模块边界与服务协作 | 商品查询、下单与待支付记录 | imports、providers、exports、跨模块注入 | [阅读](./nestjs-study-2/README.md) |
| 3 | 中间件与异常过滤器 | 商品访问审计、Agent 错误实验 | MiddlewareConsumer、请求 ID、局部/全局 Filter | [阅读](./nestjs-study-3/README.md) |
| 4 | 参数管道与 DTO 验证 | 商品查询与创建 | Parse 管道、ValidationPipe、class-validator、自定义 Pipe | [阅读](./nestjs-study-4/README.md) |
| 5 | Guard 认证与角色授权 | 共享 Agent 目录 | AuthGuard、RolesGuard、Public、Reflector | [阅读](./nestjs-study-5/README.md) |
| 6 | Interceptor 请求与响应处理 | Agent 查询、缓存与故障实验 | Observable、响应转换、日志、缓存快照、超时、错误映射 | [阅读](./nestjs-study-6/README.md) |
| 7 | 自定义与组合装饰器 | 个人 Agent 管理 | CurrentUser、Public、Roles、Auth、资源归属 | [阅读](./nestjs-study-7/README.md) |
| 8 | 自定义 Provider | Mock AI 模型选择 | Symbol Token、useValue、useClass、useFactory、useExisting | [阅读](./nestjs-study-8/README.md) |
| 9 | 异步 Provider | Redis 中的 Agent 任务状态 | 异步工厂、连接就绪、Token、资源关闭 | [阅读](./nestjs-study-9/README.md) |
| 10 | 动态模块 | 启动时配置 AI 模型 | DynamicModule、register、配置注入、实现选择 | [阅读](./nestjs-study-10/README.md) |
| 11 | 注入作用域与持久依赖树 | Agent 请求上下文、公开租户分组 | DEFAULT、REQUEST、TRANSIENT、ContextIdStrategy、durable | [阅读](./nestjs-study-11/README.md) |
| 12 | ModuleRef 运行时查找 | 每次生成操作选择模型与上下文 | get、strict、resolve、ContextId 复用 | [阅读](./nestjs-study-12/README.md) |
| 13 | 模块懒加载 | 根据 Agent 类型加载研究或编程能力 | LazyModuleLoader、动态 import、ModuleRef、缓存 | [阅读](./nestjs-study-13/README.md) |
| 14 | 执行上下文与元数据 | 共享 Agent 的角色访问 | ExecutionContext、typed Reflector、Guard、Interceptor | [阅读](./nestjs-study-14/README.md) |
| 15 | 应用生命周期 | 异步 Agent 任务与关闭排空 | 初始化、停止接单、等待任务、释放资源、信号钩子 | [阅读](./nestjs-study-15/README.md) |
| 16 | DiscoveryService | Agent 工具目录和执行 | 自定义元数据、Provider 扫描、启动注册表 | [阅读](./nestjs-study-16/README.md) |

## 仓库结构

```text
Nestjs/
├── README.md
├── docs/
│   └── AUDIT.md                # 审查发现、修复和验证边界
├── scripts/
│   └── verify-studies.mjs      # 批量执行各章已有检查
├── nestjs-study-1/
├── nestjs-study-2/
├── nestjs-study-3/
├── nestjs-study-4/
├── nestjs-study-5/
├── nestjs-study-6/
├── nestjs-study-7/
├── nestjs-study-8/
├── nestjs-study-9/
├── nestjs-study-10/
├── nestjs-study-11/
├── nestjs-study-12/
├── nestjs-study-13/
├── nestjs-study-14/
├── nestjs-study-15/
└── nestjs-study-16/
```

每个 Study 自带 `package.json`、`pnpm-lock.yaml`、TypeScript/Nest/Vitest 配置、`src/main.ts` 和测试，独立安装、构建和启动。根目录没有把它们合并成应用或 pnpm workspace。各章业务数据也不互通。

## 开发环境与版本

本轮核对了全部 `package.json`、锁文件与已安装依赖。当前共同的声明与实际版本如下；新增章节仍应单独核对，不能依赖这张表自动升级。

| 工具 | 当前声明 | 锁文件及安装结果 |
| --- | --- | --- |
| Nest common/core/platform-express | `^12.0.1` | 12.3.2 |
| Nest CLI | `^12.0.0` | 12.0.11 |
| TypeScript | `^6.0.2` | 6.0.3 |
| Vite | `^8.0.0` | 8.3.5 |
| Vitest | `^4.1.2` | 4.1.12 |

本机验证使用 **Node.js 24.5.0、pnpm 12.3.4**。建议使用 Node.js 24；当前 Vite 要求 `^20.19.0 || >=22.12.0`，Vitest 要求 `^20 || ^22 || >=24`，不能只看 Nest 的 Node 最低要求。仓库原本没有统一的 engines 或 packageManager 锁定；安装时使用每章锁文件。

各章依赖有区别：1、4、6 安装了 class-validator/class-transformer；9 使用真实 Redis 客户端；8、10、12 的模型是本地 Mock。1 保留原有 Observe 依赖，但当前应用没有注册遥测模块，也不要求凭证。

全部采用 `type: module` 与 `module/moduleResolution: nodenext`，保留 `strict`、`isolatedModules`、装饰器元数据和声明输出。相对导入写 `.js`，TypeScript 在开发时解析对应 `.ts`，构建后由 Node 加载真实 `.js`。DTO class 需要运行时值；interface 等纯类型使用 `import type`。

## 运行一个项目

例如从仓库根目录开始：

```bash
cd nestjs-study-4
pnpm install --frozen-lockfile
pnpm start:dev
```

默认监听 `http://localhost:3000`。每次只启动一个默认端口的项目，或使用 `PORT=3104 pnpm start:dev`。有些章没有根路径 `/`，应调用本章 README 列出的业务路由。

在另一个终端进入同一项目目录验证：

```bash
pnpm build
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm test
pnpm test:e2e
```

`build` 检查生产源码与声明输出；完整 `tsc` 还检查测试和配置。e2e 导入已编译的 `dist` 模块，因此**先 build 再完整 tsc**；`test:e2e` 已包含构建步骤，不需要手动生成文件。`pnpm test` 中部分保留的脚手架测试只证明类本身，业务机制由各章 e2e 验证。

构建后 `pnpm start:prod` 只是本地运行 `node dist/main.js`，不涉及部署。Study 9 需要先启动 Redis 并设置可选的 `REDIS_URL`，具体步骤见该章；其他章不需要数据库或真实模型 Key。

如果各章依赖都已安装，可以在根目录执行：

```bash
node scripts/verify-studies.mjs        # 全部章节，逐章执行
node scripts/verify-studies.mjs 4 11   # 只验证指定章节
```

该脚本不安装依赖、不启动长期服务；输出每项检查结果，失败时返回非零退出码。Study 9 自动 e2e 使用客户端替身，真实 Redis 的独立验证范围见 [审查记录](docs/AUDIT.md)。

## 教学简化应怎样理解

- 内存数据会随进程重启丢失；示例没有数据库事务或多进程一致性。
- 固定 Bearer Token 和 API Key 是公开测试夹具，角色由服务端映射；它们没有密码登录、签名、有效期或撤销机制。
- Study 7 实现当前用户的资源归属检查；5、14 是共享目录，不能把它们的示例等同于完整多用户产品。
- Study 11 的 `x-tenant-id` 是两个公开 DI 分组标签，不代表认证后的租户身份或真实数据隔离。
- AI 模型、搜索和天气返回 Mock；动态模块中的 timeout/maxRetries 等配置不代表已经执行真实重试。

这些边界在各章 README 中有对应说明。学习时先验证当前实现，再把数据库、真实认证等作为单独的新主题推进。

## 后续学习计划

下列方向尚未作为新的完整 Study 交付，只是可选路线：配置管理、SQL 与 ORM、Redis 进阶、缓存、队列、任务调度、日志、文件上传、SSE、WebSocket、完整认证与授权、GraphQL、微服务，以及 AI Agent 后端架构。

增加下一章时，保留独立目录与锁文件；先定义一项可观察的业务问题，再编写源码和成功/失败验证。补齐中文 README 的真实目录、核心机制、推荐阅读顺序、练习与简化边界，最后把实际完成的章节加入学习路线。

参考：[NestJS 英文文档](https://docs.nestjs.com/)、[NestJS 中文文档](https://docs.nestjs.cn/introduction/)。参考文档有助于理解机制，版本相关行为仍以项目安装版本和测试为准。
