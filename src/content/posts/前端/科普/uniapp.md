---
title: uni-app 学习文档
published: 2026-07-19
updated: 2026-07-19
description: '面向已熟悉 Vue、第一次系统学习 uni-app 的工作文档：从跨端模型、文件组织、生命周期、pages.json、uni API、状态管理和跨端边界建立完整知识地图。'
image: ''
tags: [uni-app, Vue, 小程序, 跨端, 移动端]
category: '前端/科普'
draft: false
---

# uni-app 学习文档

阅读目标：

- 先知道 uni-app 是什么，不是什么。
- 把 uni-app、Vue、微信小程序的文件组织关系一次对齐。
- 把生命周期、页面注册、页面栈、组件、API、状态管理这些高频知识点整理成可查的字典。
- 建立跨端开发意识：哪些代码是通用的，哪些能力要看平台。

一句话概括：

> uni-app 是 DCloud（国内公司） 推出的跨端应用框架。它以 Vue 单文件组件作为主要开发方式，用 `pages.json` 描述页面结构，用 `uni.*` 提供跨端 API，最终编译到 H5、小程序、App 等目标平台。

## 一、uni-app 的定位：它和 Vue、小程序、H5、App 的关系

### 1. uni-app 不是“另一个 Vue”，而是“基于 Vue 语法的跨端框架”

```
Vue 负责组件和响应式
uni-app 负责页面体系、跨端编译、跨端 API、平台发布
目标平台负责真实运行环境，如浏览器、微信客户端、App WebView/原生运行时
```

在 uni-app 中：

| 层级 | 你写什么 | 谁负责 |
| --- | --- | --- |
| 视图描述 | `.vue` 文件里的 `<template>` | uni-app 编译器把它转成目标端能理解的结构 |
| 响应式逻辑 | `ref`、`reactive`、`computed`、事件函数 | Vue 运行时负责状态和渲染更新 |
| 页面注册 | `pages.json` | uni-app 框架根据配置创建页面和页面栈 |
| 跨端能力 | `uni.request`、`uni.navigateTo`、`uni.setStorage` | uni-app 适配到 H5、小程序、App 的底层 API |
| 平台差异 | 条件编译、平台判断、平台配置 | 开发者自己收敛差异 |

因此，uni-app 代码看起来像 Vue，但它的运行边界不等于普通 Vue Web 项目。

### 2. uni-app 和微信小程序的文件组织对比

微信小程序传统页面是“四件套”：

```text
pages/detail/
├─ detail.wxml   # 页面结构
├─ detail.wxss   # 页面样式
├─ detail.js     # 页面逻辑
└─ detail.json   # 页面局部配置
```

uni-app 把页面组织成 Vue 单文件组件：

```text
pages/detail/
└─ detail.vue
```

一个 `.vue` 文件内部再拆成三段：

```vue
<template>
  <!-- 页面结构：类似小程序 WXML，但写的是 uni-app 组件 -->
</template>

<script setup>
// 页面逻辑：响应式数据、事件、生命周期、请求、跳转
</script>

<style scoped>
/* 页面样式：类似 CSS，但要注意跨端兼容 */
</style>
```

对照关系：

| 微信小程序 | uni-app | 说明 |
| --- | --- | --- |
| `app.json` 的页面配置 | `pages.json` | 页面路径、窗口样式、tabBar、分包等 |
| `app.js` | `App.vue` / `main.js` | 应用入口、全局生命周期、插件注册 |
| `app.wxss` | `App.vue` 全局样式 / `uni.scss` | 全局样式和 SCSS 变量 |
| `page.wxml` | `.vue` 的 `<template>` | 页面结构 |
| `page.wxss` | `.vue` 的 `<style>` | 页面样式 |
| `page.js` | `.vue` 的 `<script>` | 页面逻辑 |
| `page.json` | `pages.json` 中对应页面的 `style` | 页面导航栏、下拉刷新等局部配置 |
| `wx.*` API | `uni.*` API | uni-app 对多端 API 的统一封装 |

> :fish:我记得不是有个manifest.json吗，为什么没了

### 3. uni-app 是否能用 React 或 JSX

uni-app 官方主线开发范式是 **Vue**，包括 Vue2 和 Vue3。

实际学习时可以先记住：

| 写法 | 是否是 uni-app 主流写法 | 说明 |
| --- | --- | --- |
| Vue SFC + template | 是 | 官方文档、插件生态、HBuilderX 提示最完整 |
| Vue3 `<script setup>` | 是 | 新项目常见写法 |
| Vue Options API | 是 | 老项目常见写法 |
| JSX / TSX | 不是主流 | 在部分 Vue 工程配置里可以做组件渲染，但不适合作为 uni-app 入门主线 |
| React | 不是 uni-app 的官方主线 | 如果公司技术栈是 React 跨端，通常会看 Taro 等框架 |

所以公司项目如果说“我们做 uni-app”，默认就是 Vue 体系，而不是 React 体系。

### 4. rpx、`wx.*` 和 `uni.*` 的关系

`rpx` 是移动端跨屏适配单位，微信小程序和 uni-app 都常用。

常见理解：

```text
750rpx = 当前设备屏幕宽度
375px 设计稿里 1px 通常可以按 2rpx 理解
```



## 二、开发工具与项目初始化：HBuilderX 和 CLI 怎么选

### 1. HBuilderX 是什么

HBuilderX 是 DCloud 官方 IDE。它不是普通文本编辑器加插件那么简单，在 uni-app 场景里，它还承担这些事情：

- 创建 uni-app 项目模板。
- 运行到 H5、小程序模拟器、App 真机。
- 管理 uni-app 编译器版本。
- 安装和识别 DCloud 插件。
- App 云端打包、证书配置、发行辅助。
- 对 `pages.json`、条件编译、uni-app 组件和 API 提供更贴近官方的提示。

官方快速上手里也把 HBuilderX 作为最容易跑通的方式。尤其是 App 打包、真机运行、插件市场联动这些场景，HBuilderX 的路径更顺。

### 2. HBuilderX 和 VS Code 的区别

