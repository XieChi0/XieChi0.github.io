---
title: React Crash Course 中文速成笔记
published: 2026-05-29
updated: 2026-05-29
description: '基于 React 2021 Crash Course 视频转录稿整理，覆盖 React 基础、组件、Props、State、Hooks、JSON Server、路由与构建部署。'
image: ''
tags: [React]
category: '前端/React'
draft: false
---

# React Crash Course 中文速成笔记

> 本文基于一份 React Crash Course 视频英文转录稿提炼整理，目标不是逐字翻译，而是把课程里的核心知识点转成适合快速复习的中文笔记。

---

## 1. React 是什么？

React 的标准定义是：

> 一个用于构建用户界面的 JavaScript 库。

它由 Facebook 创建并维护，主要运行在浏览器中，属于**前端 UI 层技术**。

虽然官方说 React 是 library，但很多人也会把它叫作 framework。原因是 React 的实际使用方式更像 Angular、Vue 这类前端框架：

- 用组件组织页面
- 用状态驱动 UI
- 用生态包扩展能力
- 常配合路由、状态管理、构建工具一起使用

React 本身不内置路由，也不直接处理数据库连接。如果要做完整应用，通常会把 React 放在前端，然后配合后端 API 使用。

常见全栈组合：

```txt
MERN = MongoDB + Express + React + Node.js
```

也可以这样搭配：

```txt
React + Laravel
React + Django
React + NestJS
React + Spring Boot
```

后端负责提供 JSON 数据，React 通过 HTTP 请求获取、添加、更新、删除数据。

---

## 2. 单页应用 SPA

React 通常用于构建 SPA，也就是 Single Page Application，中文一般叫**单页应用**。

传统服务端页面通常是：

```txt
用户访问页面 -> 服务器返回完整 HTML -> 页面刷新
```

React SPA 通常是：

```txt
浏览器加载一个 index.html -> React 接管页面渲染 -> 路由和交互由 JavaScript 控制
```

React 应用最终会被打包成 JavaScript bundle，由浏览器加载执行。

这种方式的优点：

- 页面交互更快
- 局部更新，不需要频繁刷新整个页面
- 用户体验更接近桌面应用
- 更适合复杂、动态、交互密集的前端界面

---

## 3. 为什么要学 React？

React 最重要的价值之一是：它给前端 UI 提供了一套清晰的组织方式。

在大型动态页面中，如果只用原生 JavaScript，很容易出现：

- HTML、CSS、JS 逻辑散落各处
- DOM 操作越来越混乱
- 不同人写法差异很大
- 状态变化难以追踪
- 组件复用困难

React 通过组件化解决这些问题。

你可以把页面拆成一个个可复用组件：

```txt
App
├─ Header
│  └─ Button
├─ AddTask
├─ Tasks
│  ├─ Task
│  ├─ Task
│  └─ Task
└─ Footer
```

每个组件可以拥有自己的结构、样式、事件和状态。

---

## 4. React 在 MVC 中的位置

MVC 是一种常见软件架构模式：

| 部分 | 含义 |
|------|------|
| Model | 数据 |
| View | 用户界面 |
| Controller | 请求、路由、业务协调 |

React 主要负责 View，也就是用户看见并交互的 UI 部分。

React 不负责数据库，也不直接替代后端框架。它通常通过 API 与后端通信。

---

## 5. 学 React 前需要什么基础？

不建议刚学完 HTML 和 CSS 就直接跳 React。至少应该先熟悉 JavaScript 基础。

建议掌握：

- 变量、数据类型、函数、条件、循环
- 数组和对象
- ES6 语法
- 箭头函数
- 解构赋值
- 模板字符串
- 模块导入导出
- Promise
- async / await
- fetch API
- 常用数组方法

React 中非常常见的数组方法：

```js
forEach()
map()
filter()
reduce()
```

尤其是 `map()` 和 `filter()`，在渲染列表、删除数据、更新状态时会频繁出现。

---

## 6. 创建 React 项目

视频中使用的是 Create React App。

```bash
npx create-react-app react-task-tracker
cd react-task-tracker
npm start
```

常用命令：

```bash
npm start
npm run build
npm test
```

说明：

| 命令 | 作用 |
|------|------|
| `npm start` | 启动开发服务器，通常运行在 `localhost:3000` |
| `npm run build` | 生成生产环境静态文件 |
| `npm test` | 运行测试 |

Create React App 会生成一个基础项目结构：

