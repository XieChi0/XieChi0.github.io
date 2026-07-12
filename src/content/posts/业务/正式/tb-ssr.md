---
title: SSR 服务端渲染笔记
published: 2026-07-12
updated: 2026-07-12
description: '梳理 SSR 与 SPA 的渲染差异、Vue / Nuxt SSR 实现思路与首屏性能优化要点。'
image: ''
tags: ['SSR', 'Vue', '性能优化']
category: '业务/正式'
private: true
draft: false
---

# SSR 服务端渲染笔记

## 一、先建立心智模型

在深入代码之前，先搞懂一个最基本的问题：**用户访问你的网站时，服务器到底在干什么？**

### **spa**

每个页面对应独立 HTML，跳转浏览器整页刷新，后端返回完整页面；

**SPA 模式（单页面应用）**

整个网站只有index.html，页面切换不再向服务端请求完整新页面，由前段通过 JS 动态替换、渲染页面局部内容，实现无刷新跳转的前端应用。

> 至于spa切换页面，资源如何获取，有两种
>
> 第一种是全部一开始加载，不过这样首屏文件巨大，白屏久
>
> 第二种是**路由懒加载**，进入当前页面才会加载对应页面的资源
>
> ```
> // 懒加载写法
> const routes = [
>   {
>     path: '/user',
>     // 访问 /user 时才执行import加载组件
>     component: () => import('@/views/User.vue')
>   }
> ]
> ```

### csr与ssr

CSR：浏览器执行 JS 后才生成页面内容
SSR：服务器先生成页面内容，之后浏览器执行jS是异步的，做水合



客户端渲染

```
用户浏览器
   │
   ▼ 1. 请求html
静态服务器
   │
   ▼ 2. 返回空壳index.html
浏览器解析html
   │
   ▼ 3. 请求bundle.js
静态服务器
   │
   ▼ 4. 返回完整JS包
浏览器执行JS
   │
   ▼ 5. 请求业务数据API
业务后端
   │
   ▼ 6. 返回JSON数据
浏览器JS渲染DOM → 页面展示完成
```

服务端渲染

```
用户浏览器
   │
   ▼ 1. 直接请求页面路由
Node SSR渲染服务
   │
   ├─▶ 2. 同步请求业务API
业务后端 ◀─┘
   │
   ▼ 3. 拿到数据，服务端生成完整带内容HTML
浏览器
   │
   ▼ 4. 直接渲染出可见页面（无需等JS）
   │
   ▼ 5. 后台异步加载客户端JS
浏览器执行JS → Hydration水合，页面可交互
```



### **三种不同的访问场景**

```text
1. SSR 页面 = 服务器提前渲染好内容，返回带内容的 HTML
2. 普通路由 = 服务器返回空壳 HTML，前端自己决定显示什么
3. 静态资源 = 服务器直接返回文件
```

理解了这个，后面看代码你就会明白：**SSR 中间件其实是在"截胡"白名单请求，而不是处理所有请求。**



---

## 二、什么是 SSR？⭐

**SSR = Server Side Rendering（服务端渲染）**

在**服务器**先把完整 HTML 字符串生成好，发给浏览器

流程：

```text
用户访问路由，请求打到 Node/Java 服务端
服务端执行 Vue/React 组件代码，请求后端接口拿数据
在服务器直接把组件 + 数据拼接成完整带内容的 HTML 字符串
把完整 HTML 一次性返回浏览器
浏览器直接渲染出可见页面（首屏立刻有内容）
再下载 JS 包， hydration（水合）：给页面绑定交互事件，变成可操作 SPA
关键点：服务端产出完整内容 HTML，浏览器先看页面，再做交互激活
```

|      | CSR（客户端渲染） | SSR（服务端渲染） |
| ---- | ----------------- | ----------------- |
| 首屏 | 慢，容易白屏等待  | 快，HTML 先有内容 |
| SEO  | 差，初始 HTML 内容少 | 好，爬虫更容易读到内容 |
| 交互 | JS 执行后才有页面和交互 | HTML 先显示，水合后可交互 |



---

## 三、使用链路：开发阶段、生产阶段、打包成两份

### 3.1 开发阶段：Vite 直接跑源码

开发阶段 SSR Server 不需要先生成 `ssr/server/entry-server.js`，而是让 Vite 直接从源码加载：

```typescript
const { render: renderFn } = await vite.ssrLoadModule('/src/entry-server.ts');
```

开发阶段主要依靠 Vite 的热更新。



### 3.2 生产阶段：先打包，再运行

生产环境不能每次请求都让 Vite 临时编译源码，所以要提前打包。

SSR 正式部署用：

```bash
npm run build:ssr
```

这里打包生成两个部分，

