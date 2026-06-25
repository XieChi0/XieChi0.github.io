---
title: 吴悠1-React核心语法
published: 2026-05-29
updated: 2026-05-29
description: '基于吴悠React视频整理，涵盖JSX语法、事件处理、状态管理等核心知识点。'
image: ''
tags: [React]
category: '前端/React'
draft: false
---

# 吴悠1-React核心语法

> 视频来源：吴悠讲编程，一个很喜欢的up

---

## 1. React 概述

### 1.1 React 项目创建

React 项目有两种创建方式：

1. **直接引入文件**：通过 CDN 引入 `react.js` 和 `react-dom.js`
2. **脚手架工具**：使用 Vite 或`create-react-app` 

```bash
# Vite 方式（推荐）
npm create vite@latest myreactapp -- --template react
cd myreactapp
npm install
npm run dev

# create-react-app 方式（不推荐）
npx create-react-app myreactapp
cd myreactapp
npm start
```

### 1.2 项目目录结构

```
myreactapp/
├── public/          # 静态资源
├── src/             # 源码目录
│   ├── index.js     # 入口文件
│   ├── App.js       # 根组件
│   └── ...
├── package.json
└── ...
```

**入口文件 index.js**：

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- `React.StrictMode`：严格模式，用于组件内部功能审查
- `ReactDOM.createRoot()`：创建 React 实例
- `.render`：根组件渲染

**根组件 App.js**：

```javascript
function App() {
  return <div>Hello React</div>;
}

export default App;
```

> React 组件有两种写法：
>
> **函数式组件**（官方主推）和**类组件**。
>
> 本笔记采用函数式组件写法。

---

## 2. JSX 语法

JSX 是 JavaScript 和 HTML 结合的模板语法，将 UI 和逻辑写在同一个地方。

> 是在 JavaScript 中插入 HTML。看起来像 HTML 的代码，最终会被编译成 React.createElement 这样的 JavaScript 函数调用。
>
> 用类似 HTML 的写法在 JS 里描述页面结构。
>
> JSX 最终不会直接编译成 DOM，而是先被 Babel 等工具编译成 `React.createElement` 函数调用，这个函数会返回**虚拟 DOM 对象**。然后 React 会根据虚拟 DOM 计算出需要更新的部分，再把这些变化应用到**真实 DOM** 上。所以 JSX 是虚拟 DOM 的 “语法糖”，真实 DOM 是虚拟 DOM 渲染后的结果。

### 2.0 jsx初印象

#### 与 Vue 的对比

Vue 组件（分块）：

```vue
<template>
  <!-- 放 HTML -->
</template>

<script setup>
  // 放 JavaScript
</script>

<style>
  /* 放 CSS */
</style>
```

React 组件（JSX 写法）：

```jsx
import React from 'react';  // 引入 React

function App() {           // 一个普通函数
  return (                 // return 里面就是 JSX（HTML + JS 混写）
    <div className="app">
      <h1>Hello</h1>
      <p>内容</p>
    </div>
  );
}

export default App;        // 导出
```

|         | Vue                   | React                      |
| :------ | :-------------------- | :------------------------- |
| 模板    | `<template>` 单独区域 | JSX 直接写在 return 里     |
| 样式    | `<style>` 单独区域    | 用 `.css` 文件或 CSS-in-JS |
| JS 逻辑 | `<script>` 单独区域   | 直接写在函数里             |

> Vue 把模板、逻辑、样式都塞进一个文件；React 把 HTML + JS 混写在 return 里，CSS 还是分开放的。



**JSX 看起来像 HTML，但本质上是 JavaScript：**

```jsx
// 你写的（像 HTML）
return <h1>Hello</h1>;

// 编译后实际是（React.createElement 调用）
return React.createElement('h1', null, 'Hello');
```

浏览器不能直接运行 JSX，需要编译工具（如 Babel/Vite）先把 JSX 转成 `React.createElement()`，再转成真正的 HTML。

**所以**：

- JSX 语法看起来像 HTML
- 本质是 JavaScript 的语法糖
- 最终会被编译成纯 JS 执行



#### JSX 里一个函数 = Vue 的一个组件

| Vue | React |
| :-- | :---- |
| `.vue` 文件 = 组件 | `.jsx` 文件 = 组件 |
| 组件里写 template + script + style | 组件里写 return JSX + 函数逻辑 + CSS 单独 |
| `<template>` 描述 UI | `return (...)` 描述 UI |

**核心类比**：
- Vue 的 `<template>` → 模板引擎解析
- React 的 `return JSX` → 返回一个 JS 对象（React 根据这个对象渲染真实 HTML）

**React 的哲学**：组件 = 函数，return 什么就显示什么。



#### 插值语法

JSX 用 `{}` 嵌入 JavaScript 表达式，对比 Vue：

