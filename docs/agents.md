# 开发规范 (AI)

## 环境要求

- Node.js: **22.x 或 23.x**（必须与 CI 一致）
- pnpm: 最新版本

## 推送前检查

按顺序执行，全部通过后再推送：

```bash
pnpm biome ci ./src
pnpm astro check
pnpm astro build
```

## 常见问题

| 问题 | 解决方案 |
|-----|---------|
| TypeScript `undefined` 错误 | 用 `?.` 或 `??` 处理，或加空检查 |
| `any` 类型警告 | 定义具体 interface |
| Biome 格式错误 | `pnpm biome check --write ./src` |
| 导入排序错误 | 同上，自动修复 |

## 代码规范

- 优先使用 `?.` 和 `??`，避免非空断言 `!`
- 用模板字符串 `` `${var}` ``，不用拼接
- 导入按字母排序
- 避免 `@ts-ignore`