```text
build:client
  -> 生成给浏览器用的 dist/client/

build:server
  -> 生成给 Node.js SSR Server 用的 ssr/server/
```

打包后得到：

```text
tb-dock-ow/
├── dist/
│   └── client/
│       ├── index.html
│       └── assets/
│           ├── index-xxx.js
│           └── index-xxx.css
│
└── ssr/
    └── server/
        └── entry-server.js
```

这两份产物的用途不同：

| 产物 | 给谁用 | 作用 |
| ---- | ------ | ---- |
| `dist/client/` | 浏览器 | 下载 JS/CSS，完成水合和后续交互 |
| `ssr/server/` | Node.js SSR Server | import `entry-server.js`，调用 `render()` 生成 HTML |

生产环境里，SSR Server 不是再读 `src/entry-server.ts`，而是读构建后的文件：

```typescript
const { render: renderFn } = await import('./server/entry-server.js');
```

这里先粗略记住一句话：`entry-server` 是“服务端 Vue 入口”，它的任务是把 Vue App 渲染成 HTML 字符串；

真正接收 HTTP 请求、判断白名单、检查缓存、拼完整 HTML 的，是 `ssr/server.ts`。后面第四节会先把这几个文件的关系单独讲清楚。

### 完整请求流程（生产环境）

下面以用户访问首页 `/` 为例。端口不要死记，实际由环境变量决定：

- `SSR_PORT`：SSR 页面服务端口。
- `SSR_SERVER_API_PORT`：SSR 管理接口端口，用来刷新缓存。

```text
用户访问首页 /
       │
       ▼
┌─────────────────────────────────┐
│  Nginx / CDN / 反向代理          │
│                                 │
│  收到请求 /                      │
│  转发给 SSR Server              │
│  例如 127.0.0.1:${SSR_PORT}     │
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  tb-dock-ow SSR Server          │
│  文件：ssr/server.ts            │
│                                 │
│  1. 判断 URL 是否在 SSR_URLS     │
│     当前 "/" 命中白名单          │
│                                 │
│  2. 生产环境检查 HTML 缓存       │
│     第一次请求通常 MISS          │
│                                 │
│  3. import 构建产物              │
│     ssr/server/entry-server.js  │
│                                 │
│  4. 调用 render("/")             │
│     render 内部同时产出三样东西：│
│     a. 触发组件的 onServerPrefetch│
│        ──► 业务后端 API          │
│        ◄── 首屏数据（字典等） 
│		并把预加载数据序列化成__x9
│     b. renderToString → HTML 骨架│
│     c. 收集渲染过程产生的 CSS      │
│                                 │
│  5. server.ts 拼完整 HTML：       │
│     把 appHtml 塞进 index.html   │
│     注入 CSS（防闪屏）           │
│     把预加载数据加密成 __x9      │
│     注入 HTML                    │
│                                 │
│  6. 写入内存缓存                 │
│                                 │
│  7. 返回完整 HTML                │
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  浏览器收到 HTML                 │
│                                 │
│  <div id="app">                 │
│    <!-- 服务端渲染好的首页内容 -->│
│  </div>                         │
│                                 │
│  <script src="/assets/xxx.js">  │
│                                 │
│  此时用户已经能看到首屏内容       │
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  浏览器执行客户端 JS             │
│  文件：entry-client.ts           │
│                                 │
│  1. 读取并解密 __x9 数据         │
│  2. 恢复 Pinia 状态              │
│  3. 提供预加载数据               │
│  4. createSSRApp(App)            │
│  5. mount("#app") 完成水合       │
│  6. 页面变为可交互               │
└─────────────────────────────────┘
```

> 这里的__x9需要讲一下，这个里面是业务数据，在浏览器第一次收到服务端返回的html时候，其实页面上已经渲染好dom了，所以页面上用户可以看到数据，
>
> 浏览器第一次收到服务端返回的 HTML 时，页面上的 DOM 已经渲染好了，所以用户能直接看到内容；但这些 DOM 只是静态结果。等客户端 JS 开始执行时，它不会重新请求 `__x9`，而是从当前 HTML 里的 `<script id="__x9">` 读取并解密这份数据，用来恢复 Pinia 和组件状态，让后续交互接上同一份数据。

## 四、技术链路：先看核心文件和调用关系

正式看代码前，先把几个文件分清楚，否则很容易把 `server.ts` 和 `entry-server.ts` 混在一起。

| 文件 | 运行位置 | 主要职责 |
| ---- | -------- | -------- |
| `ssr/server.ts` | Node.js 服务进程 | 接收 HTTP 请求，判断 SSR 白名单，检查缓存，调用 `entry-server`，拼完整 HTML |
| `src/entry-server.ts` | Node.js SSR 渲染过程 | 创建服务端 Vue App，匹配路由，执行 `renderToString`，产出 Vue App HTML |
| `src/entry-client.ts` | 浏览器 | 读取 SSR 注入的数据，恢复 Pinia 状态，执行水合 |



