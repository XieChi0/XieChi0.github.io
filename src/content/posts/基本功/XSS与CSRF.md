---
title: XSS 与 CSRF：两种常见 Web 安全攻击解析
published: 2026-05-18
updated: 2026-05-18
description: 用通俗易懂的方式解释 XSS 跨站脚本攻击和 CSRF 跨站请求伪造的区别、原理及防御方法。
image: ''
tags: [XSS, CSRF, 认证授权]
category: '基本功'
draft: false
---

这两个就是学登录认证、Cookie、Token 时绕不开的两个安全词。

你可以先这样记：

```txt
XSS：坏人把“恶意 JS 代码”塞进你的网站里执行
CSRF：坏人借用“你已经登录的身份”去偷偷发请求
```

一个是**偷东西/执行脚本**，一个是**冒充你发请求**。

---

# 一、XSS 是什么？

XSS 全称是：

```txt
Cross-Site Scripting
跨站脚本攻击
```

它的核心是：

> 攻击者想办法让恶意 JavaScript 代码在你的网页里执行。

比如你的网站有一个评论区。

正常用户输入：

```txt
这篇文章写得不错
```

但是攻击者输入：

```html
<script>
  alert('你被攻击了')
</script>
```

如果你的页面没有做处理，直接把这段内容渲染到页面里，那浏览器就会真的执行这段 JS。

这就是 XSS。

---

## 1. XSS 能干什么？

如果恶意 JS 在你的网站里执行，它就能做很多坏事，比如：

```txt
读取 localStorage 里的 token
读取页面上的用户信息
偷偷发送请求
修改页面内容
诱导用户点击假按钮
```

比如你的 token 存在 localStorage：

```js
localStorage.setItem('token', 'xxxxx')
```

攻击者的恶意代码可能这样写：

```js
const token = localStorage.getItem('token')
```

然后把 token 发到他的服务器。

所以前面说：

```txt
Token 放 localStorage，要注意 XSS
```

就是这个意思。

---

## 2. XSS 的典型场景

最典型的是你把用户输入的内容，原样渲染到了页面里。

比如 Vue 里：

```vue
<div v-html="content"></div>
```

如果 `content` 是用户传来的不可信内容，就危险。

因为 `v-html` 会把字符串当 HTML 插入页面。

如果里面混了恶意标签、事件、脚本，就可能出事。

所以你可以简单记：

```txt
凡是用户能输入，又会被页面展示出来的地方，都要小心 XSS
```

比如：

```txt
评论区
昵称
文章内容
富文本编辑器
搜索框回显
URL 参数回显
```

---

## 3. 怎么防 XSS？

前端角度先记几个重点就行：

```txt
1. 不要随便用 v-html
2. 不要把用户输入直接当 HTML 渲染
3. 对用户输入做转义或过滤
4. 后端也要做内容过滤
5. Cookie 存 token 时尽量配合 HttpOnly
```

`HttpOnly` 的意思是：

```txt
这个 Cookie 不能被 JS 读取
```

所以即使发生 XSS，攻击者也不容易直接通过 JS 读到 Cookie 里的 token。

但是注意：HttpOnly 不是万能的。XSS 代码虽然读不到 Cookie，但仍然可能在当前页面里发请求。

---

# 二、CSRF 是什么？

CSRF 全称是：

```txt
Cross-Site Request Forgery
跨站请求伪造
```

它的核心是：

> 攻击者不一定偷你的 token，而是诱导你的浏览器带着你的登录状态，去目标网站发一个请求。

这句话有点绕，我们用例子讲。

---

## 1. CSRF 的例子

假设你已经登录了银行网站：

```txt
https://bank.com
```

你的浏览器里保存了银行网站的 Cookie。

然后你又打开了一个恶意网站：

```txt
https://evil.com
```

这个恶意网站里偷偷放了一个请求：

```html
<img src="https://bank.com/transfer?to=attacker&money=1000" />
```

浏览器加载这张“图片”时，其实会向 `bank.com` 发请求。

如果 `bank.com` 只靠 Cookie 判断你是否登录，那么浏览器会自动带上你在 `bank.com` 的 Cookie。

于是银行服务器可能以为：

```txt
这是用户本人发来的请求
```

这就是 CSRF 的思路。

重点不是攻击者知道你的密码，也不是知道你的 token。

重点是：

```txt
浏览器会自动带 Cookie
攻击者借用了这个“自动携带”的特性
```

---

## 2. CSRF 为什么主要和 Cookie 有关？

因为 Cookie 有一个特点：

```txt
符合规则时，浏览器会自动携带
```

你访问恶意网站时，恶意网站虽然不能读取 `bank.com` 的 Cookie，但它可以尝试让你的浏览器向 `bank.com` 发请求。

