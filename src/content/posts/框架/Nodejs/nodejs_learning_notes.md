---
title: Nodejs learning notes
published: 2026-05-09
updated: 2026-05-13
description: 'Read more about Markdown features in Fuwari'
image: ''
tags: [Nodejs]
category: '框架/Nodejs'
draft: false
---

# Node.js 全栈工程师学习笔记

> 基于 wc-Backend 项目源码分析
>

---

# 第一阶段：项目整体目录分析

## 1.1 目录结构概览

### 项目根目录结构

```
wch1d_modelingtool_crossplatform/
├── .vscode/                    # VSCode 编辑器配置
├── deploy-examples/            # Docker/Podman 部署示例
├── logs/                       # 运行时日志输出目录
├── new_cpu_engine/             # 新版 CPU 计算引擎
├── new_engine/                 # 新版引擎
├── projects/                   # 用户项目数据存储目录【重要】
│   ├── db/                    # SQLite 数据库文件
│   └── {project-id}/          # 各项目独立目录
├── s6-config/                 # S6 服务配置
├── src/                        # 源代码目录【核心】
├── swmm/                       # SWMM 相关脚本
├── template_db/                # 模板数据库
├── .dockerignore              # Docker 构建排除
├── .env                        # 环境变量配置
├── .env.container              # 容器环境变量
├── Dockerfile                  # Docker 镜像定义
├── eslint.config.mjs          # ESLint 配置
├── package-lock.json          # npm 锁定文件
├── package.json               # 项目配置与依赖
├── podman-xbuild.toml         # Podman 构建配置
└── README.md                   # 项目说明文档
```

### src/ 源代码目录结构

```
src/
├── app.js                      # Express 应用入口
├── business/                    # 业务逻辑层【核心】
│   ├── model/                  # Sequelize 数据模型定义
│   │   ├── project.js
│   │   └── user.js
│   ├── repository/             # 数据访问层（Repository）
│   │   ├── project.js
│   │   ├── user.js
│   │   └── hydrologic/
│   └── service/                # 业务服务层（Service）
│       ├── user.js            # 用户认证服务
│       ├── project.js        # 项目管理服务
│       ├── engine.js         # 计算引擎服务
│       ├── hydrologic/       # 水文计算服务
│       ├── drainage/         # 排水计算服务
│       └── twoDimensional/    # 二维计算服务
├── framework/                   # 框架基础设施层
│   ├── datasource/            # 数据库连接管理
│   │   └── datasourcemanager.js
│   ├── route/                 # 路由封装
│   │   └── custumrouter.js   # 统一路由封装
│   ├── utils/                 # 通用工具
│   │   ├── argument_utils.js # 参数校验
│   │   ├── file_utils.js    # 文件处理
│   │   └── interceptor.js    # 计算锁拦截器
│   ├── load.js               # 路由自动加载器
│   └── logger.js             # Winston 日志配置
├── routes/                     # 路由定义层【API 入口】
│   ├── user.js               # 用户相关路由
│   ├── project.js            # 项目管理路由
│   ├── hydrologic/           # 水文业务路由
│   ├── drainage/             # 排水业务路由
│   ├── twoDimensional/       # 二维业务路由
│   ├── boundary.js           # 边界条件路由
│   ├── reach.js              # 河道路由
│   ├── section.js            # 断面路由
│   ├── link.js               # 连接路由
│   ├── point_result.js        # 点结果路由
│   ├── calculate_result.js    # 计算结果路由
│   ├── dataset.js            # 数据集路由
│   ├── initial_parameter.js  # 初始参数路由
│   ├── system_parameter.js   # 系统参数路由
│   ├── simulation_setting.js # 模拟设置路由
│   ├── prediction.js         # 预测路由
│   ├── train.js               # 训练路由
│   ├── trainPerformance.js   # 训练性能路由
│   ├── water_quality.js      # 水质路由
│   ├── weir.js               # 堰坝路由
│   ├── control.js            # 控制路由
│   ├── grid_tool.js          # 网格工具路由
│   ├── storage.js            # 存储路由
│   ├── update.js             # 更新路由
│   └── config.js             # 配置路由
├── logs/                       # 日志目录（软链接或运行时生成）
└── test/                       # 测试相关
    ├── client/               # 客户端测试
    ├── http/                 # HTTP 测试
    ├── python_api_test1/     # Python API 测试
    └── *.js                  # 各种测试脚本
```

## 1.2 各层职责说明

| 层级 | 目录 | 职责 | 本笔记对应章节 |
|------|------|------|---------------|
| **入口层** | `app.js` | Express 应用初始化、中间件配置 | 第三阶段 |
| **路由层** | `routes/` | API 路由定义、请求分发 | 第三阶段 3.2 |
| **业务层** | `business/service/` | 核心业务逻辑处理 | 第三/五阶段 |
| **数据访问层** | `business/repository/` | 数据库 CRUD 操作封装 | 第四阶段 4.2 |
| **模型层** | `business/model/` | Sequelize 数据模型定义 | 第四阶段 4.1 |
| **框架层** | `framework/` | 数据源、路由封装、工具函数 | 第一/六阶段 |
| **公共层** | `framework/utils/` | 参数校验、文件处理、拦截器 | 第一阶段 |

## 1.3 代码文件位置速查表

### 入口与配置
| 功能 | 文件路径 |
|------|----------|
| 应用入口 | `src/app.js` |
| 项目配置 | `src/package.json` |

### 路由层
| 功能 | 文件路径 |
|------|----------|
| 统一路由封装 | `src/framework/route/custumrouter.js` |
| 项目路由 | `src/routes/project.js` |
| 用户路由 | `src/routes/user.js` |
| 水文路由 | `src/routes/hydrologic/*.js` |

### 业务层
| 功能 | 文件路径 |
|------|----------|
| 用户登录/认证 | `src/business/service/user.js` |
| 项目管理 | `src/business/service/project.js` |
| 水文计算引擎 | `src/business/service/engine.js` |

### 数据层
| 功能 | 文件路径 |
|------|----------|
| 数据源管理 | `src/framework/datasource/datasourcemanager.js` |
| 项目 Repository | `src/business/repository/project.js` |
| 用户 Repository | `src/business/repository/user.js` |
| 项目 Model | `src/business/model/project.js` |

### 工具层
| 功能 | 文件路径 |
|------|----------|
| 计算锁拦截器 | `src/framework/utils/interceptor.js` |
| 参数校验 | `src/framework/utils/argument_utils.js` |
| 文件处理 | `src/framework/utils/file_utils.js` |

# 第二阶段：深入异步：Promise、async/await与并发锁机制

Promise 三种状态

```
pending (待定) → fulfilled (已兑现) 或 rejected (已拒绝)
```

### async/await 错误处理：JWT 验证

```javascript
// src/business/service/user.js
try {
    const decoded = await jwt.verify(token, secretKey);
    req.user = decoded;
    next();
} catch (err) {
    return res.status(403).json({ message: "无效的身份验证令牌" });
}
```

### async/await 完整函数：登录逻辑

```javascript
// 同步写法
async function login(param) {
    if (enableUAMServer) {
        const token = await axios.post(`${uamServerUrl}/login`, {
            username: name, password: password
        }).then(response => response.data.token);
        return token;
    } else {
        const user = await userRepository.getUser(param.name);
        if (!user || user.password != password) {
            throw new Error("用户名或密码错误");
        }
        return jwt.sign({ name }, secretKey);
    }
}
```

### 项目中的计算锁机制

> **📍 位置：** `src/framework/utils/interceptor.js`
>
```javascript
// src/framework/utils/interceptor.js
module.exports = {
    async withCalculateLock(projectId, calculateFn) {
        const success = await projectRepository.startCalculate(projectId);
        if (!success) {
            throw new Error("工程正在计算");
        }
        try {
            return await calculateFn();
        } catch (e) {
            await projectRepository.stopCalculate(projectId);
            throw e;
        } finally {
            await projectRepository.stopCalculate(projectId);
        }
    }
};
```


# 第三阶段：Express.js 框架深入

> **📍 整体位置：** 路由层位于 `src/routes/`、框架封装位于 `src/framework/route/`、入口位于 `src/app.js`

## 3.1 项目启动流程

> **📍 位置：** `src/app.js` 为入口文件
>
> 理解项目的启动流程是掌握整个架构的关键。

### 入口文件定义处

```json
// package.json
{
  "main": "./src/app.js",    // 模块入口
  "bin": "./src/app.js",    // CLI 入口
  "scripts": {
    "start": "node src/app"
  }
}
```

