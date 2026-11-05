# NestJS Study 20：尚未实现专题的脚手架

本目录目前只有 Nest CLI 初始应用：`GET /` 返回 `Hello World!`。源码没有 MongoDB、Mongoose、数据库实体或任何 AI 业务，因此不能将本目录标记为已完成的 MongoDB 课程。

仓库保留这个独立项目作为后续学习起点。继续学习已经实现的 Techniques 内容，可前往 [Study 21：Validation](../nestjs-study-21/README.md)；关系型数据库示例见 [Study 19](../nestjs-study-19/README.md)。

## 当前可以学习什么

- `main.ts` 创建应用，AppModule 决定模块图。
- Controller 声明 HTTP 路由，Service 提供返回内容。
- 单元测试只创建被测类所需的依赖；e2e 创建整个应用后发送 HTTP 请求。

这里没有数据库技术的核心机制，安装包中存在某个依赖也不代表项目已经使用它。

## 真实目录与执行流程

```text
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.controller.spec.ts
└── app.service.ts
test/
└── app.e2e-spec.ts
```

```text
HTTP GET / → AppController.getHello() → AppService.getHello() → 文本响应
```

[AppModule](src/app.module.ts) 注册 AppController 与 AppService。控制器通过构造函数注入服务；它不负责应用启动，监听端口在 [main.ts](src/main.ts) 中处理。

## 如何运行与验证

建议 Node.js 24、pnpm 12。当前独立锁文件对应 Nest core/common 12.3.2、TypeScript 6.0.3；无需环境文件和外部服务。

```bash
cd nestjs-study-20
pnpm install --frozen-lockfile
pnpm start:dev
```

| Method | Endpoint | 当前结果 |
| --- | --- | --- |
| GET | / | 200，Hello World! |

```bash
curl http://localhost:3000/
curl -i http://localhost:3000/agents
```

第一项返回问候文本；第二项返回 404，因为当前没有 AgentsController。这不是数据库功能测试。

```bash
pnpm build
pnpm exec tsc --noEmit --incremental false
pnpm lint
pnpm test
pnpm test:e2e
```

这些检查只能证明脚手架能构建、响应根路由，不能证明任何尚未实现的专题完成。

## 推荐阅读顺序

1. [main.ts](src/main.ts)：找到应用启动和端口。
2. [app.module.ts](src/app.module.ts)：找到类的注册。
3. [app.controller.ts](src/app.controller.ts) → [app.service.ts](src/app.service.ts)：跟随一次请求。
4. [e2e](test/app.e2e-spec.ts)：把断言与真实路由对应起来。

## 思考与后续方向

1. 为问候增加一个可选查询参数，并验证未传参数的行为。
2. 新增一个独立 Service，观察只创建文件而不注册时的依赖注入错误。
3. 对比单元测试和 HTTP e2e 各自能发现哪些问题。

未来如果确定本章主题，再补齐相应实现、基础设施配置、正反验证和教学讲解，并更新根目录导航。本次审查没有自行填造缺失课程。当前没有需要讨论的生产业务架构。

参考：[NestJS 第一阶段入口](https://docs.nestjs.cn/introduction/)、[Techniques 目录](https://docs.nestjs.cn/techniques/)。
