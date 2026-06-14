# Commit History

## [2026-06-10] 整理全部文章的分类

**Commit ID**: `b1d5c9c068b48535e6f514a414b82b9965141081`
**变更文件数**: 388
**主要需求**: 对仓库中的历史文章做一次系统性分类整理，把散落在旧目录下的文章迁移到更清晰的分类结构中，同时同步迁移配套图片资源与修正文内引用，减少后续维护时的目录混乱。

### 变更详情
|| 文件 | 变更类型 | 说明 |
||-----|---------|------|
|| src/content/posts/教程文章/** | 重命名 | 将教程类文章整体迁移到新的个人/教程文章分类下 |
|| src/content/posts/后端/编程语言/** | 重命名 | 将语言相关历史文章收拢到更明确的后端编程语言目录 |
|| src/content/posts/基本功/数据结构/** | 新增/重命名 | 为数据结构文章创建独立目录，并补齐配套 `assets` 图片资源 |
|| src/content/posts/工程基础/** | 重命名 | 将工程基础相关文章从旧目录迁移到统一分类路径 |
|| src/content/posts/基本功/网络/** | 重命名 | 将网络主题文章与资源移动到更明确的网络分类目录 |
|| src/content/posts/基本功/算法/*.md | 修改 | 调整算法文章中的局部路径或分类引用，适配新的目录结构 |
|| commit-history.md | 修改 | 在顶部插入本次文章分类整理摘要 |
|| .agents/MODES.md | 修改 | 同步补充本地模式说明与提交约定变更 |

### 实现方式
- 以“主题归类优先”而不是“历史来源优先”的原则重组文章目录，降低后续查找与继续扩展时的心智负担。
- 对涉及图片依赖的文章同步迁移 `assets` 资源，避免只移动 Markdown 导致引用断裂。
- 对少量仍依赖旧路径的文章正文进行同步修正，保证迁移后的静态构建结果可用。
- 保持这次提交聚焦在内容目录整理，不和前面的侧边栏组件改动混在同一个 commit 中。

---

## [2026-06-10] 优化首页标签与分类侧边栏

**Commit ID**: `098a5e669f029d4705ceb70b673340fc6384eb44`
**变更文件数**: 4
**主要需求**: 调整首页 tags 组件的折叠与展开体验，避免展开后无限拉长；同时修正分类树每一层的排序规则，让非叶子节点排在前面、叶子节点排在后面。

### 变更详情
|| 文件 | 变更类型 | 说明 |
||-----|---------|------|
|| src/components/widget/WidgetLayout.astro | 修改 | 为侧边栏通用容器新增展开后最大高度与内部滚动能力 |
|| src/components/widget/Tags.astro | 修改 | 提高 tags 折叠与展开高度，并接入滚动容器能力 |
|| src/components/widget/Categories.astro | 修改 | 修正分类树根层与子层排序，统一先渲染非叶子节点再渲染叶子节点 |
|| commit-history.md | 修改 | 在顶部插入本次提交摘要 |

### 实现方式
- 在 `WidgetLayout` 中抽象 `maxExpandedHeight`，让 widget 展开后仍保持受控高度，并通过内部滚动承载超长内容。
- 将 tags 的高度参数集中在组件常量中调整，避免把视觉尺寸散落在 class 或脚本里。
- 将分类树排序逻辑收敛到递归入口，使每一层都复用同一套“父节点在前、叶子节点在后”的规则。
- 保持改动范围只落在侧边栏相关组件，不把仓库里其它内容整理变更混入本次提交。

---

---

## [2026-06-10] 新增面试图片同步脚本

**Commit ID**: `37e80cb00a0617efa97d1c00adb81f3af1ef98d5`
**变更文件数**: 3
**主要需求**: 新增一个脚本，把面试目录 Markdown 中引用的本地图片统一复制到 `assets` 目录，并自动把文内引用重写成仓库内相对路径，同时补充 npm 脚本入口，方便后续批量整理图片资产。

### 变更详情
|| 文件 | 变更类型 | 说明 |
||-----|---------|------|
|| scripts/sync-interview-images.mjs | 新增 | 扫描面试目录 Markdown，复制缺失图片到 `assets`，并重写 Typora / 本地绝对路径引用 |
|| package.json | 修改 | 新增 `sync-interview-images` 脚本命令，方便直接执行图片同步 |
|| commit-history.md | 修改 | 在顶部插入本次脚本提交摘要 |

### 实现方式
- 默认扫描 `src/content/posts/业务/面试` 目录下全部 Markdown 文件。
- 同时识别 Markdown 图片语法和 HTML `img` 标签中的 `src`。
- 默认从 Typora 图片目录读取源文件，也支持通过命令行参数传入自定义图片源目录。
- 通过 `package.json` 暴露统一脚本入口，避免每次手敲文件路径。
- 对已存在于 `assets` 的图片只重写引用，不重复复制。
- 最终输出 JSON 摘要，列出复制结果、被重写的 Markdown 文件和缺失图片。

---

## [2026-06-06] 增加文章阅读进度悬浮保存

**Commit ID**: `75c080c`
**变更文件数量**: 3
**核心改动**: 在文章详情页增加阅读进度悬浮按钮，按正文滚动位置计算百分比，并复用学习中心登录与 Supabase 进度保存能力。

### 变更文件清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/components/ArticleProgressSaver.svelte | 新增 | 计算阅读百分比、处理登录并保存进度 |
| src/pages/posts/[...slug].astro | 修改 | 生成文章元数据并挂载悬浮进度组件 |
| src/layouts/MainGridLayout.astro | 修改 | 增加 `floating` 插槽，避免悬浮控件被内容容器裁剪 |

### 功能效果

- 阅读文章时，右下角实时显示当前正文阅读百分比。
- 页面顶部显示 `0%`，滚动到正文末端显示 `100%`。
- 点击按钮后，已登录用户直接保存；未登录用户输入学习中心密码后保存。
- 保存继续复用现有 `study_progress` 和 `study_events` 数据结构。

### 验证结果

- 本地浏览器验证按钮可见、滚动百分比变化、登录面板正常打开。
- 浏览器控制台无警告或错误。
- Frontmatter Check、Astro Check、Astro Build、Biome CI 全部通过。

### 后续事项

- 设计独立的复习记录与艾宾浩斯到期模型。
- 评估是否增加可配置的自动保存策略，同时避免滚动时频繁写入数据库。

---

## [2026-06-09] 调整移动端悬浮按钮

**Commit ID**: `abeab0bc931a82e1f4783dcf33b0dd28b6df7af7`
**变更文件数量**: 5
**核心改动**: 为文章页移动端悬浮控件增加统一开关，缩小保存按钮与返回顶部按钮尺寸，并更新知识库文档说明当前学习系统状态。

### 变更文件清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/components/ArticleProgressSaver.svelte | 修改 | 缩小移动端保存按钮尺寸并调整底部间距与文案字号 |
| src/components/control/BackToTop.astro | 修改 | 允许移动端显示返回顶部按钮，并单独调整按钮尺寸与位置 |
| src/components/control/MobileFloatingToggle.astro | 新增 | 新增移动端悬浮按钮总开关，统一控制显示与收起状态 |
| src/layouts/MainGridLayout.astro | 修改 | 在文章页挂载移动端悬浮按钮开关组件 |
| 知识库.md | 修改 | 重构学习系统说明，补充当前状态、边界和 RAG 规划 |

### 功能效果

- 移动端文章页默认收起返回顶部和阅读进度按钮，避免遮挡正文。
- 用户可通过右侧悬浮开关统一展开或收起这组控件。
- 展开后返回顶部和阅读进度按钮在移动端使用更紧凑的尺寸与间距。
- 知识库文档同步更新为当前学习系统、问答规划和后续路线说明。

### 验证结果

- `npx astro check`：通过，保留既有 hints。
- `npx astro build`：通过，保留既有 `astro-expressive-code` 语言 warning。
- `npx biome ci ./src`：提交前由 pre-commit 再次校验。

---

## [2026-06-05] 支持学习进度本地 Supabase 配置

**Commit ID**: c68b940
**变更文件数量**: 5
**主要目标**: 在静态部署环境没有 Supabase env 时，仍然显示学习进度入口，并允许用户把 Supabase 配置粘贴到浏览器本地保存后继续使用。

### 变更清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/lib/studyProgress/supabase-client.ts | 修改 | 增加本地配置解析、保存、清除和读取逻辑，优先使用 env，缺失时回退到 localStorage |
| src/lib/studyProgress/adapters/supabase-study-progress-adapter.ts | 修改 | Supabase client 和 owner email 改为运行时读取，支持本地配置 |
| src/components/studyProgress/StudyProgressApp.svelte | 修改 | 增加保存/清除本地配置后的 API 重建流程 |
| src/components/studyProgress/StudyProgressLogin.svelte | 修改 | 在缺少配置时显示粘贴配置面板 |
| src/pages/studyProgress.astro | 修改 | 取消构建期隐藏页面，始终挂载学习进度应用 |

### 已实现成果

- GitHub Pages / Actions 没有 Supabase env 时，静态构建不再失败。
- `/studyProgress/` 页面仍然可访问，并能提示用户粘贴本地 Supabase 配置。
- 配置只保存到当前浏览器 `localStorage`，不写入仓库。
- 已粘贴配置后会重新初始化学习进度 API，继续走 Supabase 登录和数据同步。

### 提交前检查

- `pnpm check`：通过，保留既有 `document.execCommand` 和 `_cssVar` hint。
- 无 Supabase env 的 `pnpm build`：通过，保留既有 `astro-expressive-code` 语言高亮 warning。
- `.husky/pre-commit.cjs`：通过。

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

**Commit ID**: `494788bbc832883aae39f08a197e17ff79452d34`
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
## [2026-06-05] 兼容无 Supabase 环境的静态构建

**Commit ID**: `8a93ba36954cb58e694ab93b696e31070471ea54`
**变更文件数量**: 4
**主要目标**: 让学习进度页在缺少 Supabase 公开环境变量时自动降级，避免 GitHub Pages 静态构建因为私有运行时配置缺失而失败。

### 变更清单

| 文件 | 变更类型 | 说明 |
|-----|---------|------|
| src/lib/studyProgress/study-progress-api.ts | 修改 | 增加 Supabase 环境变量检测并在未配置时阻止创建 API |
| src/pages/studyProgress.astro | 修改 | 根据环境变量决定渲染学习进度应用或降级提示 |
| 知识库.md | 修改 | 补充静态部署下学习进度功能的构建降级策略 |
| commit-history.md | 修改 | 追加本次构建兼容性提交摘要 |

### 已实现成果

- 构建阶段不再因为缺少 `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_PUBLISHABLE_KEY` 而直接抛错。
- `/studyProgress/` 页面在未配置 Supabase 时会显示降级提示，而不是让整站构建失败。
- 保留已配置环境下的学习进度能力，不影响正常登录和 Supabase 数据读写路径。
- GitHub Actions 这类没有私有运行时环境变量的静态构建场景可以继续产出站点。

### 提交前检查

- `pnpm build`：通过，保留既有 `astro-expressive-code` 语言高亮 warning。

---

**Commit ID**: `67817fd855fb9bc6b0e6f47e5014aa1d0366bc39`
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
