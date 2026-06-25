---
title: MCP 是什么：让 AI 连接外部工具和数据的协议
published: 2026-05-22
updated: 2026-05-22
description: '用面试准备阶段能看懂的方式介绍 MCP：它是什么、和 Skill 有什么区别、MCP 连接在哪里发生、AI 怎么知道有哪些工具，以及如何写一个最小 MCP Server。'
image: ''
tags: [MCP概念]
category: 'AI'
draft: false
---

## 1. 先用大白话理解 MCP

MCP 全称是 **Model Context Protocol**，就是让 AI 应用连接外部工具和数据的一套通用接口协议。

```
AI 应用 -> MCP 协议 -> MCP Server -> 外部工具 / 数据源
```

AI 应用不用知道每个外部系统内部怎么实现，只要会通过 MCP 调用能力就行。

---

## 2. MCP 和 Skill 的区别

| 对比 | Skill | MCP |
|-----|-------|-----|
| 本质 | 本地经验文档 / 工作流 | 外部工具协议 / 服务接口 |
| AI 看到什么 | 完整的步骤、规则、参考资料 | 工具名、描述、参数 schema、返回结果 |
| 透明度 | 高，AI 知道怎么做 | 低，AI 不一定知道内部实现 |
| 适合什么 | 写作流程、代码规范、复杂操作经验 | 查数据、调接口、操作外部系统 |
| 类比 | 教程 / 菜谱 | 接口 / 点餐窗口 |

> Skill 是把方法交给 AI；MCP 是把能力接给 AI。

它们也可以配合：
- Skill 告诉 AI：文章应该怎么写、怎么检查、怎么组织结构
- MCP 让 AI：读取资料、查询数据库、发布文章

---

## 3. MCP 解决什么问题

**3.1 AI 不知道外部信息**

大模型本身不会天然知道你的本地文件、公司数据库、当前项目代码。

MCP 可以让 AI 通过 MCP Server 读取上下文：文件、数据库 schema、GitHub issue、设计稿、内部 API。

**3.2 工具接入不统一**

不同工具 API 都不一样（GitHub API、Notion API、Figma API...），MCP 加了一层统一标准。

```
AI 应用只认识 MCP，MCP Server 负责适配具体工具
```

**3.3 Agent 能力扩展**

Agent 不只是聊天，它还要能做事。MCP 把这些动作包装成标准能力：读文件、搜索代码、运行测试、查数据库。

---

## 4. MCP 连接在哪里发生

MCP 不是连接到某一句聊天内容上，而是连接到某个 AI 应用 / IDE / CLI 这个 **Host** 上。

```
Host = 你正在使用的 AI 应用
会话 = Host 里的一次聊天
MCP Server = Host 可以连接的外部能力
```

Host 可以是：
- Claude Desktop、Cursor、Windsurf、Codex 等 AI IDE
- 支持 MCP 的 AI CLI
- 自己写的 AI 应用

> MCP 接在 Host 上，不是接在一句话上。

---

## 5. AI 怎么知道 MCP 有哪些功能

典型流程：

```
1. AI 应用启动
2. Host 读取 MCP 配置
3. Host 和 MCP Server 建立连接
4. MCP Server 返回 tools/resources/prompts 的名称、描述、参数 schema
5. 用户提出需求
6. AI 判断是否调用某个 tool
```

连接时就获取能力列表，用户提需求后再按需调用——这就是 MCP 里"渐进式披露"的设计。

---

## 6. MCP 的三个角色和能暴露什么能力

### 三个角色

| 角色 | 大白话理解 | 例子 |
|------|-----------|------|
| Host | 用户正在使用的 AI 应用 | Claude Desktop、Cursor |
| Client | Host 里负责连接 MCP Server 的部分 | 每个 Server 对应一个 Client |
| Server | 真正提供工具和数据的服务 | 文件系统 Server、GitHub Server |

```
用户 -> Host: AI 应用 -> Client: 连接部分 -> Server: 工具/数据 -> 真实系统
```

### 能暴露什么能力

| 能力 | 描述 | 简单理解 |
|------|------|---------|
| tools | 让 Host AI 执行动作 | **让 AI 做事**，比如“帮我查订单”“帮我创建日程” |
| resources | Server 暴露给 Host/模型读取的“上下文数据” | **给 AI 看资料**，比如“读取项目 README”“查看订单表结构” |
| prompts | Server 暴露给 Host/用户使用的“提示词模板/任务模板”，用于让 AI 按固定方式完成任务 | "按代码审查格式回答" |

> 每次 Host 连接 MCP Server 时，会向 Server 询问：你有哪些 tools？然后 Host 把这些 tool 的名称、描述、参数 schema 临时放进当前会话/当前连接的可用工具列表里。

---

