---
title: tb-面试讲解
published: 2026-06-05
updated: 2026-06-06
description: '围绕 TBDock 项目的生态搭建、官网性能优化与动态表单体系整理面试讲解思路。'
image: ''
tags: ['面试讲解', 'Vue']
category: '业务/正式'
private: true
draft: false
---

# TBDock 简历项目面试讲解稿

> 这份文档只围绕简历里直接写到的重点展开：生态搭建、官网性能优化、动态表单体系。AI 资料采集工作流不在这里展开，可以放到另一份专门文档里讲。

## 0. 先把项目讲清楚

TBDock 是一个面向雷电扩展坞硬件资料管理和对外展示的全栈平台，包含 Vue3 管理后台、Vue SSR 官网和 NestJS 服务端，主要解决硬件资料分散、参数复杂、录入效率低、官网首屏慢和 SEO 收录差的问题。

衔接到简历三条：

> 所以我主要做了三件事：第一，从 0 到 1 搭建前台、后台和服务端生态；第二，针对官网做 SSR、缓存、异步加载和构建优化；第三，针对复杂硬件参数做动态表单和结构化录入体系。

## 1. 生态搭建：我从 0 到 1 搭了什么

### 1.1 为什么拆成官网、后台和服务端

这个项目天然分成三个职责：

- 官网：给普通用户访问，重点是首屏速度、SEO、筛选和对比体验。
- 后台：给维护者使用，重点是复杂数据录入、编辑、字典维护、反馈处理。
- 服务端：统一管理数据模型、接口、鉴权、上传、日志、缓存刷新。



### ⭐1.2 服务端模块怎么拆

服务端核心文件在 [tb-dock-server/src/app.module.ts](F:/zz_blog/tb-dock/tb-dock-server/src/app.module.ts)。

主要模块：

- `DockModule`：扩展坞产品、端口、视频能力的增删改查。
- `DictModule`：品牌、接口类型、分辨率、系统、货币等字典。
- `AuthModule / SysUserModule`：后台登录、JWT、刷新 token、用户管理。
- `CommonModule`：数据库备份、官网首页缓存刷新。
- `CosModule / CdnModule`：图片上传、CDN 和 SSR 缓存刷新。
- `FeedbackModule / LogModule`：用户反馈和请求日志。

这里不能只停留在“模块名字”，最好顺手指出 **`AppModule`** 的职责：它把配置、Redis、定时任务和业务模块统一装配起来，同时把 JWT 守卫、参数校验、日志拦截、统一响应包装和异常处理挂成全局能力。

代码示例（服务端总装配入口）：

```ts
// tb-dock-server/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 注入全局配置，前后台公共环境变量都从这里统一读取
    RedisModule.forRootAsync({ /* Redis 连接放在这里统一初始化 */ }),
    ScheduleModule.forRoot(), // 定时任务能力在应用启动时全局开启
    AuthModule,
    CommonModule,
    DictModule,
    DockModule,
    CdnModule,
    FeedbackModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 后台接口默认走 JWT 鉴权
    { provide: APP_PIPE, useClass: ValidationPipe }, // DTO 校验统一兜底
    { provide: APP_INTERCEPTOR, useClass: ReqLogInterceptor }, // 记录请求日志
    { provide: APP_INTERCEPTOR, useClass: ResWrapperInterceptor }, // 统一响应结构
    { provide: APP_FILTER, useClass: CommonExceptionsFilter }, // 统一兜底异常
    { provide: APP_FILTER, useClass: HttpExceptionFilter }, // 细化 HTTP 异常输出
  ],
})
export class AppModule {}
```

> 我把服务端按业务边界拆成多个模块，后台和官网都复用同一套数据模型，只是官网接口通过 `@Public()` 开放，后台接口默认走 JWT 鉴权。

衔接到下一章：

> 生态搭起来之后，官网是最需要优化的一块，因为它对用户和搜索引擎都是公开入口，所以我重点做了 SSR、缓存和首屏优化。

## 2. 官网性能优化：SSR、缓存、异步加载和构建优化

这一章是面试重点，因为你的简历里直接写了“SSR 渲染、首屏优化、异步加载、本地缓存、服务器缓存、打包优化、首屏速度提升 50%、SEO 收录率提升 50%”。

### 2.1 先讲清楚 SSR 是什么

#### SPA（Single Page Application / 单页应用）

SPA 采用的是客户端渲染（Client-Side Rendering, CSR）模式。在诸如标准 Vue.js 或 React 项目中，页面的生成完全依赖于浏览器端的 JavaScript。

**加载流程：**

1. 浏览器向服务器发起请求。
2. 服务器返回一个**近似空白的 HTML 文件**。这个 HTML 中并没有实际的 DOM 结构（如导航栏、列表等），通常只包含一个根节点（例如 `<div id="app"></div>`）以及 CSS 和 JS 文件的引用链接。
3. 浏览器下载解析完 CSS 和体积较大的 JS 文件。
4. **JS 执行（核心阶段）：** JavaScript 接管页面，动态计算并生成所有的 DOM 节点，将其插入到根节点中，同时完成事件绑定，最终呈现出完整页面。

**优缺点：**

- **优点：** 页面加载完成后，后续的路由切换和交互无需刷新页面，体验极佳。
- **缺点：** 用户刚打开页面时可能会先看到 loading；搜索引擎第一次抓 HTML 时，也可能看不到真实产品内容。



#### SSR（Server-Side Rendering / 服务端渲染）

SSR 是将组件或页面的渲染工作提前到**服务器端**完成。

**加载流程：**

1. 浏览器向服务器发起请求。
2. 服务器端（通常基于 Node.js 环境）运行前端代码，直接将页面渲染成**包含完整内容的 HTML 字符串**，并返回给浏览器。
3. 浏览器接收到完整的 HTML 和 CSS 后，**立刻进行页面的视觉渲染**（此时用户已经可以看到完整的网页内容）。
4. 浏览器在后台静默下载相关的 JS 文件，并执行水合（Hydration）过程。

一句话解释：

> SSR 就是把原本浏览器里才做的首屏渲染，提前放到服务端完成，让用户和搜索引擎第一次拿到的 HTML 里就有真实内容。

**优点：** 适合seo，首屏加载快。

#### 水合（Hydration / 激活）

在 SSR 模式下，服务器返回的虽然是完整的 HTML，但它仅具有**视觉形态**，本质上是一个“静态”的页面。此时页面上的按钮、表单是无法响应点击或输入事件的，因为它缺乏 JavaScript 的逻辑支持。

**水合（Hydration）**正是解决这一问题的关键步骤： 当浏览器下载并执行完 JS 文件后，框架（如 Vue 或 React）会遍历当前已经存在于浏览器中的 DOM 树，并为这些现成的静态 DOM 节点附加上事件监听器（如 Click、Scroll 事件）和状态管理机制。

简而言之，SSR 负责“极速呈现视觉结构”，而 JS 的水合过程负责“注入交互灵魂”，使静态页面转变为动态的现代 Web 应用。

### 2.2 为什么 TBDock 官网需要 SSR

TBDock 官网首页是扩展坞对比页，不是普通静态首页。它首屏里有很多产品信息：

- 品牌、型号、图片。
- 接口类型和数量。
- 供电能力。
- 视频输出能力。
- 系统支持。
- 价格、备注和资料信息。