| 对比项 | HBuilderX | VS Code / WebStorm + CLI |
| --- | --- | --- |
| 定位 | DCloud 官方 IDE | 通用前端 IDE |
| 创建项目 | 可视化创建，模板集成 | 通过 CLI、npm、pnpm 创建 |
| 编译器位置 | HBuilderX 安装目录里 | 项目依赖中 |
| 版本升级 | 升级 HBuilderX 影响其创建/管理的编译器 | 升级项目里的 `@dcloudio/*` 依赖 |
| App 云打包 | 支持更完整 | 通常仍需要 HBuilderX 或相关 CLI |
| 代码体验 | uni-app 专项提示更强 | 前端生态插件更自由 |
| 团队协作 | 要注意大家 HBuilderX 版本是否一致 | 依赖锁定在项目里，更容易统一 |

公司项目里最容易遇到的问题是：**同一个项目，HBuilderX 工程和 CLI 工程的编译器版本来源不同**。

如果项目是 CLI 工程，升级 HBuilderX 不一定升级项目编译器；要看 `package.json` 和锁文件里的依赖版本。



## 三、工程结构：先知道每个文件管什么

一个较常见的 uni-app 项目：

```text
my-uniapp/
├─ pages/
│  ├─ index/
│  │  └─ index.vue
│  └─ detail/
│     └─ detail.vue
├─ pages-sub/
│  └─ order/
│     └─ detail.vue
├─ components/
│  └─ goods-card/
│     └─ goods-card.vue
├─ uni_modules/
│  └─ uni-icons/
├─ static/
│  └─ logo.png
├─ api/
│  └─ goods.js
├─ utils/
│  └─ request.js
├─ stores/
│  └─ user.js
├─ App.vue
├─ main.js
├─ pages.json
├─ manifest.json
├─ uni.scss
└─ package.json
```

目录字典：

| 目录 / 文件 | 作用 | 阅读重点 |
| --- | --- | --- |
| `pages/` | 主包页面 | 页面是否在 `pages.json` 的 `pages` 中注册 |
| `pages-sub/` / `subpkg/` | 分包页面，名字由项目约定 | 是否在 `subPackages` 中注册 |
| `components/` | 项目内组件 | 是否符合 easycom 自动引入规则 |
| `uni_modules/` | DCloud 插件市场模块 | 组件、API、页面模板可能来自这里 |
| `static/` | 静态资源 | 本地图片、字体、图标等 |
| `api/` / `services/` | 后端接口封装 | 每个业务接口怎么组织 |
| `utils/` / `common/` | 通用工具 | request、format、校验、环境判断 |
| `stores/` | Pinia / Vuex 状态 | 用户、token、全局配置、购物车等 |
| `App.vue` | 应用入口 | 应用生命周期、全局样式 |
| `main.js` / `main.ts` | Vue 应用创建入口 | 插件、Pinia、全局组件注册 |
| `pages.json` | 页面和窗口配置 | 路由、tabBar、分包、globalStyle |
| `manifest.json` | 平台发布配置 | App、小程序、H5 的 appid、权限、SDK |
| `uni.scss` | 全局 SCSS 变量 | 主题色、间距、组件变量 |

注意 `pages/` 不是自动路由目录。**页面文件存在，不等于它已经是页面**。能不能通过路由打开，主要看 `pages.json` 是否注册。

## 四、生命周期：先理解应用、页面、组件的执行边界

生命周期要放在前面学，因为 uni-app 的很多业务问题，本质上都是“代码写在了错误的时机”。

### 1. 三类生命周期

| 类型 | 写在哪里 | 常见钩子 | 解决什么问题 |
| --- | --- | --- | --- |
| 应用生命周期 | `App.vue` | `onLaunch`、`onShow`、`onHide` | 应用启动、进入前台、进入后台 |
| 页面生命周期 | `pages/**.vue` | `onLoad`、`onShow`、`onReady`、`onHide`、`onUnload` | 页面加载、显示、渲染完成、隐藏、销毁 |
| 组件生命周期 | 普通组件 `.vue` | `onMounted`、`onUnmounted` 等 | 组件自身挂载和销毁 |

组合式 API 写法中，uni-app 页面生命周期从 `@dcloudio/uni-app` 引入：

```vue
<script setup>
import {
  onLoad,
  onShow,
  onReady,
  onHide,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
} from '@dcloudio/uni-app'

onLoad((query) => {
  // 页面第一次加载时触发，query 是上个页面通过 url 传来的参数
})

onShow(() => {
  // 页面每次显示都会触发，包括从详情页返回列表页
})

onReady(() => {
  // 页面初次渲染完成，适合做节点尺寸查询
})

onHide(() => {
  // 当前页面被其他页面盖住，或应用进入后台
})

onUnload(() => {
  // 当前页面从页面栈销毁
})

onPullDownRefresh(() => {
  // 用户下拉刷新，通常重新请求第一页数据
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  // 页面滚动到底部，通常加载下一页
})
</script>
```

### 2. 页面生命周期怎么选

| 场景 | 推荐位置 | 原因 |
| --- | --- | --- |
| 接收路由参数 | `onLoad(query)` | 页面创建时参数最清晰 |
| 请求详情页首屏数据 | `onLoad` | 和路由参数绑定，页面只加载一次 |
| 从别的页面返回后刷新数据 | `onShow` | 返回时不会重新 `onLoad`，但会 `onShow` |
| 查询节点尺寸、滚动位置 | `onReady` 后 | 过早查询可能拿不到节点 |
| 停止定时器、取消订阅 | `onUnload` / `onHide` | 避免页面隐藏后逻辑继续跑 |
| tabBar 页面刷新角标 | `onShow` | tabBar 页面常驻内存，切换时触发显示 |
| 下拉刷新 | `onPullDownRefresh` | 页面级刷新能力 |
| 分页加载 | `onReachBottom` | 页面滚动触底 |

### 3. `onLoad` 和 `onShow` 的关键区别

> :fish:这里要说清楚onload只会出现一次

```text
进入列表页
  -> 列表页 onLoad
  -> 列表页 onShow
  -> navigateTo 详情页
  -> 列表页 onHide
  -> 详情页 onLoad
  -> 详情页 onShow
  -> navigateBack 返回
  -> 详情页 onUnload
  -> 列表页 onShow
```

所以：

- 初始化参数、首次请求，放 `onLoad`。
- 每次露出页面都要刷新，放 `onShow`。
- 不要把所有请求都塞进 `onShow`，否则页面每次返回都会重新请求。

### 4. 应用生命周期写在哪里

`onLaunch`、`onShow`、`onHide` 属于应用级生命周期，通常写在 `App.vue`：

