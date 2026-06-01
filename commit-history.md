# Commit History

---

## [2026-06-01] 修复移动端代码块体验

**Commit ID**: (提交后补充)
**变更文件数**: 4
**主要需求**: 修复移动端代码块体验问题（移除语言标签、修复复制功能、恢复横向滚动）

### 变更详情

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| astro.config.mjs | 修改 | 移除 `wrap: true`，恢复代码块横向滚动 |
| src/components/misc/Markdown.astro | 修改 | 添加 `execCommand("copy")` 作为 Clipboard API 的移动端降级方案 |
| src/plugins/expressive-code/language-badge.ts | 修改 | 移除移动端语言标签的强制显示代码 |

### 实现方式

- 移除 Expressive Code 的 `wrap: true` 配置，让长代码行保持不换行，通过 `overflow-x-auto` 实现横向滚动
- 在复制功能中增加 `window.isSecureContext` 判断，不可用时使用传统 `textarea + execCommand` 方案确保移动端兼容
- 删除 `language-badge.ts` 中 `@media (hover: none)` 的移动端强制显示逻辑，语言标签在移动端回归默认隐藏状态

### 涉及知识点

- Clipboard API 与 `window.isSecureContext` 安全上下文检测
- `document.execCommand("copy")` 降级方案及移动端兼容性
- CSS `@media (hover: none)` 区分触摸设备与指针设备
- Expressive Code 配置项 `wrap` 控制代码换行行为

### 移动端复制原理详解

```javascript
// 第一步：判断用哪种复制方式
if (navigator.clipboard && window.isSecureContext) {
    // Clipboard API：现代浏览器直接调用，简洁但需要 HTTPS
    navigator.clipboard.writeText(code);
} else {
    // 降级方案：使用传统 textarea + execCommand
    // 适合所有浏览器，特别是移动端

    // ① 创建临时 textarea（不可见）
    const textarea = document.createElement("textarea");
    textarea.value = code;              // 放入要复制的内容
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";    // 移出屏幕
    textarea.style.top = "-9999px";

    // ② 把 textarea 加到页面上
    document.body.appendChild(textarea);

    // ③ 选中内容（execCommand 必须配合选中操作）
    textarea.focus();
    textarea.select();

    // ④ 执行复制命令
    try {
        document.execCommand("copy");
    } catch (err) {
        console.warn("复制失败:", err);
    }

    // ⑤ 删除临时元素，清理 DOM
    document.body.removeChild(textarea);
}
```

### 核心问题解答

**Q: 为什么不直接检测"是否是移动端"？**

A: `window.isSecureContext` 检测的是**页面运行环境是否安全**（HTTPS 或 localhost），而不是设备类型。很多移动端浏览器要求安全上下文才给用 Clipboard API，而桌面浏览器只要是 HTTPS 就可用。所以用安全上下文判断比检测设备类型更准确、兼容性更好。

**Q: 为什么 textarea 要移出屏幕？**

A: 因为这个 textarea 只是用来触发复制命令的工具，不需要显示给用户看。把它移到屏幕外 (`left: -9999px`) 既不影响视觉，又能让浏览器正常执行选中操作。

**Q: 为什么最后要删除 textarea？**

A: 避免 DOM 污染。虽然元素不可见，但留在页面上会浪费内存，且可能影响页面布局或被屏幕阅读器读到。

---

## [2026-05-23] 支持 4 层目录 + MobileTOC 重构

**Commit ID**: b323cebdee8d599430e91d2fc6ca5c2531c9b160
**变更文件数**: 9
**主要需求**: 将 TOC 目录支持扩展到 4 层（H1-H4），并重构 MobileTOC 组件支持 Swup 页面切换

### 变更详情

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/config.ts | 修改 | toc.depth 从 2 改为 4 |
| src/types/config.ts | 修改 | depth 类型扩展支持 4 |
| src/components/widget/TOC.astro | 修改 | 添加 H4 样式 |
| src/components/widget/MobileTOC.astro | 修改 | 重构 + 添加 Swup 支持 |
| src/layouts/Layout.astro | 修改 | 添加 updateMobileTOC 逻辑 |
| src/pages/posts/[...slug].astro | 修改 | 传递 headings 到全局变量 |
| src/content/posts/前端/科普/前端框架svelte&astro_vs_vue&react.md | 修改 | 新增 SPA/MPA 知识点 |
| agents.md | 删除 | 迁移到 .agents 目录 |
| .agents/ | 新增 | 规范文档目录 |
| .cursor/ | 新增 | Cursor 配置目录 |

### 实现方式

- 提取 `levelStyles` 配置数组统一管理层级样式
- 通过 `data-toc-depth` 属性解决服务端/客户端配置共享问题
- 添加 `mobiletoc:update` 事件处理 Swup 页面切换后的目录更新
- 新增 `__CURRENT_HEADINGS__` 全局变量在页面间传递目录数据
- 重构 MobileTOC 模板逻辑，使用数组索引替代多层 if-else
- 新增 SPA vs MPA 知识点，解释 Astro 组件的服务端/客户端分离架构

### 涉及知识点

- Astro frontmatter（服务端）vs `<script>`（客户端）的区别
- SPA（单页面应用）与 MPA（多页面应用）的对比
- Web Component 的 `customElements.define()`
- `data-*` 属性在服务端/客户端通信中的应用
- `IntersectionObserver` 实现滚动监听
- Swup 页面切换与事件机制

---