```txt
react-task-tracker
├─ public
│  └─ index.html
├─ src
│  ├─ index.js
│  ├─ App.js
│  └─ index.css
└─ package.json
```

---

## 7. React 的入口

`public/index.html` 中通常有一个根节点：

```html
<div id="root"></div>
```

React 会把整个应用挂载到这个节点里。

`src/index.js` 类似这样：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

`App` 是根组件，其他组件通常都会被组织到 `App` 里面。

---

## 8. JSX

React 组件返回的内容看起来像 HTML，但其实是 JSX。

JSX 全称是 JavaScript Syntax Extension。

示例：

```jsx
function App() {
  return (
    <div className="container">
      <h1>Hello React</h1>
    </div>
  )
}
```

JSX 和 HTML 很像，但有一些区别：

| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| 内联样式字符串 | 样式对象 |

例如：

```jsx
<label htmlFor="task">Task</label>
<div className="container"></div>
```

JSX 中可以嵌入 JavaScript 表达式：

```jsx
const name = 'Brad'

return <h1>Hello {name}</h1>
```

也可以写简单条件：

```jsx
const isOpen = true

return <h1>{isOpen ? 'Open' : 'Closed'}</h1>
```

注意：组件返回 JSX 时，必须只有一个父级元素。

可以用普通元素包裹：

```jsx
return (
  <div>
    <h1>Hello</h1>
    <h2>React</h2>
  </div>
)
```

也可以用 Fragment：

```jsx
return (
  <>
    <h1>Hello</h1>
    <h2>React</h2>
  </>
)
```

---

## 9. 组件 Component

React 的核心思想是组件化。

组件可以是函数，也可以是类。现代 React 更常用函数组件配合 Hooks。

函数组件示例：

```jsx
const Header = () => {
  return (
    <header>
      <h1>Task Tracker</h1>
    </header>
  )
}

export default Header
```

类组件示例：

```jsx
import React from 'react'

class Header extends React.Component {
  render() {
    return <h1>Task Tracker</h1>
  }
}

export default Header
```

课程主要使用函数组件。

---

## 10. Props

Props 可以理解为组件的外部参数。

父组件传值：

```jsx
<Header title="Task Tracker" />
```

子组件接收：

```jsx
const Header = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  )
}
```

Props 的特点：

- 从父组件传给子组件
- 子组件不能直接修改 props
- 可以传字符串、数字、布尔值、对象、数组、函数

如果传数字或布尔值，要用花括号：

```jsx
<Header count={1} showAdd={true} />
```

---

## 11. 默认 Props

可以给组件设置默认值：

```jsx
Header.defaultProps = {
  title: 'Task Tracker',
}
```

如果父组件没有传 `title`，组件就会使用默认值。

---

## 12. PropTypes

PropTypes 可以用来检查 props 类型。

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types'

Header.propTypes = {
  title: PropTypes.string.isRequired,
}
```

如果传入的类型不对，页面仍然可能渲染，但控制台会出现警告。

这对早期学习和小项目有帮助。大型项目中也可以使用 TypeScript 做更完整的类型约束。

---

## 13. 样式写法

React 中常见样式方式：

- 普通 CSS 文件
- CSS Modules
- CSS-in-JS
- styled-components
- Tailwind CSS
- UI 组件库

课程中主要使用普通 CSS。

也可以写内联样式：

```jsx
<h1 style={{ color: 'red', backgroundColor: 'black' }}>
  Task Tracker
</h1>
```

注意 JSX 中的样式是对象，所以属性要用驼峰写法：

```js
backgroundColor
fontSize
borderRadius
```

---

## 14. Button 组件示例

把按钮抽成可复用组件：

```jsx
const Button = ({ color, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className="btn"
    >
      {text}
    </button>
  )
}

Button.defaultProps = {
  color: 'steelblue',
}

export default Button
```

使用：

```jsx
<Button color="green" text="Add" onClick={handleClick} />
```

这里体现了组件复用：

- `text` 控制按钮文案
- `color` 控制按钮颜色
- `onClick` 控制点击行为

---

## 15. 事件处理

React 中事件使用驼峰命名：

```jsx
<button onClick={handleClick}>Add</button>
```

常见事件：

```txt
onClick
onDoubleClick
onChange
onSubmit
```

如果需要传参数，不要直接调用函数，而是包一层箭头函数：

```jsx
<button onClick={() => deleteTask(task.id)}>
  Delete
</button>
```

如果写成下面这样，函数会在渲染时立即执行：

```jsx
<button onClick={deleteTask(task.id)}>
  Delete
