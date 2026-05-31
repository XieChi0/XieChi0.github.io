---
title: React 2024 Crash Course 中文速成笔记
published: 2026-05-29
updated: 2026-05-29
description: '基于 Traversy Media React 2024 Crash Course 字幕整理，覆盖 Vite、Tailwind、组件、Props、State、Hooks、React Router、JSON Server 与 React Jobs 项目。'
image: ''
tags: [React, Vite, TailwindCSS, React Router, JSON Server, 前端]
category: '框架/React'
draft: false
---

# React 2024 Crash Course 中文速成笔记

> 本文基于 Traversy Media 的 2024 版 React Crash Course 英文字幕提炼整理。课程目标是用 React 快速构建一个 Job Listings 前端项目，并顺带掌握现代 React 的核心基础。
>
> 时效说明：视频录制时 React 19 还未正式发布。现在 React 19 已在 2024-12-05 稳定发布。本文仍按课程主线讲 React 18/Vite 写法，同时在相关位置补充 React 19 的理解方式。

---

## 1. 这门课要做什么？

这门 2024 版 React Crash Course 面向 React 初学者，最终会构建一个招聘信息网站前端，项目可以叫：

```txt
React Jobs
```

你会接触到：

- React 组件
- Props
- State
- Hooks
- JSX
- 列表渲染
- 条件渲染
- 数据获取
- React Router
- JSON Server mock 后端
- CRUD 基础
- Vite 项目搭建
- Tailwind CSS 样式

和 2021 版 Task Tracker 不同，这一版更贴近现代 React 项目：

| 2021 版 | 2024 版 |
|------|------|
| Create React App | Vite |
| Task Tracker | React Jobs |
| 普通 CSS | Tailwind CSS |
| 简单任务管理 | 招聘信息网站 |
| React Router 基础 | 多页面应用结构 |
| JSON Server | JSON Server |

---

## 2. React 是什么？

React 是一个用于构建用户界面的 JavaScript library。

官方更倾向叫它 library，而不是 framework。原因是 React 本身只负责 UI 层，不内置完整解决方案。

例如，React 核心库本身不包含：

- 路由
- HTTP 客户端
- 全局状态管理
- 表单库
- SSR 框架能力

Angular 更像完整框架，因为它内置了很多东西。React 则更像一个 UI 核心，再通过生态组合成完整应用。

但在日常交流中，很多人也会把 React 叫作前端框架，因为它实际使用时经常和 Angular、Vue、Svelte 放在同一类讨论。

---

## 3. 为什么使用 React？

早期 Web 页面非常静态：

```txt
点击链接 -> 请求服务器 -> 返回新 HTML -> 整页刷新
```

后来 Ajax 出现后，浏览器可以在不刷新页面的情况下请求数据。这让单页应用成为可能。

但是，随着页面越来越动态，如果只靠原生 JavaScript 操作 DOM，代码会变得很难维护。

React 解决的问题主要是：

- 让复杂 UI 更容易拆分
- 让状态变化更容易追踪
- 让页面局部更新更清晰
- 让团队协作有统一结构
- 让组件可以复用和组合

React 的核心思想可以浓缩成一句话：

> UI 是 state 的函数。

也就是说，页面长什么样，取决于当前状态是什么。

---

## 4. React、Vue、Angular、Svelte 怎么看？

视频里提到几个主流前端框架：

- React
- Vue.js
- Angular
- Svelte

作者的观点比较实在：React 最大优势之一是就业市场和生态。

React 的优势：

- 工作机会多
- 社区生态大
- Next.js、Remix 等元框架成熟
- React Native 可以做移动端
- 大量组件库、工具库围绕 React 建设

但 React 不一定是语法最简单的选择。Vue 和 Svelte 在一些场景下写法更直接。

如果目标是找前端工作，React 很值得学。如果目标是快速做自己的产品，也可以同时看看 Vue 或 Svelte。

---

## 5. React 19 怎么理解？

视频中说 React 19 即将发布，并提到 React Compiler 可能带来性能提升和更自动化的优化。

现在需要更新一下这个背景：

- React 19 已经在 2024-12-05 稳定发布
- React 19 增加了 Actions、useActionState、useOptimistic、use、资源预加载等能力
- React Compiler 在 2024 年进入 Beta 阶段
- 但 React 的基础心智模型没有变

这意味着：

```txt
组件、Props、State、Hooks、JSX、Router、数据请求
```

这些基础仍然是 React 学习的核心。

