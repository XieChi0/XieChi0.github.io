---
title: Nestjs Crash Course
published: 2026-05-09
updated: 2026-05-12
description: 'Read more about Markdown features in Fuwari'
image: ''
tags: [Nestjs,装饰器]
category: '框架/Nodejs'
draft: false
---
# NestJS 速成课

> 本教程基于 YouTube [NestJS Crash Course](https://www.youtube.com/watch?v=FcioMucBc0Q) 视频翻译整理，大概百分之三十五参考。
>
> **视频年代**：约 2018 年（7年前），部分内容可能已过时，我会根据目前的情况整理。

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

启动步骤：

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

小项目可以直接在 AppModule 里注册 Controller 和 Service；

大项目通常在 AppModule 里导入各个业务模块，例如 ItemsModule、UsersModule。

`@Module()` 负责给 Nest 提供组织应用结构的元信息。

---

## 4. Nest 装饰器基础

### 什么是装饰器？

装饰器（Decorator）是 TypeScript 的一项语法特性，形式是 `@表达式`。

在 NestJS 里，装饰器的作用是：**给类、方法、参数贴一个 Nest 能读懂的标记**。

> 普通 TS 类本身没有后端含义。
> 加上装饰器以后，Nest 才知道这个类是什么角色、这个方法对应哪个接口、这个参数从请求哪里取。

所以装饰器不是普通注释，它会影响 Nest 如何组织项目、注册路由、注入依赖。

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

注册 ≠ 创建实例
注册只是告诉 Nest 有这个服务
创建实例是 Nest 根据注册信息和依赖关系，真正 new 出一个对象

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

```
GET /items/100
```

得到：

```
id = "100"
```

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
keyword = "apple"
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

```
createItemDto.name = "apple"
createItemDto.quantity = 10
```

**`@Req()` 和 `@Res()` 示例**

上面那些装饰器能直接拿到对应的数据，NestJS 帮我们封装好了。但有时候，我们需要拿到"原始的" Express 请求/响应对象，这就用 `@Req()` 和 `@Res()`。

> **什么时候需要用？** 比如：
>
> - 需要读取 Express 原生的 API（headers、method、ip、路径等）
> - 需要操作响应头、设置 Cookie
> - 需要手动控制响应状态码或发送自定义格式的响应
> - 接入某些必须用原生 req/res 的第三方中间件

> **和普通写法最大的区别：** 普通写法是 `return` 数据，NestJS 自动包装成响应。使用 `@Res()` 后，你需要**自己调用 `res.json()` 或 `res.send()` 来返回数据**，否则请求会一直挂起。

```
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
200 OK
{ "message": "custom response" }
```

> **警告：** 使用 `@Res()` 会绕过 NestJS 的响应拦截器（interceptor）和全局异常过滤器。优先使用专门的装饰器（`@Headers()`、`@Body()` 等）来获取数据，只在以上场景必须时才用 `@Req()` / `@Res()`。

------

### 4.5 一次完整请求中，装饰器怎么配合？

看这段代码：

```
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

```
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

```
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

### 5.5 Controller 中注入 Service：constructor 是什么意思？

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

因为这样 Controller 会越来越乱。

**更推荐的写法是：**

```typescript
@Controller('items')
export class ItemsController {
  // 通过 constructor 注入 Service
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    // 调用注入进来的 Service
    return this.itemsService.findAll();
  }
}
```

#### constructor 是什么意思？

```typescript
constructor(private readonly itemsService: ItemsService) {}
```

可以拆成三层意思：

| 部分 | 含义 |
|------|------|
| `ItemsService` | 我要的是 ItemsService 这个服务 |
| `itemsService` | 注入后，在当前类里用这个名字访问它 |
| `private readonly` | 这个属性只在当前类内部使用，不建议重新赋值 |

#### Nest 如何执行注入？

```
当 Nest 创建 ItemsController 的时候：
    ↓
发现 constructor 里需要 ItemsService
    ↓
去当前 Module 的 providers 里找 ItemsService
    ↓
如果找到了，创建 ItemsService 实例
    ↓
注入到 ItemsController 里
```

所以 `constructor` 只是**声明**需要什么：

```typescript
constructor(private readonly itemsService: ItemsService) {}
//              ↑
//              声明：我需要这个服务
```

真正**调用**的时候是这样：

```typescript
@Get()
findAll() {
  return this.itemsService.findAll();  // 这里是真正调用
}
```

#### constructor 的完整写法

```typescript
// 简写（推荐）
constructor(private readonly itemsService: ItemsService) {}

// 展开写法（等价于上面）
private readonly itemsService: ItemsService;
constructor(itemsService: ItemsService) {
  this.itemsService = itemsService;
}
```

---

### 5.6 Controller 和 Service 的配合流程

假设有这样一个 Service：

```typescript
@Injectable()
export class ItemsService {
  private items = [
    { id: '1', name: '苹果', quantity: 10 },
    { id: '2', name: '香蕉', quantity: 20 },
  ];