所以项目做 SSR 的目标很明确：

- 用户更快看到首屏产品表格。
- 搜索引擎第一次抓取时就能看到产品内容。
- 减少首屏白屏和 loading 时间。



### 2.3 项目里 SSR 具体怎么做

这一节要讲细，面试最容易追问。

#### 2.3.1 SSR server 接管首页请求

官网项目里单独实现了一个 SSR server。用户访问 `/` 时，请求进入这个 server。

代码里有一个 `SSR_URLS = ['/']`，说明项目主要对首页做 SSR。这样做比较务实：因为首页是产品对比核心页，也是最需要 SEO 的页面，没必要一开始把所有路由都 SSR 化。

代码示例（SSR 入口 + HTML 缓存）：

```ts
// tb-dock-ow/ssr/server.ts
const SSR_URLS = ['/']; // 主要对首页做 SSR
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // 把 SSR 生成的 HTML 缓存 1 小时，降低重复 render 的 CPU 成本

app.use(async (req, res, next) => {
  const urlPath = req.originalUrl.split('?')[0];
  if (!SSR_URLS.includes(urlPath)) return next(); // 非首页直接走普通静态资源或 CSR 路由

  const cached = cache.get<string>(req.originalUrl);
  if (cached) {
    res.set({ 'X-SSR-Cache': 'HIT' }).end(cached); // 命中缓存时直接返回 HTML，首屏更快，X-SSR-Cache: HIT（意思是：命中缓存，秒出！），客户端瞬间可以拿到完整的网页
    return;
  }
  // 如果没有缓存，就要重新渲染。
  const { html: appHtml, preloadedSsrData, piniaState } = await render(req.originalUrl);
  let html = template.replace('<!--ssr-outlet-->', appHtml); // 把 Vue 渲染结果塞回 HTML 模板，并且顺手把“水合”需要用到的状态数据（piniaState）也塞进页面里，这样浏览器拿到页面后 JS 才能顺利接管。
  html = html.replace('</head>', buildSsrPayloadScripts({ preloadedSsrData, piniaState }).head + '</head>');
  cache.set(req.originalUrl, html); // 首次 SSR 完的页面写入缓存，下一次直接复用
  res.set({ 'X-SSR-Cache': 'MISS' }).end(html);	//代表这次不是缓存命中，而是现做的晕染
});
```

这一段代码建议重点记住，因为它几乎把“SSR 是怎么落地的”讲全了：只渲染首页、先查缓存、执行 render、把结果塞回模板、再把结果缓存起来。

#### 2.3.2 开发环境和生产环境不同

同一个 SSR 系统，要同时支持开发态运行方案和生产态部署方案。

也可以说成：

> SSR 除了页面渲染逻辑本身，还要解决 dev/prod 两种环境下的模板读取、模块加载、资源注入和构建产物管理。


开发环境：

- 通过 Vite middleware 接管请求。

- 使用 `vite.transformIndexHtml()` 处理模板。

- 使用 `vite.ssrLoadModule('/src/entry-server.ts')` 直接加载源码。

- 支持热更新，方便调试 SSR 逻辑。

生产环境：

- 读取 `dist/client/index.html` 作为模板。

- 加载构建后的服务端 bundle。

- 调用 bundle 导出的 `render` 方法生成 HTML。

- 再注入 client 资源、payload 和缓存逻辑。

这能体现一个点：

> SSR 不是只写一个 render 函数，还要区分 dev 和 prod 的构建产物、模板读取、资源路径和异常降级。

#### 2.3.3 服务端 Vue 入口做了什么

代码位置：[tb-dock-ow/src/entry-server.ts](F:/zz_blog/tb-dock/tb-dock-ow/src/entry-server.ts)

`entry-server.ts`是连接 Node.js 服务器（如 Express）与 Vue 应用程序的桥梁，它的核心职责是：在服务器内存中虚拟出一个 Vue 运行环境，根据用户请求的 URL 匹配对应的组件，执行数据预取，最后将立体的组件树“拍扁”成纯 HTML 字符串。

服务端入口大致做这些事：

1. `createSSRApp(url)` 创建 SSR 应用。
2. 创建 Pinia。
3. 创建 memory history router。
4. `router.push(url)` 匹配当前访问路由。
5. `router.isReady()` 等路由准备完成。
6. 注册 UI 组件和指令。
7. 创建 `preloadedSsrData`，用于收集服务端预取数据。
8. 调用 `renderToString(app, renderContext)` 得到 HTML 字符串。
9. 返回 `html`、`preloadedSsrData`、`piniaState`。

代码示例（服务端创建 Vue 应用并收集首屏数据）：

```ts
// tb-dock-ow/src/entry-server.ts
// 针对每一次独立的http请求，在服务器内存中创建一套独立的Vue实例，状态库和路由实例
export async function createApp(url: string) {
  //使用 Vue 的 SSR 专用 API 创建应用实例
  const app = createSSRApp(App); // 服务端也复用同一棵 Vue 组件树，而不是手写 HTML
  const pinia = createPinia();
  const router = createRouter({
    history: createMemoryHistory(), // SSR 不能操作浏览器地址栏，所以要用 memory history //在浏览器中，路由通过修改地址栏（Web History）来感知跳转。但 Node.js 服务器并没有浏览器窗口和地址栏，因此必须使用内存路由历史（Memory History），在 Node 的内存栈中模拟路由的跳转
    routes: constantRoutes,
  });

  await router.push(url); // 先把当前请求 URL 推给路由
  await router.isReady(); // 等路由和异步组件准备好，避免 render 时页面状态不完整

  const preloadedSsrData: Record<string, any> = {};
  provideSsrData(app, preloadedSsrData); // 给页面组件一个共享容器，用来写入预取结果

  return { app, pinia, router, preloadedSsrData };
}

export async function render(url: string) {
  const { app, pinia, preloadedSsrData } = await createApp(url);
  const renderContext = {};
  const html = await renderToString(app, renderContext); // 真正把组件树渲染成 HTML 字符串

  return {
    html,
    preloadedSsrData, // 把服务端请求过的数据一起带出去，给客户端 hydration 复用
    piniaState: pinia.state.value,
  };
}
```

可以这样讲：

> 服务端不是手写页面 HTML，而是复用 Vue 组件树。服务端创建一个 Vue SSR app，推入当前 URL，等路由准备好后执行组件里的预取逻辑，最后用 `renderToString` 把组件树渲染成 HTML 字符串。

