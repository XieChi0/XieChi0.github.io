---
title: Nodejs Crash Course
published: 2026-05-03
updated: 2026-05-03
description: ''
image: ''
tags: [Node.js, 事件循环]
category: '框架/Nodejs'
draft: false 
---

# Node.js 速成课程

> （一部分）原文来源：Traversy Media - Node.js Crash Course  
>
> 翻译整理+补充：苯人

## 第一部分：Node.js 基础概念

### 什么是 Node.js？

**Node.js 是一个 JavaScript 运行时（Runtime）**。运行时是一个运行其他程序的程序或环境。有了它，我们可以在你的电脑或服务器上直接构建和运行 JavaScript 应用程序。

Node.js 使用了强大的 V8 JavaScript 引擎，这也是 Google Chrome 浏览器所使用的引擎。



### Node.js 适用场景

**适合的场景**：

- 构建 API（RESTful API、GraphQL API）
- 服务端渲染应用（可以服务 HTML 页面）
- 实时应用（聊天、实时游戏、协作工具）
- 微服务
- 命令行工具
- 机器人（如 Twitter、Slack、Discord 机器人）
- 网页爬虫
- Web 服务器

它让你能够使用 JavaScript 编写服务端代码，做很多和 Python、PHP、C 以及其他服务端语言相同的事情。

**不太适合的场景**：

- CPU 密集型应用（如复杂的数学计算）
- 这种情况下，Python、Ruby、Java 等语言可能更合适

### JavaScript 的进化

传统上，JavaScript 只能在浏览器端使用，做一些表单验证、动画之类的小功能。但有了 Node.js，JavaScript 真正成为了一门强大的**全栈语言**。



### Node.js 的优势

Node.js 非常快且可扩展，这得益于它的架构和 V8 引擎。它也非常流行：
- 约 630 万个网站使用 Node.js
- 被 Netflix、Uber、LinkedIn 等公司使用
- 同时也是初创公司和小型项目的热门选择



---

## 课程大纲

本次课程涵盖的内容（按顺序）：

1. **什么是 Node.js** - 了解它的基本概念和底层原理
2. **安装与项目设置** - 创建项目，配置 package.json
3. **自定义模块** - 创建可以导入导出的文件
4. **模块系统** - CommonJS vs ES Modules
5. **核心模块**：
   - HTTP 模块（最重要）
   - 文件系统（fs）模块
   - Path 模块
   - URL 模块
   - Events 模块
   - OS 模块
   - Crypto 模块
   - Process 模块

### 学习前提

在学习 Node.js 之前，你应该：
- 扎实地掌握 JavaScript 基础知识（变量、函数、循环、对象、类）
- 理解异步编程（回调、Promise、async/await）
- 了解 HTTP 工作原理（请求/响应周期、GET/POST/PUT/DELETE 方法、状态码如 200、404、500）
- 有一些 npm 使用经验（如果用过 React 或任何前端框架，你可能已经接触过）

---

## Node.js 工作原理

### 核心特性

Node.js 基于 V8 引擎，核心特性包括：

- **单线程**：JS 主线程唯一，避免多线程资源竞争问题
- **非阻塞 I/O**：I/O 操作不阻塞主线程执行
- **事件循环**：协调异步任务调度的核心机制

> 我们常说Node.js单线程指的是它的javaScript执行线程只有一个，这个线程负责处理非阻塞的 I/O 操作回调和业务逻辑。
>
> 它还有其他线程，比如底层的 libuv 库会管理线程池来处理文件 I/O、DNS 解析等阻塞操作，不过这些线程对 JavaScript 开发者是透明的。
>
> 它单线程，是强调 JS 执行逻辑在一个线程里，避免了多线程的锁问题，而不是整个进程只有一个线程。
>
> 如果要处理高并发，会用到事件循环机制。



### 底层架构

Node.js 基于 V8 JavaScript 引擎构建，这个引擎同样驱动着 Google Chrome。其他浏览器有自己的引擎：
- Firefox 用 SpiderMonkey
- Safari 用 JavaScriptCore

V8 引擎用 C++ 编写，它负责将 JavaScript 代码转换成机器码，让你的电脑能够理解。Node.js 将这个引擎扩展到服务端使用。

┌─────────────────────────────────┐
│        Node.js 运行时           │
├─────────────────────────────────┤
│   JavaScript 核心模块 (JS)       │  ← 大部分 API 是 JS
├─────────────────────────────────┤
│   V8 引擎 (C++)                 │  ← 编译 JS 为机器码
├─────────────────────────────────┤
│   libuv (C)                     │  ← 处理异步 I/O
├─────────────────────────────────┤
│   其他 C++ bindings              │  ← 连接底层系统
└─────────────────────────────────┘

> V8 引擎：
>
> - 由 Google 用 C++ 开发
> - 作用是将 JavaScript 代码编译成机器码，让电脑能执行
>
> Node.js 本身：
>
> - 大部分是用 JavaScript 写的（核心模块如 `fs`、`http`、`path` 等）
> - 但它需要用 C++ 来绑定底层系统能力，比如调用文件系统、操作网络等
> - 这些 C++ 部分主要做"桥接"工作
>
> Node.js 的底层依赖 C++（V8 + libuv + bindings）

### 非阻塞 I/O

Node.js 是**非阻塞**的，这意味着它不会等待 I/O 操作完成。