### 完整启动流程图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        1. 用户启动命令                                │
│                   npm start 或 node src/app.js                       │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        2. app.js 执行                                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 第1步: 版本检查 (命令行参数 -v 或环境变量 WCH1D_PRINT_VERSION) │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 第2步: 加载 dotenv.config()  ← 环境变量在这里注入             │   │
│  │        ↓ process.env 现在可用了                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 第3步: 初始化工具模块                                         │   │
│  │   • argument_utils.js  - 获取命令行参数，确定项目根路径       │   │
│  │   • file_utils.js      - 创建 db/ 目录                        │   │
│  │   • logger.js         - 初始化 Winston 日志系统               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        3. Express 应用创建                           │
│                                                                     │
│  const app = express()                                             │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 配置中间件:                                                   │   │
│  │   • bodyParser.json()  - 解析 JSON 请求体 (最大 500MB)        │   │
│  │   • bodyParser.urlencoded() - 解析 URL 参数                  │   │
│  │   • userService.authenticate - JWT 认证中间件               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        4. 路由加载                                   │
│                                                                     │
│  routeLoader.loadRemoteRoute(app)                                   │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ src/routes/*.js (所有路由文件)                               │   │
│  │   ├── user.js         - 用户认证                            │   │
│  │   ├── project.js      - 项目管理                            │   │
│  │   ├── hydrologic/     - 水文计算                            │   │
│  │   ├── drainage/       - 排水计算                            │   │
│  │   └── twoDimensional/ - 二维计算                            │   │
│  │   ... 还有很多其他路由                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        5. 数据库初始化                               │
│                                                                     │
│  routeLoader.loadDatabase(app)  ← 返回 Promise                     │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ datasource/datasourcemanager.js                             │   │
│  │   • 读取 process.env 中的数据库配置                         │   │
│  │   • 连接 MySQL 或 SQLite                                    │   │
│  │   • 同步数据模型 (Sequelize)                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        6. HTTP 服务器启动                            │
│                                                                     │
│  app.listen(port, async () => {                                     │
│      console.log(`WCH1D listening on port: ${port}`)                │
│      const projectService = require(...)                           │
│      await projectService.interrupt()  ← 中断之前运行的任务        │
│      stopHooks.registerStop()      ← 注册进程终止钩子              │
│  })                                                                 │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     7. 服务运行中                                    │
│                                                                     │
│  等待 HTTP 请求 → 路由匹配 → 中间件处理 → 业务逻辑 → 数据库 → 响应    │
└─────────────────────────────────────────────────────────────────────┘
```



```javascript
// src/app.js 完整启动流程

// 1. 环境变量加载（最早执行）
require('dotenv').config()

// 2. 工具模块初始化
const argumentUtils = require('./framework/utils/argument_utils')
const fileUtils = require('./framework/utils/file_utils')
fileUtils.setRootPath(argumentUtils.getRootPath())
fileUtils.mkdirPath(fileUtils.getWorkPath('db'))
require('./framework/logger');

// 3. Express 应用创建
const app = express()

// 4. 中间件配置
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
app.use(userService.authenticate)

// 5. 路由加载（自动扫描 routes/ 目录下所有文件）
routeLoader.loadRemoteRoute(app)

// 6. 获取端口配置
const port = process.env.SERVER_PORT??8080

// 7. 数据库初始化 + HTTP 服务启动
routeLoader.loadDatabase(app).then(r => {
  app.listen(port, async () => {
    // 中断之前运行的任务
    await projectService.interrupt()
    // 注册终止钩子
    stopHooks.registerStop()
  })
})
```



| 阶段 | 执行顺序 | 涉及文件 | 作用 |
|------|---------|----------|------|
| **环境变量** | 1 | `dotenv` | 加载 .env 配置 |
| **工具初始化** | 2 | `argument_utils`, `file_utils`, `logger` | 参数处理、目录创建、日志 |
| **Express 创建** | 3 | `app.js` | 创建应用实例 |
| **中间件配置** | 4 | `app.js` | 请求解析、认证 |
| **路由加载** | 5 | `routeLoader`, `routes/*.js` | API 路由注册 |
| **数据库初始化** | 6 | `datasourcemanager` | 连接数据库 |
| **服务启动** | 7 | `app.js` | 监听端口 |
| **任务清理** | 8 | `projectService.interrupt()` | 中断之前的计算任务 |



### 数据流向图

```
客户端请求
     │
     ▼
┌────────────┐
│  Express   │  ← app.js 创建
│  Router     │  ← routeLoader 加载
└─────┬──────┘
      │ 匹配路由
      ▼
┌────────────┐
│ 中间件链    │  ← authenticate (JWT验证)
│            │  ← bodyParser (请求体解析)
└─────┬──────┘
      │ next()
      ▼
┌────────────┐
│ Service层  │  ← business/service/*.js
│ 业务逻辑   │
└─────┬──────┘
      │
      ▼
┌────────────┐
│ Repository │  ← business/repository/*.js
│ 数据访问   │
└─────┬──────┘
      │
      ▼
┌────────────┐
│  Sequelize  │  ← ORM
│  数据库操作 │
└────────────┘
```

## 3.2 中间件机制

这里拿了app.js用到的一些中间件举例

```javascript
// src/app.js
const app = express()

// 解析 JSON 请求体，最大 500MB
app.use(bodyParser.json({limit: '500mb'}));

// 解析 URL 编码
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));

// 认证中间件
app.use(userService.authenticate)

// 路由加载
routeLoader.loadRemoteRoute(app)
```



### 入口文件代码详细介绍

这里的流程是请求进来后-->解析JSON请求体-->解析表单/URL编码请求体-->认证用户合法性-->进入具体路由-->返回响应。

```
const app = express()
```

创建Express应用实例。

app是整个后端服务的核心对象，后面的东西基本都是挂载在它的身上。比如app.use/app.get/app.listen..

```
bodyParser.json({ limit: '500mb' })
```

解析前端传来的json数据，把json解析成js对象

```
bodyParser.urlencoded({ extended: false, limit: '500mb' })
```

解析表单格式数据

> 某些关于表单的接口用这种格式：
>
> ```
> name=张三&age=18
> ```
>
> 它会帮你解析成：
>
> ```
> req.body = {
>   name: '张三',
>   age: '18'
> }
> ```

```
extended: false
```

只解析简单对象，不解析复杂嵌套对象。



```
app.use(userService.authenticate)
```

认证中间件，用来判断请求里面的token、权限。

> 比如前端请求接口时带 token：
>
> ```
> axios.get('/api/user/list', {
>   headers: {
>     Authorization: 'Bearer xxxxxx'
>   }
> })
> ```
>
> 后端的 `authenticate` 可能会做这些事：
>
> ```
> function authenticate(req, res, next) {
>   const token = req.headers.authorization
> 
>   if (!token) {
>     return res.status(401).json({
>       message: '未登录'
>     })
>   }
> 
>   // 校验 token 是否有效
>   // 如果有效，把用户信息挂到 req 上
>   req.user = {
>     id: 1,
>     name: '张三'
>   }
> 
>   next()   //认证通过调用next，否则就res.status(401).json(...)
> }
> ```

```
routeLoader.loadRemoteRoute(app)
```

路由加载函数，把很多路由统一注册到app上。（集中加载路由到app上）

### 中间件顺序

认证中间件要放在路由前面，因为认证过了才能加载路由。

但是要是登录的路由也放在了 路由统一加载的那个部分里，就会发生如下事情

> 只有登录后才有token，但是现在想去接触登录的这个路由，必须先有token。
>
> 类似于想进大楼必须要刷卡，但是没有卡，办卡的房间在大楼里面。

**做法一：**

先单独放出登录路由-->认证中间价-->放所有路由

```
app.use('/api/login', loginRouter)

app.use(userService.authenticate)

app.use('/api/user', userRouter)
app.use('/api/order', orderRouter)
```

**做法二：**

在认证中间件里，先单独放行login

```
function authenticate(req, res, next) {
  if (req.path === '/login') {
    return next()
  }

  // 其他接口继续校验 token
}
```



## 3.3 路由系统

> **📍 位置：** 路由定义在 `src/routes/`、路由封装在 `src/framework/route/custumrouter.js`
>
> ### RESTful API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /projects | 获取项目列表 |
| GET | /projects/:id | 获取单个项目 |
| POST | /projects | 创建项目 |
| PUT | /projects/:id | 更新项目 |
| DELETE | /projects/:id | 删除项目 |

### 项目路由定义

```javascript
// src/routes/project.js
const router = require("../framework/route/custumrouter");
const bathPath = "/business/project";
const projectService = require("../business/service/project");

router.post(`${bathPath}/create`, projectService.create);
router.post(`${bathPath}/update`, projectService.update);
router.post(`${bathPath}/queryAll`, projectService.queryAll);
router.post(`${bathPath}/calculate`, projectService.calculate);
router.post(`${bathPath}/calculateAsync`, projectService.calculateAsync);

module.exports = router.router();
```

---

## 3.4 统一响应格式

```javascript
// 成功响应
res.send({ code: 200, data: result });

// 错误响应
res.send({ code: 500, msg: error.message });

// 文件下载
res.attachment(result.filename);
res.setHeader("Content-Type", result.mimeType);
res.send(result.buffer);
```

---

# 第四阶段：数据库与 ORM

> **📍 整体位置：** Model 层位于 `src/business/model/`、Repository 层位于 `src/business/repository/`、数据源管理位于 `src/framework/datasource/`

## 4.1 Sequelize ORM

### 模型定义

```javascript
// src/business/model/project.js
const { DataTypes } = require("sequelize");
const {sequelize} = require("../../framework/datasource/datasourcemanager");

const Project = sequelize.define("Project", {
    id: { type: DataTypes.STRING, field: "id", primaryKey: true },
    name: { type: DataTypes.STRING, field: "name" },
    modelTypes: { type: DataTypes.STRING, field: "model_types" },
    createTime: { type: DataTypes.DATE, field: "create_time" },
    isCalculated: { type: DataTypes.BOOLEAN, field: "is_calculated" },
    isCalculating: { type: DataTypes.BOOLEAN, defaultValue: false },
    userName: { type: DataTypes.STRING, field: "user_name" },
}, { tableName: "t_project" });

module.exports = Project;
```

### 常用数据类型

| DataTypes | 说明 |
|-----------|------|
| STRING | VARCHAR |
| INTEGER | INT |
| BOOLEAN | TINYINT(1) |
| DATE | DATETIME |
| TEXT | TEXT |
| JSON | JSON |

---

## 4.2 Repository 模式

> **📍 位置：** `src/business/repository/` 目录
>
> ### 数据访问层封装

```javascript
// src/business/repository/project.js
module.exports = {
    async save(project, t) {
        project.updateTime = Date.now();
        return Project.upsert(project, { transaction: t });
    },

    async queryAll(param) {
        const whereClause = {};
        if (!param.isAdmin) {
            whereClause.userName = { [Op.or]: { [Op.is]: null, [Op.eq]: param.userName } };
        }
        const result = await Project.findAll({
            order: [["updateTime", "DESC"]],
            where: whereClause,
        });
        return result ? result.map((it) => it.dataValues) : [];
    },

    async deleteByIds(ids) {
        return Project.destroy({ where: { id: { [Op.in]: ids } } });
    },

    async startCalculate(id) {
        // 乐观锁实现
    }
};
```

---

## 4.3 数据库连接管理

**📍 位置：** `src/framework/datasource/datasourcemanager.js`

> ```javascript
>// src/framework/datasource/datasourcemanager.js
> const { Sequelize } = require("sequelize");

```
const datasource_type = process.env.DATASOURCE_TYPE??"mysql";

if (datasource_type === "mysql") {
    sequelize = new Sequelize({
        logging: false,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        dialect: "mysql",
        define: { timestamps: false },
        pool: { max: 10, min: 0, idle: 10000, acquire: 3000 },
        timezone: '+08:00'
    });
}
```




### 连接池配置说明

| 配置 | 说明 | 项目值 |
|------|------|--------|
| max | 最大连接数 | 10 |
| min | 最小连接数 | 0 |
| idle | 空闲超时(ms) | 10000 |
| acquire | 获取连接超时(ms) | 3000 |




# 第五阶段：认证与安全

> **📍 整体位置：** 用户服务位于 `src/business/service/user.js`、认证白名单定义在同一文件

## 5.1 JWT 认证

### Token 生成

```javascript
// src/business/service/user.js
async login(param) {
    // 验证用户...
    // 生成 JWT
    return jwt.sign({ name }, secretKey);
}
```

### Token 验证

```javascript
// 认证中间件
jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
        return res.status(403).json({ message: "无效的身份验证令牌" });
    }
    req.user = decoded;
    next();
});
```

### JWT 结构

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2MTYxNTEwMDB9.abc123
     ↑ Header                ↑ Payload                      ↑ Signature
```

---

## 5.2 白名单机制

```javascript
// src/business/service/user.js
const whiteList = [
    "/user",
    "/business/hydrologic/exportResult",
    "/business/two-dimensional/exportNcFile",
    "/business/project/exportProject",
    "/business/reach/exportShape",
];

function isInWhiteList(url) {
    return whiteList.some(path => url.startsWith(path));
}

function isNeedAuthenticate() {
    return process.env.ENABLE_AUTH !== "false";
}
```

---

# 第六阶段：项目架构与改进建议

> **📍 整体位置：** 本阶段综合分析了 `src/` 目录下各层的设计

## 6.1 项目分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Express Web Server                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer (Auth, BodyParser)                        │
├─────────────────────────────────────────────────────────────┤
│  Route Layer                                                │
│  ├── custumrouter.js (统一封装)                              │
│  └── routes/*.js (业务路由定义)                             │
├─────────────────────────────────────────────────────────────┤
│  Business Layer (Service)                                   │
│  ├── project.js, user.js, engine.js                         │
│  └── hydrologic/, twoDimensional/, drainage/               │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer (Repository)                             │
│  └── project.js, user.js, hydrologic/                       │
├─────────────────────────────────────────────────────────────┤
│  ORM Layer (Sequelize)                                       │
│  └── Model definitions                                      │
├─────────────────────────────────────────────────────────────┤
│  Framework Layer                                            │
│  ├── datasource/, logger.js, utils/                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 6.2 改进建议

### 问题与解决方案

| 问题 | 现状 | 改进建议 |
|------|------|----------|
| **错误处理不统一** | 仅在 custumrouter 中捕获 | 添加全局错误处理中间件 |
| **缺少参数校验** | 直接使用请求参数 | 使用 Joi/Zod 校验 |
| **事务使用不完整** | 部分操作无事务 | 统一使用事务管理 |
| **缺少单元测试** | 仅有手动测试 | 添加 Jest 单元测试 |
| **缺少 API 文档** | 无 Swagger | 添加 swagger-jsdoc |

### 改进示例：全局错误处理

```javascript
// 添加到 app.js
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        code: err.status || 500,
        msg: err.message,
        data: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});
```

### 改进示例：参数校验

```javascript
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    type: Joi.string().valid('hydrologic', 'drainage', 'two-dimensional'),
    userName: Joi.string().optional()
});

// 路由中使用
router.post(`${bathPath}/create`, async (req, res, next) => {
    const { error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.message });
    // ...
});
```

---

# 第八阶段：Framework 框架层详解

> **📍 整体位置：** `src/framework/` 目录
>
> Framework 是整个项目的基础设施层，封装了路由加载、日志系统、数据库连接、文件操作等通用功能，是所有业务模块的底层依赖。

## 8.1 目录结构

```
framework/
├── load.js                    # 路由加载器（核心入口）
├── logger.js                  # 日志系统
├── datasource/
│   └── datasourcemanager.js    # 数据库连接管理
├── route/
│   ├── custumrouter.js        # 统一路由封装（最重要）
│   └── localrouter.js         # 本地路由注册
└── utils/
    ├── argument_utils.js       # 命令行参数处理
    ├── file_utils.js          # 文件操作工具（最复杂）
    ├── interceptor.js         # 计算锁拦截器
    ├── stop_hook.js           # 进程终止钩子
    ├── base64_utils.js        # Base64 编解码
    ├── common_utils.js        # 通用工具函数
    ├── date_utils.js          # 日期工具
    ├── exec_utils.js          # 进程执行工具
    ├── geo_utils.js           # 地理工具
    ├── math_utils.js          # 数学工具
    └── section_calculate.js    # 断面计算工具
```

### Framework 的设计思想

| 特点 | 说明 |
|------|------|
| **基础设施层** | 把通用的、底层的功能抽取到这里 |
| **业务无关** | 不包含任何业务逻辑 |
| **复用性强** | 所有业务模块都依赖它 |
| **统一规范** | 路由、日志、错误处理都有统一格式 |

---

## 8.2 load.js - 路由加载器

**文件位置：** `src/framework/load.js`

这是整个应用的**路由注册中心**，类似于餐厅的前台接待。

```javascript
const userRouter = require("../routes/user");
const catchmentRouter = require("../routes/hydrologic/catchment");
const paramRouter = require("../routes/hydrologic/param");
// ... 总共引入了 43 个路由模块

module.exports = {
    // 加载远程路由（Express HTTP 路由）
    loadRemoteRoute(app) {
        app.use("/", userRouter);           // 用户相关
        app.use("/", projectRouter);        // 项目管理
        app.use("/", hydrologicRouter);     // 水文计算
        app.use("/", twoDimensionalRouter); // 二维计算
        // ... 总共注册了 43 个路由模块
    },
    
    // 加载本地路由（用于本地调用，不走 HTTP）
    loadLocalRoute() {
        return require("./route/localrouter").getRouters();
    },
    
    // 初始化数据库
    async loadDatabase() {
        if (process.env.SYNC_TABLES == "true") {
            await sequelize.sync({ alter: true });  // 同步表结构
        }
    }
};
```

### load.js 工作流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        app.js 启动                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              load.loadRemoteRoute(app)                            │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│   │ user    │  │ project │  │hydrologic│  │drainage │  ...    │
│   │ Router  │  │ Router  │  │ Router  │  │ Router  │         │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘         │
│        │            │            │            │                 │
│        └────────────┴────────────┴────────────┘                 │
│                         │                                       │
│                    Express App                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 通俗理解

```
load.js 就像是「餐厅的前台接待」
├── loadRemoteRoute() = 接待客人（HTTP请求）→ 分发到各个服务员（路由）
├── loadLocalRoute()  = 内部员工可以直接叫服务员（本地调用）
└── loadDatabase()    = 打开仓库门（连接数据库）
```

---

## 8.3 logger.js - 日志系统

**文件位置：** `src/framework/logger.js`

基于 Winston 实现的日志系统，自动按日期归档。

```javascript
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// 创建日志文件，每天一个新文件
const rotateTransport = new DailyRotateFile({
    dirname: logDir,                    // 日志目录
    filename: 'app-%DATE%.log',        // 文件名格式：app-2026-05-09.log
    datePattern: 'YYYY-MM-DD',         // 按日期命名
    maxSize: '10m',                   // 单个文件最大 10MB
    maxFiles: '5d',                   // 保留 5 天的日志
});

const logger = createLogger({
    transports: [rotateTransport],
});

// 重定向 console
['log', 'info', 'warn', 'error'].forEach((level) => {
    const original = console[level];
    console[level] = (...args) => {
        logger[level === 'log' ? 'info' : level](args.join(' '));  // 写入日志
        original(...args);  // 仍然输出到终端
    };
});
```

### 日志文件结构

```
logs/
├── app-2026-05-05.log
├── app-2026-05-06.log
├── app-2026-05-07.log
├── app-2026-05-08.log
└── app-2026-05-09.log    ← 当前日志
```

### 通俗理解

```
logger.js 就像是「监控摄像头」
├── 自动录制（console.log）
├── 按日期存档（每天一个文件）
├── 自动清理旧文件（只保留5天）
└── 同时输出到屏幕和文件
```

---

## 8.4 datasource/datasourcemanager.js - 数据库连接管理

**文件位置：** `src/framework/datasource/datasourcemanager.js`

这是**数据库连接的核心**，支持 MySQL 和 SQLite 两种数据库类型。

```javascript
const { Sequelize } = require("sequelize");

// 根据环境变量决定使用哪种数据库
const datasource_type = process.env.DATASOURCE_TYPE??"mysql";

// MySQL 配置
if (datasource_type === "mysql") {
    sequelize = new Sequelize({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        dialect: "mysql",
        pool: {                       // 连接池配置
            max: 10,                  // 最大连接数
            min: 0,                   // 最小连接数
            idle: 10000,              // 空闲超时 10秒
            acquire: 3000,            // 获取连接超时 3秒
        },
        timezone: '+08:00'           // 时区设为北京时区
    });
} else {
    // SQLite 配置（默认）
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: fileUtils.getWorkPath(path.join('db', 'main.db')),
    });
}

module.exports = {
    // 每个项目有独立的数据库连接
    getSequelize(projectId) {
        if (datasource_type === "mysql") {
            return sequelize;
        } else {
            // 每个项目独立的 SQLite 文件
            return new Sequelize({
                dialect: "sqlite",
                storage: fileUtils.getWorkPath(path.join('db', `${projectId}.db`)),
            });
        }
    },
    sequelize
};
```

### 连接池示意图

```
应用 ──┬── 连接到 MySQL ── 连接池(最多10个连接) ── MySQL服务器
       │
       └── 每个项目有独立 SQLite 文件
           projects/db/{项目ID}.db
```

### SQLite 数据库文件结构

```
projects/
└── db/
    ├── main.db          # 主数据库（存储项目列表等）
    ├── template.db      # 模板数据库（新建项目时复制）
    └── {项目ID}.db     # 每个项目独立的数据库
```

---

## 8.5 route/custumrouter.js - 统一路由封装（最重要）

**文件位置：** `src/framework/route/custumrouter.js`

这是项目的**路由封装核心**，统一了所有 API 的响应格式。

```javascript
const express = require("express");
const router = express.Router();

module.exports = {
    // POST 请求封装
    post(path, serviceFunc) {
        router.post(path, (req, res) => {
            console.log(`================url: ${path}`);
            
            // 调用业务逻辑函数
            serviceFunc(req.body, req.user).then((result) => {
                
                // 处理文件下载
                if (result != null && result.apiType === "FILE_DOWNLOAD") {
                    res.attachment(result.filename);      // 设置下载文件名
                    res.setHeader("Content-Type", result.mimeType);
                    res.send(result.buffer);               // 发送文件
                } 
                // 处理文件流下载（适用于大文件）
                else if (result != null && result.apiType === "FILE_STREAM_DOWNLOAD") {
                    res.attachment(result.filename);
                    result.fileStream.pipe(res);           // 流式传输
                } 
                // 普通 JSON 响应
                else {
                    res.send({
                        code: 200,    // 成功码
                        data: result // 数据
                    });
                }
                
            }).catch((error) => {
                // 统一错误处理
                res.send({
                    code: 500,              // 错误码
                    msg: error.message,     // 错误信息
                });
            });
        });
        
        // 同时注册本地路由（可被本地代码直接调用）
        localRouter.registe(path, serviceFunc);
    }
};
```

### 请求流程图

```
客户端 POST 请求
       │
       ▼
┌──────────────────────────────┐
│   custumrouter.post()        │
│   ┌────────────────────────┐  │
│   │ 1. 接收 req.body       │  │
│   │ 2. 接收 req.user(JWT)  │  │
│   └──────────┬─────────────┘  │
│              │                │
│              ▼                │
│   ┌────────────────────────┐  │
│   │ 3. 调用 serviceFunc()  │  │
│   │    业务逻辑处理         │  │
│   └──────────┬─────────────┘  │
│              │                │
└──────────────┼────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
   成功响应          失败响应
   {code:200}      {code:500}
   {data:...}      {msg:...}
```

### 使用示例

```javascript
// src/routes/project.js
const router = require("../framework/route/custumrouter");
const projectService = require("../business/service/project");

// 简单的 POST 请求
router.post(`${bathPath}/create`, projectService.create);
router.post(`${bathPath}/queryAll`, projectService.queryAll);

// 内部同时注册了本地路由，可在本地直接调用
```

---

## 8.6 route/localrouter.js - 本地路由注册

**文件位置：** `src/framework/route/localrouter.js`

这个设计很巧妙，允许**不通过 HTTP 直接调用服务函数**。

```javascript
const localRouter = {};

module.exports = {
    // 注册路由到本地路由表
    registe(path, func) {
        localRouter[path] = func;
    },
    
    // 获取所有本地路由
    getRouters() {
        return localRouter;
    }
};
```

### 两种调用方式对比

```javascript
// 方式1：通过 HTTP 调用（远程）
fetch('/business/project/queryAll', {
    method: 'POST',
    body: JSON.stringify({})
});

// 方式2：直接本地调用（不经过 HTTP）
const routers = require('./framework/route/localrouter').getRouters();
routers['/business/project/queryAll']({}, user);  // 直接调用
```

### 通俗理解

```
localrouter.js = 餐厅的「内部对讲机」
├── HTTP 请求 = 客人通过服务员点菜（走正常流程）
└── 本地调用  = 厨房主管直接喊话（跳过服务员）
```

---

## 8.7 utils/argument_utils.js - 命令行参数处理

**文件位置：** `src/framework/utils/argument_utils.js`

处理命令行参数，获取项目根目录。

```javascript
module.exports = {
    // 获取项目根目录
    getRootPath() {
        // process.argv = ['node', 'app.js', '/path/to/project']
        const systemPath = process.argv.splice(2)[0];  // 获取第3个参数
        
        if (systemPath) {
            return systemPath;  // 如果有命令行参数，用它
        }
        return process.cwd();  // 否则用当前工作目录
    },
    
    // 检查是否支持 GPU（通过 WMI 查询显卡）
    async waitInit() {
        // 等待 GPU 检测完成
    },
    
    isSupportGpu() {
        return is_support_gpu;
    }
};
```

### 启动命令示例

```bash
# 指定项目路径启动
node src/app.js /path/to/my/project

# 不指定路径，使用当前目录
npm start
```

---

## 8.8 utils/file_utils.js - 文件操作工具（最复杂）

**文件位置：** `src/framework/utils/file_utils.js`

这是最复杂的工具文件，包含大量文件操作和路径管理函数。

### 核心路径管理

```javascript
let systemPath = "";  // 项目根目录

module.exports = {
    setRootPath(path) {
        systemPath = path;  // 设置根目录
    },
    getRootPath() {
        return systemPath;  // 获取根目录
    },
    getProjectPath() {
        return path.join(this.getRootPath(), "projects");
    },
    getWorkPath(pathLabel) {
        return path.join(this.getProjectPath(), pathLabel);
    }
};
```

### 目录结构

```
项目根目录/
├── projects/                    # getProjectPath()
│   ├── db/                     # 数据库文件
│   │   ├── main.db            # 主数据库
│   │   ├── template.db        # 模板数据库
│   │   └── {项目ID}.db        # 每个项目独立的数据库
│   └── {项目ID}/              # 每个项目的文件
├── bin/                        # 可执行文件
│   ├── Hydro1D.exe
│   ├── swmm5.exe
│   └── ...
└── logs/                       # 日志文件
```

### 文件操作函数

| 函数 | 作用 |
|------|------|
| `copyLargeFileWithName()` | 大文件复制（流式传输，不占内存） |
| `copyFile()` | 普通文件复制 |
| `mkdirPath()` | 递归创建目录 |
| `removePath()` | 递归删除目录 |
| `removeFile()` | 删除单个文件 |
| `writeContentSync()` | 同步写入文件内容 |
| `readContentSync()` | 同步读取文件内容 |
| `writeFileSync()` | 写入 Base64 编码的文件 |
| `unzipFile()` | 解压 ZIP 文件 |
| `zipFile()` | 压缩文件夹 |
| `zipFileAndReturnZipFast()` | 快速压缩（不压缩，速度快） |

### 可执行文件路径管理

```javascript
// 获取各种可执行文件的路径（跨平台支持）
getHydro1dExecPath()           // 一维水文引擎
getSectionExecPath()            // 断面计算
getSwmmExePath()              // SWMM 排水模型
getPythonPath()               // Python 解释器
getJavaPath()                 // Java 运行环境
getAiModelTrainScriptPath()    // AI 训练脚本
getHydrologinModelExecPath()   // 水文引擎 JAR
// ... 还有更多
```

### 文件复制示例（流式传输）

```javascript
// 用于复制大文件，不占用大量内存
copyLargeFileWithName(sourcePath, targetDir, targetName) {
    const readStream = fs.createReadStream(sourcePath);  // 创建读取流
    const writeStream = fs.createWriteStream(targetPath); // 创建写入流
    readStream.pipe(writeStream);  // 管道传输，边读边写
}
```

---

## 8.9 utils/interceptor.js - 计算锁拦截器

**文件位置：** `src/framework/utils/interceptor.js`

防止同一项目**同时进行多个计算任务**。

```javascript
const projectRepository = require("../../business/repository/project");

module.exports = {
    // 带计算锁的异步执行
    async withCalculateLock(projectId, calculateFn) {
        // 1. 尝试获取计算锁
        const success = await projectRepository.startCalculate(projectId);
        if (!success) {
            throw new Error("工程正在计算");  // 如果已锁定，抛出异常
        }
        
        try {
            // 2. 执行计算任务
            return await calculateFn();
        } catch (e) {
            // 3. 出错时释放锁
            await projectRepository.stopCalculate(projectId);
            throw e;
        } finally {
            // 4. 无论成功失败，都要释放锁
            await projectRepository.stopCalculate(projectId);
        }
    },
    
    // 检查项目是否正在计算
    async checkProjectCalculateStatus(projectId) {
        const projectInfo = await projectRepository.queryById(projectId);
        if (projectInfo.isCalculating) {
            throw new Error("工程正在计算");
        }
    }
}
```

### 通俗理解

```
interceptor.js = 停车场的「拦车杆」
├── withCalculateLock() = 
│   ├── 放下拦车杆（startCalculate）
│   ├── 让车进去（calculateFn）
│   └── 抬起拦车杆（stopCalculate）
│
└── 同一时间只允许一辆车进入（防止并发计算冲突）
```

---

## 8.10 utils/stop_hook.js - 进程终止钩子

**文件位置：** `src/framework/utils/stop_hook.js`

管理应用的**优雅退出**，确保程序终止时清理资源。

```javascript
const fs = require('fs');

const STARTED_SIGNAL_FILE_PATH = 'bin/started.signal';

function registerStop() {
    // 1. 创建一个「启动信号文件」
    fs.writeFileSync(STARTED_SIGNAL_FILE_PATH, '');
    
    // 2. 注册退出时的清理函数
    const deleteSignalFile = () => {
        fs.unlinkSync(STARTED_SIGNAL_FILE_PATH);
    };
    
    // 3. 监听多种退出信号
    process.on('exit', deleteSignalFile);    // 正常退出
    process.on('SIGINT', () => {             // Ctrl+C
        deleteSignalFile();
        process.exit(0);
    });
    process.on('SIGTERM', () => {            // 进程终止信号
        deleteSignalFile();
        process.exit(0);
    });
    
    // 4. 定时检查信号文件是否存在
    setInterval(() => {
        if (!fs.existsSync(STARTED_SIGNAL_FILE_PATH)) {
            process.exit(0);  // 如果文件被删，退出进程
        }
    }, 1000);
}
```

### 支持的退出信号

| 信号 | 来源 | 说明 |
|------|------|------|
| `exit` | 代码调用 | 正常退出 |
| `SIGINT` | Ctrl+C | 用户手动中断 |
| `SIGTERM` | 系统 | 进程终止请求 |

### 通俗理解

```
stop_hook.js = 餐厅的「打烊流程」
├── 开店时放招牌（创建 started.signal）
├── 收到关门信号时收招牌（删除信号文件）
├── 定时检查：如果招牌没了，说明被强制关门，自己也关门
└── 支持多种关门方式：正常下班、Ctrl+C、被系统叫停
```

---

## 8.11 utils/base64_utils.js - Base64 编解码

```javascript
module.exports = {
    toBase64(text) {
        return Buffer.from(text).toString("base64");
    },
    fromBase64(text) {
        return Buffer.from(text, "base64").toString("utf-8");
    },
    bufferToBase64(buffer) {
        return buffer.toString("base64");
    },
    fromBase64ToBuffer(text) {
        return Buffer.from(text, "base64");
    }
};
```

**使用场景：** 文件在前后端之间传输时转成 Base64 字符串（JSON 不能直接传输二进制）。

---

## 8.12 utils/common_utils.js - 通用工具函数

```javascript
module.exports = {
    // 时间单位转换
    convertToSecUnit(value, unit) {
        switch (unit) {
            case "sec": return value;
            case "min": return value * 60;
            case "hour": return value * 3600;
            case "day": return value * 86400;
        }
    },
    
    // 找到数组中最近的元素（水文计算中用于找到最近的监测站）
    findClosestObject(arr, targetValue, attrName) {
        // ...
    },
    
    // 水文模型评估指标
    nashSutcliffeEfficiency(realValues, predictedValues) {
        // NSE 效率系数，用于评估模型精度
    },
    rSquared(realValues, predictedValues) {
        // R² 决定系数
    },
    rmse(realValues, predictedValues) {
        // RMSE 均方根误差
    },
    averagePhaseDifference(realValues, predictedValues) {
        // 相位差（洪峰时间偏差）
    },
    averagePeakError(realValues, predictedValues) {
        // 洪峰误差
    }
};
```

### 水文模型评估指标说明

| 指标 | 全称 | 说明 | 理想值 |
|------|------|------|--------|
| NSE | Nash-Sutcliffe Efficiency | 效率系数 | 1 |
| R² | 决定系数 | 拟合优度 | 1 |
| RMSE | Root Mean Square Error | 均方根误差 | 0 |
| 相位差 | Phase Difference | 洪峰时间偏差 | 0 |
| 洪峰误差 | Peak Error | 洪峰值偏差 | 0 |

---

## 8.13 Framework 核心价值总结

### 文件重要性排名

| 排名 | 文件 | 核心职责 | 重要性 |
|------|------|----------|--------|
| 🥇 | `load.js` | 路由注册中心 | ⭐⭐⭐⭐⭐ |
| 🥇 | `custumrouter.js` | 统一 API 封装 | ⭐⭐⭐⭐⭐ |
| 🥇 | `datasourcemanager.js` | 数据库连接 | ⭐⭐⭐⭐⭐ |
| 4 | `file_utils.js` | 文件/路径管理 | ⭐⭐⭐⭐ |
| 5 | `logger.js` | 日志系统 | ⭐⭐⭐⭐ |
| 6 | `interceptor.js` | 计算锁 | ⭐⭐⭐⭐ |
| 7 | `stop_hook.js` | 优雅退出 | ⭐⭐⭐ |
| 8 | `localrouter.js` | 本地调用 | ⭐⭐⭐ |

### 完整请求生命周期

```
HTTP 请求
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express App                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Middleware: bodyParser (解析请求体)                  │   │
│  │ Middleware: authenticate (JWT 认证)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                  custumrouter.js                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 路由匹配 → 调用 serviceFunc(req.body, req.user)      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Service                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 业务逻辑处理                                         │   │
│  │ • interceptor.withCalculateLock() 防并发            │   │
│  │ • file_utils 文件操作                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 数据访问层                                           │   │
│  │ • datasourcemanager.getSequelize()                  │   │
│  │ • Sequelize ORM 操作                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
响应 { code: 200, data: ... } 或 { code: 500, msg: ... }
```

---

# 第七阶段：面试题汇总

## 7.1 核心概念题

### Q1: Node.js 与浏览器的区别？

| 方面 | Node.js | 浏览器 |
|------|---------|--------|
| 运行环境 | 服务器 | 客户端 |
| 全局对象 | global | window |
| 模块系统 | CommonJS/ESM | ESM |
| 核心模块 | fs, path, http | DOM, BOM |
| API | 服务端 API | Web API |

### Q2: CommonJS vs ES Module？

| 特性 | CommonJS | ES Module |
|------|----------|-----------|
| 语法 | require/module.exports | import/export |
| 加载时机 | 同步 | 异步 |
| 循环依赖 | 较难处理 | 支持但有条件 |
| 打包 | 支持 | 需要构建工具 |

### Q3: process.nextTick vs setImmediate？

```javascript
process.nextTick(() => console.log('nextTick'));  // 当前操作完成后立即执行
setImmediate(() => console.log('setImmediate'));   // 当前事件循环阶段结束后执行
```

执行顺序取决于上下文：
- 在 I/O 回调中：`setImmediate` 先执行
- 在普通代码中：`process.nextTick` 先执行

---

## 7.2 异步编程题

### Q4: Promise.all vs Promise.race？

```javascript
// Promise.all: 全部成功才成功，一个失败则失败
const results = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
]);

// Promise.race: 返回最快完成的（无论成功失败）
const result = await Promise.race([
    fetchTimeout(),
    fetchData()
]);
```

### Q5: async/await 如何实现？

async/await 是 Promise 的语法糖：
- `async` 函数自动返回 Promise
- `await` 等待 Promise resolve
- 错误通过 try/catch 捕获

```javascript
// 转换关系
async function fetchData() {
    const result = await getData();
    return result;
}

// 等同于
function fetchData() {
    return getData().then(result => result);
}
```

---

## 7.3 Express 相关题

### Q6: 中间件执行顺序？

```javascript
app.use((req, res, next) => {
    console.log('1');
    next();
});

app.use((req, res, next) => {
    console.log('2');
    next();
});

app.get('/test', (req, res) => {
    res.send('test');  // 不会触发上面的中间件
});

app.use((req, res, next) => {
    console.log('3');  // 不会被 /test 触发
});
```

### Q7: 如何防止 SQL 注入？

1. 使用参数化查询（ORM 自动处理）
2. 避免拼接 SQL
3. 输入验证和过滤

```javascript
// Sequelize 自动处理参数化查询
const user = await User.findAll({
    where: { name: req.body.name }  // 自动转义
});
```

---

## 7.4 性能相关题

### Q8: 如何排查内存泄漏？

1. 使用 `--inspect` 启动 Node.js
2. 使用 Chrome DevTools 录制堆快照
3. 使用 `process.memoryUsage()` 监控
4. 检查全局变量、闭包、事件监听器

```javascript
setInterval(() => {
    console.log(process.memoryUsage());
    // { heapUsed: xxx, heapTotal: xxx, external: xxx, rss: xxx }
}, 5000);
```

### Q9: Cluster 模块的使用？

```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    app.listen(8080);
}
```

---

## 7.5 手写代码题

### Q10: 实现防抖函数

```javascript
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 使用
const debouncedSearch = debounce(search, 300);
```

### Q11: 实现节流函数

```javascript
function throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 使用
const throttledScroll = throttle(handleScroll, 100);
```

### Q12: 实现深拷贝

```javascript
function deepClone(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (visited.has(obj)) return visited.get(obj);

    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);

    const clone = Array.isArray(obj) ? [] : {};
    visited.set(obj, clone);

    for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key], visited);
    }
    return clone;
}
```

---

## 学习资源

| 资源 | 链接 |
|------|------|
| Node.js 官方文档 | https://nodejs.org/docs |
| Express 官方文档 | https://expressjs.com/ |
| Sequelize 文档 | https://sequelize.org/ |
| 《深入浅出 Node.js》 | 朴灵著 |

---

*笔记会持续更新*

----
# 第二个项目的项目架构

## 1. 项目概述

**项目名称**: tb-dock-server  

**技术栈**: Nest.js + Prisma + MySQL + Redis  

**项目描述**: TBDock 产品的后端 API 服务，为前端和外部系统提供数据接口

### 1.1 核心业务
- Dock（扩展坞）产品管理：CRUD、分页查询、条件筛选
- 系统用户认证与授权
- 数据字典管理
- 用户反馈管理
- 验证码服务
- CDN/SSR 缓存管理
- 数据库备份导出

---

## 2. 技术架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          客户端请求                                  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Nest.js 应用                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    全局中间件/管道/拦截器                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐ │   │
│  │  │ ValidationPipe│  │JwtAuthGuard │  │ ReqLogInterceptor  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘ │   │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐   │   │
│  │  │ ResWrapperInterceptor   │  │ HttpExceptionFilter    │   │   │
│  │  └─────────────────────────┘  └─────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Controller 层                          │   │
│  │  DockController │ SysUserController │ DictController │ ...  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Service 层                             │   │
│  │  DockService │ AuthService │ DictService │ CosService │ ... │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                 │                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       Module 层                               │   │
│  │  DockModule │ AuthModule │ SysUserModule │ CommonModule │... │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     MySQL       │  │     Redis       │  │  腾讯云 COS      │
│   (Prisma)     │  │   (ioredis)     │  │  (对象存储)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 3. 项目目录结构

```
tb-dock-server/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── app.module.ts               # 根模块
│   │
│   ├── api/                       # API 通用定义
│   │   └── http.ts                 # 统一响应体 CommonResBody
│   │
│   ├── auth/                      # 认证授权模块
│   │   ├── auth.module.ts         # 认证模块
│   │   ├── auth.service.ts        # 认证服务（JWT签发/验证）
│   │   ├── jwt.strategy.ts        # Passport JWT策略
│   │   ├── local.strategy.ts      # Passport 本地策略
│   │   ├── jwtAuth.guard.ts       # JWT守卫
│   │   ├── authorization.decorator.ts  # 公开接口装饰器
│   │   ├── owDataEncrypt.decorator.ts  # OW出口数据加密
│   │   └── authenticatedUser.d.ts  # 用户类型定义
│   │
│   ├── captcha.module/            # 验证码模块
│   │   ├── captcha.module.ts
│   │   ├── captcha.controller.ts
│   │   ├── captcha.service.ts
│   │   ├── captcha.dto.ts
│   │   └── captchaRateLimit.guard.ts  # 验证码限流守卫
│   │
│   ├── cdn/                       # CDN管理模块
│   │   ├── cdn.module.ts
│   │   └── cdn.service.ts          # 腾讯云CDN缓存刷新
│   │
│   ├── common.module/             # 公共模块
│   │   ├── common.module.ts
│   │   ├── common.service.ts      # 公共服务（备份/首页刷新）
│   │   ├── common.controller.ts
│   │   ├── common.dto.ts
│   │   ├── dbBackup.ts            # 数据库备份核心逻辑
│   │   └── coreBusinessDataWriteProtection.ts  # 核心数据写保护
│   │
│   ├── cos.module/               # 腾讯云COS模块
│   │   ├── cos.module.ts
│   │   └── cos.service.ts         # 文件上传服务
│   │
│   ├── dict.module/              # 数据字典模块
│   │   ├── dict.module.ts
│   │   ├── dict.service.ts
│   │   ├── dict.controller.ts
│   │   └── dict.dto.ts
│   │
│   ├── dock.module/              # 核心Dock产品模块
│   │   ├── dock.module.ts
│   │   ├── dock.controller.ts     # Dock + OW Dock 控制器
│   │   ├── dock.service.ts        # 核心业务逻辑
│   │   ├── dock.dto.ts            # DTO定义
│   │   └── dock.query.helper.ts   # 查询辅助（CSP回溯算法）
│   │
│   ├── feedback.module/          # 用户反馈模块
│   │   ├── feedback.module.ts
│   │   ├── feedback.controller.ts
│   │   ├── feedback.service.ts
│   │   └── feedback.dto.ts
│   │
│   ├── filter/                   # 全局异常过滤器
│   │   ├── basic.filter.ts        # 基础过滤器
│   │   ├── httpException.filter.ts
│   │   └── commonException.filter.ts
│   │
│   ├── interceptor/              # 全局拦截器
│   │   ├── reqLog.interceptor.ts  # 请求日志拦截器
│   │   └── resWrapper.interceptor.ts  # 统一响应包装
│   │
│   ├── log.module/               # 日志模块
│   │   ├── log.module.ts
│   │   ├── log.service.ts
│   │   ├── log.controller.ts
│   │   └── log.dto.ts
│   │
│   ├── pipe/                      # 全局管道
│   │   └── validate.pipe.ts       # 参数验证管道
│   │
│   ├── prisma/                    # Prisma ORM
│   │   └── index.ts               # Prisma客户端实例 + 扩展
│   │
│   ├── sysUser.module/            # 系统用户模块
│   │   ├── sysUser.module.ts
│   │   ├── sysUser.service.ts
│   │   ├── sysUser.controller.ts
│   │   ├── sysUser.dto.ts
│   │   └── loginRateLimit.guard.ts  # 登录限流守卫
│   │
│   └── utils/                     # 工具函数
│       ├── utils.ts               # 通用工具（UUID/深拷贝/命名转换）
│       ├── dict.ts                # 字典相关
│       └── payload-encryptor.ts   # OW出口数据加密算法
│
├── prisma/
│   └── schema.prisma               # 数据库Schema定义
│
├── generated/
│   └── prisma/                     # Prisma生成的类型
│
├── public/
│   └── captcha-images/             # 验证码图片目录
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.dev                        # 开发环境配置
├── .env.test                       # 测试环境配置
└── .env.prod                       # 生产环境配置
```

---

## 4. 核心模块详解

### 4.1 Dock 模块（核心业务）

**文件位置**: `src/dock.module/`

**模块职责**: 扩展坞产品的增删改查及高级筛选

**控制器**:
| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/dock` | GET | 获取单个产品详情 | 需要 |
| `/dock` | POST | 创建/更新产品 | 需要 |
| `/dock` | DELETE | 删除产品 | 需要 |
| `/dock/page` | GET | 分页查询（支持复杂筛选） | 需要 |
| `/dock/pic` | POST | 上传产品图片 | 需要 |
| `/dock/weight` | PATCH | 更新产品权重 | 需要 |
| `/dock/underMaintenance` | PATCH | 更新维护状态 | 需要 |
| `/ow/dock` | GET | **OW出口**：获取详情 | 公开+加密 |
| `/ow/dock/page` | GET | **OW出口**：分页查询 | 公开+加密 |

**高级查询特性**:
- **端口筛选**: 使用 CSP 回溯算法进行精确匹配（支持版本比较）
- **视频能力筛选**: 基于带宽评分的多约束匹配
- **价格区间筛选**: 按货币类型和价格范围过滤
- **假分页**: 应用层精确筛选后的分页处理
- **查询优化字段**: `portTypeQty`、`videoMaxOutputsCount` 预计算字段

### 4.2 认证模块

**文件位置**: `src/auth/`

**认证流程**:
```
1. 登录 → LocalStrategy 验证用户名密码
2. 生成 JWT Token（包含 user uuid, signDate, expiresIn, tokenType）
3. 请求 → JwtStrategy 验证 Token 签名和有效期
4. Redis 检查 Token 是否被撤销
```

**Token 管理**:
- Access Token: 短期令牌（默认30分钟）
- Refresh Token: 刷新令牌（用于无感续期）
- Token 撤销: 用户登出或修改密码时，写入 Redis 标记

### 4.3 数据字典模块

**文件位置**: `src/dict.module/`

**用途**: 提供系统中各类枚举值的统一管理

**字典类型示例**:
| dictType | 说明 | 示例值 |
|----------|------|--------|
| `thunderbolt_ver` | Thunderbolt 版本 | 3, 4, 5 |
| `usb_ver` | USB 版本 | 2.0, 3.0, 3.1, 3.2, 4 |
| `hdmi_ver_simple` | HDMI 版本 | 1.4, 2.0, 2.1 |
| `dp_ver_simple` | DP 版本 | 1.2, 1.4, 2.0 |
| `currency_type` | 货币类型 | CNY, USD, JPY |

**应用场景**:
- 产品编辑时的下拉选项
- 端口筛选时的版本比较（通过 `sortOrder` 排序）

### 4.4 公共模块

**文件位置**: `src/common.module/`

**数据库备份**:
- 导出: MySQL → SQL 文件 → 上传 COS
- 导入: COS 下载 → 执行 SQL
- 核心数据写保护: 备份恢复期间禁止写入核心表

**缓存刷新**:
- SSR 页面缓存刷新
- CDN 资源缓存刷新

### 4.5 OW 出口数据加密

**文件位置**: `src/auth/owDataEncrypt.decorator.ts`（装饰器）、`src/utils/payload-encryptor.ts`（算法实现）

**目的**: 保护 OW 前端数据的隐私性

**加密范围**:
- 仅加密响应体中的 `data` 字段
- `code`、`msg` 保持原样
- 非 2xx 响应透传不加密

**加密算法**: 见 `src/utils/payload-encryptor.ts`

---

## 5. 数据库设计

**文件位置**: `prisma/schema.prisma`

### 5.1 核心数据模型

#### 表关系图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Product (产品主表)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │ 一个 Dock 产品 ←─────────────────── 多个 Port (端口表)              │ │
│  │ 一个 Dock 产品 ←─────────────────── 多个 VideoCapability (视频能力) │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Product 产品表 (产品主表)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BigInt | 自增主键 |
| `uuid` | Char(8) | 业务主键（8位随机UUID，用于外部引用） |
| `brand` | Varchar(50) | 品牌名称 |
| `model` | Varchar(150) | 型号 |
| `pics` | Text | 产品图片URL列表（逗号分隔） |
| `daisyChainSupport` | Boolean | 是否支持菊花链 |
| `daisyChainDetail` | Text | 菊花链详细说明 |
| `tbIntelCertified` | Boolean | 是否通过 Intel/TB 认证 |
| `powerInputDetail` | Text | 电源输入规格 |
| `powerOutputMax` | Decimal | 最大电源输出功率 |
| `powerOutputTypical` | Decimal | 典型电源输出功率 |
| `powerOutputDetail` | Text | 电源输出详细说明 |
| `activeCooling` | Boolean | 是否主动散热（风冷） |
| `coolingDetail` | Text | 散热详细说明 |
| `osSupport` | JSON | 支持的操作系统列表 |
| `materialRefs` | JSON | 材质参考资料 |
| `prices` | JSON | 价格信息（多币种） |
| `about` | Text | 产品简介 |
| `notes` | Text | 备注 |
| `hasUncertainInfo` | Boolean | 是否包含未确认信息 |
| `videoCapabilityNotes` | Text | 视频能力备注 |
| `underMaintenance` | Boolean | 是否处于维护中（新品默认true） |
| `weight` | Int | 权重（用于搜索排序优先级） |
| `portTypeQty` | JSON | **查询优化字段**：各类型端口数量统计 |
| `videoMaxOutputsCount` | Int | **查询优化字段**：最大视频输出数量 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

#### Port 端口表 (一对多子表)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BigInt | 自增主键 |
| `uuid` | Char(8) | 业务主键 |
| `productUuid` | Char(8) | **外键** → Product.uuid |
| `type` | Enum | 端口类型（thunderbolt/usb_c/usb_a/audio_3p5/spdif/vga/hdmi/dp/dp_mini/rj45/card_reader/lock/other） |
| `qty` | Int | 数量（该类型端口有几个） |
| `index` | Int | 排序索引 |
| `notes` | Text | 端口备注 |

**Thunderbolt 相关字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `tb4Host` | Boolean | 是否为 TB4 主机接口 |
| `tbVer` | Varchar(10) | TB 版本（如 "3", "4"） |
| `tbSpeed` | Decimal | TB 速率（Gbps） |
| `tbPower` | Decimal | TB 供电功率（W） |
| `tbVideoAvail` | Boolean | 是否支持视频输出 |
| `tbVideoTech` | Varchar(20) | 视频技术（DP/HDMI） |

**USB-C 相关字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `usbcVer` | Varchar(15) | USB 版本（如 "3.2", "4"） |
| `usbcPower` | Decimal | USB-C 供电功率（W） |
| `usbcVideoAvail` | Boolean | 是否支持视频输出 |
| `usbcVideoTech` | Varchar(20) | 视频技术 |

**USB-A 相关字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `usbaVer` | Varchar(15) | USB 版本 |
| `usbaPower` | Decimal | 供电功率（W） |

**音视频端口字段**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `audio3p5Type` | Varchar(30) | 3.5mm音频类型（耳机/麦克风/ combo） |
| `spdifPhysicalType` | Enum | S/PDIF 物理类型（optical/coaxial） |
| `spdifIoType` | Enum | S/PDIF 方向（in/out） |
| `hdmiVerSimple` | Varchar(10) | HDMI 版本（如 "2.1", "2.0"） |
| `hdmiEncoding` | Enum | HDMI 编码方式（TMDS/FRL） |
| `dpVerSimple` | Varchar(10) | DP 版本（如 "1.4", "2.0"） |
| `dpSpeed` | Varchar(15) | DP 速率 |
| `vga` | - | VGA 接口（无附加字段） |

**网络与存储**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `rj45Speed` | Decimal | RJ45 网速（Mbps/Gbps） |
| `cardReaderType` | Enum | 卡槽类型（SD/XQD/CFEXPRESS） |
| `sdInterface` | Varchar(10) | SD 卡接口 |
| `sdVer` | Varchar(10) | SD 版本 |
| `sdSpeed` | Varchar(15) | SD 速度等级 |
| `sdCapacity` | Varchar(15) | SD 容量支持 |
| `cfeVer` | Varchar(30) | CFExpress 版本 |
| `cfeInterface` | Enum | CFExpress 接口类型（A/B/C） |

**其他**:
| 字段 | 类型 | 说明 |
|------|------|------|
| `lockHoleType` | Varchar(20) | 安全锁孔类型 |
| `otherDesc` | Varchar(40) | 其他接口描述 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

#### VideoCapability 视频能力表 (一对多子表)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BigInt | 自增主键 |
| `uuid` | Char(8) | 业务主键 |
| `productUuid` | Char(8) | **外键** → Product.uuid |
| `isOptimal` | Boolean | 是否为最优视频方案 |
| `isNotTypical` | Boolean | 是否为非典型方案 |
| `conditions` | Text | 实现该视频输出的条件说明 |
| `outputs` | JSON | 视频输出配置数组，结构见下方 |
| `notes` | Text | 备注 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

**outputs JSON 结构示例**:
```json
[
  {
    "type": "hdmi",
    "resolution": "3840x2160",
    "resolutionPixels": 8294400,
    "hz": 60,
    "colorDepth": 10,
    "qty": 2
  },
  {
    "type": "dp",
    "resolution": "5120x2880",
    "hz": 60,
    "colorDepth": 8,
    "qty": 1
  }
]
```

### 5.2 系统表

#### SysUser 系统用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Int | 自增主键 |
| `uuid` | Char(8) | 业务主键 |
| `username` | Varchar(32) | 用户名（唯一） |
| `password` | Varchar(64) | 密码（bcrypt加密） |
| `nickname` | Varchar(50) | 昵称 |
| `phone` | Varchar(20) | 手机号 |
| `avatar` | Varchar(255) | 头像URL |
| `userStatus` | Char(1) | 用户状态（"0"=正常） |
| `claims` | Varchar(255) | 权限标识列表 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

#### SysDictType 字典类型表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Int | 自增主键 |
| `dictName` | Varchar(100) | 字典名称（如 "端口类型"） |
| `dictType` | Varchar(100) | 字典标识（唯一，如 "port_type"） |
| `dictStatus` | Char(1) | 状态（"0"=正常） |
| `remark` | Varchar(500) | 备注 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

**关联关系**: 一个字典类型 → 多个字典数据

#### SysDictData 字典数据表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Int | 自增主键 |
| `sortOrder` | Int | 排序序号（用于版本比较） |
| `label` | Varchar(100) | 显示标签（如 "USB 4"） |
| `val` | Varchar(100) | 值（如 "usb4"） |
| `dictType` | Int | **外键** → SysDictType.id |
| `dictDataStatus` | Char(1) | 状态（"0"=正常） |
| `remark` | Varchar(500) | 备注 |
| `del` | Boolean | 软删除标记 |
| `createdBy` | Char(8) | 创建人UUID |
| `updatedBy` | Char(8) | 更新人UUID |
| `createdAt` | Timestamp | 创建时间 |
| `updatedAt` | Timestamp | 更新时间 |

**字典类型与数据的关系示例**:
```
SysDictType (dictType="thunderbolt_ver")
    └── SysDictData (label="Thunderbolt 3", val="3", sortOrder=1)
    └── SysDictData (label="Thunderbolt 4", val="4", sortOrder=2)
    └── SysDictData (label="Thunderbolt 5", val="5", sortOrder=3)
```

#### ReqLog 请求日志表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Int | 自增主键 |
| `path` | Varchar(255) | 请求路径 |
| `method` | Varchar(15) | 请求方法 |
| `query` | JSON | 查询参数 |
| `body` | JSON | 请求体 |
| `header` | JSON | 请求头 |
| `user` | JSON | 当前用户信息 |
| `ip` | Varchar(140) | 客户端IP |
| `res` | JSON | 响应内容 |
| `error` | Boolean | 是否异常 |
| `createTime` | DateTime | 创建时间 |
| `del` | Boolean | 软删除标记 |

#### Feedback 用户反馈表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | BigInt | 自增主键 |
| `uuid` | Char(8) | 业务主键 |
| `title` | Varchar(100) | 反馈标题 |
| `text` | Text | 反馈内容 |
| `done` | Boolean | 是否已处理 |
| `createdAt` | Timestamp | 创建时间 |

---

## 6. 全局机制

### 6.1 统一响应格式

**文件位置**: `src/api/http.ts`（CommonResBody 类）、`src/interceptor/resWrapper.interceptor.ts`

统一响应体结构：
```typescript
{
  "data": { ... },    // 业务数据
  "msg": "succ",      // 消息
  "code": 200         // HTTP状态码
}
```

### 6.2 请求处理流程

```
请求 → ValidationPipe → JwtAuthGuard → Controller
                                      ↓
                                 Service 处理
                                      ↓
                        ResWrapperInterceptor 包装响应
                                      ↓
                        ReqLogInterceptor 记录日志
                                      ↓
                              HttpExceptionFilter (异常处理)
                                      ↓
                              响应给客户端
```

**关键文件**:
| 组件 | 文件位置 |
|------|----------|
| ValidationPipe | `src/pipe/validate.pipe.ts` |
| JwtAuthGuard | `src/auth/jwtAuth.guard.ts` |
| ResWrapperInterceptor | `src/interceptor/resWrapper.interceptor.ts` |
| ReqLogInterceptor | `src/interceptor/reqLog.interceptor.ts` |
| HttpExceptionFilter | `src/filter/httpException.filter.ts` |
| CommonExceptionsFilter | `src/filter/commonException.filter.ts` |

### 6.3 软删除机制

所有业务表都有 `del` 字段，删除操作时设置 `del=true`，查询时自动过滤。

---

## 7. 环境配置

### 7.1 环境变量说明

| 变量 | 说明 |
|------|------|
| `HOST_PORT` | 服务端口 |
| `TOKEN_SECRET` | JWT 签名密钥 |
| `MYSQL_*` | MySQL 连接配置 |
| `REDIS_URL/PWD` | Redis 连接配置 |
| `COS_*` | 腾讯云 COS 配置 |
| `PAYLOAD_SECRET` | OW 数据加密密钥 |

### 7.2 多环境启动

```bash
npm run start:debug     # 开发环境 (.env.dev)
npm run start:test      # 测试环境 (.env.test)
npm run start:prod      # 生产环境 (.env.prod)
```

---

## 8. 关键技术亮点

### 8.1 CSP 回溯算法（端口筛选）

**文件位置**: `src/dock.module/dock.query.helper.ts`

使用约束满足问题（CSP）算法进行端口精确匹配：
- **MRV 启发式**: 选择可用端口最少的未匹配需求
- **LCV 启发式**: 优先尝试灵活度低的端口
- **前向检查**: 确保每步都能继续匹配

### 8.2 查询优化策略

- **预计算字段**: `portTypeQty`、`videoMaxOutputsCount` 存储端口统计
- **索引优化**: 为高频查询字段建立复合索引
- **假分页**: 应用层精确筛选后分页，减少数据库负担

**文件位置**: `src/dock.module/dock.service.ts`

### 8.3 核心数据写保护

**文件位置**: `src/prisma/index.ts`、`src/common.module/coreBusinessDataWriteProtection.ts`

备份恢复期间，通过 Prisma 扩展拦截所有写操作，防止数据不一致。

---

## 9. 部署架构

```
                          ┌──────────────────┐
                          │   负载均衡器      │
                          └────────┬────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
   │  Node 1      │        │  Node 2      │        │  Node N      │
   │ tb-dock-srv  │        │ tb-dock-srv  │        │ tb-dock-srv  │
   └───────┬──────┘        └───────┬──────┘        └───────┬──────┘
           │                       │                       │
           └───────────────────────┼───────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
             ┌──────────┐  ┌──────────┐  ┌──────────┐
             │  MySQL   │  │  Redis    │  │   COS     │
             └──────────┘  └──────────┘  └──────────┘
```

---

## 10. 相关文档

| 文档 | 路径 |
|------|------|
| OW 出口数据加密详细设计 | `.ai/rules/business-data-encryption.md` |
| Prisma 数据库 Schema | `prisma/schema.prisma` |
| API 接口定义 | 各模块 `src/*/xxx.controller.ts` |
| Prisma 客户端配置 | `src/prisma/index.ts` |

---

# 项目架构对比分析

> 本章节对 **wc-Backend 项目**（第一阶段笔记）和 **tb-dock-server 项目**（第二个项目）进行全方位对比分析，帮助理解不同架构风格的特点和适用场景。

## 对比总览

| 对比维度 | wc-Backend | tb-dock-server |
|----------|------------|----------------|
| **框架** | Express.js（原生 Node.js） | Nest.js（企业级框架） |
| **语言** | JavaScript | TypeScript |
| **模块规范** | CommonJS | ES Module |
| **ORM** | Sequelize | Prisma |
| **数据库** | SQLite | MySQL |
| **缓存** | 无 | Redis |
| **文件存储** | 本地文件系统 | 腾讯云 COS |
| **架构风格** | 自定义分层 | 约定式模块化 |
| **认证方式** | 自定义中间件 | Passport + JWT |
| **项目类型** | 工具类（水文计算） | 商业产品管理 |

---

## 1. 框架层面的对比

### 1.1 Express.js vs Nest.js

**wc-Backend（Express.js）**:
```javascript
// 路由定义方式
const express = require('express');
const router = express.Router();