| Vue | React |
| :-- | :---- |
| `{{ name }}` | `{name}` |
| 双大括号 | 单对大括号 |

```jsx
function App() {
  const name = '小明';
  const age = 18;
  const isLogin = true;

  return (
    <div>
      {/* 1. 插入变量 */}
      <h1>{name}</h1>

      {/* 2. 插入表达式 */}
      <p>{age + 1} 岁</p>

      {/* 3. 插入三元运算 */}
      <p>{isLogin ? '已登录' : '未登录'}</p>

      {/* 4. 插入函数调用 */}
      <p>{name.toUpperCase()}</p>
    </div>
  );
}
```

**只能写表达式，不能写语句**：

```jsx
// ✅ 可以（表达式）
{ name }
{ 1 + 1 }
{ isLogin && '已登录' }
{ arr.map(item => <li>{item}</li>) }

// ❌ 不行（语句）
{ if (isLogin) ... }      // if 是语句
{ for (...) ... }         // for 是语句
```

**常见用法**：

```jsx
// 绑定属性
<img src={logoUrl} />

// 绑定事件
<button onClick={handleClick}>点我</button>

// 动态类名
<div className={isActive ? 'active' : 'normal'}>
```

#### 事件绑定

React 事件用 `on + 事件名`（驼峰命名）：

```jsx
function Counter() {
  // 定义状态
  let count = 0;

  // 定义点击事件处理函数
  function handleClick() {
    count += 1;
    console.log('点击了，当前计数：', count);
  }

  // 渲染 UI
  return (
    <div>
      <h1>计数器</h1>
      <p>当前计数：{count}</p>
      {/* 绑定点击事件 */}
      <button onClick={handleClick}>点我 +1</button>
    </div>
  );
}
```

对比 Vue：

| Vue | React |
| :-- | :---- |
| `@click="handleClick"` | `onClick={handleClick}` |
| v-on 简写 @ | 直接 on + 大驼峰 |
| 引号里写字符串 | 大括号里放函数引用 |

#### 样式处理

React 有几种处理样式的方式：

**方式一：外部 CSS 文件（最常用）**

```jsx
// Button.jsx
function Button() {
  return <button className="btn">点我</button>;
}

import './Button.css';  // 引入 CSS
```

```css
/* Button.css */
.btn {
  background: blue;
  color: white;
  padding: 10px 20px;
}
```

**方式二：内联样式（适合简单样式）**

```jsx
function Button() {
  return (
    <button style={{
      backgroundColor: 'blue',
      color: 'white',
      padding: '10px 20px'
    }}>
      点我
    </button>
  );
}
```

> 注意：`style` 里面用**双大括号**，属性名用**驼峰**（如 `backgroundColor` 而不是 `background-color`）

**方式三：CSS Modules（避免样式冲突）**

```jsx
// Button.module.css
.btn { background: blue; }
```

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.btn}>点我</button>;
}
```

| Vue | React |
| :-- | :---- |
| `<style>` 直接写在 `.vue` 里 | 单独 `.css` 文件或内联 |
| scoped 避免冲突 | CSS Modules 解决冲突 |
| 自动注入到 template | 需要手动 import |

#### JSX 文件组织结构

```
src/
├── components/          # 公共组件（可复用）
│   ├── Button.jsx
│   ├── Header.jsx
│   └── Modal.jsx
├── pages/               # 页面组件
│   ├── Home.jsx
│   ├── About.jsx
│   └── Login.jsx
├── App.jsx              # 主应用组件
└── main.jsx             # 入口文件
```

| Vue | React |
| :-- | :---- |
| `.vue` 文件是组件 | `.jsx` / `.tsx` 文件是组件 |
| 页面用 `.vue` | 页面用 `.jsx` |
| 小组件 `.vue` | 小组件 `.jsx` |
| `<template>` + `<script>` | 全部写在 return 的 JSX 里 |

**总结**：
- Vue 用 `.vue` 文件包含 template + script + style
- React 用 `.jsx` 文件只包含 JSX（HTML 混在 JS 里），样式单独放 `.css` 文件
- 两者组织结构思路一样：**按功能分目录，大组件拆成小组件**

### 2.1 基本使用规则

1. **return 后的 JSX 需要用小括号包裹**（多行时必须）

```javascript
function App() {
  return (
    <div>内容</div>
  );
}
```

2. **JSX 只能返回一个根元素**

```javascript
// ❌ 报错：JSX must have one parent element
// 原因：React 组件的返回值必须由单一的根节点包裹
return (
  <div>第一个</div>
  <div>第二个</div>
);

// ✅ 方案一：用真实的 DOM 元素包裹（缺点：会增加一层额外的无意义 DOM 节点）
return (
  <div>
    <div>第一个</div>
    <div>第二个</div>
  </div>
);