所以即使课程使用 React 18，也不影响学习 React 的基本写法。

---

## 6. React 应用类型

视频里介绍了三类常见 React 应用。

### SPA

SPA 是 Single Page Application，单页应用。

特点：

- 浏览器先加载一个 `index.html`
- JavaScript bundle 接管页面
- 路由切换由前端完成
- 用户体验很流畅

适合：

- 后台管理系统
- 工具类应用
- 动态交互多的前端应用

缺点：

- 首屏加载可能较慢
- SEO 需要额外处理

本课程构建的就是 SPA。

### SSR

SSR 是 Server Side Rendering，服务端渲染。

常见框架：

- Next.js
- Remix

特点：

- 首屏 HTML 由服务端生成
- 对 SEO 更友好
- 首屏性能通常更好
- 部署比纯 SPA 更复杂

### SSG

SSG 是 Static Site Generation，静态站点生成。

常见框架：

- Gatsby
- Astro

特点：

- 构建时生成 HTML 文件
- 部署简单
- 适合博客、文档、营销页

你现在看的这个博客项目就是 Astro，更接近 SSG 的思路。

---

## 7. 为什么 2024 版使用 Vite？

以前创建 React 项目最常见的是 Create React App。

现在更推荐 Vite。

原因：

- 启动速度快
- 热更新快
- 配置更轻
- 开发体验更好
- 不像 CRA 那样臃肿

创建项目：

```bash
npm create vite@latest react-jobs
```

选择：

```txt
Framework: React
Variant: JavaScript
```

进入项目：

```bash
cd react-jobs
npm install
npm run dev
```

Vite 默认端口通常是 `5173`。如果想改成 `3000`，可以修改 `vite.config.js`：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

---

## 8. Vite 项目结构

基础结构大概是：

```txt
react-jobs
├─ index.html
├─ package.json
├─ vite.config.js
└─ src
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   └─ assets
```

`index.html` 是 SPA 的单页入口：

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

`main.jsx` 是 React 入口：

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

关键流程：

```txt
index.html 的 #root
-> main.jsx
-> 渲染 App
-> App 组织所有组件
```

---

## 9. React StrictMode

入口里通常会包一层：

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

StrictMode 是开发阶段检查工具，会帮助发现潜在问题，例如：

- 不安全的生命周期写法
- 过时 API
- 副作用问题

它不会影响生产环境渲染。

---

## 10. 安装 Tailwind CSS

课程使用 Tailwind CSS 来写样式。

安装：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

生成：

```txt
tailwind.config.js
postcss.config.js
```

配置扫描路径：

```js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在 `src/index.css` 中引入 Tailwind：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

课程还扩展了字体和网格列：

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    gridTemplateColumns: {
      '70/30': '70% 28%',
    },
  },
}
```

这样后面可以用类似：

```txt
grid-cols-70/30
```

来做详情页布局。

---

## 11. JSX 基础

React 组件返回 JSX。

JSX 看起来像 HTML，但它是 JavaScript 语法扩展。

组件示例：

```jsx
const App = () => {
  return (
    <div>
      App
    </div>
  )
}

export default App
```

JSX 的规则：

- 只能返回一个父元素
- `class` 要写成 `className`
- `for` 要写成 `htmlFor`
- JavaScript 表达式写在 `{}` 里
- 注释要用 JSX 注释语法

错误写法：

```jsx
return (
  <div>Hello</div>
  <p>React</p>
)
```

正确写法：

```jsx
return (
  <div>
    <div>Hello</div>
    <p>React</p>
  </div>
)
```

也可以用 Fragment：

```jsx
return (
  <>
    <div>Hello</div>
    <p>React</p>
  </>
)
```

---

## 12. JSX 中使用变量和表达式

```jsx
const name = 'John'

return <h1>Hello {name}</h1>
```

表达式也可以：

```jsx
const x = 10
const y = 20

return <p>The sum is {x + y}</p>
```

JSX 里的 `{}` 不是模板字符串，而是进入 JavaScript 表达式。

---

## 13. 列表渲染

使用 `map()` 渲染列表：

```jsx
const names = ['Brad', 'Mary', 'Joe', 'Sarah']

return (
  <ul>
    {names.map((name, index) => (
      <li key={index}>{name}</li>
    ))}
  </ul>
)
```

React 列表必须有 `key`。

如果数据里有稳定的 `id`，优先用 `id`：

```jsx
{jobs.map((job) => (
  <JobListing key={job.id} job={job} />
))}
```

