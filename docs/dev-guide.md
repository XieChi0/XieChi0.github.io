# 开发指南

## 环境要求

- **Node.js**: 22.x 或 23.x（与 CI 保持一致）
- **pnpm**: 最新版本

### 使用正确的 Node.js 版本

```bash
# 查看当前 Node 版本
node -v

# 如果是 nvm 用户，自动切换到项目需要的版本
nvm use

# 如果是 fnm 用户
fnm use

# 如果没有 22/23 版本，需要安装
nvm install 22
```

---

## 开发流程

### 1. 安装依赖

```bash
pnpm install
```

### 2. 本地检查（推送前必做）

按顺序执行以下命令：

```bash
# ① 代码格式和 lint 检查
pnpm biome ci ./src

# ② TypeScript 类型检查
pnpm astro check

# ③ 构建测试
pnpm astro build
```

> ⚠️ 所有命令都通过后再推送！

### 3. 常见错误及解决方案

#### TypeScript 错误

| 错误类型 | 示例 | 解决方案 |
|---------|------|---------|
| 类型可能是 undefined | `node.children` | 添加空检查或使用 `?.` 可选链 |
| 类型不匹配 | `string \| undefined` 传给 `string` | 确保在使用前处理了 undefined |
| 非空断言过多 | `node.children!` | 重构代码，确保类型安全 |

#### Biome 格式错误

| 错误类型 | 示例 | 解决方案 |
|---------|------|---------|
| 导入顺序错误 | import 未排序 | 运行 `pnpm biome check --write ./src` |
| 模板字符串 | 应使用 `` `${var}` `` | 改用模板字符串 |
| 格式不一致 | 缩进/换行问题 | 同上，自动修复 |

#### Astro 构建错误

| 错误类型 | 解决方案 |
|---------|---------|
| content 同步失败 | 检查 markdown 文件 frontmatter 格式 |
| 组件类型错误 | 查看 `astro check` 详细输出 |

---

## 代码规范

### 使用 Biome 自动格式化

```bash
# 格式化单个文件
pnpm biome check --write ./src/components/Example.astro

# 格式化所有文件
pnpm biome check --write ./src
```

### 避免使用 `any` 类型

尽量使用具体类型定义：

```typescript
// ❌ 避免
function foo(data: any) { ... }

// ✅ 推荐
interface CategoryNode {
    name: string;
    url: string;
    count: number;
    children?: CategoryNode[];
}
function foo(data: CategoryNode) { ... }
```

### 处理可选值

```typescript
// ❌ 可能导致错误
renderCategoryNodes(node.children, indent + 1)

// ✅ 安全写法
if (node.children) {
    renderCategoryNodes(node.children, indent + 1)
}

// ✅ 或者使用可选链
renderCategoryNodes(node.children ?? [], indent + 1)
```

---

## CI/CD 说明

项目使用 GitHub Actions 自动检查，每次 push 都会运行：

1. **biome** — 代码格式和 lint
2. **astro check** — TypeScript 类型检查
3. **astro build** — 构建测试

所有检查通过后才会部署到 GitHub Pages。

---

## 常见问题

### Q: `pnpm biome ci` 报错
A: 运行 `pnpm biome check --write ./src` 自动修复

### Q: `pnpm astro check` 报错
A: 检查错误信息中的文件路径和行号，修复 TypeScript 错误

### Q: 推送后 CI 失败
A: 查看 GitHub Actions 日志，修复本地问题后重新推送

### Q: 本地 Node 版本不对
A: 确保使用 22 或 23 版本，参考上面的版本切换命令
