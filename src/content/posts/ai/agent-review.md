---
title: agent-review
published: 2026-05-22
updated: 2026-05-22
description: '总结小公司使用 Coding Agent 的常见方式'
image: ''
tags: [Review]
category: 'AI'
draft: false
---

## 先说结论

小公司做 Coding Agent，通常不是一上来就自己手搓一个完整平台。

更常见的路线是：

```txt
先用现成工具提升日常开发效率
再把固定规则写进项目规范
然后在 CI/CD 里加自动检查和 AI Review
最后才考虑自己封装调度器或多 Agent 流程
```

如果只是日常写代码，小公司更倾向于直接用：

- Codex
- Claude Code
- Cursor

如果是业务流程，比如客服总结、报表生成、日志分析、工单处理，才更可能自己基于 OpenAI API、Anthropic API 或 LangGraph 做内部 Agent。

一句话：

```txt
写代码用现成的，跑流程包一层，做产品才深度自研。
```

---

## 为什么重点看小公司

大公司往往已经有自己的内部平台。

开发者可能只需要点一个按钮，或者在内部系统里把任务分配给 AI，就可以让平台自动创建分支、改代码、跑测试、开 PR。

这种做法对学习者的参考度不一定高，因为你看不到背后的平台，也不需要自己搭。

小公司的做法更适合参考，因为它们通常会更现实地考虑：

- 能不能马上用起来
- 能不能少造轮子
- 能不能先接入现成工具
- 成本是否可控
- 团队成员是否容易学会

所以小公司的路线一般不是：

```txt
先自研一整套 Agent 平台
```

而是：

```txt
先用 Codex / Claude Code / Cursor
再写 AGENTS.md / CLAUDE.md / Cursor Rules
再固定 QA Review Prompt
最后才考虑自动化脚本或 LangGraph
```

---

## 小公司常见落地方式

### 1. 直接用终端 Agent

这是最常见的方式。

开发者在项目目录里打开终端，让 AI 直接读代码、改文件、跑命令。

比如：

```bash
codex
```

然后告诉它：

```txt
请根据需求实现功能。
改完后运行：
pnpm biome ci ./src
pnpm astro check
pnpm astro build
```

这种方式的特点是：公司没有自己做 Agent 平台，而是直接使用成熟工具。

它适合：

- 改 bug
- 写页面
- 补测试
- 小范围重构
- 解释项目代码
- 生成文档

优点是马上能用。

缺点是质量依赖使用者的提示词、项目规则和最终检查。

---

### 2. 用项目规则约束 Agent

公司通常会在项目里放规则文件，例如：

```txt
AGENTS.md
CLAUDE.md
.cursor/rules
```

里面写清楚项目规范：

```txt
项目使用 pnpm
提交前必须跑 pnpm biome ci ./src
提交前必须跑 pnpm astro check
提交前必须跑 pnpm astro build
不要使用 any
不要使用 @ts-ignore
优先使用 ?. 和 ??
```

这样 Agent 进入项目后，就知道这个项目的开发要求。

这不算手搓 Agent 平台，更像是“驯化现成 Agent”。

投入小，收益快，所以小公司很喜欢这种方式。

---

## 提交前验收与 PR Review

这里要先区分两个概念：

- 提交前验收 review
- PR Review

它们都叫 review，但发生的时间和目标不一样。

---

## PR 的含义

PR 是 Pull Request 的缩写。

所以 PR 通常发生在代码已经 commit 之后。

完整流程一般是：

```txt
本地修改代码
  ↓
commit 提交到本地 Git
  ↓
push 推到远程分支
  ↓
创建 Pull Request
  ↓
别人 review
  ↓
通过后 merge 到主分支
```

PR Review 看的就是这个 Pull Request 里的代码变更。

它比较像团队里的“合并前审查”。

---

## 提交前验收 Review 怎么实现

你现在更关心的是这一种。

它发生在：

```txt
AI 刚改完代码
你还没有 commit
你想确认需求到底有没有真正完成
```

这个阶段的 QA 目标是判断：

```txt
当前未提交的改动，是否可以放心 commit？
```

它要看的材料一般有四类：

```txt
1. 原始需求
2. 当前 git diff
3. 检查命令结果
4. 页面或功能的实际运行结果
```

其中第四点很关键。

这时候只看 diff 不够，必须运行项目，用浏览器或测试脚本去验收。

---

### 提交前验收的自动化流程

整体流程可以这样设计：