router.get('/project', async (req, res) => {
    const result = await projectService.getProjects(req.query);
    res.send({ code: 200, data: result });
});

module.exports = router;
```

**特点**:
- 轻量、灵活，几乎没有约束
- 路由、控制器、逻辑可以混在一起
- 需要手动处理很多重复性工作（参数校验、异常处理）
- 适合小型项目或学习理解原理

---

**tb-dock-server（Nest.js）**:
```typescript
// 控制器定义方式
@Controller('dock')
export class DockController {
    constructor(private readonly dockService: DockService) {}

    @Get('page')
    async getPage(@Query() getDockPageDto: GetDockPageDto) {
        const result = await this.dockService.getPage(getDockPageDto);
        return { data: result };
    }
}
```

**特点**:
- 约定优于配置，结构清晰
- 内置依赖注入、控制反转
- 装饰器语法，声明式编程
- 完善的异常处理、管道、守卫、拦截器机制
- 适合中大型企业级应用

---

### 1.2 装饰器模式的威力

**Nest.js 装饰器示例**:
```typescript
// 一个完整的受保护接口
@Get('page')
@UseGuards(JwtAuthGuard)              // 守卫：认证拦截
@UsePipes(new ValidationPipe())       // 管道：参数校验
@UseInterceptors(ResWrapperInterceptor) // 拦截器：响应包装
async getPage(@Query() dto: GetDockPageDto) {
    return this.dockService.getPage(dto);
}

