# Commit History

---

## [2026-05-23] 支持 4 层目录 + MobileTOC 重构

**Commit ID**: (提交后补充)
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
