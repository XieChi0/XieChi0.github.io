---
title: Vue3 组合式 API 指南
published: 2026-04-24
updated: 2026-04-24
description: 探索 Vue3 组合式 API 的强大功能
image: ""
tags: [Vue, Vue3, 前端]
category: 前端/Vue
lang: zh-CN
---

# Vue3 组合式 API 指南

本文介绍 Vue3 组合式 API 的使用方法。

## setup()

```javascript
import { ref, computed } from 'vue'

export default {
    setup() {
        const count = ref(0)
        const double = computed(() => count.value * 2)
        return { count, double }
    }
}
```

这是一篇用于测试层级分类的演示文章。
