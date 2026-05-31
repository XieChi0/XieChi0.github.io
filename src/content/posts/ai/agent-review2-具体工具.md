---
title: agent-review2-具体工具
published: 2026-05-22
updated: 2026-05-22
description: '详细介绍 AI Coding Agent 中的浏览器自动化工具，包括 cursor-ide-browser、Playwright MCP 和 Chrome DevTools MCP。'
image: ''
tags: [MCP工具, 浏览器自动化, Playwright]
category: 'AI'
draft: false
---

> 本篇专注介绍浏览器自动化 MCP 工具。MCP 基础概念可参考 [MCP 详解](./MCP.md)。

---

## 一、cursor-ide-browser

### 1.1 简介

`cursor-ide-browser` 是 Cursor IDE 内置的**浏览器自动化 MCP 工具**，让 AI 可以操作浏览器。

**核心能力**：导航、点击、输入、截图、调试。

### 1.2 工具列表

| 类别 | 工具 | 功能 |
|------|------|------|
| 导航 | `browser_navigate` | 打开 URL |
| | `browser_resize` | 调整窗口（模拟移动端） |
| | `browser_tabs` | 管理标签页 |
| 交互 | `browser_click` | 点击元素 |
| | `browser_scroll` | 滚动 |
| | `browser_type` | 输入文本 |
| | `browser_fill_form` | 批量填充表单 |
| 信息 | `browser_snapshot` | 获取页面结构（核心） |
| | `browser_take_screenshot` | 截图 |
| | `browser_console_messages` | 控制台日志 |
| 其他 | `browser_lock/unlock` | 锁定浏览器 |

### 1.3 核心工具

#### browser_snapshot（最核心）

获取页面可访问性树，AI 靠它"看见"页面：

```json
{
  "interactive": true,
  "selector": "#panel",
  "includeDiff": true
}
```

返回结构：
```json
{
  "role": "button",
  "name": "提交",
  "ref": "button[id='submit']",
  "enabled": true
}
```

#### browser_navigate

```json
{ "url": "http://localhost:4321/posts/example" }
```

#### browser_resize（模拟移动端）

```json
{ "width": 375, "height": 812 }  // iPhone
```

### 1.4 使用示例

```javascript
browser_navigate({ url: "http://localhost:4321/posts/test" })
browser_resize({ width: 375, height: 812 })
browser_snapshot()
browser_click({ element: "目录按钮", ref: "button[id='toc']" })
browser_take_screenshot({ filename: "test.png" })
```

### 1.5 Lock/Unlock

```javascript
browser_lock()
// ... 操作 ...
browser_unlock()  // 必须解锁
```

### 1.6 注意事项

- 需要 dev server
- 无法访问 iframe
- 截图 ≠ 视觉理解

---

## 二、Playwright MCP

### 2.1 简介