I/O（Input/Output）即输入 / 输出操作，指计算机与外部设备（硬盘、网络、数据库等）之间的数据交互，常见场景包括：

- 文件读写（File System）
- 网络请求（HTTP/HTTPS）
- 数据库操作（Database）

Node.js 遇到这类任务时，通常会把任务交给 **libuv / 操作系统 / 线程池** 处理。

JS 主线程不会一直等待结果，而是继续执行后面的代码。

等 I/O 完成后，对应的回调会进入队列，再由事件循环调度执行。

####  非阻塞 I/O与阻塞 I/O 的区别

| 类型           | 执行逻辑                                                     | 特点                           |
| :------------- | :----------------------------------------------------------- | :----------------------------- |
| **阻塞 I/O**   | 线程发起 I/O 请求后，**暂停执行**并等待结果返回，期间无法处理其他任务 | 简单但效率低，线程资源浪费严重 |
| **非阻塞 I/O** | 线程发起 I/O 请求后，**立即返回**继续执行其他任务，I/O 完成后通过回调通知结果 | 高效利用线程，适合高并发场景   |



------

### Node.js的两种异步机制

#### 底层资源型异步：非阻塞I/O

- 文件读写
- 网络请求
- 数据库操作
- TCP / HTTP / Socket
- Stream 流
- 定时器



Node.js 遇到这类任务时，通常会把任务交给 **libuv / 操作系统 / 线程池** 处理。

JS 主线程不会一直等待结果，而是继续执行后面的代码。

等 I/O 完成后，对应的回调会进入队列，再由事件循环调度执行。



#### JS队列型异步：Promise/微任务/nextTick

- Promise.then / catch / finally
- async / await 后续代码
- queueMicrotask
- process.nextTick

有些异步不涉及文件读写、网络请求、数据库，也不需要操作系统或线程池真正去执行耗时任务，它只是 JS 自己的队列调度机制。

这类异步主要是：

**把回调放进 JS 的任务队列 / 微任务队列，等当前同步代码执行完后再执行。**

例如：

```js
console.log(1)
Promise.resolve().then(() => {
  console.log(2)
})

console.log(3)


执行结果
1
3
2
```

:star2:：但是！不意味着带promise或者async/await一定是非阻塞I/O操作，具体的你要看里面的代码，如果涉及到了非阻塞I/O,那就是底层资源型异步 + JS 队列型异步的组合。

promise本身不是“干活的人”，只是“结果通知器”，无论任务未完成、完成、失败，都要进行通知。

>  如果里面包装了I/O，Promise / async-await 负责在结果完成后，把**I/O完成后的通知与回调放到宏任务中**，把**.then/await后续代码放进微任务队列**执行。



### libuv

libuv是Node.js底层用的C语言库。

Node.js对于开发人员是用js写的，但js本身不会去操作系统处理文件、网络、定时器，于是Node.js借助libuv来做底层工作。

而libuv 提供了事件循环、线程池、I/O 通知这些底层机制，让 Node.js 可以做到：主线程不等待耗时任务，任务完成后再执行回调。可以说**是libuv让Node.js拥有了异步的能力**。

libuv会负责：

```
1.事件循环
2.异步I/O
3.线程池
4.定时器
5.网络socket
6.跨平台兼容Windows/macos/Linux
```



#### 与事件循环的配合

:star2:调用异步 API → **Node/libuv 根据任务类型建立异步处理机制** → 等任务完成或资源就绪 → 回调进入队列 → 事件循环调度执行。

> JS 发起异步任务
> ↓
> Node 接收任务和回调
> ↓
> 如果是 Node 提供的异步能力，比如文件、网络、定时器等
> 大多会经过 libuv
> ↓
> libuv 再根据任务类型，交给操作系统或线程池处理，**libuv会监听事件的执行，执行完后会负责把回调放进队列。**


但要注意一个例外：

```
Promise / async-await / queueMicrotask
```

这类不是“底层 I/O 异步”，主要是 **JS/V8 的微任务机制**，不是主要交给 libuv 去干活。

所以你可以记成：

> **Node 里的 I/O 类异步，大多经过 libuv；JS 语法层面的异步，比如 Promise，主要是 V8/JS 微任务机制。**
>
> > setTimeout 是 JS 常用 API，但在 Node 里，真正计时和调度主要靠 Node + libuv。

![image-20260511131220181](./assets/image-20260511131220181.png)

事件循环只负责“等主线程空了，且回调可以执行时，把它拿出来执行”，负责回调的执行安排，只是**调度员**。


---

## 事件循环（Event Loop）机制

### 单线程与事件循环

![image-20260503110713318](./assets/image-20260503110713318.png)

<h4>核心角色</h4>

- **JS 主线程**：执行同步代码和回调函数
- **事件循环**：持续运行的调度器，负责任务分配和回调触发
- **任务队列**：存放待执行的回调函数（宏任务 / 微任务分队列存储）
- **底层线程 / 系统内核**：处理非阻塞 I/O 操作（如文件读写、网络请求）

<h4>完整执行流程</h4>
1. **请求进入**：Requests 进入系统，由事件循环接收


2. **任务分发：**
   - 同步任务：直接在 JS 主线程执行
   - 异步 I/O 任务：事件循环将操作交给底层线程 / 系统内核处理

3. **I/O 处理**：底层执行 I/O 操作期间，JS 主线程继续处理其他任务

4. **回调入队**：I/O 完成后，**回调函数（携带结果）被放入任务队列**

