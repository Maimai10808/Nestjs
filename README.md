# NestJS 中文实战学习仓库

基于 NestJS 官方文档、围绕真实业务场景组织的 TypeScript 后端学习项目。仓库目前包含 38 个独立目录：Study 1–16 为概述与 Fundamentals，Study 17–19、21–38 为已实现的 Techniques 示例，Study 20 仍是脚手架，适合能阅读 JavaScript、TypeScript、React、了解基本 HTTP，但尚未系统学习后端架构的开发者。

你将从用户接口、商品下单走到 Agent 管理、模型 Provider、请求作用域、懒加载和工具发现。业务代码尽量小，让每一个框架机制都能通过阅读、运行和修改得到验证。

## 怎样学习

官方文档用于确认概念、API 和使用限制；**当前项目源码是本仓库实现事实的依据**。目录编号不等于官方章节编号，Study 1 也保留了一些进阶实验。

1. 先看下面的路线，选择一章，阅读该章 README 的介绍和边界。
2. 按“推荐阅读顺序”打开源码，先确认模块注册，再沿一条请求跟到 Service。
3. 独立安装依赖、启动项目，执行 README 中成功和失败两类请求。
4. 观察响应、终端日志、实例 ID；对照解释判断框架机制是否真正触发。
5. 修改代码完成练习，运行本章检查，然后进入下一章。

建议先完成 1–16，再按下表进入 Techniques。Study 20 暂时跳过，不能按编号把它当作已完成的 MongoDB 课程。初次读 Study 1 可以先完成用户接口，把作用域和订单实验留到 Study 2、11 后再回看。Study 8、10、12 分别展示容器 Provider、启动配置和运行时选择模型，它们是不同问题的解法。

## 学习路线

以下主题根据实际源码整理，不按编号推断。

### 概述与 Fundamentals（Study 1–16）

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

### Techniques（Study 17–38）

按中文文档的章节顺序，从 Configuration、SQL、Validation、Caching 继续。相邻两个配置与缓存示例分别解决不同深度的问题；每章有自己的安装步骤和验证入口。

| Study | 主题 | 实际业务与核心知识 | 文档 |
| --- | --- | --- | --- |
| 17 | Configuration：多环境配置 | 模拟 AI 生成；环境文件优先级、Joi、配置命名空间 | [README](./nestjs-study-17/README.md) |
| 18 | Configuration：类型化注入 | Agent 执行参数与配额计算；ConfigType、配置 KEY、启动校验 | [README](./nestjs-study-18/README.md) |
| 19 | SQL / TypeORM | PostgreSQL 用户、Agent、任务关系；Repository、外键、级联删除 | [README](./nestjs-study-19/README.md) |
| 20 | 尚未实现专题 | 只有 Hello World 脚手架；不计入 Techniques 完成项 | [当前状态](./nestjs-study-20/README.md) |
| 21 | Validation | Agent CRUD、分页、批量与嵌套执行选项；DTO、转换、PartialType | [README](./nestjs-study-21/README.md) |
| 22 | Caching：基础 | 公开 Agent 与模型目录；GET 拦截器缓存、手动缓存、毫秒 TTL | [README](./nestjs-study-22/README.md) |
| 23 | Caching：失效与分组 | Agent 写入后清理缓存、公开用户分组；自定义 Key、主动失效 | [README](./nestjs-study-23/README.md) |
| 24 | Serialization | Agent / 用户公开视图；ClassSerializerInterceptor、Expose、Exclude、groups | [README](./nestjs-study-24/README.md) |
| 25 | Versioning | V1/V2 论文任务接口；URI 版本、公共路由与 Mock 异步完成 | [README](./nestjs-study-25/README.md) |
| 26 | Task Scheduling | Agent 静态 Cron/Interval/Timeout、动态 Cron 与延迟任务管理 | [README](./nestjs-study-26/README.md) |
| 27 | Queues / BullMQ | Redis 队列中的 Agent 执行；WorkerHost、进度、重试、暂停与结果 | [README](./nestjs-study-27/README.md) |
| 28 | Logger | 模拟 AI 执行日志；自定义 ConsoleLogger、transient 上下文、错误日志 | [README](./nestjs-study-28/README.md) |
| 29 | Cookies | AI SaaS 登录与偏好；cookie-parser、随机 ID、内存 Session、归属筛选 | [README](./nestjs-study-29/README.md) |
| 30 | Events | Agent 事件驱动通知、统计和审计；OnEvent、通配监听、emit/emitAsync 边界 | [README](./nestjs-study-30/README.md) |
| 31 | Compression | 大小不同的模拟研究报告；Express compression、协商和 no-transform | [README](./nestjs-study-31/README.md) |
| 32 | File Upload | 本地知识库文件；Multer、文件/DTO 验证、大小限制、安全存储名 | [README](./nestjs-study-32/README.md) |
| 33 | Streaming Files | 本地研究报告生成与按 ID 下载；StreamableFile、流与下载响应头 | [README](./nestjs-study-33/README.md) |
| 34 | HTTP Module | 本地 Mock 搜索和模型调用；HttpService、Observable、firstValueFrom、axiosRef | [README](./nestjs-study-34/README.md) |
| 35 | Session | AI SaaS 会话；express-session、登录后 ID 轮换、持久化操作与登出清理 | [README](./nestjs-study-35/README.md) |
| 36 | MVC | Handlebars 研究报告页面；Render、模板、静态资源、构建产物 | [README](./nestjs-study-36/README.md) |
| 37 | Performance / Fastify | Agent 与研究接口；FastifyAdapter、原生 hook、适配器差异 | [README](./nestjs-study-37/README.md) |
| 38 | SSE | 模拟 Deep Research 阶段和 Token 流；Observable、MessageEvent、断连与异步初始化清理 | [README](./nestjs-study-38/README.md) |