</button>
```

---

## 16. State

State 是组件内部状态。

它决定组件如何渲染、如何变化。

例子：

- 菜单是否展开
- 表单输入内容
- 任务列表数据
- 当前用户信息
- 加载中状态
- 错误信息

React 中不要直接修改 state。

错误示例：

```js
tasks.push(newTask)
```

正确思路是：创建新的状态，再用更新函数替换旧状态。

---

## 17. Hooks

React 16.8 引入了 Hooks，让函数组件也可以使用状态和生命周期能力。

课程中重点使用两个 Hook：

```txt
useState
useEffect
```

### useState

`useState` 用来声明状态。

```jsx
import { useState } from 'react'

const [tasks, setTasks] = useState([])
```

含义：

| 名称 | 作用 |
|------|------|
| `tasks` | 当前状态值 |
| `setTasks` | 更新状态的方法 |
| `useState([])` | 初始值为空数组 |

示例：

```jsx
const [showAddTask, setShowAddTask] = useState(false)
```

切换布尔值：

```js
setShowAddTask(!showAddTask)
```

### useEffect

`useEffect` 用来处理副作用，例如：

- 页面加载后请求数据
- 监听某些变化
- 操作浏览器 API
- 设置定时器

页面加载时请求数据：

```jsx
useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }

  getTasks()
}, [])
```

最后的 `[]` 是依赖数组。空数组表示这个 effect 只在组件首次渲染后执行一次。

---

## 18. Task Tracker 项目功能

课程构建的是一个任务追踪应用。

核心功能：

- 展示任务列表
- 添加任务
- 删除任务
- 双击任务切换 reminder
- 显示或隐藏添加任务表单
- 使用 JSON Server 模拟后端 API
- 使用 React Router 添加 About 页面

任务数据结构：

```js
{
  id: 1,
  text: 'Doctors Appointment',
  day: 'Feb 5th at 2:30pm',
  reminder: true
}
```

组件拆分：

```txt
App
├─ Header
├─ Button
├─ AddTask
├─ Tasks
├─ Task
├─ Footer
└─ About
```

---

## 19. 渲染任务列表

父组件保存任务数组：

```jsx
const [tasks, setTasks] = useState([
  {
    id: 1,
    text: 'Doctors Appointment',
    day: 'Feb 5th at 2:30pm',
    reminder: true,
  },
])
```

把任务传给子组件：

```jsx
<Tasks tasks={tasks} />
```

子组件用 `map()` 渲染：

```jsx
const Tasks = ({ tasks }) => {
  return (
    <>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </>
  )
}
```

`key` 必须是唯一值，通常用数据的 `id`。

如果没有 `key`，React 会在控制台提示警告。

---

## 20. 单个 Task 组件

```jsx
const Task = ({ task }) => {
  return (
    <div className="task">
      <h3>{task.text}</h3>
      <p>{task.day}</p>
    </div>
  )
}
```

如果需要根据 `reminder` 动态添加 class：

```jsx
<div className={`task ${task.reminder ? 'reminder' : ''}`}>
  <h3>{task.text}</h3>
  <p>{task.day}</p>
</div>
```

当 `task.reminder` 为 `true` 时，添加 `reminder` 样式。

---

## 21. 删除任务

删除任务的核心思路：

```js
setTasks(tasks.filter((task) => task.id !== id))
```

解释：

- `filter()` 返回一个新数组
- 保留所有 `id` 不等于目标 `id` 的任务
- 等于目标 `id` 的任务会被过滤掉
- 最后用 `setTasks()` 更新状态

父组件定义删除函数：

```jsx
const deleteTask = (id) => {
  setTasks(tasks.filter((task) => task.id !== id))
}
```

传给子组件：

```jsx
<Tasks tasks={tasks} onDelete={deleteTask} />
```

再传给单个任务：

```jsx
<Task key={task.id} task={task} onDelete={onDelete} />
```

Task 中触发：

```jsx
<button onClick={() => onDelete(task.id)}>
  Delete
</button>
```

这体现了 React 的常见数据流：

```txt
数据从父组件向下传
事件从子组件向上传
```

---

## 22. 切换 Reminder

双击任务切换提醒状态。

核心逻辑：

```js
setTasks(
  tasks.map((task) =>
    task.id === id
      ? { ...task, reminder: !task.reminder }
      : task
  )
)
```

解释：

- 用 `map()` 遍历每个任务
- 如果找到目标任务，就复制原任务并反转 `reminder`
- 其他任务保持不变
- 最后生成一个新数组更新 state

Task 组件中绑定双击事件：

```jsx
<div
  className={`task ${task.reminder ? 'reminder' : ''}`}
  onDoubleClick={() => onToggle(task.id)}