5. **回调触发**：事件循环检查任务队列，当 JS 主线程空闲时，取出回调函数交给主线程执行（Trigger Callback）

> :star2:事件循环阶段处理的是 I/O完成后的回调，不是I/O本身。

```
┌─────────────────────────────────────────────────────────────────┐
│                      Node.js 事件循环流程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                              │
│   │   Call Stack │  执行栈，存放要执行的代码                      │
│   │   (调用栈)    │  同步代码在这里执行                           │
│   └──────┬───────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────┐                                              │
│   │  Node.js API │  异步任务注册的地方                           │
│   │  (Web APIs)  │  setTimeout, fs.readFile 等                   │
│   └──────┬───────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────┐                                              │
│   │  Event Queue │  任务队列，存放完成的异步任务                  │
│   │   (事件队列)   │  等待被 Call Stack 执行                       │
│   └──────┬───────┘                                              │
│          │                                                      │
│          │ 事件循环：不断检查 Call Stack 是否为空                 │
│          │         为空就把队列里的任务搬过来执行                │
│          ▼                                                      │
│   ┌──────────────┐                                              │
│   │   无限循环   │  永远不停，直到没有任务                       │
│   │             │                                              │
│   └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```



### 宏任务（Macro Task）与微任务（Micro Task）

<h4>1. 基本概念</h4>

- **宏任务**：较大的异步操作单元，事件循环每个轮次执行一个
- **微任务**：较小且优先级高的异步操作单元，当前宏任务执行完后立即全部执行

<h4>2. 常见类型</h4>

| 类型       | 示例                                                         |
| :--------- | :----------------------------------------------------------- |
| **宏任务** | 整体脚本执行、`setTimeout`/`setInterval` 回调、I/O 操作、`setImmediate`（Node.js） |
| **微任务** | `Promise.then/catch/finally`、`queueMicrotask()`、`MutationObserver`（浏览器） |

<h4>3. 执行顺序规则

1. 执行**一个宏任务**（从宏任务队列取出）
2. 执行该宏任务过程中产生的**所有微任务**（清空微任务队列）
3. 重复步骤 1-2，直到所有任务执行完毕

> 注意：微任务不一定来源于宏任务（如 `queueMicrotask()` 可直接创建微任务），但无论来源如何，执行完一个宏任务后都会清空当前微任务队列。

:star::star:但是并不是说当同时出现宏任务、微任务时，宏任务一定优先执行，他们哪个先执行要看说话的语境。

宏任务先于微任务：讲的是**每一轮循环的内部规则**（一个宏任务 + 全量微任务）

微任务先于宏任务：讲的是**代码最开始启动的执行顺序**



## 经典面试题：执行顺序

```javascript
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
Promise.resolve().then(() => console.log('Promise then'));
process.nextTick(() => console.log('nextTick'));

console.log('同步代码');
```

**输出顺序：**

```
同步代码
nextTick
Promise then
setTimeout (或 setImmediate - 取决于 I/O)
setImmediate (或 setTimeout)
```

**解释：**

先跑完**全局同步代码**，

然后**一次性清完全部微任务**，

才开始跑第一个宏任务。

```
同步 → 微任务 → 宏任务
```

**微任务：**

process.nextTick→ 最高优先级（`nextTick` 是 Node **内置高优先级插队机制**，比标准 ES6 Promise 微任务优先级更高）

promise.then

**宏任务：**

setTimeout(fn, 0)

setImmediate(fn)

顺序不固定，完全看当前Node.js 性能与 I/O 状态，谁快谁先输出。

## 事件循环的几个阶段（大概看，不重要）

```
同步代码
│
├─ 先直接执行
│
├─ 执行完后清空：
│   ├─ process.nextTick
│   └─ Promise 微任务
│
└─ 然后进入事件循环阶段，也就是宏任务体系：
    ├─ timers
    ├─ pending callbacks
    ├─ poll
    ├─ check
    └─ close callbacks
```

Node.js 事件循环有多个**阶段（Phase）**，每个阶段处理不同类型的任务：

> 它们不是平行抢着执行，而是像一个圆形流水线,
>
> 一圈一圈转：
> timers → pending → poll → check → close → 下一圈 timers → ...

```
┌─────────────────────────────────────────────────────────────────┐
│                      事件循环的六个阶段                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ① timers（计时器阶段）                                         │
│   │   ├── setTimeout(回调, 1000)                                │
│   │   └── setInterval(回调, 1000)                               │
│   │   执行：到期的定时器回调                                       │
│   │                                                               │
│   ② pending callbacks（待定回调阶段）                            │
│   │   执行：延迟到下一个循环的 I/O 回调                           │
│   │                                                               │
│   ③ idle, prepare（空闲/准备阶段）                                │
│   │   内部使用，开发者无需关心                                     │
│   │                                                               │
│   ④ poll（轮询阶段）⭐ 重要                                       │
│   │   ├── 获取新的 I/O 事件                                      │
│   │   ├── 执行 I/O 回调（文件读取、网络请求等）                   │
│   │   └── 如果没有回调，停留等待                                   │
│   │                                                               │
│   ⑤ check（检查阶段）                                            │
│   │   └── 执行 setImmediate 回调                                  │
│   │                                                               │
│   ⑥ close callbacks（关闭回调阶段）                              │
│       └── 执行 socket.on('close') 等关闭回调                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```