// ✅ 方案二：使用 Fragment 简写（推荐：不会渲染额外 DOM 节点，代码最简洁）
// 注意：空标签 <> 不能接收任何属性
return (
  <>
    <div>第一个</div>
    <div>第二个</div>
  </>
);

// ✅ 方案三：使用 Fragment 完整写法（同样不会渲染额外 DOM 节点）
// 适用场景：需要在使用 map 遍历列表时传递唯一的 key 属性
return (
  <React.Fragment key={item.id}>
    <div>第一个</div>
    <div>第二个</div>
  </React.Fragment>
);
```

3. **标签必须正确闭合**

```jsx
// 单标签必须自闭合
<input />
<img src="..." />
```

### 2.2 条件渲染

**使用变量存储 JSX**：

```jsx
const flag = true;

let content;
if (flag) {
  content = <span>条件为真</span>;
} else {
  content = <p>条件为假</p>;
}

return <div>{content}</div>;
```

**直接写 JSX 表达式**：

```jsx
const flag = true;
return (
  <div>
    {flag ? <span>条件为真</span> : <p>条件为假</p>}
  </div>
);
```

### 2.3 列表渲染

使用 `map` 遍历数组生成 JSX（类似 Vue 的 `v-for`）：

```jsx
const list = [
  { id: 1, name: "小吴" },
  { id: 2, name: "小李" },
  { id: 3, name: "小花" }
];

return (
  <ul>
    {list.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);
```

**拆解**：

| 部分 | 含义 |
|------|------|
| `list.map(item => ...)` | 遍历数组，类似 Vue 的 `v-for` |
| `item` | 遍历时的每个元素 |
| `key={item.id}` | 唯一标识，类似 Vue 的 `:key` |
| `{item.name}` | 插值显示名字 |

**对比 Vue**：

```vue
<!-- Vue -->
<ul>
  <li v-for="item in list" :key="item.id">
    {{ item.name }}
  </li>
</ul>
```

| Vue | React |
|-----|-------|
| `v-for` | `数组.map()` |
| `:key="item.id"` | `key={item.id}` |
| `{{ item.name }}` | `{item.name}` |

> Vue 自己造了一套 `v-for` 指令，React 直接用 JS 原生的 `map()` 方法。核心思路一样，只是写法不同。

**列表中有多个根元素时使用 Fragment**：

```jsx
{list.map(item => (
  <React.Fragment key={item.id}>
    <li>{item.name}</li>
    <hr />
  </React.Fragment>
))}
```

---

## 3. React 状态（useState）

在 React 中，**状态（State）就是用来驱动画面更新的引擎**。

函数式组件默认没有状态管理，需要使用 `useState` Hook。

### 4.1 基本使用

```jsx
import { useState } from 'react';

function App() {
  const [content, setContent] = useState("默认内容");

  return (
    <div>
      <p>{content}</p>
      <button onClick={() => setContent("新内容")}>
        修改
      </button>
    </div>
  );
}
```

`useState(初始值)`：返回 `[状态值, 修改函数]` 的数组



### 4.2 对象类型状态

修改对象时，需要**展开原有属性**再覆盖：

```jsx
const [data, setData] = useState({
  title: "默认标题",
  content: "默认内容"
});

// ❌ 错误：会丢失其他属性
setData({ title: "新标题" });

// ✅ 正确：展开 + 覆盖
setData({ ...data, title: "新标题" });
```

> 对象不能直接作为 React 子元素渲染，需要访问其属性。



### 4.3 数组类型状态

数组操作需要通过 `setState` 函数，并注意**不修改原数组**：

```jsx
const [data, setData] = useState([
  { id: 1, name: "小吴" },
  { id: 2, name: "小李" },
  { id: 3, name: "小花" }
]);

// 添加到末尾
setData([...data, { id: 4, name: "小明" }]);

// 添加到开头
setData([{ id: 4, name: "小明" }, ...data]);

// 删除（过滤）
setData(data.filter(item => item.id !== 2));

// 更新
setData(data.map(item => 
  item.id === 2 ? { ...item, name: "新名字" } : item
));
```

> 不能直接使用 `push`、`splice` 等会修改原数组的方法。

---

## 5. 总结

| 知识点 | 核心要点 |
|--------|----------|
| JSX | 根元素、小括号包裹、标签闭合、插值 `{}` |
| 条件渲染 | 三元表达式、变量存储 JSX |
| 列表渲染 | `map` + `key`（用 ID 而非下标） |
| 事件 | 驼峰命名 `onClick`，接收事件对象 `e` |
| useState | `[值, 修改函数]` 解构，修改时触发重渲染 |
| 对象状态 | 展开运算符 `...` 保留其他属性 |
| 数组状态 | 不修改原数组，使用展开运算符创建新数组 |