>
  <h3>{task.text}</h3>
  <p>{task.day}</p>
</div>
```

---

## 23. 表单与受控组件

添加任务表单通常由多个输入组成：

- 任务文本
- 日期和时间
- 是否设置提醒

每个输入对应一个 state：

```jsx
const [text, setText] = useState('')
const [day, setDay] = useState('')
const [reminder, setReminder] = useState(false)
```

文本输入：

```jsx
<input
  type="text"
  placeholder="Add Task"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

复选框：

```jsx
<input
  type="checkbox"
  checked={reminder}
  onChange={(e) => setReminder(e.currentTarget.checked)}
/>
```

这种由 React state 控制输入值的写法叫**受控组件**。

提交表单：

```jsx
const onSubmit = (e) => {
  e.preventDefault()

  if (!text) {
    alert('Please add a task')
    return
  }

  onAdd({ text, day, reminder })

  setText('')
  setDay('')
  setReminder(false)
}
```

表单：

```jsx
<form className="add-form" onSubmit={onSubmit}>
  {/* inputs */}
  <input type="submit" value="Save Task" className="btn btn-block" />
</form>
```

---

## 24. 添加任务

如果没有后端，可以临时生成一个随机 id：

```js
const id = Math.floor(Math.random() * 10000) + 1
const newTask = { id, ...task }

setTasks([...tasks, newTask])
```

关键是：

```js
[...tasks, newTask]
```

这表示创建一个新数组，包含旧任务和新任务。

不要直接 `push()` 修改原数组。

---

## 25. 显示和隐藏表单

在 `App` 中维护一个布尔状态：

```jsx
const [showAddTask, setShowAddTask] = useState(false)
```

根据状态决定是否渲染：

```jsx
{showAddTask && <AddTask onAdd={addTask} />}
```

按钮点击时切换：

```jsx
<Header
  onAdd={() => setShowAddTask(!showAddTask)}
  showAdd={showAddTask}
/>
```

Header 中根据状态切换按钮文案和颜色：

```jsx
<Button
  color={showAdd ? 'red' : 'green'}
  text={showAdd ? 'Close' : 'Add'}
  onClick={onAdd}
/>
```

这就是 React 适合动态 UI 的地方：界面由状态自动驱动。

---

## 26. 构建生产版本

开发时运行：

```bash
npm start
```

部署前构建：

```bash
npm run build
```

构建后会生成 `build` 文件夹，里面是最终要部署的静态资源。

可以用 `serve` 在本地预览：

```bash
npm install -g serve
serve -s build -p 8000
```

然后访问：

```txt
http://localhost:8000
```

开发源码不会直接部署给浏览器，真正部署的是打包后的静态文件。

---

## 27. JSON Server 模拟后端

JSON Server 可以快速创建一个假的 REST API。

安装：

```bash
npm install json-server
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "server": "json-server --watch db.json --port 5000"
  }
}
```

创建 `db.json`：

```json
{
  "tasks": [
    {
      "id": 1,
      "text": "Doctors Appointment",
      "day": "Feb 5th at 2:30pm",
      "reminder": true
    }
  ]
}
```

启动：

```bash
npm run server
```

访问：

```txt
http://localhost:5000/tasks
```

JSON Server 支持常见 REST 操作：

| 方法 | 路径 | 作用 |
|------|------|------|
| GET | `/tasks` | 获取全部任务 |
| GET | `/tasks/:id` | 获取单个任务 |
| POST | `/tasks` | 添加任务 |
| PUT | `/tasks/:id` | 更新任务 |
| DELETE | `/tasks/:id` | 删除任务 |

---

## 28. 从 API 获取任务

封装请求：

```js
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

  return data
}
```

页面加载时获取：

```jsx
useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }

  getTasks()
}, [])
```

这时任务不再写死在前端 state 中，而是来自后端 API。

---

## 29. 请求单个任务

```js
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}
```

更新某个任务前，可以先请求它的最新数据。

---

## 30. 删除 API 数据

删除函数变成异步：

```js
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id))
}
```

先请求后端删除，再更新前端 UI。

---

## 31. 添加 API 数据

```js
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json()

  setTasks([...tasks, data])
}
```