```vue
<script>
export default {
  onLaunch() {
    const token = uni.getStorageSync('token')
    console.log('应用启动，读取本地 token', token)
  },
  onShow() {
    console.log('应用进入前台')
  },
  onHide() {
    console.log('应用进入后台')
  },
}
</script>
```

应用生命周期适合做：

- 初始化本地 token。
- 初始化埋点、日志、全局配置。
- 检查版本更新。
- 恢复上次使用状态。
- 监听应用前后台切换。

不适合做：

- 某个页面的列表请求。
- 某个表单的局部状态。
- 依赖页面节点的操作。

## 五、`pages.json`：页面注册、窗口配置、tabBar、分包

`pages.json` 是 uni-app 的页面结构配置文件。它决定：

- 哪些 `.vue` 文件是页面。
- 首页是哪一个页面。
- 页面导航栏标题和窗口样式是什么。
- 是否有 tabBar。
- 是否有分包。
- 是否开启 easycom 组件自动引入。

### 1. 主包页面必须注册在 `pages`

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/detail/detail",
      "style": {
        "navigationBarTitleText": "详情"
      }
    }
  ]
}
```

规则：

- `path` 不写 `.vue` 后缀。
- `pages` 数组第一项通常是应用首页。
- 页面必须注册后，才能用 `uni.navigateTo` 等 API 打开。
- 普通组件不注册在 `pages`。
- `components/` 下的组件不是页面，不参与页面栈。



| 文件类型 | 是否注册到 `pages.json` | 原因 |
| --- | --- | --- |
| 页面 `.vue` | 要 | 要进入页面栈 |
| tabBar 页面 | 要 | 既要在 `pages` 注册，也要在 `tabBar.list` 引用 |
| 分包页面 | 要 | 写在 `subPackages` 的 `pages` 中 |

### 2. 全局窗口样式 `globalStyle`

```json
{
  "globalStyle": {
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f6f7f9",
    "enablePullDownRefresh": false
  }
}
```

常见字段：

| 字段 | 作用 |
| --- | --- |
| `navigationBarTitleText` | 原生导航栏标题 |
| `navigationBarBackgroundColor` | 导航栏背景色 |
| `navigationBarTextStyle` | 导航栏文字颜色 |
| `backgroundColor` | 窗口背景色 |
| `enablePullDownRefresh` | 是否默认开启下拉刷新 |
| `onReachBottomDistance` | 页面触底距离 |

页面自己的 `style` 会覆盖全局配置：

```json
{
  "path": "pages/detail/detail",
  "style": {
    "navigationBarTitleText": "商品详情",
    "enablePullDownRefresh": true
  }
}
```

### 3. tabBar 页面

```json
{
  "tabBar": {
    "color": "#8a8f99",
    "selectedColor": "#1677ff",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tab-home.png",
        "selectedIconPath": "static/tab-home-active.png"
      },
      {
        "pagePath": "pages/mine/mine",
        "text": "我的",
        "iconPath": "static/tab-mine.png",
        "selectedIconPath": "static/tab-mine-active.png"
      }
    ]
  }
}
```

tabBar 的关键规则：

- tabBar 页面也必须先在 `pages` 中注册。
- `tabBar.list` 一般 2 到 5 个。
- 跳转 tabBar 页面必须用 `uni.switchTab`。
- tabBar 页面第一次展示会加载，之后通常保留在内存里；再次切换主要触发 `onShow`。

### 4. 分包 `subPackages`

分包用于把非首屏页面拆出去，减少主包体积。

```json
{
  "pages": [
    {
      "path": "pages/index/index"
    }
  ],
  "subPackages": [
    {
      "root": "pages-order",
      "pages": [
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "订单详情"
          }
        }
      ]
    }
  ]
}
```

上面的真实页面路径是：

```text
pages-order/detail/detail.vue
```

分包页面不是写到主包 `pages` 里，而是写到对应 `subPackages` 的 `pages` 里。

> :fish:分包主包是咋分的 咋就把一些东西搞成分包了呢 直接填在subpackage就成为分包了吗

## 六、页面、路由和页面栈

### 1. 页面是什么

uni-app 中页面通常是放在 `pages/` 或分包目录下的 `.vue` 文件。

> :fish: 啥叫 分包目录下的.vue ，迷惑

它和普通组件的区别：

| 对比项 | 页面 | 普通组件 |
| --- | --- | --- |
| 是否进入页面栈 | 是 | 否 |
| 是否需要在 `pages.json` 注册 | 是 | 否 |
| 是否可以配置导航栏 | 可以 | 不可以 |
| 是否能接收路由参数 | 可以，通常在 `onLoad(query)` | 不能直接作为页面接收 |
| 是否有页面生命周期 | 有 | 没有页面级生命周期 |

### 2. 页面跳转写法

从列表页进入详情页：

```js
uni.navigateTo({
  url: '/pages/detail/detail?id=1001&type=goods'
})
```

详情页接收参数：

```vue
<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad((query) => {
  const id = Number(query.id)
  const type = query.type
})
</script>
```

注意：

- URL 参数拿到后通常是字符串。
- 参数复杂时不要直接塞大对象，优先传 id，然后详情页重新请求。
- 路径建议以 `/` 开头，避免相对路径混乱。

### 3. 路由 API 

| API | 页面栈行为 | 常见场景 |
| --- | --- | --- |
| `uni.navigateTo` | 保留当前页，打开新页 | 列表到详情，可返回 |
| `uni.redirectTo` | 关闭当前页，打开新页 | 登录后替换中间页 |
| `uni.reLaunch` | 关闭所有页面，打开某页 | 退出登录回首页 |
| `uni.switchTab` | 切换到 tabBar 页面，关闭非 tabBar 页面 | 首页、我的、购物车 |
| `uni.navigateBack` | 返回上一页或多级页面 | 详情返回列表 |

示例：

```js
// 普通页面
uni.navigateTo({
  url: '/pages/goods/detail?id=1'
})

// tabBar 页面
uni.switchTab({
  url: '/pages/index/index'
})

// 返回两级
uni.navigateBack({
  delta: 2
})
```

### 4. 页面栈意味着页面不是每次都重新创建

```text
列表页 -> 详情页
列表页只是隐藏，不一定销毁

