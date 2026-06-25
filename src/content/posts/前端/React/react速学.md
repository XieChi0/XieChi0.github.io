---
title: react速学
published: 2026-06-25
updated: 2026-06-25
description: 'React速学笔记：State与渲染关系、Context、useReducer等核心概念'
image: ''
tags: [React, State, Context]
category: '前端/React'
draft: false
---

### State与渲染的关系

1. 数据(state)变了 不一定 触发渲染（新旧值相同会跳过）；
2. 发生渲染 不一定 是 state 变化导致的。

#### 渲染发生的情况

1. state变化
2. 父组件重新渲染，所有子组件默认跟着一起渲染；
3. props 传进来的数据变了；
4. 用了上下文 Context，上下文值更新；

### Context可以理解为“全局传值”

普通情况下，父组件给子组件传数据要用 `props`：

```
<Child theme="dark" />
```

但是如果层级很深，就会变成这样：

```
App
 ↓ props
Page
 ↓ props
Layout
 ↓ props
Header
 ↓ props
Button
```

为了避免一层一层传，React 提供了 `Context`。

```react
import { createContext, useContext, useState } from "react"

const ThemeContext = createContext("light")

function App() {
  const [theme, setTheme] = useState("light")

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme("dark")}>
        切换主题
      </button>

      <Toolbar />
    </ThemeContext.Provider>
  )
}

function Toolbar() {
  return <Button />
}

function Button() {
  const theme = useContext(ThemeContext)

  console.log("Button render")

  return <button>当前主题：{theme}</button>
}
```

React 检测到 **Context 的 value 变了**，所有调用 `useContext(ThemeContext)` 的组件（这里只有 Button）全部重新渲染。

> **1. 创建管道：`createContext`**
>
> ```
> const ThemeContext = createContext("light")
> ```
>
> - 创建一条名叫 `ThemeContext` 的**数据管道**
> - `"light"` 是**默认值**：如果某个组件不在 Provider 包裹里，拿 context 会读到这个默认值
>
> **2. 提供数据：`ThemeContext.Provider`**
>
> ```
> <ThemeContext.Provider value={theme}>
>   {/* 这里面所有后代组件都能读取 value 里的数据 */}
>   <Toolbar />
> </ThemeContext.Provider>
> ```
>
> - `Provider` 是管道的**数据出口**，`value={theme}` 就是往管道里放的数据
> - 所有被这个标签包裹的子、孙、重孙组件，都能读取管道里的 `theme`
> - 关键点：只要 `value` 发生变化（`light` → `dark`），**所有订阅这个管道的组件全部强制重渲染**
>
> **3. 读取管道数据：`useContext(ThemeContext)`**
>
> ```
> const theme = useContext(ThemeContext)
> ```
>
> - `useContext` 是订阅管道的钩子，代表当前组件**绑定了这份共享数据**
> - 只要管道里的 `value` 更新，这个组件就会重新渲染，拿到最新的值

**补充：**

- `ThemeContext`返回的是上下文对象，它自带属性，不能单独使用< ThemeContext>
  - `ThemeContext.Provider`：提供数据的容器组件
- context的订阅 = 组件声明自己依赖这份全局共享数据，和vue的eventBus是不同的，后者只做通知，不存数据，而context订阅是要存放响应式全局状态，数据驱动视图，而且天然携带最新上下文数据，组件可以直接使用。

### useEffect介绍

`useEffect` = 副作用钩子

专门处理**不在页面渲染内的操作**，所有和 DOM、外部资源打交道的逻辑都放这里。

**什么是副作用？**

组件渲染 JSX 是**纯 UI 渲染（主逻辑）**；

除此之外所有额外操作都叫副作用：

1. 操作真实 DOM（修改 input、获取元素宽高）
2. 发网络请求（接口拿数据）
3. 定时器、延时器 `setInterval/setTimeout`
4. 监听事件（窗口滚动、窗口大小变化）
5. 本地存储读写、websocket 连接

上面的总结一下—就是异步，监听，清理。

至于具体的代码太长，省略，我已收藏。

useEffect(执行函数, 依赖数组)

```react
useEffect(() => {
  // 执行逻辑：副作用代码
  return () => {
    // 清理函数（可选）：组件销毁 / 副作用重新执行时触发
  }
}, [依赖数组])
```

组件渲染、页面DOM画好之后，才会运行useEffect内部代码。

所以可以直接操作页面DOM元素。

---

#### useEffect场景

**1. 初始化异步操作（页面加载只跑一次）**

空依赖 `[]`

- 页面打开请求接口

- 只创建一次定时器、全局监听

  属于你说的「异步」

**2. 监听数据变化执行逻辑（对应 watch）**

依赖数组写 state/props

状态一变就重新执行内部代码

属于你说的「监听」

**3. 额外必备功能：资源清理（不能漏掉）**

只要开了定时器、窗口滚动监听、订阅事件，

必须 return 清理函数，防止内存泄漏。

这块不属于异步也不算监听，但几乎配套一起用。

---

#### 依赖数组的三种写法

**1.依赖为空**

仅**组件挂载时执行 1 次**，卸载时执行清理函数。

典型场景：页面初始化请求列表、只绑定一次窗口监听

```tsx
useEffect(() => {
  // 页面一加载就请求todo数据
  fetchTodoList()
}, [])
```

**2.依赖变量**

