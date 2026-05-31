---
title: Vue 最小项目启动流程
published: 2026-05-29
updated: 2026-05-29
description: 从真实 Vue3 + Vite 项目出发，理解 index.html、main.ts、App.vue、router、store 之间的关系
tags: [Vue, Vue3, Vite, 前端, 项目结构]
category: 前端/Vue
draft: false
---

## 为什么要单独写这一篇

我之前学 Vue 的时候，很容易卡在一个地方：教程里经常写一个特别小的例子，比如：

```js
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue'
  }
})
```

这个例子当然没错，但它太理想化了。真正打开一个项目时，看到的是 `index.html`、`main.ts`、`App.vue`、`router`、`store`、`plugins`、`permission.ts` 这些文件，一下子就会变成：

这个项目到底先执行哪个文件？

Vue 实例在哪里创建？

`App.vue` 是怎么被渲染出来的？

路由、Pinia、Element Plus 这些东西为什么都在 `main.ts` 里注册？

这篇就拿一个真实项目来讲，但是我不会把源码全贴出来，只摘关键部分。目标是把“Vue 项目启动到页面渲染”的主线讲清楚。

## 先看最关键的文件

这个项目是 Vue 3 + Vite + TypeScript，大致可以先抓住这几个文件：

```txt
项目根目录
├── index.html
├── vite.config.ts
└── src
    ├── main.ts
    ├── App.vue
    ├── router
    │   ├── index.ts
    │   └── modules/remaining.ts
    ├── store
    │   ├── index.ts
    │   └── modules/app.ts
    ├── components/index.ts
    ├── directives/index.ts
    └── permission.ts
```

如果只想理解启动流程，不要一开始就钻进所有业务页面。先按这条线看：

```txt
index.html
  -> src/main.ts
    -> createApp(App)
      -> 安装 router / store / 插件
        -> app.mount('#app')
          -> App.vue
            -> RouterView
              -> 当前路由匹配到的页面组件
```

这就是一个 Vue 项目从“浏览器打开页面”到“真正显示业务页面”的主链路。

## index.html：浏览器最先看到的文件

在 Vite 项目里，根目录的 `index.html` 不是摆设，它是浏览器真正先加载的 HTML。

项目里最关键的是这两处：

```html
<div id="app">
  <div class="app-loading">
    <!-- 这里是首屏 loading -->
  </div>
</div>

<script type="module" src="/src/main.ts"></script>
```

这里有两个重点。

第一个，`<div id="app">` 是 Vue 应用最终要挂载的位置。你可以把它理解成 Vue 接管页面的容器。

第二个，`<script type="module" src="/src/main.ts"></script>` 才是真正把项目代码拉起来的入口。浏览器加载这个脚本后，才会进入 `main.ts`。

所以启动第一步不是 `App.vue`，也不是路由，而是：

```txt
浏览器加载 index.html
浏览器发现 /src/main.ts
Vite 处理 main.ts 以及它 import 的所有模块
```

项目里 `#app` 里面还写了 loading，这个很好理解：Vue 还没挂载完成时，先显示这段静态 loading；等 Vue 挂载后，Vue 渲染出来的内容会替换这个容器里的内容。

## main.ts：Vue3 创建应用实例的地方

这个项目是 Vue3，所以 `src/main.ts` 里不会再写 Vue2 的 `new Vue(...)`，而是用 Vue3 的 `createApp`：

```ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
```

这句话创建的是 **Vue 应用实例**。注意，它不是创建 `main.ts` 的实例，也不是创建路由实例；它是在说：以 `App.vue` 作为根组件，创建整个前端应用。

如果是一个最小 Vue3 项目，通常可以直接写成：

```ts
createApp(App).mount('#app')
```

意思是：

```txt
createApp(App)：创建 Vue3 应用，根组件是 App.vue
mount('#app')：把应用挂载到 index.html 的 #app 节点上
```

这个项目之所以写得更长，是因为挂载前还要先注册路由、状态管理、组件库、指令等能力：

