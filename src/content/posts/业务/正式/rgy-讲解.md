---
title: rgy-讲解
published: 2026-06-06
updated: 2026-06-06
description: '整理热工院新能源平台项目的微前端、排程可视化与视频流封装等前端面试讲解重点。'
image: ''
tags: ['面试讲解', '微前端']
category: '业务/正式'
private: true
draft: false
---

# 热工院新能源智慧化生产平台前端面试讲解稿

> 适用场景：简历项目追问、技术面自我介绍、项目复盘。  
>
> 技术栈：Vue2 / Element UI / Vuex / Vue Router / ECharts / Axios / qiankun 微前端。
>
> **热工院新能源智慧化生产平台｜前端开发**
>
>  ***\*技术栈\****：Vue2 / Element UI / Vuex / Vue Router / ECharts / Axios /qiankun 微前端 
>
>  ***\*项目简介\****：基于微前端架构的新能源生产管理平台，覆盖智能排程、巡检大屏、实时视频、安防监控等模块，服务 3 个新能源场站，提升设备检修效率 30%。
>
>  ***\*核心工作与成果\****：
>
>  \- ***\*微前端接入\****：主导平台 3 个子应用的 qiankun 微前端接入，处理路由基座、公共能力复用问题。
>
>  \- ***\*智能排程可视化\****：基于排程算法数据设计甘特图等可视化方案，展示检修任务时间 / 资源安排，人员调度效率提升 40%。
>
>  \- ***\*视频流能力封装\****：基于 WebSocket 封装视频播放组件，视频预览加载速度提升 70%，巡检点位联动准确率 100%。

## 1. 项目怎么开口讲

这个项目是一个面向新能源场站的智慧化生产管理平台，主要服务风电、光伏等新能源场站的生产运行场景。平台里有智能排程、巡检大屏、实时视频、安防监控等模块，前端采用 Vue2 + Element UI 技术栈，并用 qiankun 做微前端拆分。

我在项目里主要负责前端业务模块开发，包括三个方向：

1. 子应用的 qiankun 微前端接入。
2. 智能排程结果的可视化展示。
3. 视频流播放组件的封装和页面联动。

面试时可以这样讲：

> 这个项目不是一个单纯的后台管理系统，它更偏生产现场业务。用户不是普通运营人员，而是场站的调度、检修、巡检和值班人员，所以前端页面要解决的是“让现场状态看得清、任务排得明白、视频能快速联动起来”。

## 2. 项目整体前端结构

正式工程的前端主线在：

```text
TpriNe-pc/
  common/          公共能力：请求、组件、布局、store、工具函数
  system/          主应用/基座：菜单、登录态、微前端注册
  smartsecurity/   智能安防子应用：消防、周界、门禁、违章、巡检等
  plan/            智能巡检/计划子应用：点位、计划、任务、云台、识别等
```

可以这样理解：

- `system` 是主应用，负责“壳”：菜单、登录、权限、加载子应用。
- `smartsecurity` 和 `plan` 是业务子应用，负责具体页面。
- `common` 是公共包，子应用通过 `file:../common` 复用它。

这个结构是你讲微前端时最重要的业务背景：不是为了用新技术而用，而是因为平台模块多、业务边界清晰、多人开发需要拆分。

## 3. 微前端：先从“文件夹”讲起

### 3.1 最好懂的理解

微前端的理解：

> 一个大平台下面有多个前端项目文件夹。每个业务子应用都是一个完整的 Vue 项目，有自己的 `package.json`、`src`、`router`、`main.js`、`vue.config.js`、`.env`，可以自己启动、自己开发、自己打包。最后由主应用 `system` 统一加载这些子应用。

也就是说，你不是只写了几个页面，而是维护了类似这样的结构：

```text
TpriNe-pc/
  system/          主应用，负责加载子应用
  smartsecurity/   一个完整 Vue2 子应用，智能安防
  plan/            一个完整 Vue2 子应用，智能巡检/计划
  common/          公共包，不是页面应用，给各子应用复用
```

每个子应用文件夹里面大致长这样：