```txt
用户给需求
  ↓
Coder Agent 改代码
  ↓
调度器等待 Coder 结束
  ↓
调度器读取 git diff
  ↓
调度器运行检查命令
  ↓
调度器启动本地项目
  ↓
Playwright 打开页面做验收
  ↓
QA Agent 根据需求、diff、检查结果、页面结果判断
  ↓
不通过：把 blocking issues 交回 Coder
  ↓
通过：标记 ready to commit
```

这里用到的工具可以是：

- `child_process`：执行命令
- `git diff`：获取未提交改动
- `pnpm biome ci ./src`：检查代码规范
- `pnpm astro check`：检查 Astro 和 TypeScript
- `pnpm astro build`：检查能否构建
- `Playwright`：打开浏览器验收页面
- OpenAI API / Anthropic API：让 QA Agent 判断需求完成度

---

### 提交前验收的最小代码思路

调度器先跑基础检查：

```ts
import { execSync } from "node:child_process"

function run(command: string) {
  return execSync(command, {
    encoding: "utf-8",
  })
}

const diff = run("git diff")
const checkResult = run(`
  pnpm biome ci ./src
  pnpm astro check
  pnpm astro build
`)
```

然后用 Playwright 获取页面运行证据：

```ts
import { chromium } from "playwright"

async function runBrowserCheck() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const consoleErrors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text())
    }
  })

  await page.goto("http://localhost:3000")

  const bodyText = await page.textContent("body")
  const title = await page.title()

  await browser.close()

  return {
    title,
    bodyText,
    consoleErrors,
  }
}
```

最后把材料交给 QA Agent：

```ts
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const browserResult = await runBrowserCheck()

const result = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "user",
      content: `
你是 Pre-commit QA Agent。
你只负责判断当前未提交的改动是否真正完成需求，不负责修改代码。

【原始需求】
${requirement}

【当前 git diff】
${diff}

【检查命令结果】
${checkResult}

【浏览器验收结果】
${JSON.stringify(browserResult)}

请重点判断：
1. 需求是否完整实现
2. 页面或交互是否真的可用
3. 是否只是表面改动，没有解决真实问题
4. 是否有明显边界情况遗漏
5. 是否可以放心 commit

请只输出 JSON：
{
  "pass": true,
  "requirementDone": true,
  "blockingIssues": [],
  "manualCheck": [],
  "reason": "通过或不通过的原因"
}
`,
    },
  ],
})
```

调度器拿到结果后判断：

```ts
const review = JSON.parse(result.choices[0]?.message?.content ?? "{}")

if (review.pass) {
  console.log("READY_TO_COMMIT")
} else {
  console.log("CHANGES_REQUIRED")
  console.log(review.blockingIssues)
}
```

这就是提交前验收 review 的核心。

它不是看“代码写得优不优雅”，而是看：

```txt
需求到底有没有完成，现在能不能提交。
```

---

## PR Review 怎么实现

PR Review 发生在代码已经提交并创建 PR 之后。

它的目标更偏向：

- 代码质量
- 类型问题
- 测试是否通过
- 是否有明显 bug
- 是否符合团队规范
- 是否有合并风险

自动化 PR Review 通常放在 CI/CD 里。

流程是：

```txt
开发者创建 PR
  ↓
GitHub Actions 被 pull_request 事件触发
  ↓
CI 跑 lint / typecheck / test / build
  ↓
脚本获取 PR diff
  ↓
调用 OpenAI API 或 Anthropic API
  ↓
AI 在 PR 里输出 review 意见
```

一个简化版脚本是：

```ts
import { execSync } from "node:child_process"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function run(command: string) {
  return execSync(command, {
    encoding: "utf-8",
  })
}

const diff = run("git diff origin/main...HEAD")
const checkResult = run(`
  pnpm biome ci ./src
  pnpm astro check
  pnpm astro build
`)

const result = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    {
      role: "user",
      content: `
你是 PR Review Agent。

请 review 这次 Pull Request，重点看：
1. 是否有潜在 bug
2. 是否有类型或边界问题
3. 是否符合项目规范
4. 是否需要补测试
5. 是否有合并风险

PR diff：
${diff}

CI 检查结果：
${checkResult}

请输出：
- 结论：APPROVED 或 CHANGES_REQUIRED
- 必须修改
- 建议修改
- 原因
`,
    },
  ],
})

console.log(result.choices[0]?.message?.content ?? "")
```

如果要接入 GitHub Actions，通常会有一个 workflow：

```yaml
name: AI PR Review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm biome ci ./src
      - run: pnpm astro check
      - run: node scripts/ai-pr-review.js
```

真实项目里还会把 AI 输出发回 PR 评论区。

这一步可以用：