```ts
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)
  setupStore(app)
  setupRouter(app)

  await router.isReady()

  app.mount('#app')
}

setupAll()
```

主线不要被这些 `setupXXX` 干扰：

```txt
先 createApp(App)
再给 app 安装能力
最后 app.mount('#app')
```

顺手对比一下 Vue2。Vue2 入门示例里常见的是：

```js
new Vue({
  el: '#app',
  data: {
    message: 'hello vue'
  }
})
```

这是 Vue2 的 `el` 写法：创建实例时就通过 `el` 自动挂载，适合 CDN 引入、直接写在 HTML 里的简单例子。

Vue2 工程化项目里也常见另一种：

```js
new Vue({
  render: h => h(App)
}).$mount('#app')
```

这也是 Vue2。它和 Vue3 的写法更像，都是从 `App.vue` 这个根组件开始渲染，只是 Vue2 用 `new Vue(...).$mount('#app')`，Vue3 改成了 `createApp(App).mount('#app')`。

面试准备时记这个表就够了：

| 写法 | 版本 | 场景 |
| --- | --- | --- |
| `new Vue({ el: '#app' })` | Vue2 | CDN/HTML 入门例子 |
| `new Vue({ render: h => h(App) }).$mount('#app')` | Vue2 | Vue2 工程化项目 |
| `createApp(App).mount('#app')` | Vue3 | Vue3 工程化项目 |

它们最终都是挂载到 `#app`，但现在看 Vue3 项目时，优先抓住 `createApp(App)` 和 `app.mount('#app')` 这条线。

## app.use 是在给 Vue 应用装插件

你看到 `main.ts` 里有很多 `setupXXX(app)`，不要把它们都理解成“又创建了一个 Vue 实例”。

大多数时候，它们是在给同一个 `app` 安装能力。

比如状态管理：

```ts
// src/store/index.ts
const store = createPinia()
store.use(piniaPluginPersistedstate)

export const setupStore = (app: App<Element>) => {
  app.use(store)
}
```

这里的 `createPinia()` 创建的是 Pinia 的 store 容器，然后 `app.use(store)` 把 Pinia 安装到 Vue 应用里。这样组件中才能使用各种 `useXxxStore()`。

比如路由：

```ts
// src/router/index.ts
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
  routes: remainingRouter,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}
```

这里 `createRouter()` 创建的是路由实例，然后 `app.use(router)` 把路由安装到 Vue 应用里。安装后，项目里才可以用 `<RouterView />`、`router.push()`、`useRoute()` 这些路由能力。

比如多语言：

```ts
export const setupI18n = async (app: App<Element>) => {
  const options = await createI18nOptions()
  i18n = createI18n(options) as I18n
  app.use(i18n)
}
```

这里 `createI18n()` 创建的是 i18n 插件实例，最后也是通过 `app.use(i18n)` 安装到 Vue 应用中。

所以要分清楚：

| 代码 | 创建的是什么 | 作用 |
| --- | --- | --- |
| `createApp(App)` | Vue 应用实例 | 整个前端应用的根 |
| `createRouter(...)` | 路由实例 | 管理 URL 和页面组件的对应关系 |
| `createPinia()` | Pinia 容器 | 管理全局状态 |
| `createI18n(...)` | 多语言插件实例 | 管理语言包和翻译 |
| `app.use(...)` | 不是创建实例 | 把某个插件安装到 Vue 应用上 |
| `app.mount('#app')` | 不是创建实例 | 把 Vue 应用挂载到真实 DOM |

这样看 `main.ts` 就不会乱了。它不是在到处创建 Vue 实例，而是在创建一个 Vue 应用，然后给这个应用装东西。

## App.vue：根组件，但不是最终页面

`App.vue` 是 `createApp(App)` 里的那个 `App`。

这个项目的 `App.vue` 核心结构是：

```vue
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import routerSearch from '@/components/RouterSearch/index.vue'

const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
    <routerSearch />
  </ConfigGlobal>
</template>
```