```text
smartsecurity/
  package.json        启动、打包、依赖配置
  vue.config.js       devServer、代理、publicPath、qiankun UMD 打包配置
  .env.development    开发环境变量
  .env.production     生产环境变量
  public/             静态资源，比如播放器库、index.html
  src/
    main.js           子应用入口，qiankun 生命周期也在这里
    App.vue           子应用根组件
    router/index.js   子应用自己的路由 base 和路由表
    permission.js     路由权限/导航守卫
    store/            子应用自己的 Vuex
    api/              子应用自己的业务接口
    views/            子应用自己的业务页面
    components/       子应用自己的局部组件
```

面试时这样说会很清楚：

> 我们不是把所有页面都放在一个 Vue 项目里，而是按业务模块拆成多个完整的 Vue 项目文件夹。比如 `smartsecurity` 是智能安防子应用，`plan` 是巡检计划子应用。每个子应用都能单独 `npm run dev` 启动，也能被主应用通过 qiankun 加载。

### 3.2 什么是微前端

再技术一点：

> qiankun 的作用是让主应用根据路由去加载某个子应用。主应用加载子应用的 JS/CSS 后，会调用子应用暴露出来的生命周期函数，比如 `bootstrap`、`mount`、`unmount`。子应用在 `mount` 里把自己的 Vue 实例挂载到主应用给的容器里。

你可以把它想成这样：

```text
开发时：先启动 system 主应用（比如 npm run start-all）
  -> 再启动当前子应用（比如 smartsecurity 里 npm run dev）
  -> 主应用里点击“智能安防”菜单
  -> qiankun 发现这个路径匹配 smartsecurity 子应用
  -> 主应用加载 smartsecurity 的资源
  -> 调用 smartsecurity 暴露的 mount 方法
  -> smartsecurity 把自己的 Vue 页面挂到主应用容器里
```

面试时这样衔接会更自然：

> 我对微前端的理解不是只停留在概念上，而是结合实际开发流程去看的。我们平时开发时会先把主应用启动起来，再启动当前要调试的子应用。主应用负责平台壳、菜单和路由分发，子应用负责自己的业务页面。用户进入对应菜单后，qiankun 再把子应用加载进来，本质上就是把多个独立 Vue 项目组织成一个统一的平台。

### 3.3 为什么这个项目要这样拆

这个平台模块很多：智能安防、智能排程、巡检视频、系统管理等。如果全部放在一个 Vue 项目里，会变成一个很大的单体前端，问题会越来越明显：

1. 项目越做越大，启动和打包变慢。
2. 不同模块代码耦合，一个模块改坏可能影响其他模块。
3. 多人开发时容易冲突。
4. 公共能力和业务页面混在一起，不好维护。

## 4. 核心工作一：qiankun 子应用接入

> 我负责过平台里多个业务子应用的 qiankun 接入。落到代码上，就是把每个业务模块整理成一个完整 Vue 子应用文件夹，然后处理启动方式、入口生命周期、路由 base、资源路径、打包格式、主子应用通信和公共能力复用。

### 4.1 一个子应用要关注哪些文件

以 `smartsecurity` 为例，接入 qiankun 时最重要的是这几个文件：

```text
smartsecurity/
  package.json
  vue.config.js
  src/main.js
  src/router/index.js
  src/store/
  src/api/
  src/views/
```

逐个讲：

1. `package.json`  

   这里配置子应用怎么启动、怎么打包。比如开发时执行 `npm run dev`，本质上就是启动这个子应用自己的 Vue CLI dev server。

   例如：

```json
{
  "scripts": {
    "dev": "vue-cli-service serve",
    "build:prod": "vue-cli-service build"
  }
}
```

   你可以理解成：我进入 `smartsecurity` 目录执行 `npm run dev`，其实就是这里把子应用自己的开发服务跑起来。

2. `vue.config.js`  
   这里配置端口、代理、publicPath、webpack alias、UMD 打包格式。qiankun 接入里很重要的 `libraryTarget: 'umd'` 就在这里。

   例如：

```js
output: {
  library: 'smartsecurity',
  libraryTarget: 'umd'
}
```

   这几行的意义就是：把子应用打成主应用能加载的模块格式，不然 qiankun 拿不到子应用导出的生命周期。