`key` 帮助 React 判断哪些元素变化了。

---

## 14. 条件渲染

可以用三元表达式：

```jsx
{loggedIn ? <h1>Hello member</h1> : <h1>Hello guest</h1>}
```

如果只想在为真时显示，可以用 `&&`：

```jsx
{loggedIn && <h1>Hello member</h1>}
```

React 里不能直接在 JSX 花括号中写完整 `if` 语句：

```jsx
{/* 不推荐，也不能这样直接写 */}
{if (loggedIn) { return <h1>Hello</h1> }}
```

因为 JSX 里需要的是表达式，不是语句块。

---

## 15. JSX 内联样式

可以写内联样式：

```jsx
<h1 style={{ color: 'red', fontSize: '24px' }}>
  Hello
</h1>
```

注意：

- 外层 `{}` 表示进入 JavaScript
- 内层 `{}` 表示样式对象
- CSS 属性改成驼峰写法

例如：

```txt
font-size -> fontSize
background-color -> backgroundColor
```

不过本课程主要使用 Tailwind class：

```jsx
<h1 className="text-5xl font-bold text-indigo-700">
  Become a React Dev
</h1>
```

---

## 16. 组件拆分思路

课程从一个完整 HTML 页面开始，然后逐步拆成组件。

目标结构：

```txt
App
├─ Navbar
├─ Hero
├─ HomeCards
│  └─ Card
├─ JobListings
│  └─ JobListing
├─ ViewAllJobs
├─ JobPage
├─ AddJobPage
├─ EditJobPage
└─ NotFoundPage
```

这样做的好处：

- `App` 保持干净
- 每个组件职责明确
- 重复 UI 可以复用
- 后面加路由更自然

---

## 17. Navbar 组件

创建：

```txt
src/components/Navbar.jsx
```

组件：

```jsx
const Navbar = () => {
  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <a className="flex flex-shrink-0 items-center mr-4" href="/">
              React Jobs
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
```

如果使用图片 logo，可以放在：

```txt
src/assets/images/logo.png
```

导入：

```jsx
import logo from '../assets/images/logo.png'
```

使用：

```jsx
<img className="h-10 w-auto" src={logo} alt="React Jobs" />
```

在 Vite 中，导入图片后可以直接作为 `src` 使用。

---

## 18. Hero 组件和 Props

创建：

```txt
src/components/Hero.jsx
```

组件可以接收 props：

```jsx
const Hero = ({ title, subtitle }) => {
  return (
    <section className="bg-indigo-700 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="my-4 text-xl text-white">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
```

使用：

```jsx
<Hero
  title="Become a React Dev"
  subtitle="Find the React job that fits your skill set"
/>
```

也可以设置默认值：

```jsx
const Hero = ({
  title = 'Become a React Dev',
  subtitle = 'Find the React job that fits your skill set',
}) => {
  return (
    <section>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  )
}
```

Props 可以理解为组件的参数。

---

## 19. Children 和 Card 组件

有些组件不是通过 props 传文字，而是包住一段内容。

例如：

```jsx
<Card>
  <h2>For Developers</h2>
  <p>Browse our React jobs and start your career today.</p>
</Card>
```

组件内部通过 `children` 接收：

```jsx
const Card = ({ children, bg = 'bg-gray-100' }) => {
  return (
    <div className={`${bg} p-6 rounded-lg shadow-md`}>
      {children}
    </div>
  )
}

export default Card
```

这里还通过 `bg` prop 控制背景色：

```jsx
<Card bg="bg-indigo-100">
  <h2>For Employers</h2>
  <p>List your job to find the perfect developer.</p>
</Card>
```

这说明 props 不只能传内容，也能传样式配置。

---

## 20. HomeCards 组件

`HomeCards` 负责首页两个入口卡片：

```jsx
import Card from './Card'

const HomeCards = () => {
  return (
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold">For Developers</h2>
            <p className="mt-2 mb-4">
              Browse our React jobs and start your career today.
            </p>
            <a
              href="/jobs"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              Browse Jobs
            </a>
          </Card>

          <Card bg="bg-indigo-100">
            <h2 className="text-2xl font-bold">For Employers</h2>
            <p className="mt-2 mb-4">
              List your job to find the perfect developer.
            </p>
            <a
              href="/add-job"
              className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
            >
              Add Job
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomeCards
```

后面接入 React Router 时，站内链接会从 `<a>` 改成 `<Link>`。

---

## 21. 准备 Jobs 数据

课程一开始先用本地 JSON 文件模拟数据。