// 公开接口（跳过认证）
@Get('ow/dock')
@Public()                              // 自定义装饰器：公开接口
@owDataEncrypt()                       // 自定义装饰器：数据加密
async get(@Query() dto: GetDockDto) {
    return this.dockService.get(dto);
}
```

**Express 对比**（需要手动实现）:
```javascript
// wc-Backend 中的参数校验
const argumentUtils = require('../framework/utils/argument_utils');

router.post('/project', async (req, res, next) => {
    try {
        // 手动校验参数
        const args = argumentUtils.validate(req.body, {
            name: 'string',
            type: 'string'
        });
        const result = await projectService.create(args);
        res.send({ code: 200, data: result });
    } catch (error) {
        res.send({ code: 500, msg: error.message });
    }
});
```

---

## 2. 项目结构对比

### 2.1 wc-Backend 目录结构

```
wc-Backend/
├── src/
│   ├── app.js                    # 应用入口
│   ├── routes/                   # 路由层（API入口）
│   │   ├── user.js
│   │   ├── project.js
│   │   └── hydrologic/
│   ├── business/                # 业务层
│   │   ├── service/             # 业务逻辑
│   │   │   ├── user.js
│   │   │   ├── project.js
│   │   │   └── engine.js        # 核心计算引擎
│   │   ├── repository/          # 数据访问
│   │   │   ├── user.js
│   │   │   └── project.js
│   │   └── model/               # 数据模型
│   │       └── project.js
│   └── framework/                # 框架基础设施
│       ├── datasource/          # 数据库连接
│       ├── route/               # 路由封装
│       └── utils/               # 工具函数
└── projects/                     # 用户数据存储
    └── {project-id}/            # 每个用户独立目录