  findAll() {
    return this.items;
  }

  findOne(id: string) {
    return this.items.find(item => item.id === id);
  }

  create(item: any) {
    this.items.push({ id: Date.now().toString(), ...item });
    return item;
  }
}
```

Controller 这样使用它：

```typescript
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.itemsService.create(body);
  }
}
```

**完整流程：**

```
请求 GET /items
   ↓
进入 ItemsController
   ↓
执行 findAll()
   ↓
调用 this.itemsService.findAll()
   ↓
ItemsService 处理业务逻辑
   ↓
返回数据给 Controller
   ↓
Controller 返回给前端
```

简单说就是：

```
Controller：你要干什么？
Service：具体怎么干。
```

------

### 5.7 Controller 的完整 CRUD 示例

```js
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 查询所有 items
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  // 查询某一个 item
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  // 新增 item
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  // 修改 item
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: CreateItemDto,
  ) {
    return this.itemsService.update(id, updateItemDto);
  }

  // 删除 item
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
```

这段代码可以这样读：

```js
@Controller('items')
这个类负责 /items 这一组接口

constructor(private readonly itemsService: ItemsService)
把 ItemsService 注入进来，方便 Controller 调用业务方法

@Get()
GET /items，查询所有数据

@Get(':id')
GET /items/:id，查询某一条数据

@Post()
POST /items，新增数据

@Put(':id')
PUT /items/:id，修改某一条数据

@Delete(':id')
DELETE /items/:id，删除某一条数据
```

------

### 5.8 Controller 和 Express 写法对比

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



可以理解成：

```
Express：手动注册路由(app.get('/items/:id'))
Nest：用装饰器声明路由(@Controller + @Get 声明路由)
```





------

### 5.9 小结

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

### 什么是 Service？

Service（服务）是 NestJS 中专门**处理业务逻辑**的组件。

```
Controller：接收请求、获取参数
    ↓
Service：处理业务逻辑（查数据库、计算、发送通知等）
    ↓
返回结果给 Controller
```

### 为什么需要 Service？

**不推荐在 Controller 里写业务逻辑：**

```typescript
@Controller('items')
export class ItemsController {
  @Post()
  create(@Body() body: any) {
    // 校验数据合法性
    if (!body.name) throw new Error('name is required');

    // 处理数据
    const processedName = body.name.trim();

    // 业务计算
    const discountedPrice = body.price * 0.9;

    // 操作数据库
    this.db.items.push({ ... });

    // 发送通知
    this.emailService.send('new item created');

    // 返回结果
    return result;
  }
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
  @Post()
  create(@Body() dto: CreateItemDto) {
    // Controller 只做这两件事：
    // 1. 接收请求
    // 2. 调用 Service
    return this.itemsService.create(dto);
  }
}
```

```typescript
@Injectable()
export class ItemsService {
  create(dto: CreateItemDto) {
    // 所有业务逻辑都在这里
    const processedName = dto.name.trim();
    const result = this.processItem(processedName);
    this.emailService.send('new item created');
    return result;
  }
}
```

### 创建 Service

```bash
nest g service items
```

这条命令会：
- 在 `src/items/` 下新建 `items.service.ts` 文件
- 在 `src/items/` 下新建 `items.service.spec.ts` 测试文件
- 自动在 `items.module.ts` 中注册为 provider

### Service 的基本结构

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  // 业务逻辑写在这里
}
```

`@Injectable()` 装饰器告诉 Nest：这个类可以被依赖注入系统管理。

### Service + Interface 完整示例

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
  // 使用 private 模拟数据库
  private items: Item[] = [
    { id: '1', name: '苹果', quantity: 10 },
    { id: '2', name: '香蕉', quantity: 20 },
  ];

  // 查询所有
  findAll(): Item[] {
    return this.items;
  }

  // 查询单个
  findOne(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  // 新增
  create(item: Omit<Item, 'id'>): Item {
    const newItem = {
      id: Date.now().toString(),
      ...item,
    };
    this.items.push(newItem);
    return newItem;
  }

  // 更新
  update(id: string, updates: Partial<Item>): Item | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  // 删除
  remove(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }
}
```

> **注意**：`Omit<Item, 'id'>` 表示除了 `id` 字段外的其他字段，因为新增时 id 通常由数据库自动生成。`Partial<Item>` 表示所有字段都是可选的，用于更新操作。

### 依赖注入原理

> 这一节讲的是"为什么 constructor 能自动拿到 Service"，即依赖注入的内部原理。如果你还没看过 [5.5 节 Controller 中注入 Service](#55-controller-中注入-serviceconstructor-是什么意思)，建议先看那一节。

上一节我们讲了怎么用 `constructor` 注入 Service：

```typescript
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
}
```

这一节来解释：**Nest 是怎么做到的？**

#### Nest 启动时的扫描流程

```
项目启动
    ↓
NestFactory.create(AppModule)
    ↓
读取 AppModule 配置
    ↓
扫描所有 @Module()
    ↓