详情页 -> 返回列表页
列表页触发 onShow，但不重新触发 onLoad
```

所以列表页如果要在返回时刷新收藏状态，可以写在 `onShow`；如果只是首次加载列表，就写在 `onLoad`。

## 七、模板和内置组件：`template`、`view`、`text` 到底是什么

### 1. `<template>` 的作用

在 `.vue` 文件里，`<template>` 是页面结构模板。

它不是浏览器运行时直接看到的 HTML 字符串，而是给 uni-app 编译器和 Vue 编译器处理的结构描述。

```vue
<template>
  <view class="profile">
    <image class="avatar" :src="avatar" mode="aspectFill" />
    <text class="nickname">{{ nickname }}</text>
  </view>
</template>
```

编译到不同平台时，这段模板会变成不同目标端的结构：

```text
H5            -> 浏览器里的 DOM 结构
微信小程序     -> 小程序可识别的 WXML/组件结构
App           -> App 端对应的渲染结构
```

所以它既和 Vue 有关系，也和普通 Web 的 HTML 不完全相同。

准确说：

> uni-app 页面使用 Vue 单文件组件语法组织代码，但 `<template>` 里的标签应优先使用 uni-app 内置组件，而不是随意写 HTML 标签。

### 2. `view` 和 `text` 不是“父子概念”

在 HTML 里，`div` 和 `span` 都是元素，只是默认布局不同：

- `div` 默认是块级盒子。
- `span` 默认是行内盒子。

在 uni-app 里，`view` 和 `text` 更像跨端组件：

| 组件 | 主要语义 | 类比 |
| --- | --- | --- |
| `view` | 视图容器，用来做布局、包裹区域 | 类似 `div` |
| `text` | 文本组件，用来承载文字 | 类似 `span`，但有平台组件语义 |

说 `view` 是容器、`text` 是文本，并不是说 `view` 的地位一定“大于” `text`，而是在写页面时它们承担的职责不同。

常见写法：

```vue
<view class="card">
  <text class="title">商品名称</text>
  <text class="price">￥99</text>
</view>
```

`view` 负责布局区域，`text` 负责文本内容。不要把大量纯文本裸露在复杂结构里，使用 `text` 更符合小程序和 App 端的组件模型。

### 3. 可以写 `div`、`span` 吗

uni-app 在某些情况下会把 `div`、`span` 等 HTML 标签转换为对应组件，例如 `div` 类似转成 `view`，`span` 类似转成 `text`。

但新代码不建议这样写。原因是：

- 官方组件文档、平台兼容说明都围绕 `view`、`text`、`image` 等组件展开。
- 小程序和 App 端不是标准浏览器环境。
- 团队协作时统一使用 uni-app 组件更容易排查跨端问题。

### 4. 常见内置组件字典

| 组件 | 用途 | 关键属性 / 注意点 |
| --- | --- | --- |
| `view` | 基础容器 | 布局、点击、样式承载 |
| `text` | 文本 | 文本展示、可选中、解码等能力看平台 |
| `image` | 图片 | `src`、`mode`、懒加载、长按菜单等 |
| `button` | 按钮 | 可用于普通点击，也可能承载授权、分享等平台能力 |
| `input` | 单行输入 | 键盘、聚焦、placeholder、确认按钮类型 |
| `textarea` | 多行输入 | 高度、键盘、层级问题要注意 |
| `scroll-view` | 区域滚动 | 必须有明确高度；长列表性能要谨慎 |
| `swiper` / `swiper-item` | 轮播 | banner、横向滑动卡片 |
| `navigator` | 声明式跳转 | tabBar 页面要设置正确 open-type |
| `picker` | 选择器 | 日期、时间、普通数组、多列选择 |
| `map` | 地图 | 原生组件，层级和覆盖问题要注意 |
| `video` | 视频 | 原生组件，弹层覆盖、同层渲染要注意 |
| `canvas` | 画布 | 不同端 API 和性能差异较明显 |

### 5. `image` 的 `mode`

`image` 的 `mode` 控制裁剪和缩放，这个在业务里很常见：

| mode | 效果 | 场景 |
| --- | --- | --- |
| `scaleToFill` | 拉伸填满，可能变形 | 默认值，不适合商品图 |
| `aspectFit` | 保持比例完整显示，可能留白 | logo、证件图 |
| `aspectFill` | 保持比例填满，可能裁剪 | 商品封面、头像、banner |
| `widthFix` | 宽度固定，高度自适应 | 长图、详情图 |
| `heightFix` | 高度固定，宽度自适应 | 特定高度图 |

### 6. `scroll-view` 的重点

`scroll-view` 是区域滚动，不是页面滚动。

```vue
<scroll-view class="list" scroll-y @scrolltolower="loadMore">
  <view v-for="item in list" :key="item.id">
    {{ item.name }}
  </view>