---

## 安装 Node.js

### 安装步骤

1. 访问 [nodejs.org](https://nodejs.org)
2. 下载 **LTS**（长期支持版）——推荐使用
3. 运行安装程序
4. 打开终端，输入 `node --version` 验证安装
5. npm（Node Package Manager）会自动安装，输入 `npm --version` 验证

### Mac/Linux 安装方式

- **Mac**：可以使用 Homebrew
- **Linux**：使用系统的包管理器

### Node REPL

Node.js 自带一个 REPL（Read-Eval-Print Loop），是一个命令行环境，可以直接运行 JavaScript。

```bash
node
```

进入后，可以直接输入 JavaScript 代码：

```javascript
const name = 'John'
const greet = (name) => `Hello ${name}`
greet(name)  // 'Hello John'
```

按 `Ctrl + C` 退出。

---

## 创建第一个 Node.js 项目

### 项目初始化

```bash
mkdir nodejs-crash-course-2024
cd nodejs-crash-course-2024
npm init
```

运行 `npm init` 后会提示填写信息：
- **package name**: 项目名称
- **version**: 版本号（默认 1.0.0）
- **description**: 项目描述
- **entry point**: 入口文件（通常用 index.js）
- **test command**: 测试命令
- **git repository**: Git 仓库
- **keywords**: 关键词
- **author**: 作者
- **license**: 许可证（常用 MIT）

生成 `package.json` 文件后，99% 的时间你还需要创建一个入口文件：

```bash
touch index.js
# 或手动创建 index.js
```

### 第一个脚本

```javascript
// index.js
console.log(global)
```

运行：
```bash
node index.js
# 或
node index
```

### Node.js 与浏览器的区别

**没有 `window` 对象**：在浏览器中有 `window` 对象，但 Node.js 中没有。

**没有 `document` 对象**：没有 DOM，因为没有浏览器环境。

**有 `global` 对象**：类似于浏览器中的 `window`，但代表全局对象，包含 `setTimeout`、`setInterval` 等（在浏览器中属于 Web API）。 

**有 `process` 对象**：代表当前运行的进程，可以访问环境变量等信息。

---

## 模块系统

### 为什么需要模块？

通常你会有一个包含多个文件和文件夹的项目结构。有一个入口文件，其他文件被导入进来。

> **💡 说明：** `"type": "commonjs"` 在 `package.json` 中是**默认值**，可以省略不写。
>
> 如果要使用esmodule
>
> 方法一：在package.json的type里说明"type":"module"，这样全局会是esmodule。
>
> 方法二：直接把文件后缀由js改为`mjs`，这样可以是全局commonjs时个别文件是esmodule。
>
> 反之，如果你在package.json里写了type:module，意味着你整个文件都是esmodule，如果你想用`commonjs`，
>
> 只需要把这个文件后缀改为`cjs`

:star: **ES Module** 里，相对路径通常必须写完整文件名和后缀。

### CommonJS 模块系统

CommonJS 是 Node.js 原生的模块系统。

创建模块文件 utils.js：

```javascript
function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32
}

// 导出单个函数
module.exports = generateRandomNumber

// 或导出多个函数
module.exports = {
  generateRandomNumber,
  celsiusToFahrenheit
}


```

**导入模块** ：

```javascript
// app.js 中的模块引入
require('dotenv').config()
const argumentUtils = require('./framework/utils/argument_utils')
const fileUtils = require('./framework/utils/file_utils')
const express = require('express');
const bodyParser = require('body-parser');
const routeLoader = require('./framework/load');
const userService = require('./business/service/user')
```

三种引入类型

| 类型           | 写法                | 示例                                         |
| -------------- | ------------------- | -------------------------------------------- |
| **核心模块**   | `require('模块名')` | `require('fs')`, `require('path')`           |
| **第三方模块** | `require('模块名')` | `require('express')`, `require('sequelize')` |
| **自定义模块** | `require('./路径')` | `require('./framework/load')`                |

### ES Modules 模块系统

ES Modules 是更现代的语法，也是 React、Vue 等前端框架使用的语法。

**启用 ES Modules**：在 `package.json` 中添加：

```json
{
  "type": "module"
}
```

**导出模块** `utils.js`：

```javascript
export function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1
}

export function celsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32
}

// 或默认导出
export default function helper() { }
```

**导入模块** `index.js`：

```javascript
import { generateRandomNumber, celsiusToFahrenheit } from './utils.js'
import helper from './utils.js'  // 默认导出不需要大括号

console.log(`Random number: ${generateRandomNumber()}`)
```

> 注意：使用 ES Modules 时，导入文件需要加 `.js` 扩展名。

---



## npm包管理（package.json）

> **📍 位置：** `src/package.json`
>
> ```json
> {
> "name": "product1",
> "version": "2.4.2",
> "private": true,
> "main": "./src/app.js",
> "bin": "./src/app.js",
> "type": "commonjs",
> "scripts": {
> "start": "node src/app"
> },
> "dependencies": {
> "express": "^4.18.2",
> "sequelize": "^6.29.0",
> "axios": "^1.9.0"
> },
> "devDependencies": {
> "eslint": "^8.57.0"
> },
> "pkg": {
> "targets": ["win"],
> "assets": ["node_modules/.store/**"]
> }
> }
> ```



### 关键字段

| 字段                | 含义                             |
| ------------------- | -------------------------------- |
| `"main"`            | 模块入口文件                     |
| `"type"`            | 模块系统：`commonjs` 或 `module` |
| `"dependencies"`    | 生产环境依赖                     |
| `"devDependencies"` | 开发环境依赖                     |


| 参数写法          | 含义                         | 说明                                                         |
| ----------------- | ---------------------------- | ------------------------------------------------------------ |
| `-g / --global`   | 全局安装                     | 常用小写 `-g`；不要写 `-G`                                   |
| `-D / --save-dev` | 开发依赖 ，项目正式运行不用  | 保存到package.json中 `devDependencies`，比如 nodemon、eslint |
| `-S / --save`     | 运行时依赖，什么环境都要用到 | 保存到package.json中 `dependencies`；npm 5+ 默认就是这个，所以通常省 |

### 版本号规则


^4.18.2  →  >=4.18.2 且 <5.0.0

> 大版本锁死，第一位不变

~4.18.2  →  >=4.18.2 且 <4.19.0（允许修订号更新）

> 小版本锁死，前两位不变

4.18.2   →  精确版本



### npm 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装所有依赖 |
| `npm install <package>` | 安装单个包 |
| `npm install --save <package>` | 添加到 dependencies |
| `npm install --save-dev <package>` | 添加到 devDependencies |
| `npm run <script>` | 运行 npm 脚本 |
| `npm list` | 查看已安装的包 |
| `npm outdated` | 检查过期依赖 |
| `npm update` | 更新依赖 |





## HTTP 模块与服务器创建

### 创建第一个服务器

Node.js 的 HTTP 模块允许你创建服务器、接收请求和发送响应。

```javascript
import http from 'http'

const server = http.createServer((req, res) => {
  res.write('Hello World')
  res.end()
})

const port = 8000
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

运行 `node server.js`，访问 `http://localhost:8000` 即可看到 "Hello World"。

### 设置响应头和状态码

```javascript
const server = http.createServer((req, res) => {
  // 设置状态码
  res.statusCode = 404
  
  // 设置响应头
  res.setHeader('Content-Type', 'text/html')
  
  res.write('<h1>Not Found</h1>')
  res.end()
})
```



### 使用 npm 脚本

在 `package.json` 中配置：

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

运行：

```bash
npm start
```

> `scripts` 里的 `start` 是 npm 的内置命令，直接用 `npm start` 就能执行，不用加 `run`。除了 start，还有test、stop、restart 这些内置命令也可以省略 run，其他自定义脚本才需要用 `npm run 脚本名` 执行。（比如npm run dev）



### 使用 Nodemon 自动重启

开发时，每次修改代码都要手动重启服务器很麻烦。Nodemon 可以监听文件变化并自动重启。

```bash
npm install -D nodemon
```

在 `package.json` 中修改脚本：

```json
{
  "scripts": {
    "start": "nodemon server.js"
  }
}
```



### 环境变量与 .env 文件

环境变量存储在你的系统环境中，整个程序都可以访问。

**创建 `.env` 文件**：

```
PORT=8080
```

**在脚本中使用**：

```json
{
  "scripts": {
    "start": "node --env-file=.env server.js"
  }
}
```

**在代码中读取**：

```javascript
const port = process.env.PORT
```

**如何理解这个命令？**

> Node.js 本身默认不会读取 `.env` 文件里的环境变量，所以需要通过 `--env-file` 告诉 Node.js 加载`.env`这个文件。
>
> 
>
> node        --env-file=.env        server.js
> 启动 Node    加载哪个 env 文件       运行哪个 JS 文件（入口文件）
>
> 
>
> 这样 `server.js` 里才能用 `process.env` 访问到 `.env` 里的配置，不然直接写 `process.env.XXX` 会拿到 `undefined`。
>
> `process` 是 Node.js 提供的一个全局对象，不用额外引入就能直接用，它代表当前 Node.js 进程的运行环境和状态。



**详细说明**

> 如果你把--env-file只写到package.json的scripts里，意味着你必须用这个启动方式，不用这个启动方式，无法打开.env
>
> 如果你希望开发和生产都读取不同的 env，可以这样：
>
> ```
> {
>   "scripts": {
>     "dev": "node --env-file=.env.development app.js",
>     "start": "node --env-file=.env.production app.js"
>   }
> }
> ```
>
>  



**--env-file写到哪里？**

| 写在哪里                     | 示例                                   | 常见程度   |
| ---------------------------- | -------------------------------------- | ---------- |
| 终端命令里                   | `node --env-file=.env app.js`          | 可以       |
| `package.json` 的 scripts 里 | `"dev": "node --env-file=.env app.js"` | 最常见     |
| PM2 / Docker / 部署脚本里    | 启动命令里加 `--env-file`              | 部署时常见 |
| JS 代码里                    | `--env-file=.env`                      | 不写这里   |





<h4>与dotenv的场景区别

从 Node.js **20.6.0** 开始，Node 官方支持通过 `--env-file` 加载 `.env` 文件。官方发布说明里给出的用法是：

```
node --env-file=.env app.js
```

但是在以下几种场景，你仍然需要使用**dotenv**

**情况一：Node.js 版本低于 20.6**

**情况二：你想在代码里控制加载哪个 env 文件**

官方 `--env-file` 是在命令行里写：

```
node --env-file=.env.development app.js
```

而 `dotenv` 可以在代码里写：

```
require('dotenv').config({
  path: '.env.development'
})
```

也可以根据 `NODE_ENV` 动态决定：

```js
const dotenv = require('dotenv')

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})
```

比如：

```
NODE_ENV=production node app.js
```

它就可以加载：

```
.env.production
```

这种控制方式对一些项目会更灵活。

**情况三：你需要更复杂的 `.env` 能力**

普通 `.env`：

```
DB_HOST=localhost
DB_PORT=3306
```

够简单。

但有些项目会需要：

```
DATABASE_URL=mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/test
```

这种“变量引用变量”的能力，通常还要配合类似 `dotenv-expand` 这样的库。



<h4>Next.js 项目

Next.js 自己本身就有 `.env` 加载规则，比如：

```
.env
.env.local
.env.development
.env.production
```

所以普通 Next.js 项目里，你通常也不需要自己手动装 `dotenv`。

**`dotenv` 是以前 Node.js 读取 `.env` 的“第三方补丁”；`--env-file` 是后来 Node.js 官方内置了这个基础能力。**

**官方内置解决的是“基础读取”；`dotenv` 生态解决的是“兼容老版本 + 更灵活配置”。**



### 请求对象与路由

从请求对象中获取信息：

```javascript
const server = http.createServer((req, res) => {
  console.log('URL:', req.url)      // 请求的 URL
  console.log('Method:', req.method) // 请求方法（GET、POST 等）
  
  // 简单路由
  if (req.url === '/' && req.method === 'GET') {
    res.write('<h1>Homepage</h1>')
    res.end()
  } else if (req.url === '/about' && req.method === 'GET') {
    res.write('<h1>About</h1>')
    res.end()
  } else {
    res.statusCode = 404
    res.write('<h1>Not Found</h1>')
    res.end()
  }
})
```



### 加载 HTML 文件

使用 `fs` 模块读取 HTML 文件：

```javascript
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = http.createServer(async (req, res) => {
  let filePath = path.join(__dirname, 'public', 'index.html')
  
  if (req.url === '/about') {
    filePath = path.join(__dirname, 'public', 'about.html')
  }
  
  try {
    const data = await fs.readFile(filePath)
    res.setHeader('Content-Type', 'text/html')
    res.write(data)
    res.end()
  } catch (err) {
    res.statusCode = 404
    res.end('Not Found')
  }
})
```

---



## 构建 REST API

REST 是一套**架构设计风格**，它的核心原则是：

- 用 HTTP 方法对应 CRUD 操作：`GET`查、`POST`增、`PUT`改、`DELETE`删
- URL 代表资源（比如 `/api/users`、`/api/users/:id`）
- 用 JSON 作为数据交互格式

### 创建用户 API

```javascript
import http from 'http'

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 3, name: 'Jim Doe' }
]

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')
  
  // 获取所有用户
  if (req.url === '/api/users' && req.method === 'GET') {
    res.write(JSON.stringify(users))
    res.end()
  }
  // 获取单个用户
  else if (req.url.match(/\/api\/users\/[0-9]+/) && req.method === 'GET') {
    const id = req.url.split('/')[3]
    const user = users.find(u => u.id === parseInt(id))
    
    if (user) {
      res.write(JSON.stringify(user))
    } else {
      res.statusCode = 404
      res.write(JSON.stringify({ message: 'User not found' }))
    }
    res.end()
  }
  // 404
  else {
    res.statusCode = 404
    res.write(JSON.stringify({ message: 'Route not found' }))
    res.end()
  }
})

const port = 8000
server.listen(port, () => console.log(`Server running on port ${port}`))
```

### 处理 POST 请求（添加用户）

```javascript
// 添加用户
else if (req.url === '/api/users' && req.method === 'POST') {
  let body = ''
  
  //表示为req请求对象绑定一个名为data的事件监听器,当你使用req.on('data', ...)定义了对data事件的监听器后，只要有数据发送到服务器端的这个请求里，该监听器就会被触发来处理数据。不过前提是请求对象req存在且在有效生命周期内 。
  
  //当客户端向服务器发送数据时，数据可能会分块传输，每收到一块数据，就会触发这个监听器，将接收到的数据块chunk转换为字符串后累加到自定义变量body中，用于拼凑完整的请求体内容。
  req.on('data', chunk => {
    body += chunk.toString()
  })
  
  req.on('end', () => {
    const newUser = JSON.parse(body)
    newUser.id = users.length + 1
    users.push(newUser)
    
    res.statusCode = 201
     //将新添加的用户对象newUser转换为 JSON 格式字符串后，写入到响应体中（一是确保前后端数据一致，服务器可能会处理数据，返回数据让用户确认；二是提升体验，减少用户重复请求，如注册后直接返回信息 。）
    res.write(JSON.stringify(newUser))
    res.end()
  })
}
```



## 核心模块详解

### 文件系统（fs）模块

fs 模块用于处理文件操作。有多种使用方式：

#### 1. 异步版本（回调、不阻塞）

```javascript
import fs from 'fs'

fs.readFile('./test.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})
```

#### 2. 同步版本（阻塞）

```javascript
const data = fs.readFileSync('./test.txt', 'utf8')
console.log(data)
```

> 注意：同步版本会阻塞代码执行，尽量避免使用。

#### 3. Promise 版本（推荐）

**分为.then写法和 async/await写法**

```javascript
import fs from 'fs/promises'
//.then写法
fs.readfile('./text.txt','utf8')
    .then((data)=>console.log(data))
    .catch((err)=>console.log(err))

//async/await写法
const readFile = async() => {
  try {
    const data = await fs.readFile('./test.txt', 'utf8')
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

// 写入文件（覆盖）
const writeFile = async() => {
  await fs.writeFile('./test.txt', 'Hello, World!')
}

// 追加内容
const appendFile = async() => {
  await fs.appendFile('./test.txt', '\nThis is appended text')
}
```

---

### Path 模块

Path 模块提供处理文件路径的实用工具。

```javascript
import path from 'path'

const filePath = './dir1/dir2/test.txt'

// 获取文件名
path.basename(filePath)  // 'test.txt'

// 获取目录名
path.dirname(filePath)  // './dir1/dir2'

// 获取扩展名
path.extname(filePath)  // '.txt'

// 解析路径信息
path.parse(filePath)
// { root: '', dir: './dir1/dir2', base: 'test.txt', ext: '.txt', name: 'test' }

// 拼接路径（自动处理不同操作系统的分隔符）
path.join(__dirname, 'public', 'index.html')

// 解析为绝对路径
path.resolve('public', 'index.html')
```

> join更像是把这些路径片段合成一个路径，如果是`path.join('dir1', 'dir2', 'test.txt')`，会得到`dir1/dir2/test.txt`,
>
> resolve会从右到左，算出绝对路径。
>
> `path.resolve('dir1','dir2','test.txt')`，会得到`User/project/dir1/dir2/test.txt`

### 获取当前文件路径

**CommonJS 方式**：
```javascript
console.log(__filename)  // 当前文件路径
console.log(__dirname)   // 当前目录（绝对路径）
```

**ES Modules 方式**：

```javascript
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log(__filename,__dirname)	// /User/dev/parhLearn.js      /User/dev
```

---

### OS 模块

OS 模块提供操作系统相关信息。

> 如果你想创建出一个和系统内存、CPU等交互的程序

```javascript
import os from 'os'
console.log()
// 系统用户信息
os.userInfo()
// { uid: -1, gid: -1, username: 'xxx', home: '...', shell: '...' }
//其实是要console.log(os.userInfo())，但是不直观，后面省略console.log写法

// 系统内存
os.totalmem()  // 总内存（字节）
os.freemem()    // 空闲内存（字节）

// CPU 信息
os.cpus()  // 返回 CPU 数组

// 其他
os.hostname()    // 主机名
os.platform()    // 平台 (win32, linux, darwin)
os.release()     // 系统版本
os.uptime()      // 系统运行时间
```

---

### URL 模块

URL 模块用于解析和操作 URL。

![ChatGPT Image 2026.5.4 17_39_51](./assets/ChatGPT Image 2026.5.4 17_39_51.png)

```javascript
import { URL } from 'url'

const urlString = 'https://www.google.com/search?q=hello+world'

// URL Object
const url = new URL(urlString)

console.log(url.origin)      // 'https://www.google.com'
console.log(url.hostname)     // 'www.google.com'
console.log(url.pathname)     // '/search'
console.log(url.search)       // '?q=hello+world'

// 解析查询参数
const params = new URLSearchParams(url.search)
console.log(params.get('q'))  // 'hello world'
console.log(params)	// URLSearchParams {'q'=> "hello world"}

// 操作查询参数
params.append('limit', '5') 
//console.log(params)	// URLSearchParams {'q'=> "hello world",'limit'=>'5'}
params.delete('limit')
//console.log(params)	// URLSearchParams {'q'=> "hello world"}
```

#### 获取当前模块的 URL

```javascript
console.log(import.meta.url)           // 文件 URL (file:///Users/urlLearn.js)
console.log(fileURLToPath(import.meta.url))  // 转换为路径
```

---

### Crypto 模块

Crypto 模块用于处理：哈希、随机数、加密、解密等安全相关功能。

#### 创建哈希createHash

**哈希就是把一段原始内容，算成一串固定格式的字符串。**

常用于：文件校验、数据指纹

but，哈希不是加密，通常不能反推回原文。

```javascript
import crypto from 'crypto'

//createHash（创建一个哈希计算器）
const hash = crypto.createHash('sha256')	//参数是你想加入的哈希算法，sha256 是一种常见的哈希算法，会把输入内容计算成一段固定长度的结果。

//往哈希计算器放入要计算的原始内容，即喂数据
hash.update('password123')	

//生成哈希结果
const hashedPassword = hash.digest('hex')	//digest('hex')表示把结果转成十六进制字符串，digest会负责输出数据

console.log(hashedPassword)
// 可能输出类似ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f

//但真实项目里，不建议直接 sha256(password)
// 更推荐 bcrypt、argon2 这类专门用于密码存储的算法
```

#### 生成随机字节randomBytes

常用于 验证码 token、临时密钥、随机 ID、盐值 salt

```javascript
//生成 16 个随机字节（1 个 byte = 8 位二进制(bits)）
crypto.randomBytes(16, (err, buffer) => {
  if (err) {
    console.error('生成随机字节失败：', err)
    return
  }
  //buffer是Node.js中的二进制数据容器，randomString会生成二进制数据，这句话是说把二进制buffer转换成十六进制字符串，
  const randomString = buffer.toString('hex')
  console.log(randomString)
  //1个字节会变成2个十六进制字符串，16字节会得到32bytes
  //可能输出  // 9f2a6c0d8b3e4a12f0c99a73b41e5d88
})
```

> crypto.randomBytes(16)
> = 生成 16 个真正偏安全的随机字节
>
> buffer.toString('hex')
> = 把二进制结果变成人能看懂的十六进制字符串

#### 加密与解密

> 哈希：通常不可逆
> 加密：可以解密回来

> algorithm：算法
> key：密钥
> iv：初始化向量
>
> 可以这样理解：
>
> > algorithm = 用哪种锁
> > key       = 钥匙
> > iv        = 每次加密时的随机扰动参数

```javascript
// aes-256-cbc 是一种对称加密算法
// “对称加密”意思是：加密和解密使用同一把 key
const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

// 加密
//创建加密器
const cipher = crypto.createCipheriv(algorithm, key, iv)
// 要加密的原始内容
let encrypted = cipher.update('Hello, this is a secret', 'utf8', 'hex')
// 结束加密，final() 会处理剩余的数据块
encrypted += cipher.final('hex')

// 解密
// 创建解密器
// 注意：解密必须使用和加密时一样的 algorithm、key、iv
const decipher = crypto.createDecipheriv(algorithm, key, iv)
let decrypted = decipher.update(encrypted, 'hex', 'utf8')
decrypted += decipher.final('utf8')

console.log('Encrypted:', encrypted)
console.log('Decrypted:', decrypted)

// 输出：
// 加密后的内容：一串看不懂的十六进制字符串
// 解密后的内容：Hello, this is a secret
```

---

### Events 模块

Events 模块用于创建事件驱动的架构。

它负责两件事：

1. 注册事件：on()
2. 触发事件：emit()

> 先注册一个“事件监听器”，等监听到这个事件发生时，再自动执行对应的函数。

```javascript
import { EventEmitter } from 'events'

// 创建事件管理器
const emitter = new EventEmitter()

// 注册(greet)事件监听器
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`)
})
// 注册(goodbye)事件监听器
emitter.on('goodbye', (name) => {
  console.log(`Goodbye, ${name}!`)
})