```

**设计思路**: MVC + Repository 模式，框架层和业务层分离

---

### 2.2 tb-dock-server 目录结构

```
tb-dock-server/
├── src/
│   ├── main.ts                  # 应用入口
│   ├── app.module.ts            # 根模块
│   ├── auth/                    # 认证模块
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwtAuth.guard.ts
│   ├── dock.module/             # Dock 产品模块
│   │   ├── dock.module.ts
│   │   ├── dock.controller.ts
│   │   ├── dock.service.ts
│   │   ├── dock.dto.ts
│   │   └── dock.query.helper.ts
│   ├── dict.module/             # 字典模块
│   ├── sysUser.module/          # 用户模块
│   ├── filter/                  # 全局过滤器
│   ├── interceptor/              # 全局拦截器
│   ├── pipe/                    # 全局管道
│   └── prisma/                  # ORM 配置
│       └── index.ts
└── prisma/
    └── schema.prisma             # 数据库 Schema
```

**设计思路**: 模块化架构，每个业务领域一个模块

---

### 2.3 结构对比分析

| 方面 | wc-Backend | tb-dock-server |
|------|------------|----------------|
| **组织方式** | 按层级组织（routes/service/repository） | 按业务领域组织（dock/dict/user） |
| **模块边界** | 弱依赖，手动管理 | 强依赖，依赖注入自动管理 |
| **代码发现性** | 需要记住每层的位置 | 相关代码聚在一起 |
| **扩展方式** | 在对应层级添加文件 | 创建新模块或扩展现有模块 |
| **学习曲线** | 较陡（需要理解多层职责） | 较平（约定清晰） |

---

## 3. 数据库层对比

### 3.1 ORM 使用对比

**wc-Backend（Sequelize）**:
```javascript
// 定义模型
const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const Project = sequelize.define('project', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING },
        // ...
    });
    return Project;
};