```txt
src/jobs.json
```

结构大概是：

```json
[
  {
    "id": "1",
    "title": "Senior React Developer",
    "type": "Full-Time",
    "description": "We are seeking a talented Front-End Developer...",
    "location": "Boston, MA",
    "salary": "$70K - $80K",
    "company": {
      "name": "NewTek Solutions",
      "description": "NewTek Solutions is a leading technology company...",
      "contactEmail": "contact@newteksolutions.com",
      "contactPhone": "555-555-5555"
    }
  }
]
```

后面使用 JSON Server 时，格式会改成：

```json
{
  "jobs": [
    {
      "id": "1",
      "title": "Senior React Developer"
    }
  ]
}
```

因为 JSON Server 需要顶层资源名，例如 `jobs`。

---

## 22. JobListings 组件

导入 JSON 数据：

```jsx
import jobs from '../jobs.json'
import JobListing from './JobListing'

const JobListings = () => {
  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          Browse Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobListing key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default JobListings
```

这里的重点：

- `jobs` 是数组
- `map()` 把每个 job 变成一个组件
- `key={job.id}` 用于列表 diff
- `job={job}` 把单条数据传给子组件

---

## 23. JobListing 组件

单个职位卡片：

```jsx
const JobListing = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-md relative">
      <div className="p-4">
        <div className="mb-6">
          <div className="text-gray-600 my-2">{job.type}</div>
          <h3 className="text-xl font-bold">{job.title}</h3>
        </div>

        <div className="mb-5">
          {job.description}
        </div>

        <h3 className="text-indigo-500 mb-2">
          {job.salary} / Year
        </h3>

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="text-orange-700 mb-3">
            {job.location}
          </div>
          <a
            href={`/jobs/${job.id}`}
            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  )
}

export default JobListing
```

动态链接：

```jsx
href={`/jobs/${job.id}`}
```

后面接 React Router 时，会换成：

```jsx
to={`/jobs/${job.id}`}
```

---

## 24. React Icons

课程中使用图标时，不再使用 Font Awesome CDN，而是使用 `react-icons`。

安装：

```bash
npm install react-icons
```

导入图标：

```jsx
import { FaMapMarker } from 'react-icons/fa'
```

使用：

```jsx
<div className="text-orange-700 mb-3">
  <FaMapMarker className="inline text-lg mb-1 mr-1" />
  {job.location}
</div>
```

图标本质上也是 React 组件。

---

## 25. State 和 useState

课程通过职位描述展开/收起演示 component state。

导入：

```jsx
import { useState } from 'react'
```

使用：

```jsx
const [showFullDescription, setShowFullDescription] = useState(false)
```

含义：

| 名称 | 含义 |
|------|------|
| `showFullDescription` | 当前状态 |
| `setShowFullDescription` | 更新状态的方法 |
| `false` | 初始值 |

控制描述长度：

```jsx
let description = job.description

if (!showFullDescription) {
  description = description.substring(0, 90) + '...'
}
```

切换按钮：

```jsx
<button
  onClick={() => setShowFullDescription(!showFullDescription)}
  className="text-indigo-500 mb-5 hover:text-indigo-600"
>
  {showFullDescription ? 'Less' : 'More'}
</button>
```

这就是 state 驱动 UI：

```txt
showFullDescription = false -> 显示短描述
showFullDescription = true -> 显示完整描述
```

---

## 26. Props vs State

| 对比 | Props | State |
|------|------|------|
| 来源 | 父组件传入 | 组件内部维护 |
| 是否可变 | 子组件不能直接改 | 通过 setState 更新 |
| 用途 | 组件配置和数据传递 | 描述组件内部变化 |
| 示例 | `job={job}` | `showFullDescription` |

简单理解：

```txt
Props 是外部给我的
State 是我自己管理的
```

---

## 27. useEffect 和数据获取

后面接入后端 API 时，会用 `useEffect` 在页面加载时获取数据。

```jsx
import { useEffect, useState } from 'react'

const [jobs, setJobs] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.log('Error fetching data', error)
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [])
```

`useEffect(..., [])` 表示组件第一次渲染后执行一次。

典型用途：

- 请求 API
- 设置订阅
- 操作浏览器 API
- 初始化某些外部资源

---

## 28. JSON Server mock 后端

JSON Server 可以用一个 JSON 文件快速模拟 REST API。

安装：

```bash
npm install json-server
```

创建：

```txt
jobs.json
```

格式：