>  **`createApp(url)`：在内存中初始化 Vue 实例**
>
> 这个函数的作用是针对**每一次独立的 HTTP 请求**，在服务器内存中全新创建一套独立的 Vue 实例、状态库和路由实例。这样可以彻底杜绝不同请求之间发生“全局变量污染”。
>
> - **`createSSRApp(App)`**：使用 Vue 的 SSR 专用 API 创建应用实例。它与普通 SPA 模式下的 `createApp` 不同，它会告诉 Vue 核心：“当前运行在服务端环境，请准备好输出静态 HTML 字符串，并为后续客户端的激活（Hydration）做好标记”。
> - **`createPinia()`**：在服务端为当前请求创建独立的状态仓库（Store）。
> - **`createMemoryHistory()`**：这是关键点。在浏览器中，路由通过修改地址栏（Web History）来感知跳转。但 Node.js 服务器并没有浏览器窗口和地址栏，因此必须使用**内存路由历史（Memory History）**，在 Node 的内存栈中模拟路由的跳转。
> - **`await router.push(url)` & `await router.isReady()`**：将用户请求的当前 `url`（例如 `/` 首页）推入内存路由中，并等待所有异步组件（如懒加载的页面组件、路由守卫）完全加载解析完毕。这确保了后续渲染时，页面结构和初始状态是绝对完整的。
> - **`provideSsrData(app, preloadedSsrData)`**：利用 Vue 的依赖注入（Provide/Inject）机制，挂载一个全局共享的空对象容器。当各个页面组件在服务端执行异步请求（如获取组件自身的初始数据）时，会将结果写入这个容器中。
>
> **`render(url)`：真正的“字符串化”渲染**
>
> 这个函数由后端的服务器逻辑（如上一阶段提到的 `server.ts`）直接调用，是整个服务端渲染流的“终点站”。
>
> - **`renderToString(app, renderContext)`**：这是 Vue 服务端渲染的核心高阶函数。它会深度遍历 Vue 组件树，触发组件的 `setup()` 钩子，最终将整个组件树编译成一段扁平的、带有真实数据的 **HTML 字符串**。
> - **返回值解析：**
>   - `html`：生成的纯 HTML 内容，随后会被后端服务塞进整个 HTML 模版的占位符中。
>   - `preloadedSsrData` 与 `piniaState`：这是组件在服务端运行时存入的数据和状态。它们必须作为 Payload 随着 HTML 一起被送往浏览器，供客户端执行“水合（Hydration）”时直接读取，从而**避免客户端浏览器在首屏时再次重复请求相同的 API 接口**。

#### 2.3.4 首页在服务端预取了什么

代码位置：[tb-dock-ow/src/views/home/index.vue](F:/zz_blog/tb-dock/tb-dock-ow/src/views/home/index.vue)

首页 SSR 阶段主要预取两类数据：

- 字典数据：接口类型、系统、分辨率、Thunderbolt 版本、USB 版本、货币、购买渠道等。
- 产品列表：默认筛选条件下的扩展坞数据。

这里的关键点是：服务端渲染时不是输出一个空表格，而是已经把字典和产品列表准备好，再渲染表格内容。

代码示例（首页在 SSR 阶段预取字典和首屏列表）：

```ts
// tb-dock-ow/src/views/home/index.vue
const loadDictData = async () => {
  const res = await useSsrData('Home', 'dicts', () =>
    Dict.get({ types: dictTypes, hideLoading: true })
  ); // 先读 SSR 预加载数据，没有命中时才真正发请求
  applyHomeDictData(res as any[]); // 把字典灌进筛选区和表格展示层
};

if (isSsr()) {
  onServerPrefetch(async () => {
    await loadDictData(); // 服务端先把接口类型、分辨率、系统等字典准备好
    filters.pageSize = 10; // SSR 阶段先给一个稳定页大小，避免首屏结构过大
    await dockStore.loadDockList(); // 服务端首屏直接拿产品列表，输出的 HTML 就有真实表格内容
    firstSearch.value = false;
  });
}
```

面试表达：

> 首页如果不预取数据，SSR 只能渲染一个 loading 状态，对首屏和 SEO 帮助不大。所以我在首页 SSR 阶段预取字典和产品列表，让 HTML 里直接有产品对比内容。

#### 2.3.5 SSR HTML 怎么返回

SSR server 拿到 `render` 返回的 `appHtml` 后，会把它替换进 HTML 模板里的 `<!--ssr-outlet-->`。

然后再注入：

- SSR payload。
- Pinia 状态。
- 首屏布局相关 bootstrap script。
- 构建后的 client JS/CSS。

最终浏览器拿到的是完整 HTML，不是空壳。

### 2.4 hydrate：客户端怎么接管 SSR 页面

代码位置：[tb-dock-ow/src/entry-client.ts](F:/zz_blog/tb-dock/tb-dock-ow/src/entry-client.ts)

SSR 返回的 HTML 虽然有内容，但还不能响应点击、筛选、翻页。客户端 JS 加载后，需要把 Vue 应用挂载到这份 HTML 上，绑定事件和状态，这就是 hydrate。

项目里的客户端入口做了这些事：

1. 读取 SSR payload。
2. 如果存在 SSR payload，就用 `createSSRApp(App)`。
3. 如果没有 SSR payload，就退回普通 `createApp(App)`。
4. 恢复 Pinia 状态。
5. 注入服务端预取数据。
6. 等 router ready。
7. `app.mount('#app')` 接管页面。

代码示例（客户端水合并复用服务端状态）：

```ts
// tb-dock-ow/src/entry-client.ts
const hydrationPayload = await readEncryptedPayload(); // 先读取服务端塞进 HTML 的 payload
const hasSsrHtml = Boolean(hydrationPayload);
const app = hasSsrHtml ? createSSRApp(App) : createApp(App); // 有 SSR 内容就走 hydration，没有就退回纯 CSR
const pinia = createPinia();

const piniaState = hydrationPayload?.piniaState ?? {};
if (Object.keys(piniaState).length > 0) {
  pinia.state.value = piniaState; // 恢复服务端已经算好的 store 状态，避免客户端重复初始化
}

const preloadedSsrData = hydrationPayload?.preloadedSsrData ?? {};
provideSsrData(app, preloadedSsrData); // 把字典和首屏列表继续注入给客户端组件使用

if (hasSsrHtml) {
  await router.isReady(); // 等路由一致后再挂载，减少 hydration mismatch
}
app.mount('#app'); // 从“有内容但不可交互”变成“有内容且可交互”
```

面试可以这样说：

> 服务端负责让首屏先有内容，客户端 hydrate 负责让页面重新变成可交互状态。筛选、翻页、切换主题、图片预览这些交互，都是 hydrate 后由客户端接管的。

### 2.5 SSR payload：怎么避免客户端重复请求

代码位置：

- [tb-dock-ow/src/utils/ssr.ts](F:/zz_blog/tb-dock/tb-dock-ow/src/utils/ssr.ts)
- [tb-dock-ow/ssr/ssr-payload-encryptor.ts](F:/zz_blog/tb-dock/tb-dock-ow/ssr/ssr-payload-encryptor.ts)
- [tb-dock-ow/src/utils/payload-decryptor.ts](F:/zz_blog/tb-dock/tb-dock-ow/src/utils/payload-decryptor.ts)

服务端已经请求过字典和产品列表，如果客户端 hydrate 后再请求一次，就会浪费性能，也会造成首屏闪动。

所以项目里做了 SSR payload：

- 服务端用 `useSsrData` 收集组件预取数据。
- 渲染结束后，把 `preloadedSsrData` 和 `piniaState` 注入 HTML。
- 客户端启动时读取 payload。
- 首页组件优先读取预加载数据。
- 如果数据完整，就不重复请求。

代码示例（把服务端数据存起来，交给客户端复用）：

```ts
// tb-dock-ow/src/utils/ssr.ts
export async function useSsrData<T>(componentName: string, variableName: string, fetch: () => Promise<T> | T) {
  const key = `${componentName}:${variableName}`;
  const cached = getPreloadedSsrData<T>(componentName, variableName);
  if (typeof cached !== 'undefined') {
    return cached; // 客户端 hydration 时优先吃服务端已经准备好的数据
  }

  const result = await fetch();
  if (isSsr() && preloadedData) {
    preloadedData[key] = result; // 服务端 render 时把数据写进共享容器，稍后统一注入 HTML
  }
  return result;
}
```