发现 providers: [ItemsService]
    ↓
创建 ItemsService 实例（单例）
    ↓
扫描所有 Controller 的 constructor
    ↓
发现有依赖声明
    ↓
把对应的 Service 实例注入进去
```

#### 为什么叫"依赖注入"？

```
"依赖"：ItemsController 依赖 ItemsService 才能工作
"注入"：不是你 new 出来的，是 Nest 帮你创建并塞进来的
```

```typescript
// 你声明：constructor(private readonly itemsService: ItemsService) {}

// Nest 实际上做了：
// const itemsService = new ItemsService();      // 创建实例
// const controller = new Controller(itemsService);  // 注入进去
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
// items.module.ts
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

意思是：Nest 找不到 ItemsService，因为它没有在 providers 里注册。

#### Service 中注入其他 Service

一个 Service 也可以注入另一个 Service：

```typescript
// email.service.ts
@Injectable()
export class EmailService {
  send(to: string, message: string) {
    console.log(`Sending email to ${to}: ${message}`);
  }
}
```

```typescript
// items.module.ts
@Module({
  providers: [ItemsService, EmailService],  // 两个都注册
  controllers: [ItemsController],
})
export class ItemsModule {}
```

```typescript
// items.service.ts
@Injectable()
export class ItemsService {
  // 注入 EmailService
  constructor(
    private readonly itemsService: ItemsService,
    private readonly emailService: EmailService,
  ) {}

  create(item: Item): Item {
    const newItem = this.saveToDb(item);
    this.emailService.send('admin@example.com', 'New item created');
    return newItem;
  }
}
```

#### Service 的作用域

| 作用域 | 说明 | 示例 |
|--------|------|------|
| **单例**（默认） | 所有请求共用一个实例 | 大多数 Service |
| **请求级别** | 每个请求一个新实例 | 需要隔离状态的场景 |
| **临时** | 每次注入创建新实例 | 需要独立状态的场景 |

```typescript
@Injectable({ scope: Scope.REQUEST })
export class ItemsService {
  constructor() {
    console.log('每个请求都会创建新实例');
  }
}
```

### 小结

依赖注入的核心流程：

```
1. Service 用 @Injectable() 装饰
2. Service 在 Module 的 providers 中注册
3. Controller 在 constructor 中声明依赖
4. Nest 自动创建实例并注入
5. 你只管用，不用 new
```

用一句话记住：

```
Controller 负责接收请求
Service 负责处理业务逻辑
Module 负责组织它们
依赖注入负责"送上门"
```

---

## 8. Module 模块系统

### 什么是 Module？

Module（模块）是 NestJS 用来**组织代码**的容器。

一个 Module 就是一个普通的类，加上 `@Module()` 装饰器。

### Module 的作用

```
Module = Controller + Service + 其他依赖
         ↓
把相关的代码打包成一个"模块"
         ↓
整个应用由多个 Module 组成
```

### Module 的基本结构

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

```bash
nest g module items
```

这条命令会创建 `items.module.ts`。

### 根 Module（AppModule）

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

### Module 的组织结构

一个典型的项目结构：

```
src/
├── app.module.ts          # 根 Module
├── main.ts                # 入口文件
├── items/
│   ├── items.controller.ts
│   ├── items.service.ts
│   ├── items.module.ts    # items 专属 Module
│   ├── dto/
│   └── interfaces/
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts    # users 专属 Module
│   └── dto/
└── orders/
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── orders.module.ts    # orders 专属 Module
    └── dto/
```

### 全局模块

有时候某些服务需要在所有地方都能用（比如配置服务），可以做成全局模块：

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
// app.module.ts
@Module({
  imports: [ConfigModule],  // 只需导入一次
})
export class AppModule {}
```

加上 `@Global()` 后，`ConfigService` 就不用在每个模块的 `imports` 里导入了，可以直接注入到任何 Service 或 Controller 中。

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

### 模块之间共享服务

Module 的 `imports` 和 `exports` 可以让服务在模块之间共享：

```typescript
// items.module.ts
@Module({
  providers: [ItemsService],
  exports: [ItemsService],  // 暴露给其他模块
})
export class ItemsModule {}

// orders.module.ts
@Module({
  imports: [ItemsModule],  // 导入 items 模块
})
export class OrdersModule {
  constructor(private itemsService: ItemsService) {}
  // 现在可以访问 ItemsService 了
}
```

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

### 小结

```
AppModule（根模块）
    ├── ItemsModule（商品模块）
    │   ├── ItemsController
    │   └── ItemsService
    ├── UsersModule（用户模块）
    │   ├── UsersController
    │   └── UsersService
    └── OrdersModule（订单模块）
        ├── OrdersController
        └── OrdersService
```

Module 的核心作用：

1. **组织代码**：把相关的 Controller 和 Service 放在一起
2. **隔离**：每个模块有自己独立的作用域
3. **共享**：通过 imports/exports 在模块间共享服务
4. **全局**：用 `@Global()` 让某些服务全局可用

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