| 文件 | 作用 | 谁调用它 | 什么时机调用 |
| ---- | ---- | -------- | ------------ |
| `src/utils/ssr.ts` | 提供 `useSsrData` / `getPreloadedSsrData`，负责 SSR 预加载数据的读写（同一份数据两端复用） | **服务端**：被 `entry-server.ts` 在 render 过程中调用（`useSsrData` 写）；**浏览器**：被 `entry-client.ts` 启动时调用（`getPreloadedSsrData` 读），组件 setup 里也会调 | **写**：组件 `onServerPrefetch` 触发时；**读**：客户端 JS 启动、解密 __x9 之后、组件 setup 执行时 |
| `ssr/ssr-payload-encryptor.ts` | 把预加载数据和 Pinia 状态加密成 `__x9` 脚本（提高明文数据被直接读取的门槛） | `ssr/server.ts` | `entry-server.render()` 返回 `preloadedSsrData` / `piniaState` 之后、注入 `__x9` 到 HTML 之前 |
| `src/utils/payload-decryptor.ts` | 读取并解密 `__x9`，还原成原始数据给客户端水合 | `entry-client.ts` | JS 文件下载完成开始执行时、恢复 Pinia 状态之前 |

先看一次总调用关系：

```text
用户请求 /
  -> ssr/server.ts
     -> 判断 / 是否在 SSR_URLS 白名单
     -> 检查 HTML 缓存
     -> 加载 ssr/server/entry-server.js
        -> 这个文件由 src/entry-server.ts 打包得到
     -> 调用 render("/")
        -> entry-server 创建 Vue SSR App
        -> router.push("/")
        -> renderToString(app)
        -> 返回 appHtml、preloadedSsrData、piniaState
     -> server.ts 把 appHtml 塞进 dist/client/index.html
     -> 注入 CSS、__x9、客户端资源入口
     -> 返回完整 HTML
  -> 浏览器执行 entry-client.ts
     -> 解密 __x9
     -> 恢复 Pinia / 预加载数据
     -> createSSRApp(App).mount("#app")
     -> 完成水合
```

一句话区分：

```text
ssr/server.ts = HTTP 服务调度者
entry-server.ts = Vue 服务端渲染入口
entry-client.ts = 浏览器水合入口
```

---

## 五、SSR Server 如何接住请求？

```text
tb-dock-ow/ssr/server.ts
```

它先根据环境变量判断当前运行环境（生产/开发）

然后创建 Express 服务：

```typescript
const app = express();
```

开发环境下，它会创建 Vite Dev Server：

```typescript
vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
});

app.use(vite.middlewares);
```

这解释了为什么开发阶段不用先打包：

```text
请求进来
  -> Express
  -> Vite middleware
  -> Vite 临时编译源码
```

生产环境下，没有 Vite middleware，SSR Server 会读取构建产物：

```typescript
template = fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8');
const { render: renderFn } = await import('./server/entry-server.js');
```

所以 `ssr/server.ts` 是一个调度者：

```text
收到请求
  -> 判断是不是管理接口
  -> 判断是不是 SSR 白名单 URL
  -> 判断缓存是否命中
  -> 加载 entry-server
  -> 调用 render
  -> 拼 HTML
  -> 返回响应
```

白名单判断也发生在这个文件里。SSR 白名单写在 `ssr/server.ts`：

```typescript
const SSR_URLS = ['/'];
```

请求进入中间件后，会先取出不带查询参数的路径：

```typescript
const url = req.originalUrl;
const urlPath = url.split('?')[0];
```

然后判断是否命中白名单：

```typescript
if (!SSR_URLS.includes(urlPath)) {
  return next();
}
```

这段代码说明：

```text
命中白名单
  -> 当前中间件继续处理
  -> 走 SSR

没有命中白名单
  -> next()
  -> 跳过 SSR
  -> 交给后续普通静态资源 / SPA 兜底逻辑
```

所以白名单的语义不是"允许通过不处理"，而是：

```text
允许进入 SSR 渲染流程的 URL 列表。
```

当前只有 `/`，所以首页是 SSR，其它页面仍然是 CSR / SPA 模式。

---

## 六、entry-server.ts 如何生成 HTML？⭐

`entry-server.ts` 是服务端 Vue 入口，它只运行在 Node.js 侧。

这个文件比较重要，因为它是真正“把 Vue 页面变成 HTML 字符串”的地方。先不看细碎代码，只看它做了哪几件事：