</scroll-view>
```

```css
.list {
  height: 600rpx;
}
```

重点：

- 纵向滚动要设置 `scroll-y`。
- 容器要有明确高度，否则内容撑开后不会形成区域滚动。
- `scroll-view` 内的触底是 `scrolltolower`，页面触底是 `onReachBottom`。
- 很长的列表不要随便塞进 `scroll-view`，要考虑虚拟列表或页面滚动。

## 八、`uni.*` API 字典：先认识能力，再看写法

uni-app 的 API 统一挂在 `uni` 对象上。它的定位类似微信小程序里的 `wx` 对象，但目标是跨多端。

### 1. API 分类总览

| 分类 | 常用 API | 解决什么问题 |
| --- | --- | --- |
| 网络请求 | `uni.request`、`uni.uploadFile`、`uni.downloadFile`、`uni.connectSocket` | HTTP、上传、下载、WebSocket |
| 路由导航 | `uni.navigateTo`、`uni.redirectTo`、`uni.reLaunch`、`uni.switchTab`、`uni.navigateBack` | 页面栈管理 |
| 界面反馈 | `uni.showToast`、`uni.showModal`、`uni.showLoading`、`uni.hideLoading` | 提示、确认框、加载态 |
| 数据缓存 | `uni.setStorage`、`uni.getStorage`、`uni.removeStorage`、`uni.clearStorage` | 本地持久化 |
| 媒体能力 | `uni.chooseImage`、`uni.previewImage`、`uni.chooseVideo`、`uni.saveImageToPhotosAlbum` | 图片、视频、相册 |
| 位置能力 | `uni.getLocation`、`uni.chooseLocation`、`uni.openLocation` | 定位、选点、打开地图 |
| 设备信息 | `uni.getSystemInfo`、`uni.getWindowInfo`、`uni.getDeviceInfo` | 屏幕、系统、设备信息 |
| 剪贴板 | `uni.setClipboardData`、`uni.getClipboardData` | 复制、读取剪贴板 |
| 扫码 | `uni.scanCode` | 扫二维码、条形码 |
| 登录授权 | `uni.login`、`uni.getUserProfile` 等 | 小程序登录、用户信息，平台差异明显 |
| 文件系统 | `uni.getFileSystemManager` 等 | 小程序文件读写，平台差异明显 |
| 支付分享 | `uni.requestPayment`、分享生命周期/API | 平台强相关业务能力 |

学习 API 时不要只看名字，要看四件事：

- 这个 API 是否跨端支持。
- 参数结构是什么。
- 成功、失败、完成回调分别代表什么。
- 返回值是平台数据，还是业务接口数据。

### 2. 回调模型：`success`、`fail`、`complete`

很多 `uni.*` 异步 API 都支持这种回调结构：

```js
uni.showModal({
  title: '提示',
  content: '确认删除吗？',
  success(res) {
    if (res.confirm) {
      console.log('用户点击确定')
    }
    if (res.cancel) {
      console.log('用户点击取消')
    }
  },
  fail(err) {
    console.error('API 调用失败', err)
  },
  complete() {
    console.log('无论成功失败都会执行')
  }
})
```

含义：

| 回调 | 含义 |
| --- | --- |
| `success` | API 调用成功，拿到了平台返回 |
| `fail` | API 调用失败，例如网络不可用、权限失败、参数错误 |
| `complete` | 调用结束，不管成功失败都会执行 |

在业务项目中，经常会把这些 callback API 再封装成 Promise，方便 `async/await`。

### 3. 界面反馈 API

Toast：

```js
uni.showToast({
  title: '保存成功',
  icon: 'success',
  duration: 1500
})
```

Loading：

```js
uni.showLoading({
  title: '加载中',
  mask: true
})

try {
  await loadData()
} finally {
  uni.hideLoading()
}
```

Modal：

```js
uni.showModal({
  title: '确认操作',
  content: '是否删除这条记录？',
  success(res) {
    if (res.confirm) {
      deleteItem()
    }
  }
})
```

使用建议：

- `showToast` 适合轻提示。
- `showLoading` 适合阻塞式等待，记得 `hideLoading`。
- `showModal` 适合二次确认。
- 请求失败不要只 `console.log`，要给用户可理解的提示。

### 4. 网络请求 API：`uni.request`

`uni.request` 是最常用 API 之一。

```js
uni.request({
  url: 'https://example.com/api/goods',
  method: 'GET',
  data: {
    page: 1,
    pageSize: 20
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    console.log(res.statusCode)
    console.log(res.data)
  },
  fail(err) {
    console.error(err)
  }
})
```

重点：

- `success` 表示请求这个动作完成并拿到了响应，不等于业务成功。
- HTTP `404`、`500` 这类状态码也可能进入 `success`，所以要检查 `res.statusCode`。
- 后端业务错误通常还要检查 `res.data.code`、`res.data.success` 等字段。
- `fail` 更多表示请求没有正常完成，如域名不合法、网络断开、超时、证书问题等。

### 5. request 封装示例

```js
const BASE_URL = 'https://example.com/api'

export function request(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')

    uni.request({
      // 拼接基础域名，页面里只需要传 /goods/list 这类业务路径
      url: BASE_URL + options.url,

      // 默认 GET；新增、修改、删除时由调用方显式传 POST / PUT / DELETE
      method: options.method || 'GET',

      // GET 请求会变成 query，POST 请求通常作为 body，具体由平台和 header 决定
      data: options.data || {},

      // 合并统一 header 和调用方自定义 header
      header: {
        'content-type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.header,
      },

      // API 调用成功拿到响应后，还要继续判断 HTTP 状态码和业务状态码
      success(res) {
        const isHttpOk = res.statusCode >= 200 && res.statusCode < 300

        if (!isHttpOk) {
          uni.showToast({
            title: `请求失败：${res.statusCode}`,
            icon: 'none',
          })
          reject(res)
          return
        }

        const body = res.data

        // 这里假设后端约定 code === 0 代表业务成功
        if (body && typeof body === 'object' && 'code' in body && body.code !== 0) {
          uni.showToast({
            title: body.message || '操作失败',
            icon: 'none',
          })
          reject(body)
          return
        }

        resolve(body)
      },

      // fail 不是业务失败，而是请求动作本身失败
      fail(err) {
        uni.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
```

接口模块：

```js
import { request } from '@/utils/request'

export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'GET',
    data: params,
  })
}

export function getGoodsDetail(id) {
  return request({
    url: `/goods/${id}`,
  })
}
```

页面中使用：

```vue
<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getGoodsList } from '@/api/goods'

const list = ref([])
const loading = ref(false)

async function loadList() {
  if (loading.value) return

  loading.value = true
  try {
    const res = await getGoodsList({ page: 1, pageSize: 20 })
    list.value = res.data || res.list || []
  } finally {
    loading.value = false
  }
}

onLoad(() => {
  loadList()
})
</script>
```

### 6. 上传和下载

上传文件：

```js
uni.uploadFile({
  url: 'https://example.com/api/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    scene: 'avatar'
  },
  success(res) {
    const data = JSON.parse(res.data)
    console.log(data.url)
  }
})
```

下载文件：

```js
uni.downloadFile({
  url: 'https://example.com/file/demo.pdf',
  success(res) {
    if (res.statusCode === 200) {
      console.log('临时文件路径', res.tempFilePath)
    }
  }
})
```

上传下载在小程序端同样可能受合法域名限制。

## 九、本地存储：缓存什么，用同步还是异步

### 1. 存储 API 字典

| API | 类型 | 用途 |
| --- | --- | --- |
| `uni.setStorage` | 异步 | 写入本地缓存 |
| `uni.getStorage` | 异步 | 读取本地缓存 |
| `uni.removeStorage` | 异步 | 删除某个 key |
| `uni.clearStorage` | 异步 | 清空本地缓存 |
| `uni.getStorageInfo` | 异步 | 查看当前缓存 key、大小等信息 |
| `uni.setStorageSync` | 同步 | 同步写入 |
| `uni.getStorageSync` | 同步 | 同步读取 |
| `uni.removeStorageSync` | 同步 | 同步删除 |
| `uni.clearStorageSync` | 同步 | 同步清空 |
| `uni.getStorageInfoSync` | 同步 | 同步读取缓存信息 |

### 2. 同步写法

```js
uni.setStorageSync('token', 'abc123')