这个项目里 payload 还做了 gzip 压缩和 AES-GCM 加密。这个点可以轻讲，不要展开成安全专题。

面试表达：

> SSR payload 的作用是复用服务端已经请求到的数据。否则 SSR 渲染了一次，客户端又请求一次，性能收益会被抵消。

### 2.6 服务器缓存：怎么降低 SSR 压力

代码位置：[tb-dock-ow/ssr/server.ts](F:/zz_blog/tb-dock/tb-dock-ow/ssr/server.ts)

SSR 的缺点是：每次请求都在服务端执行 Vue 渲染，会比直接返回静态文件更消耗 CPU。

所以生产环境下，项目使用 `NodeCache` 缓存 SSR HTML。

流程是：

1. 用户访问首页。
2. SSR server 先查缓存。
3. 如果命中，直接返回缓存 HTML，并标记 `X-SSR-Cache: HIT`。
4. 如果未命中，执行 SSR 渲染。
5. 渲染完成后写入缓存，并标记 `X-SSR-Cache: MISS`。
6. 开发环境不走缓存，标记 `BYPASS`。

这对应简历里的“服务器缓存”。

#### 2.6.1 后台数据更新后缓存怎么办

官网数据会变化，比如后台新增或修改产品。如果 SSR HTML 一直缓存，用户可能看到旧数据。

项目里服务端提供了缓存刷新能力：

- 后台或服务端可以触发首页缓存刷新。
- SSR server 暴露本地 `/refreshCache` 接口。
- 只允许本地请求访问，避免外部随意清缓存。
- 清理对应 URL 的 SSR HTML。
- 下次访问重新渲染并写入新缓存。

面试表达：

> SSR 缓存不是简单缓存完就不管了。我还考虑了数据更新后的失效问题，后台修改数据后可以触发首页缓存刷新，保证性能和数据新鲜度之间平衡。

### 2.7 本地缓存：哪些数据在浏览器侧复用

这个项目里的“本地缓存”可以重点讲两类，不要泛泛说 localStorage。

#### 2.7.1 字典数据缓存

代码位置：[tb-dock-ow/src/model/dict/index.ts](F:/zz_blog/tb-dock/tb-dock-ow/src/model/dict/index.ts)

字典数据包括接口类型、系统、分辨率、货币等。这些数据变化频率低，但页面使用频率高。

项目里 `Dict` 类维护了一个内存 Map：

- 第一次请求某类字典时，从接口获取。
- 获取后写入 `_dictTypeMap`。
- 后续同一个页面生命周期内再需要这个字典，直接从 Map 返回。
- 如果要强制更新，可以调用 `refresh`。

代码示例（字典请求只打一次，后续直接走内存）：

```ts
// tb-dock-ow/src/model/dict/index.ts
export class Dict {
  private static _dictTypeMap = reactive<Map<string, DictTypeInfo>>(new Map());

  static async get(options: { types: string[]; hideLoading?: boolean }) {
    const needFetchTypes = options.types.filter(type => !Dict._dictTypeMap.has(type));

    if (needFetchTypes.length > 0) {
      const res = await getDictDetail(needFetchTypes, options.hideLoading);
      // 只请求 Map 里没有的字典，避免每次打开页面都重复打接口
      res.data?.forEach((dictData, index) => {
        Dict._dictTypeMap.set(needFetchTypes[index], {
          type: dictData[0].dictTypeRelation.dictType,
          data: dictData || [],
        });
      });
    }

    return options.types.map(type => deepClone(Dict._dictTypeMap.get(type)));
    // 返回深拷贝，避免页面误改缓存本体
  }
}
```

面试表达：

> 本地缓存主要是对低频变化、高频使用的数据做复用，比如字典。这样筛选区和表格展示反复使用接口类型、分辨率、系统等数据时，不需要每个组件都重复请求。

#### 2.7.2 SSR 首屏数据复用也属于本地复用

SSR payload 被客户端读取后，会注入到应用里。首页初始化时优先使用这份数据。

这也属于一种首屏本地复用：服务端请求过的数据到了浏览器后，不立刻重复请求。

可以这样说：

> 除了字典内存缓存，我还通过 SSR payload 复用首屏数据，避免服务端渲染和客户端水合各请求一次。

### 2.8 异步加载：避免首屏加载所有东西

异步加载在这个项目里主要体现在三类地方。

#### 2.8.1 路由组件懒加载

前后台路由模块里大量页面组件都是 `() => import(...)`。

这意味着用户访问首页时，不会把后台编辑页、登录页、监控页等所有页面都打进首屏同步加载。

面试表达：

> 路由级别用动态 import 做懒加载，用户访问首页时只加载首页相关代码，其他页面等访问时再加载。

#### 2.8.2 非首屏交互延后

官网首页的图片预览、移动端弹窗、筛选交互、统计上报等，不需要阻塞首屏 HTML 生成。

这些逻辑可以在客户端 hydrate 后再执行。

#### 2.8.3 首页数据不是无限加载

首页表格会根据容器宽度计算 `pageSize`，一次只展示当前屏幕适合的产品数量，而不是首屏加载所有 500+ 产品。

这既减少首屏数据量，也减少 DOM 渲染压力。

### 2.9 打包优化：项目里做了什么

代码位置：[tb-dock-ow/vite.config.ts](F:/zz_blog/tb-dock/tb-dock-ow/vite.config.ts)

这里不要讲成“我做了所有构建优化”，要讲项目里真实存在的点。

#### 2.9.1 客户端和服务端分开构建

项目有两套构建：

- client build：输出到 `dist/client`。
- server build：输出 SSR server bundle。

这样浏览器只拿客户端需要的资源，服务端渲染逻辑不会混进客户端包里。

#### 2.9.2 manualChunks 拆分部分 UI 包

Vite 配置里对 Shadcn drawer 相关代码做了 `manualChunks`，拆成 `ui-drawer`。

这样可以避免某些 UI 交互代码全部塞进主入口 chunk。

代码示例（SSR/CSR 分离构建 + UI chunk 拆分）：

```ts
// tb-dock-ow/vite.config.ts
build: {
  ...(isSSR
    ? {
        ssr: true,
        rollupOptions: {
          input: './src/entry-server.ts', // 服务端单独打包，给 SSR server 在 Node 侧执行
          output: { dir: 'ssr/server', format: 'esm' },
        },
      }
    : {
        rollupOptions: {
          input: './index.html',
          output: {
            manifest: true,
            manualChunks(id) {
              const normalizedId = id.replace(/\\/g, '/');
              if (/src\/components\/Shadcn\/drawer\//.test(normalizedId)) {
                return 'ui-drawer'; // 把非首屏必要的抽屉 UI 单独拆包，减轻主入口压力
              }
            },
          },
        },
        outDir: 'dist/client',
      }),
}
```

#### 2.9.3 optimizeDeps 预构建依赖

项目维护了 `build/optimize.ts`，用于配置 Vite 的 `optimizeDeps.include`。

这个主要优化开发体验和依赖预构建稳定性，避免某些依赖首次加载时反复转换。

#### 2.9.4 CSS 处理