Playwright MCP 是基于 [Playwright](https://playwright.dev/) 的浏览器自动化 MCP 工具，提供更强大的浏览器控制能力。

**特点**：跨浏览器支持（Chromium、Firefox、WebKit）、网络拦截、性能追踪。

### 2.2 工具列表

| 类别 | 工具 | 功能 |
|------|------|------|
| 导航 | `navigate` | 打开 URL |
| | `go_back` / `go_forward` | 前进/后退 |
| 交互 | `click` | 点击元素 |
| | `dblclick` | 双击 |
| | `hover` | 悬停 |
| | `fill` | 填充输入框 |
| | `select_option` | 选择下拉选项 |
| | `check` / `uncheck` | 勾选复选框 |
| | `press` | 按键 |
| 页面 | `screenshot` | 截图 |
| | `get_text_content` | 获取文本 |
| | `get_attribute` | 获取属性 |
| 特殊 | `upload_file` | 上传文件 |
| | `evaluate` | 执行 JS |
| | `wait_for_selector` | 等待元素 |

### 2.3 与 cursor-ide-browser 对比

| 对比 | cursor-ide-browser | Playwright MCP |
|------|-------------------|---------------|
| 浏览器 | Cursor 内置 | 独立浏览器实例 |
| 跨浏览器 | 不支持 | 支持 Chromium/Firefox/WebKit |
| 网络拦截 | 不支持 | 支持 |
| 性能追踪 | 简单 | 支持 CPU/内存分析 |
| 使用场景 | Cursor 内调试 | 复杂自动化测试 |

### 2.4 使用示例

```javascript
// 打开页面
navigate({ url: "https://example.com" })

// 截图
screenshot({ full_page: true, path: "full.png" })

// 填写表单
fill({ selector: "input[name='email']", value: "test@example.com" })
click({ selector: "button[type='submit']" })

// 等待响应
wait_for_selector({ selector: ".success-message" })

// 执行 JavaScript
evaluate({ expression: "document.title" })
```

### 2.5 网络拦截示例

```javascript
// 拦截并修改请求
route({ url: "**/api/**", handler: async (route) => {
  // 修改请求或返回 mock 数据
  await route.fulfill({ body: '{"mock": true}' })
}})

// 获取网络请求记录
get_requests()
```

---

## 三、Chrome DevTools MCP

### 3.1 简介

Chrome DevTools MCP 让 AI 直接访问 Chrome DevTools Protocol，提供底层的浏览器调试能力。

**特点**：深入浏览器内部、性能分析、网络调试、页面截屏。

### 3.2 工具列表

| 类别 | 工具 | 功能 |
|------|------|------|
| 页面 | `navigate` | 导航 |
| | `reload` | 刷新 |
| | `screenshot` | 截图 |
| | `get_html` | 获取页面 HTML |
| 元素 | `query_selector` | 查询元素 |
| | `getComputedStyles` | 获取计算样式 |
| | `getBoxModel` | 获取盒模型 |
| 控制台 | `getConsoleMessages` | 控制台日志 |
| | `evaluate` | 执行 JS |
| 网络 | `getNetworkLogs` | 网络请求日志 |
| 性能 | `startProfiling` | 开始性能分析 |
| | `stopProfiling` | 停止并获取报告 |
| 应用 | `getStorage` | 获取 localStorage/sessionStorage |
| | `getCookies` | 获取 Cookies |

### 3.3 与其他工具对比

| 对比 | cursor-ide-browser | Playwright MCP | Chrome DevTools MCP |
|------|--------------------|--------------|-------------------|
| 层级 | 用户视角 | 用户视角 | 开发者视角 |
| 能力 | 基础操作 | 完整自动化 | 底层调试 |
| 性能分析 | 简单 | 支持 | 详细 |
| 网络调试 | 基础 | 支持 | 详细 |
| CSS 检查 | 不支持 | 不支持 | 支持 |

### 3.4 使用示例

```javascript
// 截图
navigate({ url: "https://example.com" })
screenshot({ full_page: true })

// 获取元素样式
query_selector({ selector: "#header" })
getComputedStyles({ nodeId: 123 })

// 控制台日志
getConsoleMessages()

// 性能分析
startProfiling()
click({ selector: "button" })
stopProfiling()
```

### 3.5 适用场景

- 调试 CSS 样式问题
- 分析页面性能瓶颈
- 抓取网络请求详情
- 检查控制台错误
- 获取浏览器存储数据

---

## 四、工具选择指南

| 场景 | 推荐工具 |
|------|---------|
| Cursor 内快速调试 | cursor-ide-browser |
| 跨浏览器自动化测试 | Playwright MCP |
| CSS/样式调试 | Chrome DevTools MCP |
| 性能分析 | Playwright MCP / Chrome DevTools MCP |
| 网络请求调试 | Playwright MCP / Chrome DevTools MCP |
| 简单页面验证 | cursor-ide-browser |

---

## 五、总结

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **cursor-ide-browser** | Cursor 内置，简单直接 | 日常调试、快速验证 |
| **Playwright MCP** | 跨浏览器、完整自动化 | E2E 测试、复杂交互 |
| **Chrome DevTools MCP** | 底层调试、样式分析 | 性能分析、CSS 调试 |

**核心价值**：这些工具将 AI 从「只能看代码」提升到「能操作页面」，实现真正的自动化调试和测试。

---

> 本篇介绍完毕。MCP 基础概念可参考 [MCP 详解](./MCP.md)。