```json
{
  "jobs": [
    {
      "id": "1",
      "title": "Senior React Developer",
      "type": "Full-Time"
    }
  ]
}
```

在 `package.json` 加脚本：

```json
{
  "scripts": {
    "server": "json-server --watch jobs.json --port 8000"
  }
}
```

启动：

```bash
npm run server
```

访问：

```txt
http://localhost:8000/jobs
```

JSON Server 支持：

| 方法 | 路径 | 作用 |
|------|------|------|
| GET | `/jobs` | 获取全部职位 |
| GET | `/jobs/:id` | 获取单个职位 |
| POST | `/jobs` | 新增职位 |
| PUT/PATCH | `/jobs/:id` | 更新职位 |
| DELETE | `/jobs/:id` | 删除职位 |

---

## 29. React Router

安装：

```bash
npm install react-router-dom
```

常见页面：

```txt
/
/jobs
/jobs/:id
/add-job
/edit-job/:id
/*
```

对应组件：

```txt
HomePage
JobsPage
JobPage
AddJobPage
EditJobPage
NotFoundPage
```

React Router 可以让 SPA 看起来像多页面应用。

---

## 30. 路由配置

React Router 6.4+ 常见写法：

```jsx
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobPage />} />
      <Route path="/add-job" element={<AddJobPage />} />
      <Route path="/edit-job/:id" element={<EditJobPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
)

const App = () => {
  return <RouterProvider router={router} />
}

export default App
```

`MainLayout` 通常放公共结构：

```jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default MainLayout
```

`Outlet` 表示当前子路由渲染的位置。

---

## 31. Link 和 NavLink

站内跳转不要用普通 `<a>`，否则会刷新页面。

用 `Link`：

```jsx
import { Link } from 'react-router-dom'

<Link to="/jobs">Browse Jobs</Link>
```

导航栏可以用 `NavLink`，它能判断当前链接是否激活：

```jsx
import { NavLink } from 'react-router-dom'

<NavLink
  to="/jobs"
  className={({ isActive }) =>
    isActive
      ? 'bg-black text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 rounded-md px-3 py-2'
  }
>
  Jobs
</NavLink>
```

---

## 32. 动态路由参数

职位详情页路径：

```txt
/jobs/:id
```

在组件中读取 id：

```jsx
import { useParams } from 'react-router-dom'

const JobPage = () => {
  const { id } = useParams()

  return <div>Job ID: {id}</div>
}
```

然后请求：

```js
const res = await fetch(`http://localhost:8000/jobs/${id}`)
```

---

## 33. Loader 数据加载

React Router 支持 loader。

定义 loader：

```jsx
const jobLoader = async ({ params }) => {
  const res = await fetch(`http://localhost:8000/jobs/${params.id}`)
  const data = await res.json()
  return data
}
```

配置：

```jsx
<Route
  path="/jobs/:id"
  element={<JobPage />}
  loader={jobLoader}
/>
```

组件中读取：

```jsx
import { useLoaderData } from 'react-router-dom'

const JobPage = () => {
  const job = useLoaderData()

  return <h1>{job.title}</h1>
}
```

这种方式可以让路由负责数据加载。

---

## 34. 添加 Job

添加页面会用表单收集数据。

常见 state：

```jsx
const [title, setTitle] = useState('')
const [type, setType] = useState('Full-Time')
const [location, setLocation] = useState('')
const [description, setDescription] = useState('')
const [salary, setSalary] = useState('Under $50K')
const [companyName, setCompanyName] = useState('')
const [companyDescription, setCompanyDescription] = useState('')
const [contactEmail, setContactEmail] = useState('')
const [contactPhone, setContactPhone] = useState('')
```

提交时组装对象：

```js
const newJob = {
  title,
  type,
  location,
  description,
  salary,
  company: {
    name: companyName,
    description: companyDescription,
    contactEmail,
    contactPhone,
  },
}
```

POST 请求：

```js
await fetch('http://localhost:8000/jobs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newJob),
})
```

提交后可以跳转：

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

navigate('/jobs')
```

---

## 35. 删除 Job

详情页可以提供删除按钮。

删除请求：

```js
const deleteJob = async (id) => {
  await fetch(`http://localhost:8000/jobs/${id}`, {
    method: 'DELETE',
  })
}
```

删除后跳转回职位列表：

```js
await deleteJob(id)
navigate('/jobs')
```

真实项目里通常还会加确认框：

```js
const confirm = window.confirm('Are you sure you want to delete this job?')