// 使用
const Project = require('./model/project')(sequelize);
await Project.findAll({ where: { userId } });
```

---

**tb-dock-server（Prisma）**:
```prisma
// 定义 Schema
model Product {
    id        BigInt @id @default(autoincrement())
    uuid      String @unique
    brand     String
    ports     Port[]           // 关联关系自动生成
}

// 使用
import prisma from '../prisma';
const products = await prisma.product.findMany({
    where: { brand: 'Dell' },
    include: { ports: true }
});
```

---

### 3.2 迁移与代码生成对比

| 方面 | wc-Backend (Sequelize) | tb-dock-server (Prisma) |
|------|------------------------|--------------------------|
| **迁移方式** | 手动编写迁移文件 | `prisma migrate` 自动管理 |
| **类型安全** | 无原生 TypeScript 支持 | 完整的类型推导 |
| **数据库切换** | 需要改驱动 | 改 datasource url 即可 |
| **关联查询** | 手动 include | 自动生成 include 类型 |
| **迁移记录** | 需要额外工具 | 内置版本管理 |

---

## 4. 认证与安全对比

### 4.1 wc-Backend 自定义认证

```javascript
// 自定义中间件
module.exports = async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ code: 401, msg: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ code: 401, msg: 'Token invalid' });
    }
};