3. `src/main.js`  
   这是子应用入口。普通 Vue 项目里它只负责创建 Vue 实例；微前端项目里，它还要导出 `bootstrap`、`mount`、`unmount`，让主应用能加载和卸载它。

   例如：

```js
export async function bootstrap() {}
export async function mount(props) {
  render(props);
}
export async function unmount() {}
```

   面试时可以直接说：普通 Vue 项目没有这套生命周期，但 qiankun 子应用必须把它暴露出来。

4. `src/router/index.js`  
   这里配置子应用自己的路由。微前端里最关键的是 `base`，因为子应用独立运行和被主应用加载时，路径前缀是不一样的。

   例如：

```js
base: window.__POWERED_BY_QIANKUN__
  ? '/smartsecurity'
  : '/web-smartsecurity/'
```

   这个例子最能体现微前端和普通 Vue 项目的区别：同一套路由，要根据是不是在 qiankun 环境里动态切换前缀。

5. `src/api` 和 `src/views`  
   这里就是业务代码。比如智能安防的消防、周界、门禁页面，都在自己的子应用里维护，不会和 `plan` 混在一起。

   例如：

```js
// src/api/fire.js
export function getFireAlarmList(params) {
  return request({ url: '/fire/alarm/list', method: 'get', params });
}
```

```js
// src/views/fire/index.vue
created() {
  this.getList();
}
```

   这部分你就可以讲成：`api` 负责接口调用，`views` 负责页面展示和交互，业务逻辑是跟着子应用边界走的。

### 4.2 子应用入口 `main.js` 到底在干什么

普通 Vue2 项目的 `main.js` 一般就是：

```js
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
```

但是 qiankun 子应用不能只这样写。因为它有两种运行方式：

1. 独立运行：自己挂载到 `#app`。
2. 被主应用加载：挂载到主应用传进来的容器里。

所以项目里写了一个 `render` 方法：

```js
// render 是真正创建 Vue 实例的方法。
// 独立运行时直接挂载到当前页面的 #app。
// 被 qiankun 加载时，挂载到主应用传进来的 container 里面。
const render = (props = {}) => {
  const { container } = props;

  // 初始化子应用路由，并把子应用路由变化同步给主应用。
  initRouter(props, router);

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
};

// 如果不是 qiankun 环境，说明是本地独立启动，自己 render。
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// qiankun 首次加载子应用时调用。
export async function bootstrap() {}

// qiankun 真正挂载子应用时调用。
export async function mount(props) {
  // 接收主应用传来的 token，保证子应用接口请求能带登录态。
  store.commit('SET_TOKEN', props.store.token);

  // 保存主应用传来的通信方法，后面可以 setGlobalState。
  actions.setActions(props);

  // 挂载 Vue 应用。
  render(props);
}

// 子应用卸载时销毁 Vue 实例，避免内存泄漏和事件残留。
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
}
```

这段你可以一句一句理解：

- `render()`：真正创建 Vue 实例。
- `container ? container.querySelector('#app') : '#app'`：判断是挂到主应用容器，还是挂到自己的页面。
- `if (!window.__POWERED_BY_QIANKUN__) render()`：如果不是被 qiankun 加载，就自己启动。
- `mount(props)`：被主应用加载时，主应用会调用它。
- `unmount()`：用户离开这个子应用时，销毁 Vue 实例。

面试可以补一句：

> 这里我比较关注两个点：第一，子应用要能独立运行，这样开发调试方便；第二，被主应用加载时要正确挂载和卸载，不然切换模块后容易出现事件残留、样式残留或内存占用问题。

### 4.3 子应用怎么知道自己是不是被 qiankun 加载

项目里用了这个判断：