// 触发事件
emitter.emit('greet', 'John')
emitter.emit('goodbye', 'Jane')

// 注册错误监听器(如果以后触发 error 事件，就执行这个函数)
emitter.on('error', (err) => {
  console.error('Error:', err.message)
})
// 触发 error 事件
emitter.emit('error', new Error('Something went wrong!'))
```

```
1. 引入 EventEmitter

2. 创建 emitter

3. 注册 greet 事件
   只是登记规则，暂时不打印

4. 注册 goodbye 事件
   只是登记规则，暂时不打印

5. emit('greet', 'John')
   触发 greet
   打印 Hello, John!

6. emit('goodbye', 'Jane')
   触发 goodbye
   打印 Goodbye, Jane!

7. 注册 error 事件
   只是登记规则，暂时不打印

8. emit('error', new Error(...))
   触发 error
   打印 Error: Something went wrong!
```

 



`Events` 模块就是在教你 Node.js 底层很重要的一种思想：

```
不是你一直等着结果，
而是先注册“发生某事时该做什么”，
等事件发生后自动执行。
```

---

### Process 对象

Process 是一个全局对象，提供当前 Node.js 进程的信息，即Node.js正在运行的这个程序本身。

> 如果下面有不懂的东西没事，可以往下翻有详细的图。

```javascript
// 命令行参数，它会打印你启动 Node.js 程序时传进来的参数
console.log(process.argv)