const token = uni.getStorageSync('token')

uni.removeStorageSync('token')
```

适合：

- 启动时读取 token。
- request 拦截里读取 token。
- 读取很小的配置。
- 简单同步判断登录态。

不适合：

- 大量数据。
- 高频循环读写。
- 需要避免阻塞 UI 的场景。

### 3. 异步写法

```js
uni.setStorage({
  key: 'searchHistory',
  data: ['手机', '电脑'],
  success() {
    console.log('保存成功')
  }
})

uni.getStorage({
  key: 'searchHistory',
  success(res) {
    console.log(res.data)
  }
})
```

适合：

- 搜索历史。
- 草稿内容。
- 用户偏好设置。
- 不要求立刻同步返回的缓存。

### 4. 存储使用边界

本地存储不是数据库，也不是安全保险箱。

建议：

- token 可以存，但要配合过期、刷新、退出登录清理。
- 用户隐私、身份证、银行卡等敏感信息不要随便落本地。
- 列表缓存要考虑版本和过期时间。
- 修改全局状态后，如果希望冷启动仍然存在，要同步写入 storage。

常见封装：

```js
const TOKEN_KEY = 'token'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY)
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY)
}
```

## 十、状态管理：页面状态、全局状态、持久化状态怎么分

uni-app 项目的状态管理不能只想“我用不用 Pinia”，要先判断状态的生命周期。

### 1. 状态分类

| 状态类型 | 放在哪里 | 例子 |
| --- | --- | --- |
| 页面临时状态 | 当前页面 `ref` / `reactive` | loading、当前页码、表单输入 |
| 组件内部状态 | 组件内部 | 弹窗展开、局部选中 |
| 跨页面内存状态 | Pinia / Vuex | 用户信息、购物车数量、当前门店 |
| 持久化状态 | `uni.setStorage` | token、搜索历史、草稿 |
| 页面传递状态 | 路由参数、eventChannel、全局事件 | 详情 id、选择地址结果 |
| 应用级配置 | App 初始化 + store | 环境配置、灰度开关、系统信息 |

判断标准：

```text
只影响当前页面 -> 页面状态
多个页面都要读写 -> store
关闭应用后还要存在 -> storage
只是在两个页面之间传一次 -> 路由参数或事件
```

### 2. 页面状态

```vue
<script setup>
import { ref } from 'vue'

const loading = ref(false)
const list = ref([])
const page = ref(1)
const keyword = ref('')
</script>
```

页面状态适合放：

- 当前筛选条件。
- 列表 loading。
- 表单输入值。
- 当前 tab。
- 局部弹窗开关。

这种状态不需要全局化。否则 store 会越来越乱。

### 3. Pinia 全局状态

Vue3 uni-app 项目常用 Pinia。典型结构：

```text
stores/
├─ user.js
├─ cart.js
└─ app.js
```

用户 store：

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: null,
  }),

  getters: {
    isLogin: (state) => Boolean(state.token),
  },

  actions: {
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },

    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
    },
  },
})
```

页面使用：

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { isLogin, userInfo } = storeToRefs(userStore)
</script>
```

### 4. Vuex 和 `globalData`

老 uni-app 项目可能还在用 Vuex：

```text
store/
└─ index.js
```

Vuex 和 Pinia 都能做全局状态，只是 Pinia 更适合 Vue3 新项目。

还有一种很小程序风格的写法是 `globalData`：

```js
const app = getApp()
app.globalData.userInfo = userInfo
```

但要注意：

- `globalData` 不是响应式状态。
- 一个页面改了它，另一个页面不会自动刷新。
- 读取方通常要在 `onShow` 里重新读取，或者配合事件通知。

因此公司项目中更推荐：

```text
页面临时状态 -> ref/reactive
跨页面共享状态 -> Pinia/Vuex
冷启动仍然要保留 -> storage
```

### 5. 跨页面传值

简单参数用 URL：

```js
uni.navigateTo({
  url: `/pages/detail/detail?id=${id}`
})
```

复杂对象不建议塞进 URL。可以用：

- 只传 id，目标页重新请求。
- 写入 store，目标页读取。
- 写入 storage，目标页读取。
- 使用 eventChannel 或全局事件做一次性回传。

全局事件：

```js
uni.$emit('address:selected', address)
uni.$on('address:selected', handleAddress)
uni.$off('address:selected', handleAddress)
```

全局事件一定要记得解绑，避免页面销毁后仍然监听。

## 十一、组件拆分与 easycom：为什么引入 `GoodsCard`，模板写 `goods-card`

### 1. PascalCase 和 kebab-case

在 Vue 模板里，组件名通常可以有两种写法：

```js
import GoodsCard from '@/components/goods-card/goods-card.vue'
```

模板里可以写：

```vue
<GoodsCard :goods="goods" />
```

也可以写：

```vue
<goods-card :goods="goods" />
```

`GoodsCard` 是 JS 里的变量名，`goods-card` 是模板里的短横线写法。两者对应的是同一个组件。

很多团队在 uni-app 里更常写 `goods-card`，因为它和小程序组件标签风格更接近。

### 2. easycom 自动导入

如果组件路径符合：

```text
components/组件名/组件名.vue
```

例如：

```text
components/goods-card/goods-card.vue
```

可以直接在页面模板中使用：

```vue
<template>
  <goods-card :goods="goods" />