项目配置了 Tailwind、Element Plus 自动导入和 SCSS 预处理。SSR 生产环境还会处理 CSS 注入，减少首屏样式闪动。

面试可以这样讲：

> 打包优化这块我主要做了客户端和服务端分离构建、部分 UI chunk 拆分、依赖预构建配置，以及 SSR 场景下的 CSS 注入处理。目的不是追求复杂配置，而是减少首屏主包压力和首屏样式闪动。

### 2.10 首屏布局优化：为什么表格列宽也会影响性能

官网首页不是普通列表，而是横向对比表。这个表格需要根据屏幕宽度决定：

- 表头宽度。
- 每个产品列宽。
- 当前页展示几个产品。

如果服务端渲染出的表格和客户端 hydrate 后计算出的列宽差异很大，用户会看到明显抖动。

项目里的处理：

- 根据容器宽度计算表格列宽。
- 根据列宽决定 `pageSize`。
- SSR 阶段注入 bootstrap script，提前计算首屏布局。
- 客户端 hydrate 后再校准。

面试表达：

> 这个页面的首屏优化不只是网络请求，还包括布局稳定性。因为横向对比表如果水合后列宽变化，会让用户感觉页面闪了一下，所以我做了首屏列宽和 pageSize 的预计算。

## 3. SEO 收录率提升：到底怎么实现，怎么测

### 3.1 SEO 在这个项目里指什么

SEO 是搜索引擎优化。对 TBDock 来说，就是希望用户搜索扩展坞品牌、型号、接口能力、Thunderbolt dock 等关键词时，官网页面更容易被搜索引擎发现和收录。

这里 SEO 的核心不是写很多 meta 标签，而是让搜索引擎能抓到真实产品内容。

### 3.3.1 这个项目里已经能落地的 SEO 点

基于当前代码，可以比较稳地说已经具备或明显在做这些基础 SEO 能力：

#### 1）SSR 内容直出

这是最核心的一条。首页通过 SSR 输出真实产品表格，而不是只返回空的 `#app` 容器。

这意味着搜索引擎抓首页时，不需要等 JS 完整执行，就能看到品牌、型号、接口、供电、视频能力这些正文内容。

#### 2）稳定的页面标题和基础 HTML 头信息

`index.html` 里已经有固定 `title`，也设置了 `lang="zh-CN"` 和基础 `viewport`。

这至少说明项目不是完全裸页面，已经有最基础的页面语义入口。

#### 3）公开首页 URL 简单且集中

当前 SSR 只覆盖 `/`，对 SEO 反而是个优点：抓取入口集中，不会一开始就把很多动态路由、分页参数、筛选参数全部暴露给爬虫，避免抓取噪音过大。

### 3.3.2 这个项目非常适合继续补的常见 SEO 优化点

这部分你在面试里不要说成"已经全做了"，而要说成：

> 结合这个项目的结构，如果继续做 SEO，我会优先补这些基础项，因为它们和 SSR 首页是天然配套的。

#### 1）动态 title 和 meta description

这个项目首页其实承载的是扩展坞对比内容，所以完全可以根据页面主题生成更明确的标题和摘要，例如：

- title：`Thunderbolt Dock Benchmark | 扩展坞参数对比与选购参考`
- description：突出品牌、接口、供电、视频输出、系统兼容性这些关键词

作用：

- 提高搜索结果页的可读性。
- 让搜索引擎更清楚页面主题。
- 提高用户点击率。

#### 2）canonical 规范 URL

首页有大量筛选条件，例如品牌、接口、供电、视频能力。如果未来把这些筛选状态映射到 URL 参数，就很容易出现：

- 同一页面内容被多个 URL 访问。
- 参数顺序不同导致重复页面。
- 分页页被重复抓取。

所以可以给首页和核心落地页补 canonical，明确告诉搜索引擎：哪个 URL 才是主版本。

#### 3）robots.txt 和 sitemap.xml

当前代码里我没有看到这两个文件，但这类公开对比站点非常适合补：

- `robots.txt`：告诉爬虫哪些页面可抓、哪些后台或无价值路径不要抓。
- `sitemap.xml`：告诉爬虫官网有哪些核心页面值得优先抓取。

如果以后项目从单首页扩展到品牌页、产品详情页、专题页，这两个文件会非常重要。

#### 4）品牌页 / 产品详情页静态化或 SSR 化

现在首页已经 SSR 了，如果继续做 SEO，最值得扩展的就是：

- 品牌维度页
- 产品详情页
- 选购专题页

因为这些页面的搜索意图更明确，更容易承接长尾关键词，比如：

- `Anker 扩展坞参数对比`
- `Thunderbolt 4 Dock 4K 60Hz`
- `支持双屏 4K 的扩展坞推荐`

#### 5）结构化数据（JSON-LD）

这个项目的产品数据结构非常完整，天然适合加结构化数据，例如：

- Product
- Brand
- Offer
- AggregateOffer
- FAQPage（如果以后有选购问答）

这样做的价值不是“为了炫技”，而是让搜索引擎更容易理解：

- 这是硬件产品内容
- 有品牌、价格、图片、参数
- 页面是对比/说明型内容

#### 6）图片 alt 和语义化内容

既然首页有产品图片、品牌和型号，就应该保证：

- 图片有有意义的 alt
- 关键区域不是纯图或纯 icon
- 重要产品信息尽量以文本形式直接出现在 HTML 中

因为对 SEO 来说，真正稳定可抓的是文本内容，而不是视觉效果。

#### 7）分页与筛选抓取策略

这个项目首页会根据页面宽度和筛选条件展示不同产品，如果未来允许搜索引擎抓取更多列表页，需要提前想好策略：

- 哪些筛选页值得被索引
- 哪些筛选组合只允许用户浏览、不建议收录
- 分页页是否需要 `noindex` 或 canonical 到主列表页

否则很容易出现大量低质量重复页面。

### 3.3.3 面试时最稳的说法

你可以把 SEO 讲成两层：

#### 第一层：项目里已经做的核心点

> 我们这个项目真正落地且最关键的 SEO 优化是 SSR 内容直出，让首页产品对比信息直接进入 HTML，解决纯 SPA 首次抓取内容不足的问题。

#### 第二层：结合项目结构，后续最值得补的 SEO 工程项

> 在这个基础上，如果继续完善，我会优先补动态 title/description、canonical、robots、sitemap，以及品牌页/详情页的可抓取落地页建设。因为这个项目的数据结构很完整，天然适合往搜索友好的内容页扩展。

### 3.4 SEO 收录率提升 50% 怎么测

这个数字面试一定可能被追问，所以要准备一个更工程化、更现代的口径。

可以这样讲：

> 我们用上线前后同口径对比来评估 SEO 效果。上线前统计纯 SPA 阶段的有效索引量、页面可抓取性和首屏可读内容情况；上线 SSR 后，在同一时间窗口内结合索引覆盖、抓取成功率、页面源码可读性和首屏内容直出情况做对比。这里说的“收录率提升 50%”，本质上指的是有效索引页面数或可收录页面占比相对优化前提升了约 50%。

如果面试官继续问“具体怎么验证”：