- GitHub REST API
- GitHub CLI
- GitHub Actions bot token

---

## 两种 Review 的核心区别

| 类型 | 发生时间 | 主要目标 | 关键材料 |
| --- | --- | --- | --- |
| 提交前验收 Review | commit 之前 | 判断需求是否真的完成 | 原始需求、未提交 diff、页面运行结果、检查结果 |
| PR Review | 创建 PR 之后 | 判断能不能合并 | PR diff、CI 结果、测试结果、团队规范 |

简单说：

```txt
提交前验收：看需求完成没完成
PR Review：看代码能不能合并
```

---

## 一个 AI 写，另一个 AI 审

日常写代码时，一个比较实用的工作流是：

```txt
Coder Agent 负责实现
QA Agent 负责审查
QA 不通过就打回
Coder 根据反馈继续改
直到 QA 通过
```

这不是“一个 AI 控制另一个 AI”。

真正控制流程的是外层调度器，或者是人。



### 手动双 Agent

手动方式可以开两个对话或两个终端。

第一个是 Coder：

```txt
你是 Coder Agent，负责实现需求。

要求：
1. 只修改和需求相关的代码
2. 遵守项目 AGENTS.md
3. 修改后运行必要检查
4. 不要提交代码
5. 最后输出：
   - 改了哪些文件
   - 实现了什么
   - 运行了哪些检查
   - 是否还有风险
```

第二个是 Reviewer：

```txt
你是 QA Review Agent，只负责审查，不负责修改代码。

请根据用户需求、git diff、项目规范和检查结果判断是否可以通过。

审查重点：
1. 是否满足用户需求
2. 是否有明显 bug
3. 是否有边界情况遗漏
4. 是否有 TypeScript 类型风险
5. 是否符合 AGENTS.md
6. 是否通过必要检查
7. 是否有不必要的复杂实现

请输出：

结论：APPROVED 或 CHANGES_REQUIRED

必须修改：
- 没有则写“无”

建议修改：
- 没有则写“无”

原因：
用简短中文说明。
```

如果 Reviewer 输出：

```txt
CHANGES_REQUIRED
```

就把必须修改的问题交给 Coder：

```txt
QA 没有通过，必须修复以下问题：
...

请只修复这些问题，不要扩大改动范围。
修复后重新跑检查。
```

这个方式不需要自己开发平台，马上可以用。

但它有一个明显问题：两个独立对话默认不会互相通信。

它们之间的“对话”，其实是人在中间转发：

```txt
你 → Coder：请实现需求
Coder → 你：我改好了，这是变更总结
你 → QA：这是需求、git diff、检查结果，请审查
QA → 你：CHANGES_REQUIRED，这些必须改
你 → Coder：QA 要求修改这些问题
```

所以手动阶段，本质上是：

```txt
人当调度器
仓库当共享白板
git diff 当交接材料
```

---

## 自动化调度器怎么工作

如果不想人工转发，就需要一个调度器。

调度器不是另一个“更厉害的 AI”，它更像一个程序控制器。

它负责：

- 启动 Coder Agent
- 等 Coder Agent 完成
- 读取 `git diff`
- 运行检查命令
- 进行提交前验收
- 启动 QA Agent
- 读取 QA 的结构化结论
- 如果不通过，把问题交回 Coder
- 如果通过，允许 commit、创建 PR 或输出报告

整体流程是：

```txt
用户 / GitHub Issue / PR Comment
  ↓
Orchestrator 调度器
  ↓
创建 sandbox / worktree / branch
  ↓
Coder Agent 修改代码
  ↓
Tool Runner 跑命令
  ↓
QA Agent 验收需求 + 审查 diff + 检查结果
  ↓
判断是否通过
  ├── 不通过：反馈给 Coder
  └── 通过：允许 commit / 创建 PR / 输出报告
```

这里有一个关键点：

```txt
Coder 不需要主动联系 QA
QA 也不需要主动联系 Coder
它们都只和调度器交互
```

也就是说，不是两个 AI 在群聊里互相喊话。

更真实的结构是：

```txt
调度器是中介
代码仓库是共享白板
git diff 是交接材料
检查结果是证据
```

---

### 调度器要一直挂着吗

不一定。

常见有两种模式。

第一种是一次性任务型。

比如用户点了一个按钮：

```txt
请实现这个 issue
```

系统启动一个任务：

```txt
创建临时工作区
  ↓
调用 Coder Agent 改代码
  ↓
跑测试
  ↓
调用 QA Agent 审查
  ↓
不通过就再让 Coder 改
  ↓
通过后生成 PR 或报告
  ↓
任务结束
```