JSON Server 会自动生成 `id`，所以前端不需要自己生成随机 id。

---

## 32. 更新 Reminder 到 API

```js
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updatedTask = {
    ...taskToToggle,
    reminder: !taskToToggle.reminder,
  }

  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  })

  const data = await res.json()

  setTasks(
    tasks.map((task) =>
      task.id === id
        ? { ...task, reminder: data.reminder }
        : task
    )
  )
}
```

这里做了两件事：

- 后端数据被更新
- 前端 state 同步更新

---

## 33. React Router

React 核心库不自带路由，需要安装：

```bash
npm install react-router-dom
```

课程中使用路由创建 About 页面。

导入：

```jsx
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
```

包裹应用：

```jsx
return (
  <Router>
    <div className="container">
      <Header />
      <Footer />
    </div>
  </Router>
)
```

定义路由：

```jsx
<Route path="/about" component={About} />
```

首页路由可以用 `render` 放多个组件：

```jsx
<Route
  path="/"
  exact
  render={(props) => (
    <>
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks
          tasks={tasks}
          onDelete={deleteTask}
          onToggle={toggleReminder}
        />
      ) : (
        'No Tasks To Show'
      )}
    </>
  )}
/>
```

`exact` 的作用是精确匹配 `/`，否则 `/about` 也会先匹配到 `/`。

---

## 34. Link 组件

在 React Router 中，不建议用普通 `<a>` 标签做站内跳转。

普通 `<a>` 会导致页面刷新：

```html
<a href="/about">About</a>
```

应该使用 `Link`：

```jsx
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>
```

这样路由切换是前端完成的，不会刷新整个页面。

---

## 35. useLocation

`useLocation` 可以获取当前路径。

```jsx
import { useLocation } from 'react-router-dom'

const Header = ({ onAdd, showAdd }) => {
  const location = useLocation()

  return (
    <header className="header">
      <h1>Task Tracker</h1>

      {location.pathname === '/' && (
        <Button
          color={showAdd ? 'red' : 'green'}
          text={showAdd ? 'Close' : 'Add'}
          onClick={onAdd}
        />
      )}
    </header>
  )
}
```

这里的效果是：

- 首页显示 Add / Close 按钮
- About 页隐藏按钮

---

## 36. 课程核心心智模型

学 React 时要建立这几个模型：

### 1. 页面是组件树

不要把页面当成一整块 HTML，而是拆成多个组件。

```txt
Header
Button
Form
List
ListItem
Footer
```

### 2. UI 是状态的结果

状态变了，UI 自动变。

```txt
state -> render -> UI
```

例如：

- `showAddTask = true`，显示表单
- `showAddTask = false`，隐藏表单
- `reminder = true`，显示绿色边框
- `reminder = false`，不显示绿色边框

### 3. 数据向下，事件向上

父组件把数据传给子组件：

```txt
App -> Tasks -> Task
```

子组件通过事件通知父组件：

```txt
Task click -> onDelete(id) -> App 更新 state
```

### 4. 不直接修改状态

不要直接改旧数组或旧对象，而是创建新数据。

```js
setTasks([...tasks, newTask])
setTasks(tasks.filter((task) => task.id !== id))
setTasks(tasks.map((task) => task.id === id ? updatedTask : task))
```

---

## 37. 本课程覆盖的知识点

这门速成课大致覆盖：

- React 是什么
- SPA 单页应用
- Create React App
- 项目结构
- JSX
- 函数组件
- 类组件概念
- Props
- Default Props
- PropTypes
- 事件处理
- useState
- useEffect
- 列表渲染
- 条件渲染
- 表单和受控组件
- 组件间传值
- JSON Server
- fetch API
- REST API 的 CRUD
- React Router
- Link
- useLocation
- 生产环境构建

---

## 38. 初学者学习建议

如果第一次看 React 觉得信息量很大，是正常的。

建议按这个顺序练：

1. 先熟悉 JavaScript 的数组方法和异步请求
2. 再理解 JSX 和组件
3. 然后练 props 和 state
4. 接着做表单、列表、删除、编辑
5. 再接 API 请求
6. 最后学习路由和更复杂的状态管理

不要一上来就学 Redux、复杂工程化、SSR。先把组件、状态和数据流练顺。

---

## 39. 一句话总结

React 的核心不是“写很多特殊语法”，而是学会：

> 把 UI 拆成组件，用 state 描述变化，让数据驱动界面。

掌握这个思路后，再去学路由、请求、状态管理、组件库和工程化，都会自然很多。