### 学习状态与后续模块

| 官方模块 | 当前仓库状态 |
| --- | --- |
| Overview / Fundamentals | Study 1–16 已有源码和教学文档，按各章实际主题覆盖，不代表官方每个子章节一一完成 |
| Techniques | 21 个实质 Study，覆盖中文目录中除 MongoDB 外的 19 个技术主题；Study 20 为保留脚手架 |
| Security | 已有 Guard、Cookie、Session 中的局部示例，尚无独立完整安全专题课程 |
| GraphQL | 尚无已实现的独立 Study |
| WebSockets | 尚无已实现的独立 Study，SSE 不等于 WebSocket |
| Microservices | 尚无已实现的独立 Study，使用 Redis 队列不等于完成微服务课程 |

英文官方文档当前会将部分 Techniques 内容归入 Application、Data、HTTP 等栏目；本仓库保留中文 Techniques 学习路线，并按实际安装版本核对 API。MongoDB 不存在完整实现，不能把脚手架的构建通过当作章节完成。

## 仓库结构

```text
Nestjs/
├── README.md
├── docs/
│   ├── AUDIT.md                 # Study 1–16 的历史审查记录
│   └── TECHNIQUES_AUDIT.md      # Study 17–38 的清单、修复与验证边界
├── scripts/
│   └── verify-studies.mjs
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
├── nestjs-study-16/
├── nestjs-study-17/
├── nestjs-study-18/
├── nestjs-study-19/
├── nestjs-study-20/
├── nestjs-study-21/
├── nestjs-study-22/
├── nestjs-study-23/
├── nestjs-study-24/
├── nestjs-study-25/
├── nestjs-study-26/
├── nestjs-study-27/
├── nestjs-study-28/
├── nestjs-study-29/
├── nestjs-study-30/
├── nestjs-study-31/
├── nestjs-study-32/
├── nestjs-study-33/
├── nestjs-study-34/
├── nestjs-study-35/
├── nestjs-study-36/
├── nestjs-study-37/
└── nestjs-study-38/
```

每个 Study 自带 `package.json`、`pnpm-lock.yaml`、TypeScript/Nest/Vitest 配置、`src/main.ts` 和测试，独立安装、构建和启动。根目录没有把它们合并成应用或 pnpm workspace。各章业务数据也不互通。

## 开发环境与版本

Study 1–38 的共同框架版本与各章专用依赖分别维护。Techniques 审查核对了 17–38 的 `package.json`、锁文件与已安装依赖。当前共同的声明与实际版本如下；新增章节仍应单独核对，不能依赖这张表自动升级。

| 工具 | 当前声明 | 锁文件及安装结果 |
| --- | --- | --- |
| Nest common/core/platform-express | `^12.0.1` | 12.3.2 |
| Nest CLI | `^12.0.0` | 12.0.11 |
| TypeScript | `^6.0.2` | 6.0.3 |
| Vite | `^8.0.0` | 8.3.5 |
| Vitest | `^4.1.2` | 4.1.12 |

本机验证使用 **Node.js 24.5.0、pnpm 12.3.4**。建议使用 Node.js 24；当前 Vite 要求 `^20.19.0 || >=22.12.0`，Vitest 要求 `^20 || ^22 || >=24`，不能只看 Nest 的 Node 最低要求。仓库原本没有统一的 engines 或 packageManager 锁定；安装时使用每章锁文件。

各章依赖有区别：1、4、6 安装了 class-validator/class-transformer；9 使用真实 Redis 客户端；19 使用 PostgreSQL/TypeORM；27 使用 BullMQ 6.5.3 和显式安装的 ioredis 驱动；37 使用 Fastify 适配器；8、10、12 以及 Techniques 中的 AI 输出为本地 Mock。1 保留原有 Observe 依赖，但当前应用没有注册遥测模块，也不要求凭证。

