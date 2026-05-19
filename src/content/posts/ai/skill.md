---
title: Skill 入门：从理解到安装
published: 2026-05-15
updated: 2026-05-16
description: '记录 Codex Skill 的概念、文件结构、触发方式、安装命令和常见问题。'
image: ''
tags: [AI, Codex, Skill]
category: 'ai'
draft: false
---
## 1. Skill 到底是什么？

把一套你经常让 AI 重复执行的工作流程，封装成一个“可复用技能包”。是一份专门写给 AI 的操作手册、

比如你每次都对 Codex 说：

> 帮我按 Vue3 组合式 API + Element Plus + Tailwind 风格写页面；布局尽量用 div + flex；`el-input` 没特殊需求就用自闭合；完成后检查样式和代码结构。

如果每次都复制这段话，会很麻烦。

这时就可以把它做成一个 skill。以后你只要说：

```txt
用我的 vue-page-builder skill 帮我写这个页面
```

Codex 就会按这套固定规则来做。


------

## 2. Skill 解决什么问题？

Skill 主要解决三个问题。

第一，减少重复提示词。你不用每次都把同一套要求重新说一遍。

第二，让 AI 的输出更稳定。比如你希望页面结构、代码风格、解释方式都保持一致，就可以写进 skill。

第三，把经验沉淀下来。你平时总结出来的“好写法”“避坑规则”“检查清单”，都可以放进 skill，之后反复使用。

适合做成 skill 的任务一般有这些特点：

```txt
经常重复
流程固定
有明确规则
希望 AI 每次都按同一种方式处理
```

不太适合做成 skill 的，是那种只会做一次、规则还没想清楚的临时任务。

------

## 3. Skill、AGENTS.md、Plugin、MCP 有什么区别？

这几个概念很容易混，先用一张表分开。

| 东西 | 适合放什么 | 例子 |
| --- | --- | --- |
| `prompt` | 本次对话的临时要求 | “帮我解释这段代码” |
| `AGENTS.md` | 当前项目长期遵守的规则 | 启动命令、测试命令、代码规范 |
| `skill` | 某类可复用任务流程 | 写 Vue 页面、做代码审查、写学习笔记 |
| `plugin` | 可安装的能力包 | 把 skill、工具、MCP 打包给别人安装 |
| `MCP` | 连接外部工具或系统 | GitHub、Figma、Slack、内部文档 |

可以这样记：

```txt
prompt：临时交代
AGENTS.md：项目规矩
skill：可复用做事方法
plugin：可安装能力包
MCP：连接外部工具
```

它们不是互相替代，而是分工不同。

比如你的博客项目里，Node 版本、pnpm、构建命令这些长期规则，应该放在 `AGENTS.md`。

但“以后给我讲概念时，先用大白话，再讲解决什么问题，最后给记忆口诀”这种个人学习偏好，就很适合做成 skill。

------

## 4. Skill 里面一般有什么？

一个 skill 本质上通常是一个文件夹，里面至少要有一个 `SKILL.md`。

常见结构是：

```txt
my-skill/
  SKILL.md        必须：技能说明和具体规则
  scripts/        可选：辅助脚本
  references/     可选：参考资料
  assets/         可选：模板、图片、示例文件
```

最核心的是 `SKILL.md`。

一个最小版可以这样写：

```md
---
name: vue3-element-plus-page
description: 当用户需要生成 Vue3 + Element Plus 后台页面，包括查询表单、表格、分页、新增编辑弹窗时使用。
---

你是一个前端开发助手。

生成页面时遵守：

1. 使用 Vue3 组合式 API。
2. 使用 Element Plus。
3. 布局优先使用 div + flex。
4. 样式优先使用 TailwindCSS 或当前项目已有样式。
5. el-input、el-table-column 没有特殊插槽时尽量使用自闭合写法。
6. API 方法不要全部堆在页面里，能拆就拆。
7. 代码要适合初级前端理解，必要位置加简短注释。
```

这里有两个重点。

`name` 是 skill 的名字。你以后可以用它来点名调用。

`description` 是触发条件。Codex 会根据它判断什么时候应该加载这个 skill。

------

## 5. Skill 怎么被触发？

Skill 有两种触发方式。

第一种是你明确点名：

```txt
用 $vue3-element-plus-page 帮我生成就餐对象管理页面
```

第二种是你不点名，只描述任务，让 Codex 根据 `description` 自动判断：

```txt
帮我写一个 Vue3 + Element Plus 的后台 CRUD 页面
```

所以 `description` 不要写得太虚。

不太好：

```md
description: 帮助我写代码
```

比较好：

```md
description: 当用户需要创建 Vue3 + Element Plus 后台管理页面，包括查询表单、表格、分页、新增编辑弹窗时使用。
```

一句话：

```txt
description 是 skill 的触发条件。
```

------

## 6. 你最适合先做哪些 Skill？

结合你平时的学习和开发习惯，可以先做这三类。

**Vue3 后台页面 Skill**

你经常写后台系统里的表单、表格、弹窗、查询、导出页面。

可以做一个：

```txt
vue-admin-crud-skill
```

里面规定：

```txt
- 查询区怎么写
- 表格怎么写
- 新增/编辑弹窗怎么写
- Element Plus 组件怎么用
- Tailwind 或 flex 布局规则
- API 方法怎么拆
- 字段注释怎么补
```

这个对日常开发最实用。

**学习讲解 Skill**

你经常让 AI 讲 Nest、Express、Prisma、Node、Vue，而且希望讲得像给初学者解释。