```js
// 这是 qiankun 注入的全局变量。
// 有它，说明当前子应用是被主应用加载的。
if (window.__POWERED_BY_QIANKUN__) {
  // 子应用被主应用加载后，静态资源路径可能会变。
  // 这里把 webpack public path 改成 qiankun 注入的路径，
  // 防止图片、异步 chunk、播放器资源加载 404。
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

你可以简单说：

> `window.__POWERED_BY_QIANKUN__` 就是判断当前是不是微前端环境。独立运行没有这个变量，被主应用加载时 qiankun 会注入这个变量。

### 4.4 路由在哪里调整

路由调整在子应用自己的 `src/router/index.js` 里。

子应用路由里有这样的逻辑：

```js
export default new Router({
  // 被主应用加载时，路径前缀要和主应用注册的 activeRule 对上。
  // 比如主应用用 /smartsecurity 激活智能安防子应用。
  //
  // 独立启动时，它走自己的部署路径，比如 /web-smartsecurity/。
  base: window.__POWERED_BY_QIANKUN__ ? '/smartsecurity' : '/web-smartsecurity/',

  // 使用 history 模式，URL 里没有 #。
  mode: 'history',

  routes: constantRoutes
});
```

你可以这样讲：

> 路由 base 是微前端里很容易出问题的点。因为子应用独立运行时有自己的访问前缀，但被主应用加载时，它要挂在主应用分配的路径下面。比如智能安防在主应用里是 `/smartsecurity`，独立部署时可能是 `/web-smartsecurity/`，所以这里要根据运行环境动态切换。

### 4.5 打包配置在哪里调整

子应用的 `vue.config.js` 里有：

```js
configureWebpack: {
  output: {
    // 子应用暴露给 qiankun 的全局模块名。
    library: 'smartsecurity',

    // 打成 UMD 格式，主应用才能以模块方式加载子应用导出的生命周期。
    libraryTarget: 'umd',

    // 避免多个 webpack 应用的 JSONP chunk 名称冲突。
    jsonpFunction: 'webpackJsonp_smartsecurity'
  }
}
```

面试官如果问“为什么要 UMD”，可以答：

> qiankun 加载子应用后，需要拿到子应用暴露出来的生命周期函数，比如 `mount`、`unmount`。UMD 是一种兼容性比较好的模块格式，可以让主应用拿到这些导出内容。

### 4.6 主应用怎么注册子应用

主应用在 `system/src/micro/index.js` 里注册子应用：

```js
// registerMicroApps 告诉 qiankun：
// 有哪些子应用、入口地址是什么、什么路由下激活。
registerMicroApps(filterMicroApps(), microAppHooks);

// start 才是真正启动 qiankun。
// prefetch: 'all' 表示空闲时预加载子应用资源，提高后续打开速度。
start({
  prefetch: 'all'
});
```

这里的逻辑可以这样讲：

> 主应用会维护一份子应用配置，包括子应用名称、入口地址、激活规则和挂载容器。当用户访问某个路径时，qiankun 根据激活规则判断该加载哪个子应用。

### 4.7 主子应用通信

主应用用 qiankun 的 `initGlobalState` 初始化全局状态：

```js
// 主应用维护一份全局状态。
// token 用来同步登录态，$route 用来接收子应用当前路由，
// sidebarOpened 用来同步侧边栏状态。
export const initialState = Vue.observable({
  sidebarOpened: false,
  token: getToken(),
  $route: null,
  sonRouter: null
});