```text
ssr/server.ts 调用 render("/")
  -> 进入 src/entry-server.ts
     -> createSSRApp(App)
        创建一个服务端用的 Vue App 实例
     -> createPinia()
        创建服务端这一次渲染要用的状态容器
     -> createRouter(createMemoryHistory())
        创建服务端内存路由
     -> router.push("/")
        把路由定位到当前请求 URL
     -> provideSsrData(app, preloadedSsrData)
        准备一个预加载数据容器，给组件写入首屏数据
     -> renderToString(app)
        让 Vue 在 Node.js 里执行组件渲染
     -> 返回 html、preloadedSsrData、piniaState
  -> 回到 ssr/server.ts 继续拼完整 HTML
```

这里的“SSR App”可以先理解成：**在 Node.js 里临时创建出来的一份 Vue 应用实例**。它不是浏览器里那个长期运行的 App，而是为了当前这一次请求服务的。

这一次请求结束后，`entry-server.ts` 返回渲染结果；后续 HTML 怎么注入 CSS、怎么注入 `__x9`、怎么缓存和返回，仍然交给 `ssr/server.ts` 处理。

```typescript
const app = createSSRApp(App);
const pinia = createPinia();
const router = createRouter({
  history: createMemoryHistory(),
  routes: constantRoutes,
});
```

`createSSRApp` 是 Vue 提供的 SSR API，来自：

```typescript
import { createSSRApp } from 'vue';
```

它和普通客户端入口里的 `createApp` 很像，都是创建 Vue 应用实例；区别在于 `createSSRApp` 会按 SSR / hydration 的规则创建应用。

在服务端的 `entry-server.ts` 中，`createSSRApp(App)` 的作用是：

```text
把 App.vue 这棵组件树放进一个“可服务端渲染”的 Vue 实例里
  -> 后面 renderToString(app) 才能把它转成 HTML 字符串
```

在客户端的 `entry-client.ts` 中也会出现 `createSSRApp(App)`，但那里的作用不同：

```text
浏览器已经有服务端返回的 DOM
  -> 客户端 createSSRApp(App)
  -> mount("#app")
  -> Vue 接管已有 DOM，完成水合
```

所以同一个 API 在两端分别承担两个阶段：

```text
服务端：createSSRApp -> renderToString -> 生成 HTML
客户端：createSSRApp -> mount -> 水合已有 HTML
```

> 注：服务端渲染时没有真实浏览器，也就没有 `window.history`。所以服务端路由要用 `createMemoryHistory()` 在内存里模拟一次路由匹配。

服务端收到 URL 后，会先把路由推到目标地址：

```typescript
await router.push(url);
await router.isReady();
```

这里仍然是在 `src/entry-server.ts` 里。它叫 `entry-server`，就是因为这个文件专门作为“服务端渲染入口”。生产构建后，它会被 Vite 打包成 `ssr/server/entry-server.js`，再由 `ssr/server.ts` 动态 import。

然后创建 SSR 预加载数据容器：

```typescript
const preloadedSsrData: Record<string, any> = {};
provideSsrData(app, preloadedSsrData);
```

这里的“容器”不是特殊框架概念，可以理解成一个普通对象：

```text
preloadedSsrData = {}
```

服务端渲染组件时，如果组件通过 `useSsrData("Home", "dicts", fetch)` 请求到了数据，就会把结果写进这个对象里。等 `renderToString` 结束后，这个对象会被带回 `ssr/server.ts`，再加密进 `__x9`。

最后调用 Vue 官方服务端渲染方法：

```typescript
const html = await renderToString(app, renderContext);
```

`renderToString` 做的事情就是：

```text
Vue App
  -> 当前路由对应的页面组件
  -> 执行服务端可执行的 setup / onServerPrefetch
  -> 输出 HTML 字符串
```

最终 `entry-server.ts` 返回：

```typescript
return {
  html,
  preloadedSsrData,
  piniaState,
  ssrBootstrapScriptEntries,
};
```

这四个值会继续交给 `ssr/server.ts` 拼进最终 HTML。



---

## 七、ssr/server.ts 如何拼完整 HTML？

`entry-server.ts` 返回的 `html` 只是 Vue App 内部的 HTML，还不是完整页面。

完整页面需要基于 `dist/client/index.html` 拼出来：

```typescript
template = fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8');
```

然后把模板里的 SSR 占位符替换掉：

```typescript
let html = template.replace(`<!--ssr-outlet-->`, appHtml);
```

到这里，HTML 已经有服务端渲染出来的页面内容了。

接下来还要做三件事。

第一，注入 CSS：

```typescript
const styled = injectSsrStylesIntoHtml(html, clientDistDir, {
  inlineEnabled: inlineCssEnabled,
  inlineLimit: inlineCssLimit,
});
html = styled.html;
```