// 路由中使用
router.get('/project', requireAuth, async (req, res) => {
    // ...
});
```

---

### 4.2 tb-dock-server Passport + JWT

```typescript
// JWT 策略
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    async validate(payload: AuthenticatedUser) {
        // 完整的验证流程
        if (payload.tokenType !== 'access') throw new UnauthorizedException();
        if (this.authService.isExpire(payload.signDate, payload.expiresIn)) {
            throw new UnauthorizedException();
        }
        // 检查 Redis 中的撤销状态
        const revoked = await this.redis.get(`sys_user_token_revoked:${payload.uuid}`);
        if (revoked) throw new UnauthorizedException();
        return payload;
    }
}

// 全局守卫（所有接口默认需要认证）
// app.module.ts
{
    provide: APP_GUARD,
    useClass: JwtAuthGuard
}

// 公开接口使用 @Public() 装饰器跳过
@Get('ow/dock')
@Public()
async get() { }
```

---

### 4.3 认证机制对比

| 特性 | wc-Backend | tb-dock-server |
|------|------------|----------------|
| **Token 类型** | 仅 Access Token | Access + Refresh Token |
| **Token 存储** | 无 | Redis（支持撤销） |
| **认证粒度** | 全局拦截 | 守卫 + 装饰器 |
| **密码加密** | 需手动实现 | bcrypt 自动处理 |
| **登录限制** | 无 | Redis 限流 |

---

## 5. 请求处理流程对比

### 5.1 wc-Backend 请求流程

```
请求 → 中间件 → 路由匹配 → 控制器函数
                            ↓
                    调用 Service（业务逻辑）
                            ↓
                    调用 Repository（数据访问）
                            ↓
                    调用 Sequelize（数据库）
                            ↓
                    返回结果 → 手动包装响应
