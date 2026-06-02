# Commit History

---

## [2026-06-02] 扩展学习中心筛选与目标模式

**Commit ID**: f9caa7f9a7444d171656e19d4661d38c32319651
**变更文件数量**: 8
**主要目标**: 在学习中心补充分页、分类筛选和可用的目标模式，让文章进度从单篇记录扩展到“按目标组织多篇文章”。

### 变更清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/components/studyProgress/ArticleProgressList.svelte | 修改 | 移除临时 debug UI，增加分类筛选、分页和受控下拉菜单 |
| src/components/studyProgress/GoalPanel.svelte | 修改 | 实现目标创建、文章加入目标、完成率展示和目标删除 |
| src/components/studyProgress/StudyProgressApp.svelte | 修改 | 增加目标创建、目标文章关联、目标删除的状态处理 |
| src/components/studyProgress/StudyProgressDashboard.svelte | 修改 | 向目标面板传递文章、进度和目标操作回调 |
| src/lib/studyProgress/types.ts | 修改 | 增加目标文章、创建目标、添加目标文章和删除目标类型 |
| src/lib/studyProgress/adapters/supabase-study-progress-adapter.ts | 修改 | 增加 Supabase 目标读取、创建、关联文章和删除实现 |
| docs/studyProgress/schema.prisma | 修改 | 精简并同步目标相关表结构说明 |
| 知识库.md | 修改 | 更新当前已实现能力、未实现能力和艾宾浩斯复习模型后续方向 |

### 已实现成果

- 文章列表支持按博客现有 category 口径筛选，父分类会包含子分类。
- 文章列表改为每页 10 篇，避免一次性展开全部文章。
- 分类筛选使用自定义下拉菜单，控制菜单高度。
- 目标模式支持创建目标、给目标添加多篇文章、按文章当前进度计算目标完成率。
- 目标支持删除；删除目标不会删除博客文章，也不会删除文章当前进度。
- 记录了艾宾浩斯复习模型方向：后续应单独设计复习计划和复习记录，不把它和当前文章进度混在同一字段里。

### 提交前检查

- `pnpm check`：通过，保留既有提示。

---

## [2026-06-01] 新增博客学习进度中心

**Commit ID**: a9c8bd4796325eaabbb4988182115beb0dfe90b7
**变更文件数量**: 20
**主要目标**: 在个人博客中新增一个可登录的私人学习中心，验证文章索引、Supabase 云端进度同步和手动进度记录闭环。

### 变更清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/pages/studyProgress.astro | 新增 | 新增学习进度中心页面 |
| src/pages/about.astro | 修改 | 在 About 页面增加学习进度入口 |
| src/components/studyProgress/* | 新增 | 新增登录、仪表盘、文章进度列表和目标占位组件 |
| src/lib/studyProgress/* | 新增 | 新增文章索引、Supabase 客户端、数据访问 API 和适配器 |
| docs/studyProgress/schema.prisma | 新增 | 以 Prisma 风格伪代码记录 Supabase 表结构 |
| docs/studyProgress/supabase-schema.sql | 新增 | 记录 Supabase SQL 建表和 RLS 策略 |
| docs/studyProgress/setup.md | 新增 | 记录 Supabase 环境变量和验证步骤 |
| .env.example | 新增 | 提供前端公开 Supabase 配置模板 |
| package.json / pnpm-lock.yaml | 修改 | 新增 @supabase/supabase-js 依赖 |

### 已实现成果

- 新增 `/studyProgress/` 私人学习中心页面。
- 支持通过 Supabase Auth 密码登录。
- 从博客内容集合生成文章索引。
- 支持 0%、25%、50%、75%、100% 手动保存文章进度。
- 进度写入 `study_progress`，进度变化日志写入 `study_events`。
- 使用 Supabase RLS 限制用户只能访问自己的学习数据。
- 修复了 Svelte 响应式匹配问题，前端可以正确展示数据库中的文章进度。
- 将 Prisma 风格 schema 放在 `docs/studyProgress/schema.prisma`，避免 Astro/Vite 构建时解析 `.prisma` 文件。

### 提交前检查

- `npx astro check`：通过，保留既有提示。
- `npx astro build`：通过，保留既有代码块语言警告。
- `npx biome ci ./src`：通过。

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
## [2026-06-02] 增加私密文章网页锁罩

**Commit ID**: (提交后补充)
**变更文件数量**: 10
**核心改动**: 为 Markdown 文章增加 `private: true` 标记能力，在网页端用 Supabase Auth 密码校验后解除正文遮罩，并同步更新项目知识库记录。

### 变更文件清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/content/config.ts | 修改 | 为 posts frontmatter schema 增加 `private` 字段 |
| src/pages/posts/[...slug].astro | 修改 | 识别私密文章并包裹锁罩、模糊正文 |
| src/components/PrivatePostGate.svelte | 新增 | 复用学习中心 Supabase 登录能力完成解锁 |
| src/components/PostCard.astro | 修改 | 私密文章显示锁图标并隐藏列表摘要 |
| src/components/PostPage.astro | 修改 | 将 `entry.data.private` 传给文章卡片 |
| src/components/misc/Markdown.astro | 修改 | 支持关闭 Pagefind 正文索引 |
| src/utils/content-utils.ts | 修改 | 外部文章合并数据补齐 `private: false` |
| src/content/posts/个人/护肤.md | 修改 | 标记为第一篇私密文章 |
| 知识库.md | 修改 | 记录私密文章锁罩阶段、限制与后续方向 |
| commit-history.md | 修改 | 增加本次提交总结 |

### 功能效果

- 文章 frontmatter 可通过 `private: true` 标记为私密文章。
- 私密文章正文默认被模糊遮罩覆盖，输入学习中心密码后解锁。
- 已登录学习中心的浏览器会复用 Supabase session，进入私密文章时自动解锁。
- 私密文章在列表页显示锁图标，摘要替换为私密提示。
- 私密文章正文不进入 Pagefind 正文索引，减少搜索摘要泄露。

### 剩余风险

- 该方案只是在网页端遮住内容，不是严格保密；公开仓库和静态产物仍可能暴露正文。
- 真正私密版需要后端或加密内容方案。

---