if (!confirm) return
```

---

## 36. 编辑 Job

编辑逻辑和添加类似，不同点是：

- 先加载已有 job
- 表单初始值来自已有数据
- 提交时发 PUT 或 PATCH 请求

PUT 请求：

```js
await fetch(`http://localhost:8000/jobs/${id}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updatedJob),
})
```

更新后跳转：

```js
navigate(`/jobs/${id}`)
```

---

## 37. Loading 状态

数据请求不是瞬间完成的，所以需要 loading state。

```jsx
const [loading, setLoading] = useState(true)
```

请求结束：

```js
finally {
  setLoading(false)
}
```

渲染：

```jsx
return loading ? (
  <Spinner />
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {jobs.map((job) => (
      <JobListing key={job.id} job={job} />
    ))}
  </div>
)
```

真实项目中，loading、empty、error 三种状态都要考虑。

---

## 38. Toast 提示

课程项目里常见做法是安装提示组件库。

例如：

```bash
npm install react-toastify
```

在 App 或 Layout 中放容器：

```jsx
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

<ToastContainer />
```

使用：

```js
import { toast } from 'react-toastify'

toast.success('Job added successfully')
toast.error('Something went wrong')
```

这比只用 `alert()` 更适合真实应用。

---

## 39. 本项目的页面结构

### HomePage

首页包含：

- Hero
- HomeCards
- 前 3 个职位
- View All Jobs 按钮

### JobsPage

职位列表页包含：

- 全部职位
- 每个职位卡片
- More/Less 描述展开

### JobPage

详情页包含：

- 职位标题
- 类型
- 位置
- 描述
- 薪资
- 公司信息
- 编辑按钮
- 删除按钮

### AddJobPage

新增职位表单。

### EditJobPage

编辑职位表单。

### NotFoundPage

兜底 404 页面。

---

## 40. 课程核心知识地图

```txt
React 基础
├─ JSX
├─ Components
├─ Props
├─ Children
├─ State
├─ Events
├─ Conditional Rendering
├─ List Rendering
└─ Hooks

项目工程
├─ Vite
├─ Tailwind CSS
├─ React Icons
├─ React Router
├─ JSON Server
└─ Mock REST API

项目功能
├─ 首页
├─ 职位列表
├─ 职位详情
├─ 新增职位
├─ 编辑职位
├─ 删除职位
└─ 404 页面
```

---

## 41. 初学者最该抓住的重点

### 1. 组件是页面的积木

不要把页面当作一个大 HTML 文件，而是拆成多个可管理的小组件。

### 2. Props 是父传子

父组件把数据传给子组件：

```jsx
<JobListing job={job} />
```

子组件读取：

```jsx
const JobListing = ({ job }) => {}
```

### 3. State 表示变化

只要 UI 会变，就可能需要 state。

例如：

- 描述展开与收起
- 表单输入内容
- loading 状态
- API 返回的数据

### 4. 不要直接改 state

应该创建新数据，再用 setter 更新。

```js
setJobs([...jobs, newJob])
setJobs(jobs.filter((job) => job.id !== id))
```

### 5. Router 让 SPA 变成多页面体验

路径变了，浏览器没有整页刷新，而是 React 根据当前路径渲染对应组件。

---

## 42. 和 2021 版相比，2024 版学到了什么新东西？

2021 版更适合理解 React 最小闭环：

```txt
组件 -> props -> state -> 事件 -> JSON Server -> 路由
```

2024 版更接近现代项目习惯：

```txt
Vite -> Tailwind -> Router 6 -> Layout -> Loader -> CRUD 页面
```

如果你是速成 React，建议顺序是：

1. 先看 2021 版，理解 React 基础模型
2. 再看 2024 版，理解现代项目结构
3. 然后自己做一个 CRUD 小项目
4. 最后再学 Next.js、TypeScript、状态管理和组件库

---

## 43. 一句话总结

这门 2024 版 React Crash Course 的重点不是死记 API，而是建立现代 React 项目的基本感觉：

> 用 Vite 搭项目，用组件拆 UI，用 props 传数据，用 state 管变化，用 router 组织页面，用 mock API 练 CRUD。

把这些跑通之后，再进入真实项目就不会那么迷糊了。

---

## 参考

- React 官方 React 19 发布说明：https://react.dev/blog/2024/12/05/react-19
- React 官方文档：https://react.dev
- Vite 官方文档：https://vite.dev
- React Router 官方文档：https://reactrouter.com
- Tailwind CSS 官方文档：https://tailwindcss.com