这个逻辑在 `ssr-style-injector.ts`。它会尽量把构建产物里的 CSS 内联到 HTML 里，目的是减少首屏样式闪动。

第二，注入预加载数据：

```typescript
const ssrPayloadScripts = buildSsrPayloadScripts(
  { preloadedSsrData, piniaState },
  { encryptionSecret: ssrPayloadSecret },
);
```

第三，修正客户端资源入口：

```typescript
html = applyClientAssets(html, manifest, isDev);
```

这样最终返回给浏览器的 HTML 同时包含：

```text
服务端渲染好的 DOM
CSS
加密后的预加载数据
客户端 JS 入口
```

---

## 八、entry-client.ts 如何完成水合？

浏览器拿到 SSR HTML 后，还不能算一个完整 Vue 应用，因为此时页面虽然能看，但事件、响应式状态、路由等还没有被客户端 Vue 接管。

客户端入口是：

```text
src/entry-client.ts
```

它第一步会尝试读取 SSR 注入的加密数据：

```typescript
hydrationPayload = await readEncryptedPayload();
```

如果读到了 payload，说明当前页面是 SSR HTML：

```typescript
const hasSsrHtml = Boolean(hydrationPayload);
```

然后根据是否是 SSR 页面，选择不同创建方式：

```typescript
const app = hasSsrHtml ? createSSRApp(App) : createApp(App);
```

这里很关键：

- `createSSRApp(App)`：用于接管服务端已经生成的 DOM，也就是水合。
- `createApp(App)`：用于普通 CSR，从空 DOM 开始渲染。

接着恢复 Pinia：

```typescript
const piniaState = hydrationPayload?.piniaState ?? {};
if (Object.keys(piniaState).length > 0) {
  pinia.state.value = piniaState;
}
```

再提供服务端预加载数据：

```typescript
const preloadedSsrData = hydrationPayload?.preloadedSsrData ?? {};
provideSsrData(app, preloadedSsrData);
```

最后挂载：

> 伦伦包包不回来

> 我就要看日记本了 看呗 我好像 干嘛 都带走了 不哭奥 好包 

```typescript
app.mount('#app');
```

所以水合可以理解为：

```text
已有 HTML DOM
  -> 客户端 Vue 创建同样的 App
  -> 读取服务端注入的状态
  -> 对齐路由和数据
  -> 绑定事件和响应式能力
  -> 页面变为可交互
```

---

## 九、组件内数据预加载怎么写？

SSR 页面不能只在 `onMounted` 请求首屏数据，因为 `onMounted` 只会在浏览器执行，不会在服务端执行。

先明确当前所处阶段：这里说的“数据预加载”，发生在**服务端渲染期间**。

更具体地说：

```text
ssr/server.ts
  -> 调用 entry-server.render(url)
     -> entry-server.ts 创建 Vue SSR App
     -> renderToString(app) 开始执行组件渲染
        -> 组件 setup 执行
        -> onServerPrefetch 执行
        -> useSsrData 请求首屏数据
```

所以数据预加载不是浏览器里的 `entry-client.ts` 阶段，也不是 HTML 已经返回之后才发生。它发生在 `entry-server.ts` 调用 `renderToString(app)` 的过程中。

所以服务端预加载要使用：

```typescript
onServerPrefetch
```

本项目封装了两个工具：

```typescript
useSsrData(componentName, variableName, fetch)
getPreloadedSsrData(componentName, variableName)
```

它们在：

```text
src/utils/ssr.ts
```

`useSsrData` 的核心逻辑是：

```typescript
const result = await fetch();

if (isSsr() && preloadedData) {
  preloadedData[key] = result;
}
```

也就是：

```text
服务端执行 fetch
  -> 得到数据
  -> 存进 preloadedSsrData
  -> 后续注入 HTML
```

首页真实代码里有类似用法：

```typescript
const res = await useSsrData("Home", "dicts", () =>
  Dict.get({ types: dictTypes, hideLoading: true }),
);
```

服务端：

```typescript
if (isSsr()) {
  onServerPrefetch(async () => {
    await loadDictData();
    filters.pageSize = 10;
    await dockStore.loadDockList();
    firstSearch.value = false;
  });
}
```

客户端：

```typescript
const preloadedHomeDictData = getPreloadedSsrData<any[]>("Home", "dicts");
if (Array.isArray(preloadedHomeDictData)) {
  applyHomeDictData(preloadedHomeDictData as any[]);
}
```

这条链路的目的有两个：

1. 服务端渲染 HTML 时已经有首屏数据。
2. 客户端水合时复用同一份数据，避免重复请求和内容闪动。

---

## 十、__x9 加密数据是什么？

`__x9` 是服务端塞进 HTML 里的一个加密数据包。

