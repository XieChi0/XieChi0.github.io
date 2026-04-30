# 环境要求

- **Node.js**: 22.x 或 23.x
- **pnpm**: 最新版本

> ⚠️ 请确保本地使用 Node.js 22 或 23 版本，以与 CI/CD 环境保持一致。

---

# git推送

## 一、推送到指定远程仓库（推荐）

使用 `git push` 命令时，**加上远程名和分支名**，例如：

```
bash
git push astro-boke main
```

> 表示将当前 `main` 分支推送到 `astro-boke` 这个远程仓库。

## 二、临时设置默认推送目标

你也可以先设置默认的上游分支，让之后的 `git push` 不用每次指定：

```
bash
git branch --set-upstream-to=astro-boke/main
```

或者直接：

```
bash
git push -u astro-boke main
```

这样以后只需要输入 `git push` 就会自动推送到 `astro-boke` 仓库了。

## 三、如果git push推送失败，该怎么做
首先确保你在powershell环境下，执行```ssh -T git@github.com```
然后再git push

---

## CI/CD 自动化（GitHub Actions）

### 触发原理

当你 `git push` 到 GitHub 的 `main` 分支时，GitHub 服务器会通过 **Webhook** 自动检测到这个事件，然后触发配置的 Actions 工作流。整个过程完全自动，无需手动配置。

### 工作流说明

项目配置了以下自动化流程，文件位于 `.github` 目录：

#### 1. `workflows/build.yml` — 构建与检查

**触发条件**：`push` 或 `pull_request` 到 `main` 分支时自动运行。

包含两个 Job：

| Job | 命令 | 作用 |
|-----|------|------|
| **check** | `pnpm astro check` | 检查 Astro 项目的类型和语法错误 |
| **build** | `pnpm astro build` | 构建生产环境站点 |

两者都使用 **Node.js 22 和 23** 进行测试矩阵，确保在两个版本下都能正常工作。

#### 2. `workflows/biome.yml` — 代码质量检查

**触发条件**：同上，推送到 `main` 或 PR 时运行。

使用 **Biome**（一个现代化的前端工具链）对 `./src` 目录进行：
- 代码格式检查（Formatter）
- Lint 代码风格检查

Biome 是集成了 ESLint + Prettier 功能的一体化工具链，优势是速度极快（用 Rust 编写）。

#### 3. `dependabot.yml` — 自动依赖更新

**作用**：每天检查一次 npm 依赖更新，自动创建 PR：
- **patch** 更新（补丁版本，如 1.0.**1**）
- **minor** 更新（次版本，如 1.**1**.0）

**忽略** major（大版本）更新（如 1.x → 2.x），因为大版本更新通常需要手动处理。

### 本地测试

在推送前，你可以本地运行相同的检查命令：

```bash
# 代码质量检查 (biome)
pnpm biome ci ./src

# 类型检查 (astro check)
pnpm astro check

# 构建测试 (astro build)
pnpm astro build
```

建议测试顺序：**biome → astro check → astro build**
