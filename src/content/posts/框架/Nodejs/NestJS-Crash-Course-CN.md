---
title: Nestjs Crash Course
published: 2026-05-09
updated: 2026-05-09
description: 'Read more about Markdown features in Fuwari'
image: ''
tags: [Nestjs]
category: '框架/Nodejs'
draft: false
---
# NestJS 速成课

> 本教程基于 YouTube [NestJS Crash Course](https://www.youtube.com/watch?v=FcioMucBc0Q) 视频翻译整理
>
> **视频年代**：约 2018 年（7年前），部分内容可能已过时，会在相关位置标注

## 目录

1. [NestJS 简介](#1-nestjs-简介)
2. [项目初始化](#2-项目初始化)
3. [项目结构](#3-项目结构)
4. [Controller 控制器](#4-controller-控制器)
5. [DTO 数据传输对象](#5-dto-数据传输对象)
6. [路由参数](#6-路由参数)
7. [Service 服务与依赖注入](#7-service-服务与依赖注入)
8. [MongoDB + Mongoose 集成](#8-mongodb--mongoose-集成)
9. [完整 CRUD 示例](#9-完整-crud-示例)
10. [课程总结](#10-课程总结)

---

## 1. NestJS 简介

### 什么是 NestJS？

NestJS 是一个用于构建高效、可靠、可扩展的服务端应用的**渐进式 Node.js 框架**。

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

# 或指定包管理器
nest new project-name --package-manager npm
```

> **过时提示**：视频中使用 `nest new` 创建项目的方式基本没变，但可选的包管理器可能增加了。

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

## 3. 项目结构

### 目录结构

```
src/
├── main.ts              # 入口文件
├── app.module.ts        # 根模块
├── app.controller.ts    # 根控制器
├── app.service.ts       # 根服务
└── items/               # items 模块（我们新建的）
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

### 入口文件 main.ts

```typescript
// main.ts - 入口文件
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### 根模块 app.module.ts

```typescript
// app.module.ts - 根模块
// 类似于 Angular 的 AppModule，是所有控制器和服务的"集合地"
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

---

## 4. Controller 控制器

### 创建 Controller

```bash
nest g controller items
```

### 基本结构

```typescript
// items.controller.ts
import { Controller } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  // 路由处理方法
}
```

### 装饰器

| 装饰器 | HTTP 方法 | 说明 |
|--------|----------|------|
| `@Get()` | GET | 获取资源 |
| `@Post()` | POST | 创建资源 |
| `@Put()` | PUT | 更新资源 |
| `@Delete()` | DELETE | 删除资源 |
| `@Patch()` | PATCH | 部分更新 |

### 基本示例

```typescript
import { Controller, Get, Post } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get()
  findAll(): string {
    return 'get all items';
  }

  @Post()
  create(): string {
    return 'create item';
  }
}
```

访问：
- `GET /items` -> "get all items"
- `POST /items` -> "create item"

### 返回类型（TypeScript）

```typescript
@Get()
findAll(): string {
  return 'get all items';
}

// 如果返回类型不对，TypeScript 会报错
@Get()
findAll(): number {
  return 'hello'; // 错误！Type 'string' is not assignable to type 'number'
}
```

---

## 5. DTO 数据传输对象

### 什么是 DTO？

DTO（Data Transfer Object）是一个**定义了数据如何通过网络发送**的对象。

### 创建 DTO

```bash
# 手动创建目录和文件
mkdir -p src/items/dto
# 创建文件
```

```typescript
// dto/create-item.dto.ts
export class CreateItemDto {
  readonly name: string;
  readonly description: string;
  readonly quantity: number;
}
```

> **提示**：使用 `readonly` 修饰符表示这些字段不应被直接修改。

### 在 Controller 中使用 DTO

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  @Post()
  create(@Body() createItemDto: CreateItemDto): string {
    return `name: ${createItemDto.name}, description: ${createItemDto.description}`;
  }
}
```

Postman 请求示例：
```
POST http://localhost:3000/items
Content-Type: application/json

{
  "name": "item one",
  "description": "this is item one",
  "quantity": 100
}
```

---

## 6. 路由参数

### 获取 URL 参数

```typescript
import { Controller, Get, Param, Put, Delete } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `item ${id}`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any): string {
    return `update ${id}`;
  }

  @Delete(':id')
  delete(@Param('id') id: string): string {
    return `delete ${id}`;
  }
}
```

访问：
- `GET /items/100` -> "item 100"
- `PUT /items/44` -> "update 44"
- `DELETE /items/44` -> "delete 44"

### 简写形式

```typescript
@Get(':id')
findOne(@Param() params): string {
  return `item ${params.id}`;
}

// 或直接传递参数名
@Get(':id')
findOne(@Param('id') id: string): string {
  return `item ${id}`;
}
```

---

## 7. Service 服务与依赖注入

### 为什么需要 Service？

Controller 负责处理路由和参数，**真正的业务逻辑应该放在 Service 中**。

### 创建 Service

```bash
nest g service items
```

### 基本结构

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  // 业务逻辑
}
```

### 依赖注入

```typescript
// items.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  // 通过构造函数注入 Service
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
```

### Interface 接口

```typescript
// interfaces/item.interface.ts
export interface Item {
  id?: string;           // 问号表示可选，因为数据库会自动生成
  name: string;
  description?: string;  // 可选字段
  quantity: number;
}
```

### 完整示例

```typescript
// items.service.ts
import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  private items: Item[] = [
    {
      id: '123456',
      name: 'item one',
      description: 'this is item one',
      quantity: 100,
    },
    {
      id: '789012',
      name: 'item two',
      description: 'this is item two',
      quantity: 50,
    },
  ];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: string): Item {
    return this.items.find(item => item.id === id);
  }
}
```

---

## 8. MongoDB + Mongoose 集成

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

## 9. 完整 CRUD 示例

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

## 10. 课程总结

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