它里面主要放两类数据：

```text
1. preloadedSsrData
   -> 组件服务端预加载出来的业务数据
   -> 例如首页字典、列表初始数据等

2. piniaState
   -> 服务端渲染时 Pinia 里的状态快照
```

为什么要放这些数据？因为 SSR 首帧 HTML 已经用这些数据渲染出了 DOM，但浏览器后续执行客户端 JS 时，还需要知道“这些 DOM 背后的状态是什么”。否则客户端水合时只看到 DOM，却没有对应的数据状态，后续交互就接不上。

最简单的做法是明文注入：

```html
<script>
  window.__SSR_DATA__ = {...}
</script>
```

但这样数据是明文，打开源码就能看到。

本项目的做法是：**服务端先把这些数据加密，再把密文注入 HTML；浏览器水合前，再从 HTML 里读取并解密。**

整体过程是：

```text
服务端阶段：
  preloadedSsrData + piniaState
    -> 加密成 __x9
    -> 注入 HTML
    -> HTML 返回浏览器

浏览器阶段：
  entry-client.ts 启动
    -> 从 HTML 中找到 <script id="__x9">
    -> 解密得到 preloadedSsrData + piniaState
    -> 恢复 Pinia
    -> provideSsrData 给组件
    -> 开始水合
```

服务端**加密**：

```text
ssr/ssr-payload-encryptor.ts
```

处理过程是：

```text
preloadedSsrData + piniaState
  -> JSON.stringify
  -> gzip 压缩
  -> AES-256-GCM 加密
  -> base64url
  -> 注入 <script id="__x9">
```

客户端**解密**在：

```text
src/utils/payload-decryptor.ts
```

readEncryptedPayload ( ) 会：

```text
找到 <script id="__x9">
  -> 读取密文
  -> 移除 script 标签
  -> base64url 还原
  -> AES-GCM 解密
  -> gunzip 解压
  -> JSON.parse
  -> 返回 preloadedSsrData 和 piniaState
```

这不是绝对防爬，但它改变了数据暴露方式：不再把服务端预加载数据明文挂到页面上，提高了低成本逆向的门槛。

---

## 十一、缓存机制

SSR 缓存的位置在 SSR Server 进程内存里，使用的是 `node-cache`：

```typescript
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
```

当前缓存的是完整 HTML 字符串，不是接口数据。

也就是说缓存内容包括：

```text
最终 HTML
  + 服务端渲染好的 DOM
  + 内联 CSS
  + 加密数据脚本 __x9
  + 客户端资源入口
```

命中缓存时：

```typescript
const cached = cache.get<string>(url);
if (cached) {
  res.status(200).set({
    'Content-Type': 'text/html',
    'X-SSR-Cache': 'HIT',
  }).end(cached);
  return;
}
```

未命中时：

```text
重新 render
  -> 拼 HTML
  -> cache.set(url, html)
  -> 返回 X-SSR-Cache: MISS
```

注意几个边界：

- 开发环境不缓存。
- 生产环境缓存。
- 默认 1 小时过期。
- SSR 进程启动时会 `cache.flushAll()`。
- 当前默认按完整 URL 作为缓存 key。

刷新缓存接口：

```text
POST /refreshCache
```

这个接口监听在管理端口 `SSR_SERVER_API_PORT` 上，并且只允许本机访问。

调用示例应该以实际环境变量为准：

```bash
curl -X POST http://127.0.0.1:${SSR_SERVER_API_PORT}/refreshCache \
  -H 'Content-Type: application/json' \
  -d '{"urls":["/"]}'
```

后端服务里也有对应调用：

```typescript
const requestUrl = `http://127.0.0.1:${port}/refreshCache`;
```

---

## 十二、关键术语

| 术语 | 含义 |
| ---- | ---- |
| SSR | Server Side Rendering，服务端渲染 |
| CSR | Client Side Rendering，客户端渲染 |
| SPA 兜底 | 非 SSR 前端路由返回同一个 `index.html`，由浏览器里的 Vue Router 接管 |
| 静态资源 | JS、CSS、图片等真实文件，例如 `/assets/index.js` |
| SSR 白名单 | 允许进入 SSR 渲染流程的 URL 列表，目前是 `['/']` |
| 水合（Hydrate） | 客户端 Vue 接管服务端已有 HTML，并绑定事件和响应式状态 |
| `entry-server.ts` | 服务端入口，负责把 Vue 渲染成 HTML |
| `entry-client.ts` | 客户端入口，负责恢复状态并水合 |
| `__x9` | SSR 加密预加载数据的脚本 ID |
| `preloadedSsrData` | 服务端预取、客户端水合时复用的数据 |
| `piniaState` | 服务端渲染时收集的 Pinia 状态 |

---

## 十三、CI/CD 自动化部署

SSR 项目部署时不能只构建普通前端资源，因为生产环境还需要 `ssr/server/entry-server.js`。

自动部署脚本在：

```text
tb-dock-server/cicd/deploy-ow.sh
```

生产环境使用：

```bash
npm run build:ssr
```

测试环境使用：

```bash
npm run build:ssr:test
```

整体流程：

```text
开发者 push 代码到 Gitee
         │
         ▼
