---
title: Nestjs Crash Course
published: 2026-05-09
updated: 2026-05-14
description: 'Read more about Markdown features in Fuwari'
image: ''
tags: [Nestjs,装饰器]
category: '框架/Nodejs'
draft: false
---
# NestJS 速成课

> 本教程基于 YouTube [NestJS Crash Course](https://www.youtube.com/watch?v=FcioMucBc0Q) 视频翻译整理，大概百分之三十五参考。
>

## 目录

1. [NestJS 简介](#1-nestjs-简介)
2. [项目初始化](#2-项目初始化)
3. [项目结构与文件职责](#3-项目结构与文件职责)
4. [Nest 装饰器基础](#4-nest-装饰器基础)
5. [Controller 控制器](#5-controller-控制器)
6. [DTO 数据传输对象](#6-dto-数据传输对象)
7. [Service 服务与依赖注入](#7-service-服务与依赖注入)
8. [Module 模块系统](#8-module-模块系统)
9. [MongoDB + Mongoose 集成](#9-mongodb--mongoose-集成)
10. [完整 CRUD 示例](#10-完整-crud-示例)
11. [课程总结](#11-课程总结)

---

## 1. NestJS 简介

### 什么是 NestJS？

NestJS 是一个**渐进式 Node.js 框架**，用于构建高效、可靠、可扩展的服务端应用。

### Express vs NestJS

| 特性 | Express | NestJS |
|------|---------|--------|
| 框架风格 | 极简主义 | 结构化 |
| 组织方式 | 自己决定 | 强制规范 |
| 学习曲线 | 低 | 中等 |
| TypeScript | 可选 | 默认支持 |
| 装饰器 | 无 | 有 |
| 模块系统 | 无 | 有 |
| 依赖注入 | 无 | 有 |

### 为什么选择 NestJS？

Express 非常简洁好用，但它没有给你太多的**结构**。NestJS 是一个让你在后端有很强结构的框架。

NestJS 的语法和结构与 Angular 非常相似，如果你用过 Angular，上手会很快：

- TypeScript（默认支持）
- Services（服务）
- Dependency Injection（依赖注入）
- Modules（模块）
- Controllers（控制器）

### 技术栈组合

```
前端：Angular / React / Vue
后端：NestJS + MongoDB/MySQL/PostgreSQL
```

---

## 2. 项目初始化

### 安装 NestJS CLI

```bash
# 全局安装 CLI
npm install -g @nestjs/cli

# 验证安装
nest --version

# 创建新项目
nest new project-name
```

### 初始化项目

```bash
# 创建项目
nest new nest-rest-api

# 进入项目目录
cd nest-rest-api

# 启动开发服务器（热重载）
npm run start:dev
```

服务器会在 `http://localhost:3000` 启动。

---

## 3. 项目结构与文件职责

### 目录结构

```
src/
├── main.ts              # 入口文件
├── app.module.ts        # 根模块
├── app.controller.ts    # 根控制器
├── app.service.ts       # 根服务
└── items/               # items 模块（自己新建的）
    ├── items.controller.ts
    ├── items.service.ts
    ├── items.module.ts
    ├── dto/
    │   └── create-item.dto.ts
    ├── interfaces/
    │   └── item.interface.ts
    └── schemas/
        └── item.schema.ts
```

> 这里的 items 目录是新建的，来说一下怎么新建。首先确保自己在项目根目录：
>
> ```bash
> nest generate module items
>     # 先生成 items.module.ts（核心模块文件）
> nest generate controller items
>     # 生成 items.controller.ts + 自动注册到 items.module
> nest generate service items
>     # 生成 items.service.ts + 自动注册到 items.module
> ```
>
> 然后在 `items` 下新建 `dto` 文件夹，创建 `create-item.dto.ts`；
>
> 新建 `interfaces` 文件夹，里面创建 `item.interface.ts`；
>
> 新建 `schemas` 文件夹，里面创建 `item.schema.ts`（如果用 MongoDB + Mongoose 才需要，关系型数据库可忽略）。

### 入口文件 main.ts

```typescript
// main.ts - 入口文件 
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

`NestFactory` 是 Nest 应用的创建器/工厂，负责把 Nest 项目真正"组装并启动起来"。

`AppModule` 是 Nest 项目的根模块，类似于整个项目的总入口配置，它会告诉 Nest 这个项目有哪些 Controller，有哪些 Service，有哪些其他模块。

所以 `NestFactory.create(AppModule)` 的意思是以 AppModule 为根，把整个 Nest 应用创建出来。类似于 Vue 中的 `createApp(App).mount(#app)`。

`bootstrap` 是自己起的一个函数名，里面是启动函数。

> 这里用了async和await，因为这两步都是异步操作，
>
> **第一句：**
>
> 创建 Nest 应用需要做很多事情，所以它不是一个简单的同步操作。
>
> 读取模块
> 扫描 Controller
> 扫描 Service
> 建立依赖注入关系
> 注册路由
> 初始化底层 HTTP 服务
>
> **第二句：**
>
> 监听端口也是异步的，因为它要先知道端口是否可用，服务是否启动成功。

**启动步骤：**

```
运行 main.ts
    ↓
执行 bootstrap()
    ↓
NestFactory.create(AppModule)
    ↓
读取 AppModule
    ↓
扫描 Controller / Service / Module
    ↓
扫描装饰器
    ↓
建立路由表
    ↓
app.listen(3000)
    ↓
服务器启动成功
    ↓
浏览器访问 http://localhost:3000/items
    ↓
执行对应 Controller 方法
```



### 根模块 app.module.ts

```typescript
// app.module.ts - 根模块，是 Nest 构建整个应用的起点。
// 它告诉 Nest：这个项目里有哪些模块、控制器、服务。
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

通常在 AppModule 里导入各个业务模块，例如 ItemsModule、UsersModule。

`@Module()` 负责给 Nest 提供组织应用结构的**元信息**，告诉NestJs框架怎么组织你的代码。

**元信息**（Metadata）指的是"描述数据的数据"。就像一本书的目录告诉我们"这本书有哪些章节、每个章节在第几页"——元信息是关于书的结构信息。



上面代码部分的 `controllers`、`providers`、`imports`、`exports` 都是**元信息**——它们不是业务代码，而是告诉 Nest "这个模块有哪些组成部分、它们之间什么关系"的结构描述。

---

## 4. 装饰器基础

### 什么是装饰器？

装饰器（Decorator）是 TypeScript 的一项语法特性，形式是 `@表达式`。
在 NestJS 里，装饰器的作用是：**给类、方法、参数贴一个 Nest 能读懂的标记**。
NestJS 利用这个语法特性，提供了一系列有具体功能的装饰器。所以我们在 NestJS 代码里看到的 `@Controller`、`@Get`、`@Body()` 这些，实际上是两件事：

> @表达式  ← 这是 TypeScript 语法（装饰器语法）
> @Controller('items')  ← 这是 NestJS 提供的装饰器

| 来源 | 作用 | 例子 |
|------|------|------|
| **TypeScript** | 定义装饰器语法本身 | `@`、`target`、`propertyKey` 这些概念 |
| **NestJS** | 利用装饰器语法，提供具体功能 | `@Controller`、`@Get`、`@Body()` |
| **class-validator** | 利用装饰器语法，提供验证功能 | `@IsString()`、`@Min(0)` |

> 普通 TS 类本身没有后端含义。加上装饰器以后，框架才能识别这个类是什么角色、这个方法对应哪个接口、这个参数从请求哪里取。

------

### 4.1 装饰器写在哪里，就标记哪里

Nest 里的装饰器大致分成三类：

| 装饰器类型 | 写在哪里         | 作用                         |
| ---------- | ---------------- | ---------------------------- |
| 类装饰器   | 写在 class 上面  | 标记这个类是什么角色         |
| 方法装饰器 | 写在方法上面     | 标记这个方法处理什么请求     |
| 参数装饰器 | 写在方法参数前面 | 标记这个参数从请求的哪里取值 |

举一个最常见的例子：

```ts
@Controller('items')          // 类装饰器：标记这个类是一个控制器
export class ItemsController {
  @Get(':id')                 // 方法装饰器：标记这个方法处理 GET 请求
  findOne(@Param('id') id) {  // 参数装饰器：标记从 URL 取 id
    return `item ${id}`;
  }
}
```

这三个装饰器各司其职：

- `@Controller('items')` 告诉 Nest：这个类负责 `/items` 这一组路由
- `@Get(':id')` 告诉 Nest：这个方法处理 `GET /items/:id`
- `@Param('id')` 告诉 Nest：请把 URL 里的 `id` 取出来传给参数

------

------

### 4.2 类装饰器：标记一个类的角色

```js
@Controller('items')
export class ItemsController {
    //表示ItemsController 需要一个 ItemsService
  constructor(private readonly itemsService: ItemsService) {}
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
    

@Module({
 controllers: [ItemsController],
 providers: [ItemsService],
})
export class ItemsModule {}


@Injectable()
export class ItemsService {}
```

| 装饰器 | 作用 |
|--------|------|
| `@Controller('items')` | 标记这个类是控制器，负责 `/items` 接口 |
| `@Module({ ... })` | 标记这个类是模块，它告诉 Nest：这个模块里面有哪些 Controller，哪些 Service |
| `@Injectable()` | 标记这个类可以交给 Nest 管理，并且可以被注入到别的地方使用 |

```
@Module 里 providers: [ItemsService]
        ↓
注册 ItemsService
        ↓
Nest 启动时扫描模块
        ↓
发现 ItemsController 需要 ItemsService
        ↓
Nest 创建 ItemsService 实例
        ↓
把这个实例传给(注入) ItemsController 的 constructor
        ↓
Controller 里可以用 this.itemsService
```

> 注册 ≠ 创建实例
> 注册只是告诉 Nest 有这个服务
> 创建实例是 Nest 根据注册信息和依赖关系，真正 new 出一个对象
>
> 关于实例的具体疑问可以去service章节查看

------

### 4.3 方法装饰器：标记一个方法处理什么请求

方法装饰器写在方法上面，用来声明这个方法处理什么类型的 HTTP 请求。

| 装饰器 | HTTP 方法 | 用途 |
|--------|----------|------|
| `@Get()` | GET | 查询 |
| `@Post()` | POST | 新增 |
| `@Put()` | PUT | 整体更新 |
| `@Patch()` | PATCH | 部分更新 |
| `@Delete()` | DELETE | 删除 |

```
@Get(':id')
findOne(@Param('id') id: string) {
  return `item ${id}`;
}
```

表示：当请求 `GET /items/100` 时，执行 `findOne` 方法，参数 `id = "100"`。

------

### 4.4 参数装饰器：从请求里取数据

参数装饰器写在方法参数前面，用来告诉 Nest 这个参数从请求的哪里取值。

比如普通方法参数是这样：

```
findOne(id: string) {
  return id;
}
```

加上参数装饰器以后，是这样：

```
findOne(@Param('id') id: string) {
  return id;
}
```

| 装饰器 | 取哪里的数据 | Express 里类似 |
|--------|-------------|---------------|
| `@Body()` | 请求体 | `req.body` |
| `@Param('id')` | 路由参数 | `req.params.id` |
| `@Query('keyword')` | 查询参数 | `req.query.keyword` |
| `@Headers()` | 请求头 | `req.headers` |
| `@Req()` | 完整请求对象 | `req` |
| `@Res()` | 完整响应对象 | `res` |



#### 参数装饰器示例

**`@Param()` 示例**

```
@Get(':id')
findOne(@Param('id') id: string) {
return id;
}
```



**`@Query()` 示例**

```
@Get()
findAll(@Query('keyword') keyword: string) {
  return `search keyword: ${keyword}`;
}
```

访问：

```
GET /items?keyword=apple
```

得到：

```
search keyword: apple
```

**`@Body()` 示例**

```
@Post()
create(@Body() createItemDto: CreateItemDto) {
  return createItemDto;
}
```

访问：

```
POST /items
```

请求体：

```
{
  "name": "apple",
  "quantity": 10
}
```

得到：

```json
{
  "name": "apple",
  "quantity": 10
}
```

也就是 `return createItemDto` 把这个 DTO 对象原样返回了。

**`@Req()` 和 `@Res()` 示例**

上面那些装饰器能直接拿到对应的数据，NestJS 帮我们封装好了。但有时候，我们需要拿到"原始的" Express 请求/响应对象，这就用 `@Req()` 和 `@Res()`。

> **什么时候需要用？** 比如：
>
> - 需要读取 Express 原生的 API（headers、method、ip、路径等）
> - 需要操作响应头、设置 Cookie
> - 需要手动控制响应状态码或发送自定义格式的响应
> - 接入某些必须用原生 req/res 的第三方中间件

> **和普通写法最大的区别：** 普通写法是 `return` 数据，NestJS 自动包装成响应。使用 `@Res()` 后，你需要**自己调用 `res.json()` 或 `res.send()` 来返回数据**，否则请求会一直挂起。

```ts
import { Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('items')
export class ItemsController {
  @Get('raw')
  findRaw(@Req() req: Request, @Res() res: Response) {
    // 读取 Express 原生属性
    console.log('headers:', req.headers);
    console.log('method:', req.method);
    console.log('url:', req.url);
    console.log('ip:', req.ip);

    // 手动控制响应（必须返回，否则请求挂起）
    res.status(200).json({ message: 'custom response' });
  }
}
```

访问：

```
GET /items/raw
```

控制台输出：

```
headers: { 'content-type': 'application/json', ... }
method: GET
url: /items/raw
ip: ::1
```

HTTP 响应：

```
{ "message": "custom response" }
```

> **警告：** 使用 `@Res()` 会绕过 NestJS 的响应拦截器（interceptor）和全局异常过滤器。优先使用专门的装饰器（`@Headers()`、`@Body()` 等）来获取数据，只在以上场景必须时才用 `@Req()` / `@Res()`。

------

### 4.5 一次完整请求中，装饰器怎么配合？

看这段代码：

```ts
@Controller('items')
export class ItemsController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `item ${id}`;
  }
}
```

它可以拆成三层：

```
@Controller('items')
说明这个类负责 /items

@Get(':id')
说明这个方法负责 GET /items/:id

@Param('id')
说明 id 这个参数从路径参数里取
```

也就是说，Nest 把原来 Express 里的一行路由拆成了三部分：

*@Controller('items')  负责大路径：/items*

*@Get(':id')           负责请求方法和子路径：GET /:id*

@Param('id')          负责从请求里取 id 参数*

```
浏览器 / Postman 请求：
GET /items/100
        ↓
Nest 先看路由：
@Controller('items')  →  找到 /items 这一组 Controller
        ↓
继续匹配方法：
@Get(':id')  →  匹配 GET /items/:id
        ↓
提取参数：
@Param('id')  →  从 URL 中取出 id = "100"
        ↓
执行方法：
findOne('100')
        ↓
方法返回：
'item 100'
        ↓
Nest 把返回值作为 HTTP 响应返回给前端
```

所以访问：

```
GET /items/100
```

最终返回：

```
item 100
```

------

### 4.6 装饰器不是每次请求都执行

这个地方很容易误会。

例如：

```ts
@Get()
findAll() {
  return 'get all items';
}
```

不是每次请求都会重新执行一次 `@Get()`。

更准确地说：

```
项目启动时：
Nest 扫描 @Controller、@Get、@Post、@Injectable 等装饰器，
建立路由表和依赖注入关系。

请求进来时：
Nest 根据已经建立好的路由表，
找到对应方法，
然后执行这个方法。
```

所以每次请求真正执行的是：

```
findAll()
```

而不是：

```
@Get()
```

`@Get()` 的作用是在项目启动阶段告诉 Nest：

```
这个方法以后负责处理 GET 请求
```



## 5. Controller 控制器

### 5.1 Controller 是什么？

Controller 中文翻译叫**控制器**。

在 NestJS 里，Controller 主要负责一件事：

> **接收前端请求，然后决定调用哪个方法处理这个请求。**

可以先这样理解：

```
前端请求
   ↓
Controller 接收请求
   ↓
Controller 取出参数 / body / query
   ↓
调用 Service 处理业务逻辑
   ↓
把结果返回给前端
```

所以 Controller 不是专门写复杂业务逻辑的地方。

它更像是一个**接口入口**，负责：

```
1. 定义接口路径
2. 定义请求方式
3. 获取请求参数
4. 调用 Service
5. 返回结果
```

------

### 5.2 创建 Controller

在项目根目录下，运行以下命令创建 Controller：

```
nest g controller items
```

这条命令会：

- 在 `src/` 下新建一个 `items/` 文件夹
- 在 `src/items/` 下新建 `items.controller.ts` 文件
- 在 `src/items/` 下新建 `items.controller.spec.ts` 测试文件
- 自动在 `AppModule` 中 import 并注册

> **注意：如果 `items` 目录已存在**
>
> 执行 `nest g controller items` 时，Nest CLI 会检测到 `src/items/` 目录已存在，此时：
>
> - 它不会重新创建 `items/` 文件夹
> - 它只会在已有的 `items/` 目录下新建 `items.controller.ts` 和 `items.controller.spec.ts

---

生成的 `items.controller.ts` 大概内容是：

```
import { Controller } from '@nestjs/common';

@Controller('items')
export class ItemsController {}
```

这就是一个最基本的 Controller。

> 如果想只生成 `.ts` 文件而不生成测试文件，可以加 `--no-spec` 参数：`nest g controller items --no-spec`

------

### 5.3 Controller 的路径是怎么拼起来的？

Nest 的路径通常由两部分组成：

```
@Controller('items') 负责大路径
@Get() / @Post()    负责小路径和请求方式
```

例如：

```ts
@Controller('items')
export class ItemsController {
  @Get()
  findAll() {
    return '查询所有 items';
  }

  @Get(':id')
  findOne() {
    return '查询单个 item';
  }

  @Post()
  create() {
    return '新增 item';
  }
}
```

最终得到的接口是：

| 写法                                   | 实际接口         |
| -------------------------------------- | ---------------- |
| `@Controller('items')` + `@Get()`      | `GET /items`     |
| `@Controller('items')` + `@Get(':id')` | `GET /items/:id` |
| `@Controller('items')` + `@Post()`     | `POST /items`    |

所以：

```
@Get(':id')
```

不是完整路径，它只是子路径。

完整路径要和类上面的：

```
@Controller('items')
```

拼起来。

最终才是：

```
GET /items/:id
```

------

### 5.4 Controller 中使用 DTO

实际开发中，一般不会一直写：

```
@Body() body: any
```

因为 `any` 太宽泛了，TypeScript 不知道 body 里面到底有什么字段。

所以通常会定义 DTO。

例如：

```js
export class CreateItemDto {
  readonly name: string;
  readonly description: string;
  readonly quantity: number;
}
```

然后在 Controller 里使用：

```js
import { Body, Controller, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return createItemDto;
  }
}
```

这里的意思是：

```
前端传来的请求体，应该符合 CreateItemDto 这个结构
```

也就是大概应该长这样：

```js
{
  "name": "苹果",
  "description": "这是一个苹果",
  "quantity": 10
}
```

DTO 的作用可以先理解成：

```
告诉 TypeScript：前端传来的 body 应该有哪些字段
```

后面如果配合 `class-validator`，DTO 还可以用来做参数校验。

------

### 5.5 Controller 中注入 Service

Controller 可以接收请求，但不建议把复杂业务都写在 Controller 里。


**更推荐的写法是：**

```typescript
@Controller('items')
export class ItemsController {
  // 通过 constructor 注入 Service(第七章会有部分专门讲service)
  constructor(private readonly svc: ItemsService) {}

  @Get()
  findAll() {
    // 调用注入进来的 Service
    return this.svc.findAll();
  }
}
```
---

### 5.6 Controller 和 Express 写法对比

Express：手动注册路由(app.get('/items/:id'))
Nest：用装饰器声明路由(@Controller + @Get 声明路由)



Express 中可能这样写：

```js
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  res.send(`查询 id 为 ${id} 的 item`);
});
```

NestJS 中这样写：

```js
@Controller('items')
export class ItemsController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `查询 id 为 ${id} 的 item`;
  }
}
```

它们表达的是同一件事：

```
当请求 GET /items/:id 时，执行对应逻辑
```

只是写法不同。

Express 是：

```
app.get('/items/:id', 回调函数)
```

Nest 是：

```
@Controller('items') + @Get(':id') + 方法
```

把路径、请求方法、参数来源都拆开写：

```
@Controller('items')  负责大路径
@Get(':id')           负责请求方法和子路径
@Param('id')          负责取路径参数
```

------

### 5.7 小结

Controller 可以记成一句话：

> **Controller 是接口入口，负责接收请求、获取参数、调用 Service、返回结果。**

再记住这几个常用装饰器：

| 装饰器                 | 作用                               |
| ---------------------- | ---------------------------------- |
| `@Controller('items')` | 声明这个类负责 `/items` 这一组接口 |
| `@Get()`               | 处理 GET 请求                      |
| `@Post()`              | 处理 POST 请求                     |
| `@Put()`               | 处理 PUT 请求                      |
| `@Delete()`            | 处理 DELETE 请求                   |
| `@Param('id')`         | 获取路径参数                       |
| `@Query('keyword')`    | 获取查询参数                       |
| `@Body()`              | 获取请求体数据                     |

一句话流程：

```
前端请求 /items
   ↓
@Controller('items') 找到 ItemsController
   ↓
@Get() / @Post() 找到具体方法
   ↓
@Param() / @Query() / @Body() 取出请求数据
   ↓
调用 Service
   ↓
返回结果给前端
```

------

## 6. DTO 数据传输对象

### 什么是 DTO？

DTO（Data Transfer Object，数据传输对象）是一种设计模式，用于在网络请求中传输数据。

在 NestJS 中，DTO 通常用在 Controller 的请求参数上，用来：
- 定义请求体的数据结构
- 提供类型提示
- 配合验证器做数据校验

### 为什么需要 DTO？

**不用 DTO 的写法：**

```typescript
@Post()
create(@Body() body: any) {
  // body 是 any 类型，TypeScript 不知道里面有什么字段
  console.log(body.name);      // 不知道 name 是什么类型
  console.log(body.quantity);  // 不知道 quantity 是什么类型
}
```



### DTO、Interface、Schema 的区别

| 概念 | 作用 | 使用场景 |
|------|------|----------|
| **DTO** | 定义请求/响应的数据结构 | Controller 的 @Body() 参数 |
| **Interface** | 定义 TypeScript 类型（纯类型检查） | 定义数据结构、函数参数、返回值类型 |
| **Schema** | 定义数据库文档结构（Mongoose） | MongoDB 模型定义 |

> **补充**：TypeScript 中 `interface` 默认描述的是**对象类型**。如果需要描述其他类型（如字符串字面量、函数、联合类型等），通常用 `type` 来定义。
>
> ```typescript
> // interface → 对象类型
> interface Item { name: string; }
>
> // type → 其他类型
> type Status = 'pending' | 'done';           // 字符串字面量
> type Callback = (data: string) => void;      // 函数类型
> type ID = string | number;                   // 联合类型
> ```

```
前端请求 → Controller → DTO 校验 → Service → Schema → 数据库
                              ↑
                         这里用 DTO
```

### 创建 DTO

在项目中的 `src/items/dto/` 目录下创建：

```typescript
// dto/create-item.dto.ts
export class CreateItemDto {
  readonly name: string;
  readonly description: string;
  readonly quantity: number;
}
```

> **提示**：使用 `readonly` 表示这些字段不应在 DTO 内部被修改，这是约定俗成的写法。

### DTO 的命名约定

DTO 的命名通常包含用途：

```typescript
// 创建时用
CreateItemDto

// 更新时用
UpdateItemDto

// 查询结果用（可选）
ItemDto
```

例如：

```typescript
// 创建商品
export class CreateItemDto {
  readonly name: string;
  readonly quantity: number;
}

// 更新商品（字段都是可选的）
export class UpdateItemDto {
  readonly name?: string;
  readonly quantity?: number;
}
```

### DTO 的用途：接收数据还是返回数据？

DTO **主要用于接收数据**，但也可以用于返回数据。

```
请求（接收数据）→ Controller → DTO 验证
                              ↓
响应（返回数据）← Controller ← DTO 包装
```

**接收数据（最常用）：**

```typescript
// 前端发送
POST /items
{ "name": "苹果", "quantity": 10 }

// DTO 接收
export class CreateItemDto {
  @IsString() name: string;
  @IsNumber() @Min(0) quantity: number;
}

// Controller
@Post()
create(@Body() dto: CreateItemDto) {
  // dto 就是前端传来的数据
  return this.itemsService.create(dto);
}
```

**返回数据（也可以用）：**

```typescript
// 专门用于返回的 DTO
export class ItemResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  // 可以过滤掉敏感字段，比如 password
}

// Service
findOne(id: string): ItemResponseDto {
  const item = this.db.find(id);
  return {
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    // password: item.password  ← 不会返回这个
  };
}
```

为什么要区分？

| 用途 | DTO | 原因 |
|------|-----|------|
| **接收** | CreateItemDto | 验证前端传来的数据是否合法 |
| **返回** | ItemResponseDto | 控制返回给前端的数据结构 |

实际开发中，很多人**懒得写返回的 DTO**，直接返回数据库实体：

```typescript
// 简单项目：直接返回
@Post()
create(@Body() dto: CreateItemDto) {
  return this.itemsService.create(dto);  // 直接返回 Item 实体
}
```

> **总结**：教程里讲的 DTO 主要用于接收数据（验证请求），这是最常见、最有用的场景。返回数据的 DTO 属于进阶用法，复杂项目才需要。

### DTO 配合验证器使用

NestJS 可以配合 `class-validator` 做数据校验：

**安装依赖：**

```bash
npm install class-validator class-transformer
```

**在 main.ts 启用全局验证管道：**

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

**在 DTO 中添加验证规则：**

```typescript
// dto/create-item.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @Min(0)
  readonly quantity: number;
}
```

这样，当前端发送的请求体不符合规则时，NestJS 会自动返回 400 错误：

```json
// 请求
POST /items
{ "name": "", "quantity": -1 }

// 响应
{
  "statusCode": 400,
  "message": ["name should not be empty", "quantity must not be less than 0"]
}
```

### 常用验证装饰器

| 装饰器 | 作用 | 示例 |
|--------|------|------|
| `@IsString()` | 必须是字符串 | `@IsString() name: string` |
| `@IsNumber()` | 必须是数字 | `@IsNumber() age: number` |
| `@IsOptional()` | 字段可选 | `@IsOptional() description?: string` |
| `@Min(0)` | 最小值 | `@Min(0) quantity: number` |
| `@Max(100)` | 最大值 | `@Max(100) score: number` |
| `@IsEmail()` | 必须是邮箱 | `@IsEmail() email: string` |
| `@IsUUID()` | 必须是 UUID | `@IsUUID() id: string` |
| `@IsArray()` | 必须是数组 | `@IsArray() tags: string[]` |
| `@ValidateNested()` | 嵌套对象验证 | `@ValidateNested() user: UserDto` |

### 小结

DTO 的核心作用：

```
1. 定义请求体的结构（告诉前端应该传什么字段）
2. 提供类型提示（让 TypeScript 知道字段类型）
3. 配合验证器（自动校验数据合法性）
```

---

## 7. Service 服务与依赖注入

### 7.1 Service 是什么？

Service 是 NestJS 中专门**处理业务逻辑**的组件。

在一个常见的接口流程中：

```
Controller：接收请求、获取参数
    ↓
Service：处理业务逻辑，比如查数据库、计算、发送通知
    ↓
Controller：把结果返回给前端
```

简单理解：

```
Controller 管“入口”
Service 管“业务”

Controller：
- 接收请求
- 获取请求参数
- 调用 Service

Service：
- 处理真正的业务逻辑
- 操作数据
- 组织返回结果
```



Controller 可以接收请求，但不建议把复杂业务都写在 Controller 里。

**不推荐这样：**

```typescript
@Post()
create(@Body() body: any) {
  // 校验数据
  // 处理数据
  // 操作数据库
  // 发送通知
  // 返回结果
}
```

这样写的问题：

- Controller 代码臃肿
- 难以测试（Controller 依赖太多）
- 业务逻辑分散，难以维护

**推荐的写法：**

```typescript
@Controller('items')
export class ItemsController {
  constructor(private readonly svc: ItemsService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.svc.create(dto);
  }
}
```

```typescript
@Injectable()
export class ItemsService {
  create(dto: CreateItemDto) {
    const name = dto.name.trim();
    return {
      id: Date.now(),
      name,
    };
  }
}
```

`@Injectable()` 装饰器告诉 Nest：这个类可以被依赖注入系统管理。

### 7.2 Provider 是什么？

在 NestJS 里，Provider 可以理解为：

> 交给 Nest 管理、以后可以被注入到别的地方使用的东西。

最常见的 Provider 就是 Service。

例如：

```ts
@Injectable()
export class ItemsService {}
```

然后在模块里注册：

```ts
@Module({
  providers: [ItemsService],
})
export class ItemsModule {}
```

这里的 `ItemsService` 就是一个 Provider。

它的意思是：

```ts
把 ItemsService 交给 Nest 管理
    ↓
Nest 可以创建 ItemsService 实例
    ↓
Nest 可以保存这个实例
    ↓
别的 Controller 或 Service 需要它时
    ↓
Nest 可以把它注入过去
```

所以：

```ts
providers: [ItemsService]
```

不是说这里只能写 Service，而是说：

> 这里写的是这个模块自己提供给 Nest 管理的依赖。

Service 是最常见的 Provider，但 Provider 不只包括 Service。

常见 Provider 包括：

```
Service 类
Repository 类
配置对象
数据库连接
第三方 SDK 实例
工厂函数返回的对象
```

比如普通 Service：

```
providers: [ItemsService]
```

也可以写成完整形式：

```
providers: [
  {
    provide: ItemsService,
    useClass: ItemsService,
  },
]
```

这表示：

```
当有人需要 ItemsService 时，
Nest 就提供 ItemsService 这个类的实例。
```

再比如配置对象：

```
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        appName: 'NestJS Demo',
        version: '1.0.0',
      },
    },
  ],
})
export class AppModule {}
```

这里提供的就不是 Service 类，而是一个普通对象。

使用时需要这样注入：

```
constructor(@Inject('APP_CONFIG') private config: any) {}
```

所以 Provider 的核心不是“Service”，而是“可被 Nest 注入的依赖”。

一句话总结：

```
@Injectable()：说明这个类可以被 Nest 注入系统识别
providers：说明这个类/对象正式交给 Nest 管理
constructor：说明我这里需要某个 Provider，请 Nest 注入给我
```

### 7.3 如何创建和注册 Service

在项目根目录下，运行以下命令创建 Service：

```bash
nest g service items
```

这条命令会：

- 在 `src/items/` 下新建 `items.service.ts` 文件
- 在 `src/items/` 下新建 `items.service.spec.ts` 测试文件
- 自动在 `items.module.ts` 中注册为 provider

生成的 `items.service.ts` 大概内容是：

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {}
```

这就是一个最基本的 Service。

> 如果想只生成 `.ts` 文件而不生成测试文件，可以加 `--no-spec` 参数：`nest g service items --no-spec`

### 7.4 Controller 如何使用 Service？

#### 先澄清：this.service 不是凭空出现的

在 NestJS 里，不能因为某个 Service 被 Nest 扫描到了，就直接在 Controller 里写：

```typescript
this.svc.findAll()
```

`this.svc` 能不能用，取决于当前 Controller 实例上是否真的有这个属性，它必须先被声明，然后被赋值。



**拿到 Service 的方式大体有两类：**

```
1. 自己 new 一个 Service
2. 让 Nest 通过依赖注入帮你传进来
```



其中，Nest 推荐第二种。



#### 不推荐：手动 new Service

理论上可以这样写：

```typescript
@Controller('items')
export class ItemsController {
  private readonly svc = new ItemsService();

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
```

这样写以后，`this.svc` 确实可以使用。

但是它绕开了 Nest 的依赖注入系统，所以不推荐。

问题是：

```
1. 这个 Service 不归 Nest 管理
2. 如果 Service 里面还依赖其他 Service，会越来越麻烦
3. 不方便测试
4. 破坏了 Nest 统一管理实例的机制
```

比如 `ItemsService` 里面还需要 `EmailService`：

```typescript
@Injectable()
export class ItemsService {
  constructor(private readonly emailService: EmailService) {}
}
```

如果你自己 `new ItemsService()`，就还得自己创建并传入 `EmailService`：

```typescript
const emailService = new EmailService();
const svc = new ItemsService(emailService);
```

依赖一多，代码就会越来越乱。

所以在 Nest 项目中，通常不会自己 `new Service`。

#### 推荐：constructor 构造函数注入

最常见的写法是：

```typescript
@Controller('items')
export class ItemsController {
  constructor(private readonly svc: ItemsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
```

核心是这一句：

```typescript
constructor(private readonly svc: ItemsService) {}
```

它的意思是：

```
我这个 Controller 需要一个 ItemsService。
请 Nest 帮我从容器里找到 ItemsService，并注入进来。
```

这句代码同时做了三件事：

```
1. 声明一个 svc 属性
2. 接收 Nest 注入进来的 ItemsService 实例
3. 把它保存到 this.svc 上
```

它大致等价于：

```typescript
private readonly svc: ItemsService;

constructor(svc: ItemsService) {
  this.svc = svc;
}
```

所以后面才能写：

```typescript
this.svc.findAll()
```

`this` 指的是当前的 ItemsController 实例，`this.svc` 指的是这个实例上的 svc 属性。

流程是：

```
Nest 创建 ItemsService、ItemsController 实例
        ↓
发现 constructor 需要 ItemsService
        ↓
把 ItemsService 实例传进去
        ↓
保存成 this.svc
        ↓
Controller 方法里就可以调用 this.svc.findAll()
```

#### 特殊场景：constructor + @Inject() 显式注入

普通情况下，我们这样写就够了：

```typescript
constructor(private readonly svc: ItemsService) {}
```

因为 Nest 可以根据 `ItemsService` 这个类型，判断你想注入哪个 Service。

但是也可以写得更明确：

```typescript
import { Inject } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  constructor(
    @Inject(ItemsService)
    private readonly svc: ItemsService,
  ) {}
}
```

这表示：

```
不要只靠类型判断。
我明确告诉 Nest：这里要注入 ItemsService。
```

不过对于普通 Service 来说，这样写有点啰嗦。

真正需要 `@Inject()` 的场景，通常是下面这些：

```
1. 使用字符串 token
2. 使用 symbol token
3. 注入 interface 对应的实现
4. 一个抽象概念有多个具体实现
5. 自定义 provider，比如 useClass、useValue、useFactory
```

典型例子：使用 interface 对应的实现

```typescript
export const ITEM_REPOSITORY = 'ITEM_REPOSITORY';

@Module({
  providers: [
    {
      provide: ITEM_REPOSITORY,
      useClass: MysqlItemRepository,
    },
  ],
})
export class ItemsModule {}
```

```typescript
constructor(
  @Inject(ITEM_REPOSITORY)
  private readonly repo: ItemRepository,
) {}
```

解释：

```
ItemRepository 是 TypeScript 的 interface，运行到 JavaScript 时会消失。

Nest 运行时看不到 interface，
所以不能靠 interface 自动注入。

这时候就需要用 token 明确告诉 Nest：
我要注入 ITEM_REPOSITORY 对应的那个 provider。
```

另一个场景：想替换具体实现

```typescript
{
  provide: 'ITEM_REPOSITORY',
  useClass: MockItemRepository,  // 开发环境用假的
}
```

```typescript
{
  provide: 'ITEM_REPOSITORY',
  useClass: MysqlItemRepository,  // 生产环境用真的
}
```

Controller 或 Service 里不用改：

```typescript
constructor(
  @Inject('ITEM_REPOSITORY')
  private readonly repo: ItemRepository,
) {}
```

这样可以做到：

```
调用方不关心具体实现。
Module 决定实际注入哪个实现。
```

#### 了解即可：属性注入

除了 constructor 注入，还可以使用属性注入：

```typescript
@Controller('items')
export class ItemsController {
  @Inject(ItemsService)
  private readonly svc: ItemsService;

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
```

或者在 TypeScript 严格模式下，可能会写成：

```typescript
@Controller('items')
export class ItemsController {
  @Inject(ItemsService)
  private readonly svc!: ItemsService;

  @Get()
  findAll() {
    return this.svc.findAll();
  }
}
```

这种写法的意思是：

```
不通过 constructor 接收 Service，
而是直接把 Service 注入到类的某个属性上。
```

但是不推荐初学时作为主要写法。

原因是：

```
1. 依赖不够明显
2. 看 constructor 时不知道这个类依赖了什么
3. 测试时不如 constructor 注入方便
4. 属性是在对象创建后再赋值，constructor 里不能安全使用它
```

所以更推荐：

```typescript
constructor(private readonly svc: ItemsService) {}
```

### 7.5 constructor 注入和 @Inject() 注入的关系

这两种写法本质上都是依赖注入：

```typescript
constructor(private readonly svc: ItemsService) {}
```

```typescript
constructor(
  @Inject(ItemsService)
  private readonly svc: ItemsService,
) {}
```

它们的共同点是：

| 共同点             | 说明                             |
| ---------------- | ------------------------------ |
| 都属于依赖注入         | 都不是自己 `new Service`            |
| 都由 Nest 创建实例    | Service 实例由 Nest 容器管理          |
| 都注入到当前类中        | 最后都可以通过 `this.svc` 使用 |
| 都需要 provider 注册 | Service 必须在 `providers` 中注册    |

它们的不同点是：

| 写法                                       | Nest 怎么知道注入谁           | 适合场景                                   |
| ---------------------------------------- | ---------------------- | -------------------------------------- |
| `constructor(private svc: ItemsService)` | 根据类型 `ItemsService` 判断 | 普通 Service，最常用                         |
| `@Inject(TOKEN)`                         | 根据你指定的 token 判断        | 自定义 provider、interface、字符串 token、多实现切换 |

一句话总结：

```
普通 Service：优先用 constructor 类型注入。
遇到 token、interface、自定义 provider：用 @Inject() 显式注入。
```

### 7.6 依赖注入的基本原理

这一节解释：**Nest 是怎么做到 constructor 自动注入的？**

#### 启动流程

```
项目启动
	↓
NestFactory.create(AppModule)
	↓
从 AppModule 开始扫描模块
	↓
读取 @Module() 里的 imports / controllers / providers
	↓
把这些类登记到 Nest 容器中
	↓
Nest 根据依赖关系创建实例
	↓
创建 ItemsController 时，查看它的 constructor
	↓
发现它需要 ItemsService
	↓
去容器中找 ItemsService
	↓
如果 ItemsService 还没实例化，就先创建 ItemsService
	↓
再把 ItemsService 实例传给 ItemsController
```



#### 为什么叫"依赖注入"？

```
"依赖"：ItemsController 依赖 ItemsService 才能工作
"注入"：不是你 new 出来的，是 Nest 帮你创建并塞进来的
```

```
你声明：constructor(private readonly svc: ItemsService) {}

Nest 实际上做了：
const svc = new ItemsService();      // 创建实例
const controller = new Controller(svc);  // 注入进去
```

好处：

- **不用手动 `new Service()`**
- **容易换实现**（测试时可以用假的 Service 替换）
- **统一管理实例**

#### Service 怎么被 Nest 找到？

必须满足两个条件：

1. **Service 有 `@Injectable()` 装饰器**
2. **Service 在 Module 的 `providers` 中注册**

```typescript
@Module({
  providers: [ItemsService],  // 注册 Service
  controllers: [ItemsController],
})
export class ItemsModule {}
```

如果 Service 没有在 `providers` 里注册，Nest 会报错：

```
Nest can't resolve dependencies of ItemsController (?).
Please make sure that the argument ItemsService is available.
```

### 7.7 Service 中注入其他 Service

一个 Service 也可以注入另一个 Service：

```typescript
@Injectable()
export class EmailService {
  send(to: string, message: string) {
    console.log(`Sending email to ${to}: ${message}`);
  }
}
```

```typescript
@Module({
  providers: [ItemsService, EmailService],  // 两个都注册
  controllers: [ItemsController],
})
export class ItemsModule {}
```

```typescript
@Injectable()
export class ItemsService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  create(item: Item): Item {
    const newItem = this.saveToDb(item);
    this.emailService.send('admin@example.com', 'New item created');
    return newItem;
  }

  private saveToDb(item: Item): Item {
    return item;
  }
}
```

### 7.8 单例模式：启动时创建，请求时复用

NestJS 默认使用**单例模式**，这意味着：

- **启动时**：Nest 创建所有 Controller 和 Service 的实例（一次性）
- **请求时**：所有请求复用这些已创建的实例



单例的意思是：

一个类在应用运行期间通常只创建一个实例，后续请求都会复用这个实例。

```
const itemsService = new ItemsService()

// 第一次请求用它
itemsService.getList()

// 第二次请求也用它
itemsService.getList()

// 第三次请求还是用它
itemsService.getList()
```



```
例如 ItemsService 默认只会创建一个实例：

项目启动
    ↓
Nest 扫描模块
    ↓
创建 ItemsService 实例
    ↓
创建 ItemsController 实例，并把 ItemsService 注入进去
    ↓
请求来了
    ↓
复用已经创建好的 ItemsController 和 ItemsService
```

好处：

- **省内存**：不用每次请求都 new 一个新实例
- **速度快**：实例已经创建好了，直接用

简单记忆：`启动时创建 → 请求时复用`



#### 详细介绍单例

单例就是：

```
const service = new ItemsService()
```

只 new 一次。

然后所有 Controller 都用这一个：

```ts
@Controller()
export class AController {
  constructor(private readonly itemsService: ItemsService) {}
}
@Controller()
export class BController {
  constructor(private readonly itemsService: ItemsService) {}
}
```

表面上 AController 和 BController 都写了：

```
private readonly itemsService: ItemsService
```

但它们拿到的其实是**同一个 ItemsService 实例**。

可以想象成：

```
ItemsService 实例
     ↑
AController 用它
     ↑
BController 也用它
     ↑
CController 也用它
```

#### “类”和“实例”先分清

你可以这样理解：

```
class ItemsService {}
```

这个是**类**，像一张“图纸”。

```
const a = new ItemsService()
```

这个 `a` 是**实例**，像根据图纸造出来的“真实对象”。

再比如：

```
const a = new ItemsService()
const b = new ItemsService()
```

这里就是两个实例。

```
ItemsService 类
   ↓ new
a 实例

ItemsService 类
   ↓ new
b 实例
```

虽然 `a` 和 `b` 都来自同一个类，但它们是两个不同对象。

#### 为什么 Nest 默认用单例？

因为大多数 Service 不需要每次请求都重新创建。

比如：

```
@Injectable()
export class UserService {
  findAll() {
    return this.userRepository.find()
  }
}
```

这个 `UserService` 本身只是提供方法，没必要每次请求都 new 一个。

所以 Nest 默认：

```
启动时创建 Service
请求来了直接复用
```

好处就是你笔记里写的：

```
省内存
速度快
逻辑简单
```

#### 那是不是还有“多例”？

有。

只是 Nest 里面通常不直接叫“多例模式”，而是叫不同的 **作用域 scope**。

常见有三种：

```
默认作用域：单例
请求作用域：每个请求创建一个实例
瞬态作用域：每次注入都创建一个新实例
```

------

#### 单例最容易踩的坑

因为单例是大家共享一个对象，所以不要随便在 Service 里面保存“某一次请求的数据”。

比如这样就有风险：

```
@Injectable()
export class UserService {
  currentUserId: number

  setCurrentUser(id: number) {
    this.currentUserId = id
  }

  getCurrentUser() {
    return this.currentUserId
  }
}
```

如果它是单例，那么可能出现：

```
用户 A 请求来了，把 currentUserId 改成 1
用户 B 请求来了，把 currentUserId 改成 2
用户 A 再读 currentUserId，可能读到 2
```

所以单例 Service 里适合放：

```
方法
工具逻辑
数据库操作
公共业务逻辑
```

不适合放：

```
当前请求用户
当前请求 token
当前请求临时状态
```

这些更适合从 `req`、参数、上下文中传递，或者用 request scope。

### 7.9 Service 的作用域

| 作用域          | 说明              | 示例                        |
| ------------- | --------------- | ------------------------- |
| **单例**（默认）   | 所有请求共用一个实例     | 大多数 Service                |
| **请求级别**      | 每个请求一个新实例     | 需要隔离状态的场景               |
| **临时**        | 每次注入创建新实例     | 需要独立状态的场景               |

```typescript
@Injectable({ scope: Scope.REQUEST })
export class ItemsService {
  constructor() {
    console.log('每个请求都会创建新实例');
  }
}
```

#### 默认：单例 Singleton

```
@Injectable()
export class ItemsService {}
```

等价于：

```
@Injectable({ scope: Scope.DEFAULT })
export class ItemsService {}
```

特点：

```
整个应用共享一个实例
```

比如：

```
请求 1 → 用 ItemsService #1
请求 2 → 用 ItemsService #1
请求 3 → 用 ItemsService #1
```

都是同一个。

------

#### 请求作用域：Request Scope

写法大概是：

```
import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class ItemsService {}
```

意思是：

```
每一个请求，创建一个新的 ItemsService 实例
```

比如：

```
请求 1 → ItemsService #1
请求 2 → ItemsService #2
请求 3 → ItemsService #3
```

这就不是单例了。

适合什么场景？

比如这个 Service 里要保存“当前请求用户”的信息：

```
@Injectable({ scope: Scope.REQUEST })
export class CurrentUserService {
  userId: number
}
```

因为每个用户请求不一样，所以不能大家共用一个实例。

------

#### 瞬态作用域：Transient

写法：

```
@Injectable({ scope: Scope.TRANSIENT })
export class ItemsService {}
```

意思是：

```
每次被注入时，都创建一个新实例
```

比如：

```
AController 需要 ItemsService → 创建 ItemsService #1
BController 需要 ItemsService → 创建 ItemsService #2
CService 需要 ItemsService → 创建 ItemsService #3
```

它比“请求作用域”还要更分散。

### 7.10 Service + Interface 完整示例

```typescript
// interfaces/item.interface.ts
export interface Item {
  id: string;
  name: string;
  description?: string;
  quantity: number;
}
```

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  private items: Item[] = [
    { id: '1', name: '苹果', quantity: 10 },
    { id: '2', name: '香蕉', quantity: 20 },
  ];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  create(item: Omit<Item, 'id'>): Item {
    const newItem = {
      id: Date.now().toString(),
      ...item,
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: string, updates: Partial<Item>): Item | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }
}
```

> **补充说明**：
>
> 为什么 `findOne` 返回 `Item | undefined`，而 `findAll` 返回 `Item[]`？
>
> ```
> findOne：查一个，所以返回单个 Item；如果找不到，返回 undefined。
> findAll：查全部，所以返回 Item 数组。
> ```
>
> `Omit` 是 TypeScript 内置的工具类型，用于从某个类型中排除指定属性。
>
> `Omit<Item, 'id'>` 表示除了 `id` 字段外的其他字段，因为新增时 id 通常由数据库自动生成。`Partial<Item>` 表示所有字段都是可选的，用于更新操作。

### 7.11 小结

Service 本身负责业务逻辑。

但 Controller 想使用 Service，不能直接凭空写 `this.svc`。

`this.svc` 能用的前提是：

```
当前 Controller 实例上真的有这个属性。
```

在 Nest 中，推荐通过依赖注入来获得这个属性：

```typescript
constructor(private readonly svc: ItemsService) {}
```

这句话可以理解为：

```
我声明自己需要 ItemsService。
Nest 从 providers 里找到 ItemsService。
Nest 创建或复用它的实例。
Nest 把它传进 Controller。
Controller 把它保存成 this.svc。
```

最核心的一句话是：

```
providers 告诉 Nest：我这里有什么。
constructor 告诉 Nest：我需要什么。
@Inject() 告诉 Nest：当类型不够明确时，按哪个 token 注入。
```

Controller 和 Service 的配合示例：

```typescript
@Controller('tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  create(@Body() { title }: { title: string }) {
    return this.svc.create(title);
  }
}
```

```
Controller：接收请求，整理参数
Service：处理具体业务逻辑
```

---

## 8. Module 模块系统

### 什么是 Module？

Module（模块）是 NestJS 用来**组织代码**的容器。

**Module 的作用**

```
Module = Controller + Service + 其他依赖
         ↓
把相关的代码打包成一个"模块"
         ↓
整个应用由多个 Module 组成
```

**Module 的基本结构**

```typescript
// items.module.ts
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  controllers: [ItemsController],  // 控制器
  providers: [ItemsService],        // 服务（Provider）
})
export class ItemsModule {}
```

`@Module()` 装饰器接收一个配置对象：

| 属性 | 说明 |
|------|------|
| `controllers` | 属于这个模块的控制器列表 |
| `providers` | 属于这个模块的服务（Provider）列表 |
| `imports` | 这个模块需要导入的其他模块 |
| `exports` | 这个模块要暴露给其他模块使用的服务 |

### 创建 Module

在项目根目录下，运行以下命令创建 Module：

```bash
nest g module items
```

这条命令会：

- 在 `src/items/` 下新建 `items.module.ts` 文件
- 自动在 `AppModule` 中 import 并注册

生成的 `items.module.ts` 大概内容是：

```typescript
import { Module } from '@nestjs/common';

@Module({})
export class ItemsModule {}
```

这就是一个最基本的 Module。

> 如果想创建 Module 的同时一起创建 Controller 和 Service，可以运行：`nest g resource items`

### 根 Module（AppModule）

> 修改意见：这里的appmodule以及内里的结构，含义要写在##什么是Module这个标题里，在里面介绍清除

Nest 应用有一个根 Module，叫 `AppModule`：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [ItemsModule],  // 导入业务模块
})
export class AppModule {}
```

### 模块化设计

之前我们把所有东西都放在 `app.module.ts` 里，现在我们要接触模块化设计。

所谓“模块”，不是随便一个文件夹就叫模块，而是指一组关系比较紧密、能完成某类业务功能的代码集合。

一般来说，一个模块通常对应一个相对完整的业务领域，比如：

- 用户管理：`UsersModule`
- 商品管理：`ItemsModule`
- 订单管理：`OrdersModule`
- 权限认证：`AuthModule`
- 配置管理：`ConfigModule`
- 数据库连接：`DatabaseModule`

也就是说，模块的大小是按“业务职责”来决定的。



例如：

```txt
src/
├── app.module.ts
├── users/
│	├── users.controller.ts   # 用户接口
│	├── users.service.ts      # 用户业务逻辑
│	├── users.module.ts       # 用户模块
│	├── dto/                  # 用户相关参数类型
│	└── entities/             # 用户相关数据实体
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
└── items/
    ├── items.controller.ts
    ├── items.service.ts
    └── items.module.ts
users/
├── users.controller.ts   # 用户接口
├── users.service.ts      # 用户业务逻辑
├── users.module.ts       # 用户模块
├── dto/                  # 用户相关参数类型
└── entities/             # 用户相关数据实体
```

可以理解为：

```txt
一个模块 = 
一块业务功能 + 这块业务需要的 Controller / Service / DTO / Entity
```



> 这种模块化思想并不是 NestJS 特有的。很多后端项目都会按业务拆分代码。
>
> 只不过 NestJS 把“模块”做成了一个明确的语法概念，也就是 `@Module()`。  
>
> 所以在 NestJS 里，模块之间的关系会通过 `imports`、`providers`、`controllers`、`exports` 明确表达出来。
>
> 而 Express 本身比较轻量，它没有 NestJS 这种 `@Module()` 语法。Express 也可以按业务拆文件夹，比如：
>
> ```txt
> routes/users.js
> services/users.service.js
> routes/orders.js
> services/orders.service.js
> ```
>
> 但 Express 不会强制你这样组织，也没有 `imports`、`exports` 这种模块依赖管理机制。Express 更多是靠开发者自己约定目录结构、自己手动 `require` / `import` 文件。
>
> 所以可以简单理解为：
>
> ```
> 模块化思想：不是 NestJS 独有的
> 
> NestJS：
> 框架层面支持模块化，有 @Module()、imports、exports 等机制
> 
> Express：
> 也可以模块化组织代码，但主要靠开发者自己约定，没有官方的 Module 系统
> ```



#### 分模块的好处

1. **代码隔离**：每个模块只管自己的业务，修改时不会影响其他模块
2. **易于维护**：按功能分组，代码好找
3. **团队协作**：不同团队负责不同模块，减少冲突
4. **复用**：某个模块（如配置模块）可以共享给其他模块用



#### 模块引用关系

**以前：
AppModule 直接管理所有 Controller / Service**

**现在：
AppModule 管 Module
各个Module 再管自己的 Controller / Service**

模块之间的引用规则如下：

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule（根模块）                    │
│                                                             │
│   imports: [ItemsModule, UsersModule, OrdersModule, ...]    │
│                         ↓                                   │
│   只有在这里导入的模块，才能被整个应用使用                      │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ↓                   ↓                   ↓
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ ItemsModule │     │UsersModule  │     │OrdersModule │
   │             │     │             │     │             │
   │ Controller  │     │ Controller  │     │ Controller  │
   │    ↓        │     │    ↓        │     │    ↓        │
   │  Service    │     │  Service    │     │  Service    │
   │             │     │             │     │             │
   │ 只用自己    │     │ 只用自己    │     │ 只用自己    │
   │ 模块的     │     │ 模块的     │     │ 模块的     │
   │ 东西       │     │ 东西       │     │ 东西       │
   └─────────────┘     └─────────────┘     └─────────────┘
```

**核心规则：**

1. **模块内部**：Controller 和 Service 可以自由互相调用
2. **跨模块调用**：需要在对方的 Module 中导出（exports），然后在你的 Module 中导入（imports）
3. **Root 统一注册**：所有模块最终都要在 `AppModule` 中注册

#### :star2:模块之间怎么引用 Service？

假设：

```
订单模块 OrdersModule
需要使用
用户模块 UsersModule 里的 UsersService
```

那么关系应该是：

```ts
UsersModule 导出 UsersService
OrdersModule 导入 UsersModule
OrdersService 注入 UsersService
```

代码是这样：

```ts
// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],	//意味着UserModule内部的 UsersService 可以给别的模块用
})
export class UsersModule {}

//然后订单模块导入它
// orders.module.ts
@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [UsersModule],
})
export class OrdersModule {}

//在OrderService中使用UserService
//Orders.service.ts
@Injectable()
export class OrdersService {
  constructor(private readonly usersService: UsersService) {}

  createOrder() {
    // 可以使用 usersService
  }
}
```

完整关系是：

```ts
AppModule
  imports: [UsersModule, OrdersModule]

UsersModule
  controllers: [UsersController]
  providers: [UsersService]
  exports: [UsersService]

OrdersModule
  controllers: [OrdersController]
  providers: [OrdersService]
  imports: [UsersModule]

OrdersService
  constructor(private usersService: UsersService) {}
```



#### 为什么不是导入 Service？

因为 `Service` 本身不是一个“模块”

导出时通常导出 Service，因为Service 是你真正想用的东西；
导入时导入 Module，因为Module 是装着 Service 的盒子。

#### 为什么使用时不是 Module.Service？

Nest 的依赖注入不是按“模块名.服务名”查找的，而是按 Provider Token 查找的。

通常情况下，这个 token 就是类本身。

```
constructor(private readonly serviceA: ServiceA) {}
```

真正表达的是：

```
我需要一个 ServiceA 类型的依赖。
Nest 你帮我找一下当前模块作用域里有没有 ServiceA。
```

Nest 会这样找：

```
1. ModuleB 自己的 providers 里有没有 ServiceA？
2. ModuleB imports 的模块里，有没有哪个模块 exports 了 ServiceA？
3. 找到了 ModuleA exports: [ServiceA]
4. 把 ServiceA 注入给 ServiceB
```

所以你不用写 `ModuleA.ServiceA`。

#### :star2:imports / providers / controllers / exports 怎么记？

你可以这样记：

```
controllers：
这个模块自己有哪些 Controller

providers：
这个模块自己有哪些 Service / Provider

imports：
我想用别的模块导出的东西，所以我要导入那个模块

exports：
我想把自己模块里的某些 Service 暴露给别人用
```

更白话一点：

```
controllers = 我负责哪些接口入口
providers = 我自己有什么
imports = 我要拿别人什么
exports = 我愿意给别人什么
```

### 全局模块

某些服务需要在所有地方都能用（比如配置服务、日志服务、数据库连接服务），

如果每个模块都要写`imports: [ConfigModule]`太麻烦了，

所以做成全局模块：

```typescript
// config.module.ts
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

```typescript
// app.module.ts 只需要在根模块导入一次：
@Module({
  imports: [ConfigModule],  
})
export class AppModule {}
```

加上 `@Global()` 后，`ConfigService` 就不用在每个模块的 `imports` 里导入了，可以直接注入到任何 Service 或 Controller 中。

> Nest 官方文档也强调，`@Global()` 会让模块变成全局作用域，但全局模块一般只应该注册一次，通常由根模块或者核心模块导入；并且不推荐把所有东西都做成全局，因为这样会让模块依赖关系不清晰。

### 共享模块

如果多个模块需要使用同一个 Service，可以使用共享模块：

```typescript
// shared.service.ts
@Injectable()
export class SharedService {}

// shared.module.ts
@Module({
  providers: [SharedService],
  exports: [SharedService],  // 导出给其他模块用
})
export class SharedModule {}

// items.module.ts
@Module({
  imports: [SharedModule],  // 导入共享模块
})
export class ItemsModule {}

// users.module.ts
@Module({
  imports: [SharedModule],  // 导入共享模块
})
export class UsersModule {}
```

**特点：**

依赖关系清楚
但是每个用到的模块都要 imports



### 动态模块

Module 还可以根据配置动态生成，这就是"动态模块"：

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(connectionName: string): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION_NAME',
          useValue: connectionName,
        },
      ],
      exports: ['CONNECTION_NAME'],
    };
  }
}
```

```typescript
// app.module.ts
@Module({
  imports: [DatabaseModule.forRoot('default')],
})
export class AppModule {}
```

这个特性常用于数据库连接、HTTP 客户端等需要配置的场景。



---

## 9. MongoDB + Mongoose 集成

> **过时提示**：视频中的部分内容可能已过时，请以官方文档为准。

### 安装依赖

```bash
npm install @nestjs/mongoose mongoose
```

### 配置 Mongoose

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),
  ],
})
export class AppModule {}
```

> **过时提示**：视频中直接在代码里写 MongoDB URI，现在推荐使用环境变量。

### 创建 Schema

```typescript
// schemas/item.schema.ts
import * as mongoose from 'mongoose';

export const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
});
```

### 配置 Items Module

```typescript
// items/items.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemSchema } from './schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
```

### 在 Service 中使用 Model

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async findAll(): Promise<Item[]> {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    return await this.itemModel.findOne({ _id: id });
  }

  async create(item: Item): Promise<Item> {
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async delete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndRemove(id);
  }

  async update(id: string, item: Item): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
  }
}
```

---

## 10. 完整 CRUD 示例

### Controller

```typescript
// items.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll() {
    return await this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemsService.findOne(id);
  }

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemsService.create(createItemDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: CreateItemDto) {
    return await this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.itemsService.delete(id);
  }
}
```

### Service

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async findAll(): Promise<Item[]> {
    return await this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    return await this.itemModel.findOne({ _id: id });
  }

  async create(item: Item): Promise<Item> {
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async delete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndRemove(id);
  }

  async update(id: string, item: Item): Promise<Item> {
    return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
  }
}
```

---

## 11. 课程总结

### 核心概念

| 概念 | 说明 |
|------|------|
| **Controller** | 处理路由和请求/响应 |
| **Service** | 业务逻辑，使用依赖注入 |
| **Module** | 组织代码的容器 |
| **DTO** | 数据传输对象，定义数据结构 |
| **Interface** | TypeScript 接口，定义类型 |
| **Schema** | Mongoose 数据库模型定义 |

### 实际项目中的模块引用示例

假设场景：订单模块需要查询用户信息，怎么让订单模块用到用户模块的服务？

```typescript
// 1. UsersModule（用户模块）- 需要导出 Service 才能被其他模块使用
// users/users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // ← 关键：导出 UsersService
})
export class UsersModule {}
```

```typescript
// 2. OrdersModule（订单模块）- 导入 UsersModule
// orders/orders.module.ts
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],  // ← 关键：导入 UsersModule
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
```

```typescript
// 3. OrdersService 中使用 UsersService
// orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  // 通过 constructor 注入（NestJS 会自动找到 UsersService）
  constructor(private readonly usersService: UsersService) {}

  async createOrder(userId: string, itemId: string) {
    // 订单模块可以直接调用用户模块的服务
    const user = await this.usersService.findById(userId);
    // ... 创建订单的逻辑
  }
}
```

```typescript
// 4. AppModule（根模块）- 统一注册
// app.module.ts
@Module({
  imports: [UsersModule, OrdersModule, ItemsModule],  // 所有模块在这里汇总
})
export class AppModule {}
```

**总结：想让 A 模块用 B 模块的东西？**

1. B 模块：`exports: [要共享的Service]`
2. A 模块：`imports: [B模块]`
3. A 模块的 Service/Controller：直接在 constructor 中注入

### 依赖注入流程

```mermaid
graph TD
    A[Controller] -->|constructor| B[Service]
    B -->|@InjectModel| C[Mongoose Model]
    C -->|连接| D[(MongoDB)]
```

### Express vs NestJS 面试要点

| 问题 | Express 答案 | NestJS 答案 |
|------|-------------|-------------|
| 路由定义 | 手动在 app.js 中定义 | 用装饰器在 Controller 中定义 |
| 业务逻辑 | 直接写在路由中 | 放在 Service 中 |
| 中间件 | 使用 app.use() | 使用 Middleware 装饰器 |
| 数据库操作 | 手动编写 | 使用 ORM/ODM（Mongoose/TypeORM） |
| 代码组织 | 自己决定 | 强制的模块化结构 |

### 为什么选择 NestJS？

1. **结构化**：强制的代码组织方式，适合大型项目
2. **TypeScript 默认支持**：类型安全
3. **依赖注入**：类似 Angular，便于测试
4. **装饰器语法**：声明式编程
5. **与前端框架的相似性**：如果你用 Angular，会感觉很熟悉

### 什么时候不用 NestJS？

- 小型项目：Express 更轻量
- 只需要简单 API：不需要太多结构
- 学习曲线考量：Express 上手更快

---

> **视频原址**：[NestJS Crash Course](https://www.youtube.com/watch?v=FcioMucBc0Q)