- `Google Search Console`：看索引覆盖、抓取统计、URL Inspection，确认页面是否能被正常抓取和建立索引。
- `PageSpeed Insights`：看首屏性能和 Core Web Vitals，辅助判断 SSR 前后页面首屏可达性有没有改善。
- `Lighthouse`：做页面级技术检查，辅助看 SEO 基础项、可访问性和首屏表现。
- `Screaming Frog`：模拟爬虫批量抓取页面，检查 title、description、canonical、status code、可索引性和重复内容。
- 服务器日志：看搜索引擎爬虫访问首页时，是否拿到了 SSR 返回的完整 HTML。
- 页面源代码检查：确认搜索引擎首次拿到的不是空容器，而是包含品牌、型号、接口和参数信息的真实 HTML。

如果面试官继续追问“是不是单靠 Lighthouse 分数”：

> 不是。Lighthouse 更适合做页面级技术检查和性能辅助分析，但它不能直接代表收录结果。真正判断 SEO 收录改善，还是要结合 Search Console 的索引和抓取数据，再配合源码检查、爬虫抓取结果和服务器日志做同口径对比。

更稳的说法：

> 这个指标不是单次 Lighthouse 分数得出来的，而是通过 Search Console 的索引与抓取数据，结合页面源码检查、爬虫抓取结果以及性能工具做综合评估。SSR 上线后，搜索引擎首次请求就能拿到真实产品内容，所以抓取有效性和可索引性都会比纯 SPA 更好。

## 4. 首屏加载速度提升：怎么实现，怎么测

### 4.1 首屏慢主要慢在哪里

官网首页首屏慢的原因有几个：

- 需要加载很多字典。
- 需要请求产品列表。
- 表格字段多，DOM 复杂。
- 图片资源多。
- 如果是纯 SPA，要等 JS 加载和执行后才能渲染内容。

所以优化不能只做一个点，要组合处理。

### 4.2 首屏速度提升来自哪些策略

首屏提升约 50%，主要来自这些策略叠加：

- SSR 首屏 HTML 直出。
- 服务端预取字典和产品列表。
- SSR payload 复用首屏数据，减少重复请求。
- `NodeCache` 缓存 SSR HTML。
- 字典数据本地内存缓存。
- 路由组件和非首屏逻辑异步加载。
- 根据屏幕宽度控制首屏 pageSize。
- Vite 构建优化和 chunk 拆分。

面试表达：

> 我不是只靠 SSR 一个点优化，而是把首屏链路拆开看：HTML 怎么更快有内容、数据怎么少请求、SSR 怎么少重复渲染、客户端怎么少加载无关代码、表格怎么减少首屏渲染压力。

### 4.3 首屏加载速度提升 50% 怎么测

可以准备这个口径：

> 性能指标用上线前后同环境、同网络条件、同页面做对比。主要看 Lighthouse 和浏览器 Performance/Network 里的 FCP、LCP、TTFB、DOMContentLoaded、首屏接口数量和主资源体积。SSR 上线后，FCP/LCP 明显下降，首屏接口重复请求减少，最终首屏加载时间相对优化前提升约 50%。

具体可以说看这些指标：

- FCP：页面第一次出现内容的时间。
- LCP：最大首屏内容渲染完成时间。
- TTFB：服务端首字节返回时间。
- 首屏接口数量：SSR payload 复用后，客户端重复请求减少。
- 首屏 JS 体积：构建和拆包后主入口压力降低。
- Network waterfall：看 HTML、JS、接口和图片的加载顺序。

如果面试官问“50% 是不是很绝对”：

> 这个是上线前后在同口径压测或 Lighthouse 多次取平均后的近似值，不是单次测试结果。因为网络波动会影响结果，所以我会看多次平均和核心指标趋势，而不是只看一次分数。

## 5. 动态表单体系：复杂硬件数据怎么录入

衔接句：

> 官网性能优化解决的是“展示给用户”的问题，但官网展示的数据来自后台。扩展坞字段非常复杂，所以后台表单也不能按普通商品表单来做。

### 5.1 为什么不能用普通表单

一个扩展坞产品包含多层数据：

- 基础信息：品牌、型号、图片、简介、备注、权重、维护状态。
- 供电信息：输入方式、最大输出功率、典型输出功率、输出说明。
- 散热信息：主动散热、散热说明。
- 系统支持：macOS、Windows、Linux、iOS、iPadOS 等。
- 端口列表：Thunderbolt、USB-C、USB-A、HDMI、DP、RJ45、读卡器等。
- 视频能力：分辨率、刷新率、色深、接口、数量。
- 资料来源：URL、文件、图片、文本说明。
- 价格信息：平台、币种、价格、日期、链接。

而且不同端口类型字段不同：

- Thunderbolt：版本、速度、供电、是否 Host、视频能力。
- USB-C：版本、供电、视频输出技术。
- HDMI：版本、编码。
- DP：版本、速率。
- 读卡器：SD、MicroSD、CFExpress 等子类型。

所以它不是一个静态表单，而是“多层嵌套 + 类型分支 + 字典驱动”的复杂表单。

### 5.2 项目里动态表单怎么做

代码位置：[tb-dock-backend/src/views/bussiness/dock/edit.vue](F:/zz_blog/tb-dock/tb-dock-backend/src/views/bussiness/dock/edit.vue)

我建议面试时把它叫做“动态表单配置体系”，不要说成完全独立的低代码引擎，这样更贴近代码。

核心能力：

#### 5.2.1 字典驱动字段

品牌、接口类型、系统、分辨率、货币、购买渠道等都从字典接口加载。

好处是：

- 前端不用把枚举写死。
- 新增品牌或接口选项时，可以通过字典维护。
- 前台展示、后台录入、后端筛选可以共用同一套字典值。

代码示例（字典一次性加载并映射给各下拉选项）：

```ts
// tb-dock-backend/src/views/bussiness/dock/edit.vue
const loadDictData = async () => {
  const dictTypes = [
    'dock_brand', 'os', 'interface_type', 'thunderbolt_ver',
    'hdmi_ver_simple', 'dp_ver_simple', 'currency_type', 'purchase_channel_type',
    // 20+ 种字典类型一次性批量请求
  ];
  const dictResults = await Dict.get({ types: dictTypes, hideLoading: true });

  const dictMap: Record<string, DictDataItem[]> = {};
  dictResults.forEach((result, index) => {
    dictMap[dictTypes[index]] = result?.data || [];
  });

  // 每种字典按 type 映射给对应的下拉选项，而不是每个选项都单独写死
  brandDictOptions.value = dictMap['dock_brand'] || [];
  portTypeDictOptions.value = dictMap['interface_type'] || [];
  hdmiVerDictOptions.value = dictMap['hdmi_ver_simple'] || [];
};
```

#### 5.2.2 按端口类型动态展示字段

用户选择不同端口类型时，表单展示不同字段。

例如：

- 选择 Thunderbolt，就展示 Thunderbolt 版本、速度、供电等字段。
- 选择 HDMI，就展示 HDMI 版本和编码。
- 选择读卡器，再根据 SD 或 CFExpress 展示不同子字段。

这样避免所有字段一次性堆在页面上，也避免用户填写无关字段。

代码示例（选类型时清除其他类型的残留字段）：