这里有几个重点。

`App.vue` 是根组件，它不是某一个具体业务页面。它更像整个应用的外壳。

`ConfigGlobal` 是全局配置组件，用来包住整个应用，比如统一 Element Plus 组件尺寸。

`RouterView` 是路由出口。当前 URL 匹配到哪个页面组件，哪个组件就会渲染到这里。

`routerSearch` 是全局路由搜索组件，它放在 `App.vue` 里，所以整个应用都能使用。

所以页面真正显示哪个业务组件，不是 `App.vue` 自己决定的，而是路由决定的：

```txt
App.vue 负责提供壳子
RouterView 负责占位置
router/index.ts 负责根据 URL 找组件
```

## RouterView：页面组件是怎么被放进来的

路由实例是在 `src/router/index.ts` 里创建的：

```ts
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_PATH),
  strict: true,
  routes: remainingRouter,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
```

这里的 `routes: remainingRouter` 表示初始路由来自 `src/router/modules/remaining.ts`。

比如项目里有这样的路由：

```ts
{
  path: '/',
  component: Layout,
  redirect: '/index',
  name: 'Home',
  children: [
    {
      path: 'index',
      component: () => import('@/views/Home/Index.vue'),
      name: 'Index',
      meta: {
        title: t('router.home'),
        icon: 'ep:home-filled',
        noCache: false,
        affix: true
      }
    }
  ]
}
```

这段意思大概是：

```txt
访问 /
重定向到 /index
/index 对应 src/views/Home/Index.vue
最终这个页面会显示在 RouterView 里面
```

这里的 `component: () => import(...)` 是懒加载组件。只有访问到这个路由时，才加载对应页面文件。

## meta 不是实例，它是路由的附加信息

你可能会看到路由里有很多 `meta`：

```ts
meta: {
  title: '首页',
  icon: 'ep:home-filled',
  hidden: true,
  noTagsView: true,
  canTo: true
}
```

这个 `meta` 不是 Vue 实例，也不是组件实例。它只是路由对象上的一个配置字段，用来保存额外信息。

比如：

| meta 字段 | 大概作用 |
| --- | --- |
| `title` | 菜单、标签页、浏览器标题里显示的名字 |
| `icon` | 菜单图标 |
| `hidden` | 是否隐藏在侧边栏 |
| `noCache` | 是否不缓存页面 |
| `noTagsView` | 是否不显示在标签页 |
| `affix` | 是否固定在标签页 |
| `canTo` | 即使隐藏，也允许跳转 |

这些信息之后会被菜单、面包屑、标签页、权限逻辑读取。

比如 `permission.ts` 里路由跳转完成后会设置标题：

```ts
router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
})
```

意思是：路由切换完成后，拿当前路由的 `meta.title` 去更新页面标题。

所以 `meta` 更像“路由说明书”，不是实例。

## store：为什么 App.vue 可以用 useAppStore

`App.vue` 里用了：

```ts
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
```

这个能力来自 Pinia。

在 `src/store/index.ts` 里：

```ts
const store = createPinia()

export const setupStore = (app: App<Element>) => {
  app.use(store)
}
```

而在 `src/store/modules/app.ts` 里：

```ts
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      title: '云水食安|校园餐智慧监管平台',
      greyMode: false,
      currentSize: 'default'
    }
  },
  getters: {
    getGreyMode(): boolean {
      return this.greyMode
    }
  }
})
```

所以它的关系是：

```txt
main.ts
  -> setupStore(app)
    -> app.use(createPinia())
      -> 组件里可以 useAppStore()
        -> 拿到 app 这个 store 里的状态
```

这里也容易混：

`createPinia()` 创建的是 Pinia 容器。

`defineStore('app', ...)` 定义的是一个具体 store。

`useAppStore()` 是在组件里使用这个 store。

它们都不是 Vue 应用实例。Vue 应用实例还是 `createApp(App)` 创建的那个 `app`。