浏览器一发请求，就可能自动带上 `bank.com` 的 Cookie。

这就是 Cookie 的“双刃剑”：

```txt
方便：自动携带
风险：也可能被恶意网站借用
```

---

## 3. Authorization 请求头为什么相对不容易 CSRF？

如果你的 token 是这样带的：

```http
Authorization: Bearer xxxxx
```

这个请求头通常是你前端 JS 主动加上的：

```js
config.headers.Authorization = `Bearer ${token}`
```

恶意网站一般不能随便让浏览器自动带上你在另一个网站的 `Authorization` 请求头。

所以它不像 Cookie 那样“天然自动携带”。

但这不代表绝对安全，只是说：

```txt
Authorization 方式相比 Cookie，传统 CSRF 风险小一些
```

它更需要担心的是 XSS，因为 token 往往保存在 localStorage 或内存里。

---

# 三、XSS 和 CSRF 的核心区别

| 对比   | XSS                     | CSRF             |
| ---- | ----------------------- | ---------------- |
| 攻击核心 | 执行恶意 JS                 | 伪造用户请求           |
| 攻击位置 | 在你的网站页面里执行脚本            | 在别的网站诱导浏览器发请求    |
| 常见目标 | 偷 token、操作页面、发请求        | 借用用户登录态提交操作      |
| 主要风险 | localStorage token 容易被偷 | Cookie 自动携带容易被利用 |
| 防御重点 | 防止恶意脚本进入页面              | 确认请求真的是用户主动发的    |

---

# 四、用一句话区分

## XSS

```txt
坏人在你家里塞了一个小偷程序。
```

也就是恶意 JS 进入你的网站执行。

---

## CSRF

```txt
坏人不进你家，但骗你的门禁卡自动刷了一下。
```

也就是借用浏览器自动带 Cookie 的特性发请求。

---

# 五、和 Token 存放位置的关系

现在你再看之前的问题就更清楚了：

## Token 放 localStorage

风险主要是：

```txt
XSS
```

因为 JS 能读 localStorage。

如果网站被注入恶意 JS，它可能直接拿走 token。

---

## Token 放 HttpOnly Cookie

风险主要是：

```txt
CSRF
```

因为 JS 读不到 Cookie，XSS 偷 token 难一些。

但浏览器会自动带 Cookie，所以要防止恶意网站借用你的登录态发请求。

---

# 六、怎么防？

## 防 XSS

你先记：

```txt
不信任用户输入
不要随便 v-html
展示用户内容时要转义
前后端都要做过滤
Cookie 可以配 HttpOnly
```

---

## 防 CSRF

你先记：

```txt
Cookie 设置 SameSite
重要操作用 POST/PUT/DELETE
后端校验 Origin / Referer
使用 CSRF Token
重要操作二次确认
```

其中 `SameSite` 是 Cookie 的一个属性，用来限制跨站请求时是否携带 Cookie。

比如：

```http
Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Lax
```

---

# 七、面试答法

## 简洁版

XSS 是跨站脚本攻击，核心是攻击者把恶意 JavaScript 注入到页面中执行，比如读取 localStorage 里的 token、修改页面或者伪造操作。防御重点是不要信任用户输入，避免直接渲染 HTML，比如慎用 `v-html`，并对输入输出做转义和过滤。

CSRF 是跨站请求伪造，核心是攻击者利用用户已经登录的状态，诱导浏览器向目标网站发送请求。因为 Cookie 会被浏览器自动携带，所以使用 Cookie 维护登录态时尤其要注意 CSRF。防御方式包括设置 `SameSite`、校验 `Origin/Referer`、使用 CSRF Token 等。

---

## 更像面试的完整答法

XSS 和 CSRF 都是 Web 安全里的常见攻击，但攻击方式不同。

XSS 的重点是“脚本注入”。攻击者把恶意 JS 注入到页面里，一旦用户访问页面，脚本就在用户浏览器中执行。它可能读取本地存储中的 token，或者在用户不知情的情况下发起操作。防御上主要是对用户输入和输出做过滤、转义，避免直接使用 `v-html` 这类把字符串当 HTML 渲染的方式，同时可以配合 CSP、HttpOnly Cookie 等降低风险。

CSRF 的重点是“请求伪造”。攻击者不一定能读取用户的 Cookie，但可以诱导用户的浏览器向已登录的网站发送请求。如果认证信息放在 Cookie 里，浏览器会自动携带 Cookie，服务器可能误以为这是用户本人操作。防御上可以设置 Cookie 的 `SameSite` 属性，后端校验 `Origin/Referer`，或者使用 CSRF Token 来确认请求确实来自自己的页面。

简单说，XSS 是“让恶意脚本在你的网站里跑起来”，CSRF 是“借用户登录态偷偷发请求”。