Gitee Webhook 推送通知
         │
         ▼
webhook-server-ow.js
  -> 验证签名
  -> 判断分支 master / develop
  -> 触发 deploy-ow.sh
         │
         ▼
deploy-ow.sh
  -> git fetch
  -> git reset 到目标分支
  -> npm install
  -> npm run build:ssr 或 npm run build:ssr:test
  -> pm2 restart
  -> 健康检查
  -> 企业微信通知
```

这里最关键的是构建命令：

```text
npm run build:ssr
  -> dist/client/
  -> ssr/server/
```

如果只生成 `dist/client/`，浏览器资源是有了，但 SSR Server 没有服务端入口产物，就不能在生产环境调用 `entry-server.js` 渲染 HTML。

---

## 十四、面试回答

我们这个项目不是全站 SSR，而是手动实现了一个"部分页面 SSR，其余页面 CSR / SPA 兜底"的方案。原因是只有首页这类页面有首屏和 SEO 价值，其他带登录态或者没有 SEO 价值的页面没有必要都放到服务端渲染。

构建上，我们用 Vite 打两份产物。一份是 `dist/client/`，给浏览器下载 JS/CSS，用来水合和后续交互；另一份是 `ssr/server/`，给 Node.js SSR Server 使用。生产环境里 SSR Server 会 import `ssr/server/entry-server.js`，调用里面的 `render(url)` 生成 HTML。

用户访问首页 `/` 时，请求会先到 Nginx / CDN，再转发到 SSR Server。SSR Server 会判断 URL 是否在 SSR 白名单里。当前首页 `/` 在白名单中，所以会进入 SSR 流程。然后它先检查内存缓存，如果没命中，就读取 `dist/client/index.html`，调用 `entry-server` 渲染 Vue App，把生成的 HTML 塞进 `<!--ssr-outlet-->`，再注入 CSS 和加密后的预加载数据，最后返回给浏览器。

浏览器收到 HTML 后，`#app` 里面已经有服务端渲染好的 DOM，所以用户能先看到首屏内容。之后浏览器继续下载客户端 JS，执行 `entry-client.ts`，读取并解密 `__x9` 中的预加载数据，恢复 Pinia 状态，然后用 `createSSRApp` 挂载到 `#app` 上完成水合。水合完成后，这个页面就从"能看到的 HTML"变成了"可交互的 Vue 应用"。

对于不在白名单里的页面，比如 `/about`，SSR 中间件会 `next()` 跳过，不生成专属 HTML，而是走普通 SPA 兜底：返回同一个 `index.html`，由浏览器里的 Vue Router 根据 `/about` 渲染页面。对于 `/assets/index.js` 这种请求，它不是页面请求，而是静态资源请求，直接从 `dist/client/assets/` 返回真实文件。

所以这个 SSR 实现的核心可以概括成一句话：**服务端只提前渲染有价值的白名单页面，浏览器仍然负责水合和后续交互，普通页面继续保持 SPA 模式。**

---

## 十五、Q&A

### 1. 如何理解 CSR 和 SSR 是同构的？

“同构”指的是：同一套 Vue 组件代码，既可以在服务端运行一次，也可以在浏览器运行一次。

在本项目里，同构体现在：

```text
同一套 App.vue / routes / 页面组件
  -> 服务端入口 entry-server.ts 创建 createSSRApp(App)
  -> 浏览器入口 entry-client.ts 也创建 createSSRApp(App)
```

服务端运行这套组件，是为了生成首帧 HTML；浏览器运行这套组件，是为了接管这份 HTML，让它变成可交互应用。

所以不是“SSR 一套代码、CSR 另一套代码”，而是：

```text
同一套组件
  -> 在服务端先跑一遍，产出 HTML
  -> 在浏览器再跑一遍，对齐 DOM、状态和事件
```

这就是同构。

### 2. SSR 首帧之后，水合是如何发生的？

服务端返回的 HTML 里已经有 `<div id="app">...</div>`，浏览器能立刻显示页面，但这时它还只是静态 DOM：按钮、筛选、状态响应式还没有被 Vue 接管。

水合发生在 `entry-client.ts`：

```typescript
const app = hasSsrHtml ? createSSRApp(App) : createApp(App);
app.mount('#app');
```