## 7. MCP 的完整工作流程

```
1. 用户打开 AI 应用 / IDE / CLI
2. Host 读取 MCP 配置
3. Host 启动本地或连接远程 MCP Server
4. Host 获取 Server 暴露的 tools/resources/prompts
5. 用户提出需求
6. AI 判断是否需要调用 MCP 能力
7. Host 执行工具调用
8. MCP Server 返回结果
9. AI 根据结果继续回答用户
```

比如用户说"帮我看看 Button 组件怎么写的"：

```
AI -> 文件系统 MCP Server -> 读取 Button.tsx -> 返回内容 -> AI 回答
```

---

## 8. 本地 MCP 和远程 MCP

**本地 MCP Server**：像一个命令行程序，由 Host 启动。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "F:/项目路径"]
    }
  }
}
```

常用 `stdio` 传输：AI 应用启动子进程，通过标准输入输出通信。

**远程 MCP Server**：像一个后端服务。

```txt
https://example.com/mcp
```

Host 不负责启动，只负责连接。适合公司内部系统、云端服务、多人共用场景。

---

是的，这是 Cursor 中 MCP 的**运行时配置格式**，定义在用户设置文件里。

## 8. 字段含义

```json
{
  "mcpServers": {
    "figma": {           // MCP 服务器名称（可自定义）
      "type": "http",    // 连接类型：http | sse |stdio
      "url": "https://mcp.figma.com/mcp",        // MCP 服务端点 URL
      "oauth_resource": "https://mcp.figma.com/mcp"  // OAuth 认证资源地址
    }
  }
}
```



| 字段             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| `type`           | 传输协议类型：`http`（HTTP POST）、`sse`（Server-Sent Events）、`stdio`（标准输入输出） |
| `url`            | MCP 服务器的 HTTP 端点，用于 `http` 或 `sse` 类型            |
| `oauth_resource` | OAuth 认证资源地址，用于需要 OAuth 授权的 MCP 服务           |



## 9. 用 TypeScript 写一个最小 MCP Server

### 9.1 安装依赖

```bash
pnpm add @modelcontextprotocol/sdk zod
pnpm add -D tsx typescript
```

### 9.2 完整代码

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'demo-mcp-server',
  version: '1.0.0',
});

server.tool(
  'add',
  'Add two numbers',
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: `${a + b}` }],
  }),
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

代码解释：
- `McpServer` 创建 MCP Server，`name` 和 `version` 标识身份
- `server.tool()` 注册工具：工具名、描述、参数 schema、执行逻辑
- `StdioServerTransport` 用标准输入输出通信

> MCP SDK 还在持续演进，真实项目优先看官方文档。

---

## 10. MCP 常见误区

**MCP 不是大模型**

MCP 本身不是模型，只是让模型更容易连接外部工具和数据。

**MCP 不等于 function calling**

- function calling：模型怎么决定调用函数
- MCP：**外部工具怎么标准化地提供给 AI 应用**

两者可以配合使用。

**MCP Server 权限要控制**

文件系统 Server 如果权限太大，AI 可能读到不该读的文件。真实项目要：
- 只开放必要工具
- 限制可访问目录
- 校验输入参数

**MCP 不是必须多个代码库**

一个 MCP Server 可以直接实现，也可以包装多个已有服务。重点是把能力用统一 schema 暴露出来。

---

## 11. 面试怎么回答 MCP

如果面试官问"你了解 MCP 吗？"：

```
MCP 是 Model Context Protocol，解决 AI 应用连接外部工具和上下文不统一的问题。

它采用 client-server 架构：
- Host 是用户使用的 AI 应用（Cursor、AI CLI 等）
- MCP Server 负责暴露 tools、resources、prompts

tools 用来执行动作（查数据库、调用接口）
resources 用来提供上下文（文件、文档、数据库结构）
prompts 用来提供可复用的提示词模板

Host 在连接时获取能力列表，用户提需求时 AI 再判断是否调用具体工具。

底层通信基于 JSON-RPC，本地常用 stdio，远程常用 Streamable HTTP。

我的理解是，MCP 让 Agent 用统一方式接入外部系统，不用每个 AI 应用都为每个工具单独集成。
```

如果想补充 Skill 对比：

```
Skill 更像把流程和经验文档交给 AI，AI 能看到完整的做法；
MCP 更像把外部服务能力通过标准接口暴露给 AI，AI 只需要知道工具能做什么、需要什么参数、返回什么结果。
```

---

## 可以继续学什么

1. 理解 MCP 和 Skill 的区别
2. 理解 Host、Client、Server 三个角色
3. 用 TypeScript SDK 写一个最小 tool
4. 接到支持 MCP 的 AI 应用里试试
5. 学习权限、安全、远程 HTTP 部署