</template>
```

不一定需要手动 import。具体要看项目是否关闭或改写了 `pages.json` 的 `easycom` 配置。

### 3. 组件拆分建议

| 类型 | 是否适合拆组件 | 例子 |
| --- | --- | --- |
| 纯 UI 复用 | 适合 | 商品卡片、用户头像、空状态 |
| 带少量交互 | 适合 | 搜索框、数量选择器、筛选栏 |
| 强业务模块 | 看情况 | 地址选择、优惠券弹窗 |
| 完整页面流程 | 不适合普通组件化 | 下单页、支付页、详情页 |

原则：

- 页面负责流程和数据编排。
- 组件负责展示和局部交互。
- 组件通过 `props` 接收数据，通过 `emit` 通知外部。
- 不要让每个小组件都自己请求接口，否则数据流会变散。

## 十二、条件编译：编译期移除代码，不是运行时 if

条件编译用于处理平台差异。

它的核心不是：

```js
if (platform === 'weixin') {
  // 运行时判断
}
```

而是：

```js
// #ifdef MP-WEIXIN
// 这段代码只会编译进微信小程序产物
// #endif
```

### 1. 为什么需要条件编译

跨端项目里，大部分业务代码应该共用，但平台一定有差异：

- 微信小程序有微信专属组件和 API。
- App 端可能调用原生能力。
- H5 端可能要处理浏览器地址栏、CORS、SEO。
- 某些 CSS 或组件只在特定端支持。

条件编译的价值是：**让某个平台不需要的代码在编译时就被排除**。

### 2. 基本写法

JS 中：

```js
// #ifdef H5
console.log('只在 H5 编译')
// #endif

// #ifdef MP-WEIXIN
console.log('只在微信小程序编译')
// #endif

// #ifndef H5
console.log('除了 H5，其他平台编译')
// #endif
```

模板中：

```vue
<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <official-account />
    <!-- #endif -->
  </view>
</template>
```

CSS 中：

```css
/* #ifdef H5 */
.page {
  min-height: 100vh;
}
/* #endif */
```

### 3. 常见平台标识

| 标识 | 含义 |
| --- | --- |
| `H5` | H5 |
| `MP-WEIXIN` | 微信小程序 |
| `MP-ALIPAY` | 支付宝小程序 |
| `MP-BAIDU` | 百度小程序 |
| `MP-TOUTIAO` | 抖音小程序 |
| `APP-PLUS` | App |
| `VUE2` | Vue2 编译场景 |
| `VUE3` | Vue3 编译场景 |

### 4. 什么时候用，什么时候不用

适合用：

- 某个平台独有组件。
- 某个平台独有 API。
- 某个平台样式确实不同。
- 不同平台需要不同 manifest/pages 配置。

不适合用：

- 普通业务分支。
- 能通过组件封装解决的小差异。
- 到处散落的细碎判断。

如果一个页面满屏 `#ifdef`，应该考虑抽出平台适配层：

```text
页面业务
  -> 调用统一方法 chooseImage()
  -> adapter/h5.js 或 adapter/mp-weixin.js 内部处理差异
```

## 十三、DOM、节点查询和跨端操作边界

### 1. uni-app 能不能操作 DOM

答案要分平台：

| 平台 | 能否直接 DOM 操作 | 建议 |
| --- | --- | --- |
| H5 | 可以，因为最终运行在浏览器 | 但跨端业务不要依赖它 |
| 微信小程序 | 不能直接 `document.querySelector` | 用选择器查询 API 获取节点信息 |
| App vue 页面 | 不建议按浏览器 DOM 思维写 | 用 uni-app API 或平台特定能力 |

跨端代码里不要默认写：

```js
document.querySelector('.box').style.height = '100px'
```

应该优先通过状态驱动视图：

```vue
<template>
  <view class="box" :style="{ height: boxHeight + 'px' }" />
</template>

<script setup>
import { ref } from 'vue'

const boxHeight = ref(100)
</script>
```

### 2. `uni.createSelectorQuery`

如果你要获取节点尺寸、位置、滚动信息，可以用：

```js
uni
  .createSelectorQuery()
  .select('.goods-card')
  .boundingClientRect((rect) => {
    console.log(rect.width)
    console.log(rect.height)
    console.log(rect.top)
  })
  .exec()
```

它的重点是“查询节点信息”，不是“拿到 DOM 节点然后随便改”。

常见用途：

- 获取元素高度。
- 计算吸顶位置。
- 计算滚动区域高度。
- 获取 canvas 节点。
- 判断某个元素是否进入可视区域。

如果是在组件内部查询，通常要绑定当前组件实例上下文。公司项目里遇到组件内查询异常时，可以优先查 `in(this)` 或框架版本对应写法。

### 3. IntersectionObserver

监听元素进入视口：

```js
const observer = uni.createIntersectionObserver()

observer
  .relativeToViewport()
  .observe('.target', (res) => {
    if (res.intersectionRatio > 0) {
      console.log('元素进入视口')
    }
  })
```

适合：

- 曝光埋点。
- 图片懒加载。
- 动画触发。
- 列表项可见性判断。

用完要在页面卸载时清理：

```js
observer.disconnect()
```

## 十四、跨端环境下 CSS 布局的设计注意点

### 1. 单位选择

| 单位 | 用途 | 注意 |
| --- | --- | --- |
| `rpx` | 移动端响应式尺寸 | 适合设计稿还原 |
| `px` | 边框、固定尺寸、某些组件属性 | 不随屏幕宽度缩放 |
| `%` | 相对父容器 | 父容器必须有明确尺寸 |
| `vh` / `vw` | H5 常见 | 小程序、App 端要确认兼容 |
| `env(safe-area-inset-bottom)` | 安全区 | iPhone 底部安全区适配 |

常见写法：

```css
.page {
  min-height: 100vh;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
```

### 2. Flex 优先，复杂选择器谨慎

跨端页面尽量使用稳定布局：

```css
.row {
  display: flex;
  align-items: center;
}

.content {
  flex: 1;
  min-width: 0;
}
```

注意：

- 不要过度依赖复杂 CSS 选择器。
- 不要把布局建立在 DOM 深层结构假设上。
- 文本溢出要明确写 `overflow`、`text-overflow`、`white-space`。

### 3. `scroll-view` 和页面滚动不是一回事

页面滚动：

- 触发 `onReachBottom`。
- 页面级下拉刷新通常在 `pages.json` 配置。

区域滚动：

- 使用 `scroll-view`。
- 触底事件是 `scrolltolower`。
- 必须设置明确高度。
- 很长列表要注意性能。

### 4. 原生组件层级问题

在小程序和 App 的 vue 页面里，部分组件可能是原生组件，例如：

- `map`
- `video`
- `camera`
- `canvas`
- 聚焦时的 `input` / `textarea`
- `cover-view`
- `cover-image`

原生组件可能脱离普通 WebView 渲染层，带来：

- `z-index` 盖不住。
- 弹窗被地图或视频挡住。
- 某些 CSS 动画或裁剪不生效。
- 在 `scroll-view`、`swiper` 内嵌套时表现有平台差异。