// qiankun 提供 initGlobalState，用来建立主子应用之间的状态通信。
const actions = initGlobalState(initialState);
```

子应用里通过 `actions.setGlobalState` 把当前路由同步给主应用：

```js
router.beforeEach((to, from, next) => {
  actions.setGlobalState({
    $route: {
      fullPath: to.fullPath,
      path: to.path,
      query: to.query,
      meta: to.meta
    }
  });
  next();
});
```

面试可以这样说：

> 主应用和子应用不是直接互相 import，而是通过 qiankun 的全局状态通信。比如主应用把 token、侧边栏状态传给子应用；子应用把当前路由同步给主应用，用于标签页、面包屑或导航状态维护。

## 5. 关于“公共能力复用”这句话，面试里怎么说更稳

这一块建议不要单独讲成一个大亮点，更适合放在 qiankun 接入后面顺带一提，因为你的核心工作本质上还是**子应用接入和运行机制适配**。

而是：

> 我在做 qiankun 接入时，顺手处理了公共代码的接入方式。因为每个子应用都是独立 Vue 项目，像请求封装、基础组件、工具函数这些通用能力，项目里会放到 `common` 目录统一维护，子应用按需引用。它的价值主要是减少重复开发、保证代码风格一致，而不是说做了一个运行时共享的大总包。

如果面试官继续追问，你可以再补一句：

> 这一块我不会讲得特别重，因为它本质上还是工程组织上的复用，不是像模块联邦那种运行时动态共享。我们当时更多是在 qiankun 架构下，把子应用的路由、挂载、资源路径和状态通信先跑通，`common` 只是顺带解决重复代码问题。

这样会更符合你真实做过的事情，也不会把自己带进一个容易被追问过深的点。

## 6. 核心工作三：智能排程可视化

智能排程模块承接的不是单一页面展示，而是一整条围绕调度决策展开的前端交互流程。页面先从待处理任务列表进入，先完成本轮任务筛选，再为选中任务选择设备类型和影响类型，随后通过“优先级判定”按钮触发后端自动生成处理时长、人员数量、优先级等结果，然后进入人工排序确认，再配置时间、人员、工器具等资源约束，最后通过结果页和甘特图完成排程结果校验。

整个过程做的重点，不是单纯把算法接口接入页面，而是把调度业务中的关键判断步骤前置到交互链路里。

**任务筛选：**这一步完成的是排程范围确认。用户先按场站、设备、处理窗口等维度选择本轮要进入排程的任务，系统再基于当前选择继续后续步骤。

**前置信息选择与优先级判定：**任务进入排程前，先在列表中为每个已选任务选择设备类型和影响类型。这两个字段是触发后续计算的前置条件，缺失时不能继续执行优先级判定。页面顶部提供“优先级判定”按钮，点击后前端会把当前选中的任务整理成请求数据，调用后端接口自动生成处理时长、人员数量、优先级等结果，并回填到表格。

**人工排序确认：**在自动排程之前，保留人工排序步骤，允许结合现场经验手动调整先后顺序。

这一步完成的是人工经验纳入。系统没有把排程完全做成黑盒自动计算，而是在算法之前保留人工干预入口，让排程结果更贴近现场执行逻辑。

**资源约束配置：**排程前单独配置时间范围、可用人数、作业时段、关键工具数量等资源条件，而不是把这些参数默认写死在后台。

这一步完成的是约束显式化。用户可以明确知道当前结果是在什么条件下生成的；如果结果不理想，也可以回到这一层重新调整资源条件后再次排程。

**结果校验：**算法返回结果后，页面通过结果列表和甘特图展示任务安排、时间分布和资源占用情况，方便继续核对是否存在时间冲突、人员超限、任务分布不合理等问题。

## 7. 核心工作四：视频流能力封装

### 7.1 先解释 WebSocket

普通 HTTP 是“一次请求，一次响应”。比如页面请求列表接口，后端返回 JSON，这次请求就结束了。

WebSocket 不一样，它是浏览器和服务端之间建立一条持续连接。连接建立后，服务端可以不断往前端推数据，前端也可以随时发消息给服务端。

可以这样讲：

> WebSocket 适合实时性比较强的场景，比如消息通知、设备状态、实时视频流。它不像 HTTP 那样每次都要重新建立请求，而是建立一条长连接，后续数据都在这条连接里传输。

### 7.2 视频流为什么会用 WebSocket

摄像头常见的视频协议是 RTSP，但浏览器原生不能直接播放 RTSP。实际项目里通常会有一个流媒体服务做中转：

```text
摄像头 RTSP 流
  -> 流媒体服务转码/转封装
  -> WebSocket / WebRTC / HLS 等浏览器可播放协议
  -> 前端播放器组件播放