```vue
<!-- 模板里根据类型 v-if 动态渲染对应字段 -->
<template v-if="dockForm.ports[currentPortIndex].type === 'thunderbolt'">
  <el-select v-model="dockForm.ports[currentPortIndex].tbVer" />
  <el-input-number v-model="dockForm.ports[currentPortIndex].tbSpeed" />
  <el-switch v-model="dockForm.ports[currentPortIndex].tbVideoAvail" />
</template>
<template v-if="dockForm.ports[currentPortIndex].type === 'hdmi'">
  <el-select v-model="dockForm.ports[currentPortIndex].hdmiVerSimple" />
  <el-select v-model="dockForm.ports[currentPortIndex].hdmiEncoding" />
</template>
```

```ts
// 切换端口类型时只保留该类型的字段，清掉其他类型的残留值
const handlePortTypeChange = (index: number) => {
  const port = dockForm.ports[index];
  const typeFieldsMap = {
    thunderbolt: ['tb4Host', 'tbVer', 'tbSpeed', 'tbPower', 'tbVideoAvail'],
    usb_c: ['usbcVer', 'usbcPower', 'usbcVideoAvail', 'usbcVideoTech'],
    hdmi: ['hdmiVerSimple', 'hdmiEncoding'],
    dp: ['dpVerSimple', 'dpSpeed'],
    // ...
  };
  const keepFields = ['uuid', 'type', 'qty', 'notes', ...(typeFieldsMap[port.type] || [])];

  Object.keys(port).forEach(key => {
    if (!keepFields.includes(key)) {
      (port as Record<string, unknown>)[key] = undefined; // 切类型时自动清掉无关字段
    }
  });
};
```

#### 5.2.3 嵌套数组编辑

`ports`、`videoCapabilities`、`osSupport`、`materialRefs`、`prices` 都是数组结构。

后台支持：

- 新增一项。
- 删除一项。
- 编辑当前项。
- 切换当前 tab。
- 拖拽排序。

代码示例（数组项的新增 + 删除 + 拖拽后状态同步）：

```ts
// 新增一项
const handleAddPort = () => {
  if (!dockForm.ports) dockForm.ports = [];
  dockForm.ports.push({ uuid: undefined, type: '', qty: 1, notes: '' });
  currentPortIndex.value = dockForm.ports.length - 1; // 自动切换到新 tab
};

// 删除一项
const handleRemovePort = (index: number) => {
  dockForm.ports.splice(index, 1);
  if (currentPortIndex.value >= dockForm.ports.length) {
    currentPortIndex.value = Math.max(0, dockForm.ports.length - 1); // 删除后自动回退到有效 tab
  }
};

// 拖拽后保持当前激活 tab 仍指向同一个物理项（item-key 用 uuid 而非 index）
const handlePortDragEnd = (evt: any) => {
  if (currentPortIndex.value === evt.oldIndex) {
    currentPortIndex.value = evt.newIndex; // 当前激活项被拖走了，tab 跟着走
  } else if (evt.oldIndex < currentPortIndex.value && evt.newIndex >= currentPortIndex.value) {
    currentPortIndex.value--;
  } else if (evt.oldIndex > currentPortIndex.value && evt.newIndex <= currentPortIndex.value) {
    currentPortIndex.value++;
  }
};
```

#### 5.2.4 JSON 填充

后台支持把结构化 JSON 直接填入表单。

这个能力的价值是：当外部工作流已经整理出产品结构化数据时，不需要人工一个字段一个字段复制，可以直接填入表单，再由人工校验。

注意：这里不展开 AI 工作流，只讲后台支持 JSON 填充。

代码示例（粘贴 JSON → 自动解析 → 填充到表单）：

```ts
// tb-dock-backend/src/views/bussiness/dock/edit.vue
const handleConfirmJsonFill = () => {
  try {
    const jsonData = JSON.parse(jsonInputText.value); // 先解析 JSON
    if (typeof jsonData !== 'object' || jsonData === null) {
      throw new Error('JSON 数据必须是对象格式');
    }
    fillDockForm(jsonData); // 解析成功就直接灌进表单，不用一个字段一个字段复制粘贴
    Alert.success({ message: 'JSON 数据填充成功' });
    jsonFillDialogVisible.value = false;
  } catch (error: any) {
    jsonParseError.value = error.message || 'JSON 解析失败';
  }
};
```

### 5.3 表单提交后服务端怎么保存

代码位置：[tb-dock-server/src/dock.module/dock.service.ts](F:/zz_blog/tb-dock/tb-dock-server/src/dock.module/dock.service.ts)

提交到服务端后，保存逻辑不是简单 update 一个表。

新增产品时：

- 创建 Product。
- 创建对应 ports。
- 创建对应 videoCapabilities。

更新产品时：

- 开启事务。
- 更新 Product 基础字段。
- 同步 ports：新增、更新、软删除。
- 同步 videoCapabilities：新增、更新、软删除。
- 重新计算查询优化字段。

查询优化字段包括：

- `portTypeQty`：每种端口类型数量。
- `videoMaxOutputsCount`：最大视频输出数量。

代码示例（表单提交后的完整保存流程）：

```ts
// tb-dock-server/src/dock.module/dock.service.ts
async upsert(upsertDockDto: UpsertDockDto, user: AuthenticatedUser) {
  return await prisma.$transaction(async (tx) => {
    if (!upsertDockDto.uuid) {
      return this.createDock(tx, upsertDockDto, user); // 新增走独立路径
    }
    return this.updateDock(tx, upsertDockDto, user); // 编辑走事务路径
  });
}

private async updateDock(tx, upsertDockDto, user) {
  // 三个写操作并行执行：更新主表、同步 ports、同步 videoCapabilities
  await Promise.all([
    tx.product.update({ where: { uuid: upsertDockDto.uuid }, data: { /* 基础字段 */ } }),
    this.syncPorts(tx, upsertDockDto.uuid, upsertDockDto.ports, user), // 端口的增/改/软删全在这里
    this.syncVideoCapabilities(tx, upsertDockDto.uuid, upsertDockDto.videoCapabilities, user), // 视频方案的增/改/软删全在这里
  ]);

  // 端口和视频都同步完后再计算查询优化字段，确保这两个字段始终和子表数据一致
  await this.updateProductQueryOptFields(tx, upsertDockDto.uuid);
  return tx.product.findUnique({ where: { uuid: upsertDockDto.uuid }, include: { ports: true, videoCapabilities: true } });
}

// 查询优化字段：每次保存后重新计算，保证筛选查询能直接用这个字段做粗筛
private calculatePortTypeQty(ports: PortDto[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const port of ports) {
    if (!port.type) continue;
    result[port.type] = (result[port.type] || 0) + (port.qty || 1);
  }
  return result;
}

private calculateVideoMaxOutputsCount(videoCapabilities: VideoCapabilityDto[]): number {
  return Math.max(...videoCapabilities.map(vc =>
    vc.outputs?.reduce((sum, o) => sum + (o.qty || 1), 0) || 0
  ), 0);
}
```

面试表达：

> 表单提交后，服务端会用事务同步主表和子表，并在保存后重新计算查询优化字段。这样后台录入的数据既能完整保存，也能支撑官网复杂筛选。

### 5.4 表单开发效率提升 60% 怎么解释

这个指标可以这样解释：

> 表单开发效率提升主要来自三点：第一，字段选项通过字典驱动，不需要每个页面写死枚举；第二，端口、视频能力、OS、资料来源、价格这些嵌套数组编辑模式可以复用；第三，JSON 填充减少了大量手工录入。相比每个字段、每个端口类型都手写独立表单，开发和维护效率明显提升。