1. 单纯修改数字/计数 → 函数式更新 setX(prev=>prev+1)
2. 定时器、延时、异步函数要实时读最新值 → useRef
3. 组件内固定监听、延时逻辑随state更新 → useEffect + 完整依赖

```tsx
useEffect(() => {
  localStorage.setItem('todo', JSON.stringify(todos))
}, [todos]) // todos一变，自动存本地
```

**3. 完全不写依赖（没有第二个参数）**

每次组件渲染都会执行，极易死循环，开发几乎不用。



#### 和useState的区别

useState 是 “**管理会影响渲染的数据**”，当你调用 setXxx 更新状态时，React 会重新渲染组件，让页面显示新数据；

而 useEffect 是 “**在数据 / 渲染变化后执行额外操作**”，它本身不直接管理状态，只是 “监听” 状态变化后去做副作用逻辑。



#### 异步，定时器需要用到useeffect的原因

1. 一次性、只在本次点击触发一次的延时
简单逻辑可以直接写在点击函数里，搭配  setX(prev=>...)  读取最新值，没问题；
2. 持续存在、长期挂载的定时器/滚动监听/窗口事件（每秒计时、resize监听）
必须放 useEffect：
- 组件销毁时要清除，不然后台一直跑，内存泄漏；
- 状态更新自动重建监听，拿到最新数据。
useEffect 配合依赖数组，能精准控制定时器只在需要的时候创建，避免重复创建。

#### useEffect和watch区别

useEffect ≠ 单纯 watch，它是挂载+监听+销毁三合一，渲染完才运行，自带清理；Vue 没有完全对等的API，是多个生命周期组合才等于它。

> 空依赖 `[]` 时：等于 Vue 的 `onMounted` + `onUnmounted`；
>
> 依赖数组有值 `[num]` 时：等于 `onMounted` + `watch(num, ...)` + `onUnmounted`。
>
> 简单说，一个 useEffect 能顶 Vue 里 “挂载 + 监听 + 销毁” 三个生命周期的组合效果。

### useRef

useRef 存的是 “**跨渲染的实时值**”

**用法一：**

useRef适合存“不触发页面刷新的可变数据

适合存：定时器 ID、接口返回的临时数据、组件卸载标记、上一次 state 的值……

这些数据只给代码内部用，页面不展示，改了也不用刷新页面，用 useRef 刚好。

**用法二：**

直接获取 DOM 元素 / 组件实例

>  本质： 都是让 ref.current 持有一个 “不会随渲染快照变化” 的引用
>
> DOM 元素本身会随渲染更新，但 ref.current 存的是 “最新 DOM 元素的引用”，不会被旧快照锁住。

Vue ref = 能驱动页面的数据；React useRef = 只存东西、不碰页面的，完全不会响应式，不会刷新页面。

修改 `.current` → **页面绝对不会刷新**

> React 每次渲染会生成 “快照”，普通变量 /state 会被 “冻结” 在当前快照里，而 useRef 的 `.current` 是**所有渲染共享的同一个 “盒子”**，不管渲染多少次，盒子里的东西永远是最新的。

**避坑：**

1. **不要用 useRef 存页面上要展示的数据**

页面文字、列表、数字必须用 useState，改 ref 页面不会更新，界面不动。

2. **渲染过程中不要读写 .current**

渲染阶段（return 里面）读取 / 修改 ref 会逻辑错乱，只在点击函数、useEffect、定时器里操作。



### 组件通信

#### Zustand 

### 仓库内部固定三块内容

#### ① 原始状态（state 数据）

就是你要存的变量，比如计数器数字

```
count: 0,
name: '测试',
```

#### ② 修改状态的同步方法（actions）

用 `set()` 更新数据，两种写法：

1. 直接覆盖全部状态

```
add: () => set({ count: 10 }),
```

2. 基于旧状态更新（推荐计数器场景）

```
increase: () => set(state => ({ count: state.count + 1 })),
decrease: () => set(state => ({ count: state.count - 1 })),
reset: () => set({ count: 0 }),
```

#### ③ 可选：读取自身状态的方法（用到 get）

如果方法里需要拿当前状态做计算，用 `get()`

```
doubleCount: () => get().count * 2
```

```js
// countStore.js
import { create } from 'zustand'

// 创建全局仓库
const useCountStore = create((set, get) => ({
  // 1. 状态数据
  count: 0,

  // 2. 修改状态的方法（actions）
  // 加1
  addOne: () => set(state => ({ count: state.count + 1 })),
  // 减1
  subOne: () => set(state => ({ count: state.count - 1 })),
  // 直接赋值
  setNum: (num) => set({ count: num }),
  // 重置
  resetCount: () => set({ count: 0 }),

  // 3. 使用get获取当前状态
  getDouble: () => {
    return get().count * 2
  }
}))

// 导出仓库钩子，组件使用
export default useCountStore
```

### 组件使用

```js
import useCountStore from './store/countStore'

function Counter() {
  // 取出状态和方法
  const count = useCountStore(state => state.count)
  const addOne = useCountStore(state => state.addOne)
  const getDouble = useCountStore(state => state.getDouble)

  return (
    <div>
      <p>数字：{count}</p>
      <p>两倍值：{getDouble()}</p>
      <button onClick={addOne}>+1</button>
    </div>
  )
}
```

修改方法都是写在 store 内部的，我只要把这个方法取出来，就是进行了修改