```

**特点**:
- 中间件链式处理
- 需要手动捕获异常
- 响应格式需手动统一

---

### 5.2 tb-dock-server 请求流程

```
请求 → 全局中间件
            ↓
    ValidationPipe（参数校验）
            ↓
    JwtAuthGuard（认证守卫）
            ↓
    Controller（接收请求）
            ↓
    Service（业务逻辑）
            ↓
    Prisma（数据库访问）
            ↓
    拦截器链
        ├── ResWrapperInterceptor（响应包装）
        └── ReqLogInterceptor（日志记录）
            ↓
    异常过滤器（如有异常）
            ↓
    响应给客户端
```

**特点**:
- 自动参数校验
- 声明式认证
- 统一响应格式
- 自动异常处理
- 切面式日志

---

## 6. 业务复杂度与架构选择

### 6.1 wc-Backend 适合的场景

```
✓ 小型项目（<10 个路由）
✓ 快速原型开发
✓ 定制化程度高的场景
✓ 学习理解 HTTP 和 Node.js 底层原理
✓ 团队较小，不需要强约束
```

**典型案例**: 水利模型计算引擎、一次性脚本、内部工具

---

### 6.2 tb-dock-server 适合的场景

```
✓ 中大型项目（>20 个接口）
✓ 团队协作开发
✓ 需要长期维护
✓ 安全性要求高（认证、限流、加密）
✓ 需要可扩展性
✓ 微服务架构
```

**典型案例**: 电商后台、SaaS 产品、企业管理系统

---

## 7. 代码复用对比

### 7.1 wc-Backend 的复用方式

```javascript
// 框架工具复用
const argumentUtils = require('./framework/utils/argument_utils');
const fileUtils = require('./framework/utils/file_utils');

// 路由封装复用
const customRouter = require('./framework/route/custumrouter');
customRouter.get('/projects', projectService.getProjects);
```

**特点**: 需要手动导出和导入，复用粒度较粗

---

### 7.2 tb-dock-server 的复用方式

```typescript
// Nest.js 模块复用（依赖注入）
@Module({
    imports: [DictModule, CosModule],  // 直接复用其他模块的服务
    controllers: [DockController],
    providers: [DockService],
    exports: [DockService],            // 导出给其他模块使用
})
export class DockModule {}
```

**特点**: 通过 Module 系统的 imports/exports 实现细粒度复用

---

## 8. 性能对比

| 指标 | wc-Backend | tb-dock-server |
|------|------------|----------------|
| **启动速度** | 快（无框架开销） | 稍慢（模块初始化） |
| **运行时内存** | 较低 | 较高（依赖注入容器） |
| **响应延迟** | 极低 | 极低（框架开销可忽略） |
| **大并发支持** | 好 | 好 |

**说明**: Nest.js 的框架开销在现代硬件上几乎可忽略，性能差异主要来自业务逻辑

---

## 9. 学习曲线对比

### 9.1 wc-Backend 入门路径

```
1. JavaScript 基础 → 2. Express 路由 → 3. 中间件机制
       ↓
4. Sequelize ORM → 5. 自定义认证 → 6. 业务分层
       ↓
7. 深入理解 HTTP 和 Node.js 事件循环
```

**优点**: 每一步都能看到底层原理  
**缺点**: 需要自己做很多决定和实现

---

### 9.2 tb-dock-server 入门路径

```
1. TypeScript 基础 → 2. 装饰器语法 → 3. 依赖注入概念
       ↓
4. Nest.js 模块系统 → 5. 守卫/管道/拦截器 → 6. Prisma
       ↓
7. 业务模块开发
```

**优点**: 约定清晰，上手后开发效率高  
**缺点**: 需要理解框架概念，有一定抽象层

---

## 10. 总结：如何选择

### 选择 wc-Backend（原生 Node.js / Express）当:

1. 项目是个人项目或 MVP
2. 需要深入理解 HTTP 和 Node.js 底层
3. 项目规模小，变化频繁
4. 团队只有 1-2 人
5. 需要高度定制的中间件逻辑

### 选择 tb-dock-server（Nest.js）当:

1. 团队 3 人以上，需要统一规范
2. 项目需要长期维护和迭代
3. 需要企业级特性（认证、授权、限流、日志）
4. 希望提高开发效率，减少重复代码
5. 需要微服务或模块化架构

---

### 迁移路径

如果你从 wc-Backend 迁移到 tb-dock-server:

```
Phase 1: 理解 Nest.js 核心概念
    ↓
Phase 2: 用 Nest.js 重写新模块
    ↓
Phase 3: 逐步迁移旧模块
    ↓
Phase 4: 利用 Nest.js 企业特性（微服务、队列、缓存）
```

**注意**: 不建议为了"技术升级"而迁移稳定运行的项目

---

## 附：两个项目的核心文件对照

| 功能 | wc-Backend | tb-dock-server |
|------|------------|----------------|
| 应用入口 | `src/app.js` | `src/main.ts` |
| 根模块 | 无 | `src/app.module.ts` |
| 路由定义 | `src/routes/*.js` | `src/*/xxx.controller.ts` |
| 业务逻辑 | `src/business/service/*.js` | `src/*/xxx.service.ts` |
| 数据访问 | `src/business/repository/*.js` | `src/*/` + `src/prisma/index.ts` |
| 数据模型 | `src/business/model/*.js` | `prisma/schema.prisma` |
| 参数校验 | `src/framework/utils/argument_utils.js` | `src/pipe/validate.pipe.ts` |
| 统一响应 | 手动在路由中处理 | `src/interceptor/resWrapper.interceptor.ts` |
| 异常处理 | try-catch 手动处理 | `src/filter/*.filter.ts` |
| 认证中间件 | 自定义函数 | `@nestjs/passport` + JWT |