// 环境变量
console.log(process.env.PORT)

// 进程 ID
console.log(process.pid)	//23891

// 当前工作目录(打印执行命令时所在目录，而不一定是当前js文件所在目录)
console.log(process.cwd())

// 内存使用
console.log(process.memoryUsage())

// 进程运行时间
console.log(process.uptime())

// 退出进程
process.exit(0)  // 0 表示成功，1 表示错误

// 监听退出事件
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`)
})

//如果 process.exit(0) 写在 process.on('exit') 前面，那么后面的监听代码可能根本来不及注册。
```

![image-20260504181027557](./assets/image-20260504181027557.png)

![image-20260504181329777](./assets/image-20260504181329777.png)

![image-20260504181434564](./assets/image-20260504181434564.png)

![image-20260504181500248](./assets/image-20260504181500248.png)

![image-20260504181623339](./assets/image-20260504181623339.png)

---

## 总结

本课程涵盖了 Node.js 的核心内容：

### 核心要点

1. **Node.js 是什么**：基于 V8 引擎的 JavaScript 运行时，用于服务端开发
2. **模块系统**：CommonJS（Node.js 原生）和 ES Modules（现代语法）
3. **HTTP 模块**：创建服务器、处理请求和响应
4. **核心模块**：fs、path、url、os、crypto、events、process
5. **中间件概念**：处理请求/响应流程的函数

### 下一步

虽然了解这些底层知识很重要，但在实际项目中，你大概率会使用 Express 或其他框架来简化开发。建议接下来学习：

- **Express 速成课程**：在底层 HTTP 模块之上构建的 Web 框架
- **REST API 实战**：构建完整的后端 API
- **数据库集成**：学习与 MySQL、MongoDB 等数据库交互

---

## 推荐资源

- 本课程的 Express 速成课程
- Node.js 官方文档：https://nodejs.org/docs
- Traversy Media Node.js API 课程：traversymedia.com / Udemy

> 感谢观看！祝学习愉快！