```

在这个项目里，前端拿到设备或摄像头的 `stream id` 后，拼成播放地址：

```js
return `ws://${window.location.hostname}/stream_proxy/camera/${s}.live.mp4`;
```

这说明前端不是直接连摄像头，而是连一个流媒体代理服务。

### 7.3 EasyPlayerPro 组件封装

组件大致职责：

1. 接收外部传入的 `stream`。
2. 根据 `stream` 生成 WebSocket 播放地址。
3. 初始化 `window.EasyPlayerPro` 播放器。
4. 自动播放。
5. 监听 `stream` 变化，切换摄像头时重新播放。
6. 组件销毁时释放播放器实例。

代码示例：

```js
props: {
  // app 表示业务类型，比如 camera。
  // 在当前代码里它更多是作为语义字段存在。
  app: {
    type: String,
    required: true,
    default: ''
  },

  // stream 是摄像头或视频流标识。
  // 页面只需要传这个 id，组件内部负责拼播放地址。
  stream: {
    type: [String, Number],
    default: ''
  }
}
```

生成播放地址：

```js
getPlayUrl() {
  const s = String(this.stream != null ? this.stream : '');

  // 没有流 id，就不播放。
  if (!s) return '';

  // 如果后端直接给了完整 http 地址，就直接使用。
  if (s.startsWith('http')) {
    return s;
  }

  // 否则根据当前域名和 stream id 拼接 WebSocket 播放地址。
  // 这样部署环境变化时，不需要把 IP 写死在组件里。
  return `ws://${window.location.hostname}/stream_proxy/camera/${s}.live.mp4`;
}
```

这段可以体现一个优化点：`smartsecurity` 里的组件比 `plan` 里早期写死 IP 的版本更灵活。

初始化播放器：

```js
async initPlayer() {
  const el = this.$refs.playerRef;
  if (!el) return;

  // 防止重复初始化播放器。
  // 如果已经存在实例，先销毁再创建。
  if (this.playerInstance) {
    this.playerInstance.destroy();
    this.playerInstance = null;
  }

  // qiankun 环境下，播放器 decoder 文件也要注意资源路径。
  // 这里优先使用 qiankun 注入的 public path。
  const base = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
    || process.env.BASE_URL
    || '/';

  const decoderPath = base.endsWith('/')
    ? `${base}EasyPlayerPro/`
    : `${base}/EasyPlayerPro/`;

  // muted: true 是为了兼容浏览器自动播放策略。
  // 很多浏览器不允许有声音的视频自动播放。
  const playerConfig = {
    stretch: true,
    hasAudio: true,
    autoplay: true,
    controls: false,
    muted: true,
    loop: false,
    decoderPath
  };

  // EasyPlayerPro 是通过静态资源引入到 window 上的播放器构造函数。
  this.playerInstance = new window.EasyPlayerPro(el, playerConfig);

  // 初始化后自动播放当前 stream。
  await this.autoPlay();
}
```

监听流切换：

```js
watch: {
  // app 或 stream 变化时，说明用户可能切换了视频源。
  // 不重新创建整个组件，而是调用播放器的 play 方法切流。
  stream: {
    handler() {
      this.replayIfReady();
    }
  }
}
```

销毁播放器：

```js
beforeDestroy() {
  this.destroyPlayer();
}
```

```js
destroyPlayer() {
  if (this.playerInstance) {
    this.playerInstance.destroy();
    this.playerInstance = null;
  }
}
```

注释版理解：

```js
// Vue2 组件销毁前调用。
// 如果不销毁播放器实例，WebSocket 连接、定时器、事件监听可能还留着。
beforeDestroy() {
  this.destroyPlayer();
}
```

### 7.4 面试时怎么讲这块成果

可以这样说：

> 我把视频播放逻辑封装成一个通用组件，页面只需要传摄像头或设备的 stream id。组件内部负责生成播放地址、初始化播放器、处理自动播放、切换视频源和销毁实例。这样巡检大屏、分区监控、云台控制等页面都可以复用同一套播放逻辑。

如果被问“视频预览加载速度提升 70% 怎么来的”，可以稳一点：

> 这个指标主要来自项目验收或业务侧对比反馈。前端侧做的事情是减少页面重复初始化逻辑，把视频播放封装成可复用组件，并在切换视频源时复用播放器能力，减少页面层重复处理和不必要的交互等待。

不要说成“我靠 WebSocket 本身让速度提升 70%”，这样容易被追问到很细。

## 8. 安防监控模块怎么讲

智能安防模块包含消防、周界、门禁、违章、巡检等页面。可以按“地图/状态/列表/详情/处置”这条线来讲：

> 安防模块主要解决的是场站安全状态可视化。页面上会展示设备分布、在线状态、告警数量、告警列表和详情弹窗。比如消防页面会展示消防设备状态、当前告警、今日告警和设备分区；周界页面会展示围栏或入侵事件；门禁页面会展示出入记录和人员信息。

这部分不用讲太多原理，重点讲你在页面层做了什么：

1. 接口数据接入。
2. 状态字段格式化。
3. 告警列表和详情弹窗。
4. 地图点位/设备卡片展示。
5. 视频预览联动。

## 9. 简历原句优化

你原来的简历内容已经不错，但可以稍微让表达更“工程化”。

### 原版

> 主导平台 3 个子应用的 qiankun 微前端接入，处理路由基座、公共能力复用问题。

### 优化版

> 负责平台多个业务子应用的 qiankun 接入，完成子应用生命周期改造、路由 base 适配、UMD 打包配置及主子应用状态同步；并在接入过程中梳理 `common` 公共代码的引用方式，减少子应用重复开发。

### 原版

> 基于排程算法数据设计甘特图等可视化方案，展示检修任务时间 / 资源安排，人员调度效率提升 40%。

### 优化版

> 基于排程算法输出设计任务甘特图和任务列表，将检修任务的开始/结束时间、执行班组、设备对象、优先级等字段可视化展示，辅助调度人员快速识别资源占用和任务冲突。

### 原版

> 基于 WebSocket 封装视频播放组件，视频预览加载速度提升 70%，巡检点位联动准确率 100%。

### 优化版

> 封装基于 WebSocket 流地址的 `EasyPlayerPro` 视频播放组件，统一处理播放地址生成、播放器初始化、自动播放、视频源切换和实例销毁，支撑巡检大屏、分区监控、云台控制等场景复用。

如果一定要保留数字，可以写：

> 结合流媒体代理服务和播放器组件复用，优化视频预览链路，视频打开体验较改造前明显提升。

面试里数字可以说，但简历上数字越具体，越要准备来源。

## 10. 高频面试追问

### 10.1 什么是微前端？

答：

> 微前端就是把一个大型前端应用拆成多个可以独立开发、独立构建、独立部署的小应用，再由一个主应用统一加载。它解决的是大型前端项目模块耦合、构建慢、多人协作困难的问题。

### 10.2 qiankun 子应用接入要做哪些事？

答：

> 主要包括：导出生命周期函数，配置 UMD 打包，处理 public path，配置路由 base，主应用注册子应用，处理主子应用状态通信，以及注意样式和资源隔离问题。

### 10.3 主应用和子应用怎么通信？

答：

> qiankun 提供 `initGlobalState`。主应用初始化全局状态，子应用在 `mount(props)` 里拿到通信方法。主应用可以把 token、侧边栏状态传给子应用，子应用也可以把当前路由等信息同步回主应用。

### 10.4 WebSocket 和 HTTP 有什么区别？

答：

> HTTP 更像一次性请求，前端请求一次，后端返回一次。WebSocket 是长连接，连接建立后双方可以持续通信。实时视频、消息通知、设备状态这类场景更适合 WebSocket。

### 10.5 为什么浏览器不能直接播放 RTSP？

答：

> RTSP 是很多摄像头常用的流媒体协议，但浏览器原生 video 标签不支持直接播放 RTSP。所以通常需要流媒体服务把 RTSP 转成 WebSocket、WebRTC、HLS 或 FLV 这类浏览器可以消费的格式。

### 10.6 为什么播放器组件销毁时要 destroy？

答：

> 因为播放器内部可能持有 WebSocket 连接、解码器、定时器、事件监听和 DOM 引用。如果组件销毁时不释放，切换页面后可能出现连接残留、内存泄漏或者重复播放的问题。

### 10.7 自动播放为什么要 muted？

答：

> 现代浏览器通常禁止有声音的视频自动播放。设置 `muted: true` 可以提高自动播放成功率，等用户点击页面后再取消静音。

### 10.8 智能排程里你负责算法吗？

答：

> 算法本身不是我负责的，我负责前端可视化和交互。我的工作是把算法返回的任务时间、资源、班组、设备、状态等字段转成调度人员能理解的甘特图和任务视图。

## 11. 一分钟项目介绍

可以背这个版本：

> 我做过一个热工院新能源智慧化生产平台，主要面向新能源场站的生产运行管理，包含智能排程、巡检大屏、实时视频和安防监控等模块。前端技术栈是 Vue2、Element UI、Vuex、Vue Router、Axios、ECharts，并用 qiankun 做微前端架构。
>
> 我主要负责三个方面。第一是多个业务子应用的 qiankun 接入，包括子应用生命周期、路由 base、资源路径、UMD 打包和主子应用状态通信。第二是智能排程可视化，把排程算法返回的任务时间、班组、设备和优先级等数据展示成甘特图和任务列表，方便调度人员看资源占用和任务冲突。第三是视频流组件封装，基于 WebSocket 流地址和 EasyPlayerPro 封装通用播放器组件，统一处理播放地址、初始化、自动播放、切流和销毁，在巡检大屏、分区监控和云台控制页面复用。

## 12. 三分钟项目介绍

可以背这个版本：

> 这个项目是热工院新能源智慧化生产平台，服务新能源场站的生产运行场景。它不是普通的后台 CRUD 系统，而是把检修排程、巡检任务、实时视频、安防告警这些能力整合到一个平台里。用户主要是调度、检修、巡检和值班人员，所以前端要解决的问题是状态展示清楚、任务安排直观、视频联动及时。
>
> 技术架构上，项目采用 Vue2 + Element UI，并通过 qiankun 做微前端拆分。主应用负责登录、菜单、权限、公共布局和子应用加载，业务模块拆成独立子应用，比如智能安防和计划巡检。这样每个模块可以独立开发和构建，同时公共请求、权限指令、基础组件、布局和工具函数沉淀在 `common` 包里复用。
>
> 我在微前端接入里主要做了子应用生命周期改造。子应用既能独立运行，也能被主应用加载。独立运行时自己挂载 Vue 实例；在 qiankun 环境下，主应用会调用子应用导出的 `mount` 方法，并把 token、路由信息和全局状态传进来。子应用还需要处理 public path 和路由 base，否则会出现资源加载路径错误或者路由跳转异常。
>
> 在智能排程模块，我主要负责排程结果的可视化表达。算法会输出任务、时间、班组、设备、优先级等字段，我把这些字段整理成甘特图和任务列表，让调度人员可以直观看到每个任务的开始结束时间、资源占用和是否存在冲突。
>
> 在视频流这块，我封装了 `EasyPlayerPro` 播放组件。页面只需要传摄像头或设备的 stream id，组件内部会拼接 WebSocket 播放地址，初始化播放器，处理自动播放、静音策略、切换视频源和销毁实例。这个组件被巡检大屏、分区监控、云台控制等页面复用，减少了页面层重复处理视频播放逻辑。

## 13. 你要记住的几个关键词

面试前重点记这些词：

- qiankun 生命周期：`bootstrap`、`mount`、`unmount`。
- 子应用独立运行和主应用加载的差异。
- `__POWERED_BY_QIANKUN__` 判断运行环境。
- `__webpack_public_path__` 处理资源路径。
- `libraryTarget: 'umd'` 暴露子应用生命周期。
- `initGlobalState` 做主子应用通信。
- `common` 公共包复用请求、布局、组件和工具函数。
- WebSocket 是长连接，适合实时视频/消息。
- 浏览器不能直接播放 RTSP，需要流媒体服务中转。
- 播放器组件要处理播放地址、初始化、切流、销毁。

## 14. 最后怎么收尾

如果面试官让你总结这个项目，可以这样说：

> 这个项目对我来说最大的收获是，我不只是写单个页面，而是接触到了一个中大型前端系统的模块拆分和工程接入。微前端让我理解了主应用和子应用的边界，公共包让我理解了复用和一致性，视频流组件让我接触了实时视频在浏览器里的播放链路。虽然有些底层能力比如流媒体服务和排程算法不是我负责的，但我能把它们的结果稳定地接到前端页面里，并做成业务人员可以使用的功能。