如果页面里存在 SSR 注入的 payload，`hasSsrHtml` 为 true，客户端就用 `createSSRApp(App)` 创建应用。Vue 会用这套客户端组件树去匹配服务端已经生成好的 DOM，而不是把 DOM 全部删掉重建。

水合过程可以理解为：

```text
服务端已经生成的 DOM
  -> 客户端创建同构 Vue App
  -> 恢复服务端注入的数据和 Pinia 状态
  -> Vue 对齐现有 DOM
  -> 绑定事件、响应式状态和组件生命周期
  -> 页面可交互
```

### 3. 什么是数据预加载？

数据预加载就是：服务端渲染 HTML 之前，先把首屏需要的数据请求回来。

如果没有预加载，SSR 只能渲染一个空列表或占位结构，浏览器还要等 JS 执行后再请求数据，那首屏内容仍然不完整。

所以 SSR 首屏数据应该在服务端先准备好：

```text
服务端渲染页面前
  -> 请求字典、列表等首屏数据
  -> 用这些数据渲染 HTML
  -> 把同一份数据注入 HTML
  -> 客户端水合时复用
```

它解决的是两个问题：

1. 首屏 HTML 里有真实内容。
2. 客户端水合时不用重复请求同一份首屏数据。

### 4. 怎样预加载？

在 Vue SSR 里，组件可以用 `onServerPrefetch` 表示“服务端渲染前先执行这段异步逻辑”。

本项目又封装了一层：

```typescript
useSsrData(componentName, variableName, fetch)
```

首页里的用法类似：

```typescript
const res = await useSsrData("Home", "dicts", () =>
  Dict.get({ types: dictTypes, hideLoading: true }),
);
```

服务端执行时，`useSsrData` 会：

```text
调用 fetch
  -> 拿到接口数据
  -> 生成 key，例如 Home:dicts
  -> 写入 preloadedSsrData
```

`entry-server.ts` 在 `renderToString` 结束后会把 `preloadedSsrData` 返回给 `ssr/server.ts`，后者再把它和 `piniaState` 一起交给 `buildSsrPayloadScripts` 加密注入 HTML。

### 5. 数据怎样水合进去？

服务端把预加载数据注入 HTML 时，不是明文挂到 `window` 上，而是生成一个加密脚本：

```html
<script id="__x9" type="application/octet-stream">...</script>
```

浏览器执行 `entry-client.ts` 时，会先调用：

```typescript
hydrationPayload = await readEncryptedPayload();
```

这一步会读取 `__x9`，解密并解析出：

```typescript
{
  preloadedSsrData,
  piniaState
}
```

然后客户端做两件事：

```typescript
pinia.state.value = piniaState;
provideSsrData(app, preloadedSsrData);
```

这样组件在客户端水合阶段调用 `getPreloadedSsrData("Home", "dicts")` 时，就能读到服务端已经请求过的数据。

数据流向是：

```text
服务端 useSsrData
  -> preloadedSsrData
  -> buildSsrPayloadScripts 加密成 __x9
  -> HTML 返回浏览器
  -> readEncryptedPayload 解密
  -> provideSsrData 注入客户端 Vue App
  -> 组件 getPreloadedSsrData 读取
```

### 6. 如何理解 SSR 只负责生成首帧，之后由 CSR 接管生命流程？

SSR 的职责到“返回首帧 HTML”基本就结束了。它负责的是：

```text
请求到达服务端
  -> 匹配路由
  -> 预加载首屏数据
  -> renderToString
  -> 拼完整 HTML
  -> 返回浏览器
```

浏览器拿到 HTML 后，页面的生命周期就逐渐转移到客户端：

```text
浏览器显示服务端 HTML
  -> 下载客户端 JS
  -> entry-client.ts 执行
  -> 解密并恢复 SSR 数据
  -> createSSRApp(App).mount("#app")
  -> 水合完成
  -> 后续点击、筛选、路由跳转、状态变化都由客户端 Vue 接管
```

所以 SSR 和 CSR 的关系不是互斥，而是接力：

```text
SSR：负责第一次可见内容
CSR：负责水合后的交互、状态变化和后续路由生命周期
```

也可以把数据生命周期理解成三段：

```text
服务端阶段：
  onServerPrefetch / useSsrData 请求数据
  -> 数据进入 preloadedSsrData 和 Pinia

传输阶段：
  preloadedSsrData + piniaState
  -> 加密成 __x9
  -> 随 HTML 返回浏览器

客户端阶段：
  entry-client 解密 __x9
  -> 恢复 Pinia 和 provideSsrData
  -> 组件复用预加载数据
  -> 后续数据更新进入普通 CSR 生命周期
```

这就是“SSR 生成首帧，CSR 接管后续生命流程”的意思。