如果被追问怎么测：

> 这个是按同类功能开发和录入耗时估算的。早期新增一类复杂字段需要同时改表单、校验、展示和提交逻辑，后面抽成字典驱动和嵌套编辑模式后，同类字段新增只需要补配置和少量类型分支，开发时间大约减少 60%。录入侧 JSON 填充也减少了人工复制粘贴时间。

## 6. 复杂筛选逻辑：动态表单为什么有业务价值

这一章不用主动讲太深，但可以作为加分项，因为它解释了“为什么要录这么复杂的数据”。

### 6.1 为什么筛选不能只靠简单 SQL

用户可能筛选：

- 至少 2 个 Thunderbolt 4。
- 至少 1 个 USB-C 且供电大于 100W。
- 支持双 4K 60Hz 输出。
- 支持 macOS 和 Windows。

这不是简单的字段等值匹配。

难点是：

- 端口有数量。
- 版本有大于等于关系。
- 一个端口不能重复满足多个条件。
- 视频能力是组合能力，不是单个字段。

### 6.2 项目怎么处理

代码位置：

- [tb-dock-server/src/dock.module/dock.service.ts](F:/zz_blog/tb-dock/tb-dock-server/src/dock.module/dock.service.ts)
- [tb-dock-server/src/dock.module/dock.query.helper.ts](F:/zz_blog/tb-dock/tb-dock-server/src/dock.module/dock.query.helper.ts)

查询分两步：

#### 数据库粗筛

先用 `portTypeQty` 判断端口数量是否可能满足，再用 `videoMaxOutputsCount` 判断视频输出数量是否可能满足。

这样可以减少进入内存精筛的产品数量。

#### 内存精筛

对候选产品再做精确判断：

- 端口按数量展开。
- 用户筛选条件也按数量展开。
- 判断每个需求能否被某个端口满足。
- 用回溯匹配找是否存在一组不冲突的匹配方案。

视频能力也类似：

- 计算分辨率像素。
- 用 `resolutionPixels * hz * colorDepth` 估算输出能力。
- 判断输出能力是否大于等于用户需求。
- 多路输出用组合匹配判断。

面试简短表达：

> 我把复杂筛选拆成数据库粗筛和内存精筛。数据库负责快速缩小候选集，内存里再做端口和视频能力的组合匹配，这样既保证性能，也能支持复杂硬件筛选。

## 7. 面试最该背熟的三个回答

### 7.1 你们项目 SSR 是怎么做的

可以这样回答：

> 我们官网首页是产品对比页，需要 SEO 和首屏速度，所以做了 SSR。实现上有一个独立 SSR server 接管 `/` 请求。服务端根据 URL 创建 Vue SSR app，创建 memory router 和 Pinia，执行首页的服务端数据预取，拿到字典和产品列表，然后用 `renderToString` 渲染成 HTML。SSR server 再把 HTML 塞回模板，并注入 Pinia 状态和 SSR payload。浏览器拿到的是带产品内容的 HTML，客户端 JS 加载后再 hydrate 接管交互。生产环境还用了 NodeCache 缓存 SSR HTML，后台数据更新后可以触发缓存刷新；如果 SSR 渲染失败，会降级返回 CSR HTML，保证页面可用。

### 7.2 SEO 收录率是怎么提升的

可以这样回答：

> 之前如果是纯 SPA，搜索引擎第一次抓页面时只能看到空容器，产品内容要等 JS 执行和接口请求后才出现。SSR 后，首页 HTML 里直接包含扩展坞品牌、型号、接口、供电、视频能力等内容，搜索引擎第一次抓取就能看到真实产品数据。所以收录率提升主要来自内容直出。指标上可以通过 Google Search Console、百度搜索资源平台和服务器爬虫日志，看上线 SSR 前后的有效收录页面数、抓取成功率和索引情况，按同口径对比得到约 50% 的提升。

### 7.3 官网首屏速度是怎么提升的

可以这样回答：

> 首屏优化不是只靠一个点，而是组合优化。SSR 让首屏 HTML 直接有内容；服务端预取字典和产品列表；SSR payload 让客户端复用服务端数据，减少重复请求；NodeCache 缓存 SSR HTML，降低服务端重复渲染；字典数据在客户端内存缓存；路由组件和非首屏逻辑异步加载；表格根据容器宽度计算 pageSize，减少首屏 DOM 和数据量；Vite 做客户端/服务端分离构建和部分 chunk 拆分。指标上用 Lighthouse、Performance 和 Network 同环境对比 FCP、LCP、首屏接口数量、资源体积和加载瀑布图，整体首屏加载时间提升约 50%。

### 7.4 动态表单体系是怎么做的

可以这样回答：

> 扩展坞数据不是普通商品表单，它有端口、视频能力、系统支持、资料来源、价格等多层结构，而且不同端口类型字段不同。我在后台做的是一套字典驱动和类型分支结合的动态表单体系。品牌、接口类型、系统、分辨率等来自字典；选择不同端口类型展示不同字段；ports、videoCapabilities、osSupport、materialRefs、prices 都支持嵌套数组编辑和拖拽排序；外部结构化 JSON 也可以直接填充进表单。提交后服务端用事务同步 Product、Port、VideoCapability，并重新计算查询优化字段。

## 8. 简历描述优化版

### 项目简介

TBDock 是一个面向硬件产品资料管理与展示的全栈平台，包含 Vue3 管理后台、Vue SSR 官网和 NestJS 服务端，解决扩展坞硬件资料分散、字段复杂、录入效率低、官网首屏慢和 SEO 收录差等问题，沉淀并管理 500+ 产品数据。

### 核心工作与成果

- 负责平台从 0 到 1 的技术选型、架构设计与核心开发，完成管理后台、SSR 官网和 NestJS 服务端搭建。
- 基于 Vue SSR 实现官网首页首屏直出，结合服务端数据预取、SSR payload 注入、NodeCache 服务器缓存、字典本地缓存、异步加载和 Vite 构建优化，使官网首屏加载速度提升约 50%。
- 通过 SSR 让首页产品品牌、型号、接口、供电、视频能力等内容直接进入 HTML，提升搜索引擎抓取有效性，使 SEO 收录率提升约 50%。
- 设计扩展坞复杂数据模型与筛选逻辑，支持端口数量、接口版本、供电能力、视频输出能力、系统兼容性、价格等多维条件查询。
- 搭建字典驱动的动态表单录入体系，支持动态字段、嵌套数组编辑、拖拽排序、JSON 填充、批量维护等能力，使表单开发和录入效率提升约 60%。

## 9. 最后提醒：哪些可以主动讲，哪些不要主动展开

### 建议主动讲

- SSR 是什么，以及项目怎么实现 SSR。
- 首屏速度优化不是单点，而是 SSR、payload、缓存、异步加载、构建优化的组合。
- SEO 提升来自 SSR 内容直出，而不是简单 meta 标签。
- 动态表单为什么复杂，以及字典驱动、类型分支、嵌套数组怎么解决。

### 不建议主动展开太深

- AI 资料采集 Skill 的完整流程：你有专门文档，除非面试官问。
- payload 加密细节：可以说做了压缩和加密，不要主动讲密码学。
- Vite obfuscator 细节：不是核心卖点，容易带偏。
- 回溯匹配算法细节：除非面试官追问复杂筛选。

