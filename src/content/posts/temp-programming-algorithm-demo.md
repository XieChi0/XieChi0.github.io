---
title: 排序算法总结
published: 2026-04-23
updated: 2026-04-23
description: 常见排序算法的原理和实现
image: ""
tags: [算法, 排序, 编程]
category: 编程/算法
lang: zh-CN
---

# 排序算法总结

本文总结常见的排序算法。

## 快速排序

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

## 归并排序

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
```

这是一篇用于测试层级分类的演示文章。