这个调度器只在任务执行期间运行。

任务结束后，它就退出。

这很像 CI/CD：

```txt
PR 创建时启动
跑完检查后结束
```

第二种是后台服务型。

如果公司有内部平台，比如网页上点“让 AI 修这个 bug”，那后端可能会常驻运行：

```txt
Web 服务
任务队列
Worker
数据库
日志系统
```

但真正执行某个 Agent 任务的 worker，通常也是：

```txt
接到任务 → 执行 → 结束或等待下一个任务
```

所以不是“两个 AI 一直挂着聊天”。

更准确地说：

```txt
调度系统常驻
单个 Agent 任务按需启动
```

---

### Coder 怎么告诉调度器自己写完了

自动化系统里，通常不是 Coder 像人一样说“我写完了”。

而是调度器等待某个动作结束。

如果用 API：

```ts
const coderResult = await coderAgent(requirement)
```

这个 `await` 结束，就代表 Coder 这一轮结束了。

也就是：

```txt
函数返回 = Coder 通知完成
```

如果用 CLI Agent，调度器可以把 Codex 或 Claude Code 当成一个命令行程序启动。

命令执行结束后，调度器拿到：

- 退出码
- 终端输出
- 工作区里的文件变化

这就表示 Coder 这一轮完成了。

然后调度器继续做下一步：

```bash
git diff
pnpm biome ci ./src
pnpm astro check
pnpm astro build
```

再把这些材料交给 QA Agent。

---

### QA 怎么打回 Coder

自动化里最好让 QA 输出结构化结果。

比如：

```json
{
  "pass": false,
  "blockingIssues": [
    "登录失败时没有恢复 loading 状态",
    "没有处理 password 为空的情况"
  ],
  "requirementDone": false,
  "reason": "当前实现没有覆盖需求中的失败场景"
}
```

调度器只需要判断 `pass`：

```ts
if (review.pass) {
  finish()
} else {
  sendFeedbackToCoder(review.blockingIssues)
}
```

为什么不要只让 QA 输出自然语言？

因为自然语言容易含糊：

```txt
整体还可以，但是有一些小问题。
```

程序很难判断这到底是通过还是不通过。

结构化输出更适合自动化。

如果是提交前验收，QA 的提示词要更偏向需求完成度，而不是只看代码质量。

可以这样写：

```txt
你是 Pre-commit QA Agent。
你只负责验收当前未提交的改动是否真正完成需求，不负责修改代码。

请基于：
1. 用户原始需求
2. 当前 git diff
3. 相关页面或功能的运行结果
4. lint / typecheck / build / test 结果

判断是否可以提交。

请重点检查：
1. 需求是否完整实现
2. 是否只是表面改动，没有解决真实问题
3. 关键交互流程是否跑通
4. 是否遗漏边界情况
5. 是否引入明显回归

请输出 JSON：
{
  "pass": true,
  "requirementDone": true,
  "blockingIssues": [],
  "needManualCheck": [],
  "reason": "通过或不通过的原因"
}
```

这里的 `pass` 不是“代码能不能合并”，而是：

```txt
现在是否可以放心 commit
```

---

### 最小调度器伪代码

一个最小自动化流程可以这样写：

```ts
async function runCodingQuest(requirement: string) {
  createBranch()

  let feedback = ""

  for (let round = 1; round <= 3; round++) {
    await runCoderAgent({
      requirement,
      feedback,
    })

    const diff = run("git diff")
    const checks = run(`
      pnpm biome ci ./src
      pnpm astro check
      pnpm astro build
    `)

    const review = await runQaAgent({
      requirement,
      diff,
      checks,
    })

    if (review.pass) {
      markReadyToCommit()
      return
    }

    feedback = review.blockingIssues.join("\n")
  }

  markNeedsHumanReview()
}
```

这里最重要的是：

```txt
Coder 不直接发消息给 QA
QA 也不直接发消息给 Coder
调度器负责传递需求、diff、检查结果和验收反馈
```

---

## 现代公司有没有这种自动化流程

有，但成熟程度分层。

### 第一层：AI PR Review Bot

这是最常见、最成熟的。

流程是：

```txt
开发者提交 PR
  ↓
CI 跑测试和构建
  ↓
AI 读取 git diff
  ↓
AI 在 PR 里评论问题
  ↓
开发者自己改
```

这个阶段 AI 通常不自动改代码，只负责审查。

它比较安全，所以更容易被公司接受。

---

### 第二层：AI 自动修 PR 问题

更进一步：