## permission.ts：为什么 main.ts 要 import 它

`main.ts` 里有一句：

```ts
import './permission'
```

这个文件没有导出什么东西，但它一被引入，就会执行里面的代码，注册路由守卫：

```ts
router.beforeEach(async (to, from, next) => {
  if (getAccessToken()) {
    // 有 token，继续判断用户信息和动态路由
  } else {
    // 没 token，跳登录页
  }
})
```

所以 `permission.ts` 的作用不是创建页面，而是在路由跳转前做检查：

```txt
有没有 token？
有没有用户信息？
有没有动态菜单路由？
能不能进入这个页面？
如果不能，要跳去哪里？
```

这类文件通常叫“路由守卫”或“权限守卫”。

## @ 符号是什么意思

项目里经常看到：

```ts
import { setupStore } from '@/store'
import App from './App.vue'
```

`./App.vue` 是相对路径。

`@/store` 里的 `@` 是路径别名，通常指向 `src`。

这个项目在 `vite.config.ts` 里配置了：

```ts
resolve: {
  alias: [
    {
      find: /@\//,
      replacement: `${pathResolve('src')}/`
    }
  ]
}
```

所以：

```ts
@/store
```

等价于：

```txt
src/store
```

这个东西只是为了少写很长的相对路径。

## 抽成一个最小能跑版本

如果把这个项目压缩成最小版本，它大概长这样。

### index.html

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

### src/main.ts

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

### src/App.vue

```vue
<template>
  <RouterView />
</template>
```

### src/router/index.ts

```ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '首页'
      }
    }
  ]
})

export default router
```

这个最小版本就已经包含了：

```txt
HTML 入口
Vue 应用实例
根组件
路由实例
状态管理容器
页面渲染出口
```

真实项目只是在这个基础上继续加东西：

```txt
Element Plus
全局组件
全局样式
权限指令
路由守卫
多语言
动态路由
页面缓存
标签页
主题配置
```

但主线没有变。

## 最后按执行顺序捋一遍

真正启动时，大概是这个顺序：

1. 浏览器打开页面，加载根目录 `index.html`。
2. `index.html` 里先显示 `#app` 内的静态 loading。
3. 浏览器执行 `<script type="module" src="/src/main.ts">`。
4. Vite 处理 `main.ts` 里的各种 `import`。
5. `main.ts` 执行 `createApp(App)`，创建 Vue 应用实例。
6. 执行 `setupI18n(app)`，安装多语言。
7. 执行 `setupStore(app)`，安装 Pinia。
8. 执行 `setupRouter(app)`，安装 Vue Router。
9. 执行 `setupAuth(app)` 等，注册全局指令。
10. 执行 `await router.isReady()`，等路由准备好。
11. 执行 `app.mount('#app')`，Vue 接管 `index.html` 里的 `#app`。
12. `App.vue` 被渲染。
13. `App.vue` 中的 `<RouterView />` 根据当前路由渲染页面组件。
14. 如果路由守卫需要登录校验或动态路由，就由 `permission.ts` 处理跳转逻辑。

## 我自己的理解

如果把 Vue 项目想象成一条生产线：

`index.html` 是厂房，里面先留了一个叫 `#app` 的空位。

`main.ts` 是开机按钮，它创建 Vue 应用，并把路由、状态管理、组件库这些机器装上。

`App.vue` 是总框架，它不一定写具体业务，但它决定整个应用外壳长什么样。

`RouterView` 是页面出口，当前路由匹配到哪个页面，哪个页面就从这里显示出来。

`router/index.ts` 是导航表，告诉项目“什么路径对应什么页面”。

`store` 是公共数据仓库，多个组件都要用的数据可以放这里。

`meta` 是路由的附加说明，比如标题、图标、是否隐藏，不是实例。

抓住这条线，再看复杂项目就不会那么乱了：先找 `index.html`，再找 `main.ts`，再看 `createApp(App)`，然后顺着 `App.vue` 的 `RouterView` 去找路由和页面组件。