遇到这种问题时，不能只调 CSS，要先判断这个组件是不是原生组件。

### 5. tabBar 和底部固定按钮

H5 端 tabBar 可能是页面里模拟出来的结构；小程序和 App 端 tabBar 可能是原生层。

底部固定按钮要考虑：

- tabBar 高度。
- 安全区。
- 键盘弹起。
- H5 和小程序的窗口高度差异。

常见写法：

```css
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  padding: 20rpx 32rpx;
  background: #fff;
}
```

具体项目如果使用原生 tabBar，还要看是否需要使用 `--window-bottom` 等平台变量。

## 十五、请求域名、环境配置和小程序合法域名

### 1. “请求域名”是什么

比如接口地址是：

```text
https://api.example.com/order/list
```

其中：

```text
协议：https
域名：api.example.com
路径：/order/list
```

请求域名通常指：

```text
api.example.com
```

小程序平台为了安全，不允许你随便请求任意域名。微信小程序需要在小程序后台配置合法域名。

### 2. 为什么 H5 能请求，小程序不一定能请求

不同端的限制不同：

| 平台 | 主要限制 |
| --- | --- |
| H5 | 浏览器 CORS、代理配置、HTTPS 混合内容 |
| 微信小程序 | 后台合法域名、HTTPS、证书、端口限制 |
| App | 系统网络权限、HTTPS 证书、App 平台配置 |

所以 H5 调通了，只能说明浏览器环境下 OK。发布到微信小程序时，还要确认：

- 微信公众平台后台是否配置了 request 合法域名。
- 域名是否 HTTPS。
- 证书是否合法有效。
- 开发工具里是否临时勾选了“不校验合法域名”，真机和线上不一定一样。
- `uploadFile`、`downloadFile`、WebSocket 可能有各自的合法域名配置。

### 3. 多环境配置

公司项目通常有：

```text
开发环境：dev
测试环境：test / staging
生产环境：prod
```

可以按编译环境区分基础地址：

```js
const env = process.env.NODE_ENV

export const BASE_URL =
  env === 'development'
    ? 'https://test-api.example.com'
    : 'https://api.example.com'
```

如果还要区分平台，可以再结合条件编译或项目自己的环境变量方案。

重点是：请求域名应该集中配置，不要散落在每个页面。

## 十六、`manifest.json`：平台发布配置

`pages.json` 管页面结构，`manifest.json` 管平台发行配置。

常见内容：

| 配置 | 作用 |
| --- | --- |
| 应用名称 | App / H5 / 小程序展示名称 |
| AppID | DCloud AppID、小程序 AppID 等 |
| H5 配置 | 路由模式、基础路径、发行目录 |
| 小程序配置 | 微信小程序 appid、权限、分包优化等 |
| App 配置 | 图标、启动图、权限、SDK、模块、原生能力 |
| 权限说明 | 定位、相册、相机等权限描述 |

公司项目里改 `manifest.json` 要谨慎，因为它影响发布产物。尤其是 App 权限、包名、证书、SDK 配置，不能像改普通页面一样随手动。

## 十七、从 Vue 项目迁移思维到 uni-app 项目

你已经会 Vue，所以真正要补的是这些思维差异：

| Vue Web 项目常见思维 | uni-app 项目要改成 |
| --- | --- |
| 路由由 Vue Router 管 | 页面由 `pages.json` 和 uni-app 页面栈管 |
| 页面是浏览器 DOM | 页面是跨端组件树 |
| 请求只考虑浏览器 CORS | 还要考虑小程序合法域名、App 证书 |
| 可以直接用 `window` / `document` | 跨端业务优先用 `uni.*` 和状态驱动 |
| 组件只跑 H5 | 组件要看小程序、App 支持情况 |
| 本地存储用 `localStorage` | 用 `uni.setStorage` / `uni.getStorage` |
| CSS 按浏览器兼容想 | 还要考虑原生组件层级、rpx、安全区、滚动容器 |
| 路由参数可以配合前端 router 生态 | 页面参数主要从 `onLoad(query)` 拿 |

这不是说 uni-app 比 Vue 难，而是它多了一层“平台适配边界”。

## 十八、入职项目阅读顺序

接手公司 uni-app 项目，可以按这个顺序看：

1. 看 `package.json`：确认 Vue2/Vue3、运行命令、Pinia/Vuex、UI 组件库。
2. 看 `pages.json`：确认页面入口、tabBar、分包、globalStyle。
3. 看 `manifest.json`：确认发布端、appid、权限、App/H5/小程序配置。
4. 看 `main.js`：确认 Pinia、插件、全局组件、拦截器。
5. 看 `App.vue`：确认应用生命周期、全局初始化逻辑。
6. 看 `utils/request`：确认请求域名、token、错误处理、登录失效处理。
7. 看 `stores/`：确认用户、权限、全局配置、业务状态。
8. 看核心页面：从 tabBar 首页开始，顺着 `navigateTo` 找详情和流程页。
9. 看 `components/` 和 `uni_modules/`：确认哪些是自研组件，哪些来自插件市场。
10. 真正在目标端跑：H5、微信小程序、App 哪个是公司主战场，就优先跑哪个。

## 十九、暂时不用一开始钻太深的内容

这些内容重要，但可以放到第二阶段：

- `nvue`。
- `uni-app x`。
- `uts`。
- App 原生插件开发。
- App 云打包和离线打包。
- 各小程序平台的细碎兼容。
- uniCloud。
- 原生地图、视频、支付、推送的深度适配。

第一阶段先掌握：

```text
页面注册
生命周期
页面栈
内置组件
uni API
请求封装
状态管理
条件编译
跨端 CSS 和原生组件边界
```

## 二十、参考资料

- uni-app 官方文档：https://uniapp.dcloud.net.cn/
- 快速上手：https://uniapp.dcloud.net.cn/quickstart
- CLI 说明：https://uniapp.dcloud.net.cn/worktile/CLI.html
- 页面与生命周期：https://uniapp.dcloud.net.cn/tutorial/page
- pages.json 页面路由：https://uniapp.dcloud.net.cn/collocation/pages
- 条件编译：https://uniapp.dcloud.net.cn/tutorial/platform.html
- 组件文档：https://uniapp.dcloud.net.cn/component/
- API 概述：https://uniapp.dcloud.net.cn/api/