```txt
PR 检查失败
  ↓
AI 读取失败日志
  ↓
AI 尝试修改代码
  ↓
再次提交 commit
  ↓
CI 重新跑
```

这个已经是“Coder + 自动检查”的形态。

但很多公司会限制它只能改某些文件，或者必须人审核后才能合并。

---

### 第三层：Issue → AI 实现 → AI Review → PR

这是更完整的流程。

```txt
用户创建 issue
  ↓
调度器创建临时分支/工作区
  ↓
Coder Agent 实现
  ↓
跑 lint / typecheck / test / build
  ↓
QA Agent review
  ↓
不通过则打回 Coder
  ↓
通过后创建 PR
  ↓
人类最终 review / merge
```

这种流程现在也有公司在做，但一般会加很多限制：

- 最多循环几轮
- 必须有测试通过
- 高风险文件不能自动改
- 生成 PR 后必须人审
- 不能直接推主分支
- 日志要完整记录

---

### 第四层：内部 Agent 平台

大公司或 AI 成熟的小团队可能会做成内部平台：

```txt
任务队列
沙箱环境
GitHub / GitLab 集成
权限系统
日志系统
成本统计
多 Agent 流程
人工审批节点
```

用户看到的可能只是一个按钮：

```txt
Assign to AI
```

背后其实就是调度器在跑。

---

## LangGraph 是做什么的

LangGraph 不是专门写代码的工具。

它主要用来做 Agent 流程编排。

也就是当一个任务需要多个步骤、多个角色、多个判断分支时，LangGraph 可以把这些步骤组织成一张流程图。

比如：

```txt
用户输入需求
  ↓
需求分析 Agent
  ↓
开发 Agent
  ↓
QA Agent
  ↓
是否通过？
  ├── 通过：结束
  └── 不通过：回到开发 Agent 修改
```

如果流程很简单，直接写一个 `while` 循环就够了。

但如果流程变复杂，例如：

```txt
需求分析 Agent
架构 Agent
开发 Agent
测试 Agent
QA Agent
安全 Agent
文档 Agent
人工确认节点
失败重试
最多循环 3 次
```

这时候手写流程会越来越乱。

LangGraph 解决的就是：

- 管理多个 Agent
- 管理任务状态
- 管理条件分支
- 管理循环重试
- 管理什么时候结束

所以它更像：

```txt
Agent 版流程图引擎
```

它可以用于 Coding Agent，但不只用于写代码。

---

## 推荐学习顺序

如果主要目标是日常写代码，不建议一开始就学 LangGraph。

更适合的顺序是：

```txt
1. 先熟悉 Codex / Claude Code 这类终端 Agent
2. 学会写项目规则文件，例如 AGENTS.md
3. 学会用一个 Agent 写代码，另一个 Agent 审查
4. 学会固定 QA Review Prompt
5. 学会用 Node.js 读取 git diff
6. 学会调用 OpenAI API 或 Anthropic API 做 AI Review
7. 学会写一个最小调度器，让 Coder 和 QA 自动交接
8. 最后再看 LangGraph 或 AutoGen
```

现在最值得先练的是第三步和第七步之间的衔接：

```txt
先理解 Coder / QA 的分工
再理解调度器怎么自动传递 diff、检查结果和 QA 反馈
```

因为你的核心需求不是一开始就做一个复杂平台，而是：

```txt
让写代码和审代码分离
让 QA 有否决权
让通过标准固定下来
让调度器自动把失败原因交回 Coder
```

---

## 面试表达

可以这样说：

```txt
小团队通常不会一开始自研完整 Agent 框架。
如果是编码场景，会优先使用 Codex、Claude Code、Cursor 这类成熟工具，
再通过 AGENTS.md、CI 脚本、PR Review 流程把它接入团队规范。

AI Review 不是替代 linter。
Biome、TypeScript、测试和构建负责确定性检查；
AI Reviewer 读取需求、git diff 和检查结果，判断实现是否符合需求、有没有边界问题。

如果要做自动化多 Agent，可以让 Coder Agent 负责实现，
QA Agent 只负责审查，并要求 QA 输出结构化结果，例如 pass、blockingIssues、reason。
调度器负责读取 diff、运行检查、把 QA 反馈交回 Coder。
简单流程用脚本就够了；复杂流程再考虑 LangGraph 这种状态图工具编排。
```

---

## 记忆口诀

```txt
Linter 查规矩，测试查结果，AI Review 查思路；
一个负责写，一个负责拦。
```

再记一句：

```txt
现代 Agent 流程不是 AI 互聊，而是调度器拿着 diff 和检查结果来回传。
```