可以做一个：

```txt
beginner-explain-skill
```

里面写：

```txt
讲解技术概念时：
1. 先用一句大白话解释。
2. 说明它解决什么问题。
3. 先讲整体用法，再进入代码。
4. 每段代码都解释为什么这么写。
5. 顺带解释相关语法。
6. 最后给一句记忆口诀。
```

这样以后你问 `provider`、`module`、`service`，Codex 就会更稳定地按你喜欢的方式讲。

**项目代码审查 Skill**

比如：

```txt
frontend-review-skill
```

让 Codex 每次帮你检查：

```txt
- Vue 组件结构是否清晰
- API 是否混在页面里
- 表单字段命名是否清楚
- Element Plus 写法是否合理
- 是否有重复代码
- 是否有容易出 bug 的异步逻辑
```

这类 skill 的价值在于，它能把“我每次都想检查的点”固定下来。

------

## 7. Skill 怎么安装、放哪里？

安装 skill 先抓住一句话：

```txt
把带 SKILL.md 的文件夹，放到 Codex 能识别的 skills 目录里。
```

在 Windows 上，Codex 的用户级 skill 目录一般是：

```txt
C:\Users\你的用户名\.codex\skills
```

它不是装到项目目录 `F:\zz_blog\astro-boke` 里，而是装到 Codex 的全局目录里。

------

## 8. 用安装脚本安装 GitHub 上的 Skill

这次用npx的命令下载一直失败，就用了python格式的下载脚本去下载

这次成功使用的是 Codex 自带的安装脚本：

```powershell
python "C:\Users\XChi\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" --repo ConardLi/garden-skills --path skills/web-video-presentation skills/web-design-engineer skills/gpt-image-2 skills/kb-retriever
```

这条命令看起来长，但其实可以拆成三段。

```txt
python "安装脚本路径"    打开 Codex 自带的 skill 安装器
--repo 作者/仓库名       告诉它去哪个 GitHub 仓库找
--path skill目录         告诉它仓库里的哪些目录是 skill
```

以后套用模板就是：

```powershell
python "C:\Users\你的用户名\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" --repo 作者/仓库名 --path 仓库里的skill目录
```

如果一次安装多个 skill，就把多个目录继续写在 `--path` 后面：

```powershell
python "安装脚本路径" --repo 作者/仓库名 --path skill目录1 skill目录2 skill目录3
```

注意：`--path` 后面写的是**仓库内部路径**，不是你电脑上的本地路径。

比如：

```txt
skills/gpt-image-2
```

意思是 GitHub 仓库里面的 `skills/gpt-image-2` 目录。这个目录里通常要有 `SKILL.md`，否则不能被当成 skill 安装。

------

## 9. 为什么 `npx skills add` 可能失败？

有些教程会写：

```powershell
npx skills add ConardLi/garden-skills
```

这条命令不是直接安装 skill，而是先通过 `npm/npx` 下载一个安装工具。下载过程中，npm 会读写自己的缓存目录。

如果看到类似错误：

```txt
EPERM: operation not permitted
npm-cache\_cacache\tmp\...
```

通常说明它卡在 npm 缓存文件操作上了。常见原因有：

```txt
缓存目录权限异常
临时文件被占用
杀毒软件或系统防护正在扫描
Windows 对某些临时文件操作比较敏感
```

这种时候不一定是仓库有问题，也不一定是网络有问题。

更准确地说：`npx` 可能还没走到真正安装 skill 的步骤，就先卡在 npm 缓存了。

所以可以改用 Codex 自带的 Python 安装脚本，因为它绕过了 `npx/npm cache` 这一层。

------

## 10. 怎么判断安装成功？

用 PowerShell 查看 Codex 的 skills 目录：

```powershell
Get-ChildItem C:\Users\XChi\.codex\skills
```

如果只看到：

```txt
.system
```

说明还没有安装额外的 skill。

如果能看到类似：

```txt
gpt-image-2
kb-retriever
web-design-engineer
web-video-presentation
```

说明 skill 文件夹已经装进去了。

还可以继续检查某个 skill 里面有没有 `SKILL.md`：

```powershell
Get-ChildItem C:\Users\XChi\.codex\skills\gpt-image-2
```

安装成功后最好重启 Codex，让它重新读取 skills 目录。

------

## 11. 安装后怎么调用？

进入 Codex 后，可以查看 skill：

```txt
/skills
```

点名调用某个 skill：

```txt
$vue-admin-crud 帮我生成一个就餐对象管理页面
```

也可以不点名，直接描述任务，让 Codex 根据 `description` 自动判断：

```txt
帮我生成一个 Vue3 + Element Plus 的后台 CRUD 页面
```

如果是 plugin，可以进入：

```txt
/plugins
```

这里要再强调一次：

```txt
/skills   看 skill
/plugins  看 plugin
$xxx      通常是点名调用某个 skill
```

------

## 12. 最后怎么学？

别一上来研究很复杂的 plugin / MCP。更顺的学习路线是：

```txt
第一步：先理解 prompt
第二步：理解 AGENTS.md
第三步：理解 skill
第四步：再看 plugin / MCP
```

你现在真正该练的是：**怎么把一个 skill 写清楚**。

安装只是把文件放到正确位置，真正决定好不好用的是 `SKILL.md` 里面的规则是否具体。

最后记一句：

```txt
skill 装到 .codex\skills，路径里有 SKILL.md 才算真 skill。
```

参考：

- [OpenAI Developers - Codex](https://developers.openai.com/codex/use-cases/)