全部采用 `type: module` 与 `module/moduleResolution: nodenext`，保留 `strict`、`isolatedModules`、装饰器元数据和声明输出。相对导入写 `.js`，TypeScript 在开发时解析对应 `.ts`，构建后由 Node 加载真实 `.js`。DTO class 需要运行时值；interface 等纯类型使用 `import type`。

## 运行一个项目

例如从仓库根目录开始：

```bash
cd nestjs-study-38
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

`build` 检查生产源码与声明输出；完整 `tsc` 还检查测试和配置。多数业务 e2e 使用已编译的 `dist` 模块或真实 main 子进程，因此**先 build 再完整 tsc**；这些章的 `test:e2e` 已包含构建步骤。Study 20 保留原脚手架测试。`pnpm test` 中部分保留的脚手架测试只证明类本身，业务机制由各章 e2e 验证。

构建后 `pnpm start:prod` 只是本地运行 `node dist/main.js`，不涉及部署。启动前先阅读本章 README 的基础设施要求：

| Study | 必要准备 |
| --- | --- |
| 9 | Redis；可用 REDIS_URL 覆盖地址，见原章节 |
| 17 | 从 .env.example 准备必填配置；数据库/Redis 地址仅展示，不连接 |
| 18 | 配置都有缺省值，.env.example 可展示覆盖效果 |
| 19 | PostgreSQL；DATABASE_* 配置专用学习库，synchronize 仅用于本地 |
| 27 | Redis，默认宿主端口 6380；可用 REDIS_HOST / REDIS_PORT 覆盖 |
| 32 / 33 | 可写的本地 uploads / reports 目录，按启动工作目录创建 |
| 34 | 默认请求本应用的 /external Mock；也可配置 EXTERNAL_API_BASE_URL |
| 35 | SESSION_SECRET 至少 32 字符；.env.example 仅是公开学习夹具 |

其他 Techniques 示例不要求外部服务；当前所有 AI 输出都是模拟，不需要真实模型 Key。

如果各章依赖都已安装，可以在根目录执行：

```bash
node scripts/verify-studies.mjs 21 31 38  # 不需要外部服务的一组
# 已准备 Study 19 的专用数据库和 Study 27 的 Redis 后：
RUN_DATABASE_E2E=1 node scripts/verify-studies.mjs 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38
# 不传编号会选择仓库全部现有目录，同样需要相应基础设施
```

该脚本不安装依赖、不启动数据库或 Redis；输出每项检查结果，失败时返回非零退出码。Study 9 自动 e2e 使用客户端替身，真实 Redis 的独立验证范围见 [原审查记录](docs/AUDIT.md)。Study 19 的 e2e 需要显式 RUN_DATABASE_E2E=1；Study 27 的 e2e 使用实际 Redis / Worker，建议单独测试实例。新阶段的范围与结果见 [Techniques 审查报告](docs/TECHNIQUES_AUDIT.md)。

## 教学简化应怎样理解

- 内存数据会随进程重启丢失；示例没有数据库事务或多进程一致性。
- 固定 Bearer Token 和 API Key 是公开测试夹具，角色由服务端映射；它们没有密码登录、签名、有效期或撤销机制。
- Study 7 实现当前用户的资源归属检查；5、14 是共享目录，不能把它们的示例等同于完整多用户产品。
- Study 11 的 `x-tenant-id` 是两个公开 DI 分组标签，不代表认证后的租户身份或真实数据隔离。
- AI 模型、搜索和天气返回 Mock；动态模块中的 timeout/maxRetries 等配置不代表已经执行真实重试。

这些边界在各章 README 中有对应说明。学习时先验证当前实现，再把数据库、真实认证等作为单独的新主题推进。

## 后续学习计划

已实现的配置、SQL、缓存、队列、调度、日志、上传与 SSE 可作为继续学习的基础。后续可能增加 MongoDB、持久缓存与队列进阶、完整认证与授权、WebSocket、GraphQL、微服务以及跨任务恢复的 AI Agent 后端架构；这些方向尚未作为新的完整 Study 交付。

补全 Study 20 或增加下一章时，保留独立目录与锁文件；先定义一项可观察的业务问题，再编写源码和成功/失败验证。补齐中文 README 的真实目录、核心机制、推荐阅读顺序、练习与简化边界，最后把实际完成的章节加入学习路线。

参考：[NestJS 英文文档](https://docs.nestjs.com/)、[NestJS 中文文档](https://docs.nestjs.cn/introduction/)。参考文档有助于理解机制，版本相关行为仍以项目安装版本和测试为准。
