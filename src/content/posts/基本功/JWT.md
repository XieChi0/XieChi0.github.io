---
title: Cookie、Session、Token、JWT 核心知识总结
published: 2026-05-18
updated: 2026-05-18
description: 全面对比 Cookie、Session、通用 Token 与 JWT 的核心概念、适用场景及安全性差异，涵盖分布式认证方案详解。
image: ''
tags: [JWT,token]
category: '基本功'
draft: false
---

# Cookie、Session、Token、JWT 核心知识总结

## 一、核心概念对比表

| 技术           | 核心本质                                      | 存储位置                                              | 核心工作流程                                                 | 核心优势                                                     | 核心劣势                                                     | 典型适用场景                                          |
| :------------- | :-------------------------------------------- | :---------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :---------------------------------------------------- |
| **Cookie**     | 浏览器原生支持的**客户端小型数据载体**        | 浏览器 Cookie 文件（自动管理）                        | 1. 服务器通过`Set-Cookie`响应头发送数据<br />2. 后续同域请求浏览器**自动携带**所有 Cookie | 原生支持、无需手动处理、传输透明                             | 容量极小（≈4KB）、易受 CSRF 攻击、易受同源策略严格限制（由自身属性决定） | 简单状态保持、传递 Session ID、记住登录状态           |
| **Session**    | 服务器端的**用户会话数据存储**                | 服务器内存 / 数据库 / Redis（仅 Session ID 存客户端） | 1. 用户登录后服务器生成唯一 Session ID<br />2. Session ID 通过 Cookie 返回客户端<br />3. 后续请求通过 Session ID 索引服务器端会话数据 | 数据安全（存服务器）、可**主动立即失效**、权限控制灵活       | 分布式系统需共享存储（如 Redis）、存在单点故障风险、扩展性差 | 单体 Web 应用、高安全要求的后台系统                   |
| **通用 Token** | 服务器签发的**无状态身份凭证字符串**          | 客户端（localStorage/sessionStorage/Cookie）          | 1. 用户登录后服务器生成Token<br />2. 客户端手动存储，后续请求放在`Authorization`请求头<br />3. 服务器验证 Token 有效性 | 跨域友好、无状态、不依赖 Cookie、适合 API 接口               | 无法主动失效、泄露后有效期内可被滥用、需手动处理传输         | 前后端分离应用、移动端 API、第三方接口认证            |
| **JWT**        | **结构化的 Token 标准实现**（JSON Web Token） | 客户端（同通用 Token）                                | 1. 服务器将用户 ID、权限等信息编码进 Token<br />2. Token 包含 Header+Payload+Signature 三部分<br />3. JWT 验证签名后，服务器可以直接读取 Payload 中的用户 ID、角色等信息。<br/>但如果要确认用户是否被禁用、权限是否最新、Token 是否在黑名单中，仍然可能需要查数据库或 Redis。 | 彻底无状态、无需共享存储、跨服务认证无缝、解决分布式单点故障 | 无法主动撤销、Payload 不能存敏感信息、Token 体积较大         | 微服务分布式架构、跨域单点登录 (SSO)、无状态 API 网关 |

## 二、关键补充说明

1. **包含关系澄清**：JWT 是 Token 的一种**具体实现标准**，不是并列关系。我们常说的 "Token" 如果没有特别说明，很多时候实际指的就是 JWT。
2. **主动失效能力差异（安全性核心区别）**
   - Session：最强。检测到异常登录或用户登出时，直接删除服务器端的 Session 数据，即使 Session ID 泄露也立即失效
   - 通用 Token：较弱。若存储在服务器（如 Redis 白名单）可实现失效，但失去了无状态优势
   - JWT：最弱。一旦签发，除非到达过期时间，否则无法主动撤销。泄露后只能等待过期，因此必须配合**短过期时间 + 刷新 Token 机制**使用
3. **分布式场景适配性**
   - Session：需要 Redis 等中心化存储实现会话共享，Redis 瘫痪会导致全系统认证失败
   - JWT：每个服务只需持有相同的签名密钥即可独立验证，彻底解决分布式系统的认证单点故障问题
4. **传输方式差异**
   - Cookie：浏览器自动携带，无需前端代码处理，但天然受同源策略限制
   - Token/JWT：通常放在 HTTP 请求头中，前端需要手动处理存储和传输，但跨域更灵活



## 三、历程的详细介绍

在较早的时期，登录的流程通常是这样的，首先是在登录页输入用户和密码，然后每一次请求都会带上用户名和密码，为了确保是这个用户拥有权限。

但是把cookie放在浏览器里面，明文存储是很不安全的，所以有了新的概念**session**。每一次登录就是在进行一次session，这就是开始，至于什么时候结束，通常是由服务器进行定义的（所以每一次会话会服务器会生成session ID和结束时间）

> Session 可以理解为服务器为某个用户维护的一段登录状态。
> 用户登录后，服务器创建一份 Session 数据，并给客户端一个 Session ID。
> 之后客户端每次请求都带着这个 Session ID，服务器就能找到对应的 Session 数据。

当用户这边先进行登录，服务器收到以后去数据库进行比对，

看看是否正确，如果验证通过，服务器会生成一个随机、无意义唯一的字符串（即SessionID），

服务器就需要把 SessionID 通过**Set-Cookie**发送给浏览器，再把会话结束时间对应设置为这个 Cookie 的有效期。

> 但真正的 Session 数据和过期规则主要仍由服务器维护。
>
> 一般cookie有效期长于session有效期，因为
>
> Cookie 还在，但服务器 Session 已过期 → 还是要重新登录
> Cookie 没了，但服务器 Session 还在 → 浏览器也找不到这个会话了

浏览器拿到 Cookie 后进行保存。注意了，浏览器这个时候没有保存用户名密码，保存的 SessionID 也是没有规律的字符串。这个 Cookie 里也就只有这个 SessionID 最重要，没有别的重要信息。

> 有的服务器在发送 Cookie 之前是会对这个含有 SessionID 的 Cookie 进行签名。如果有人劫持并修改了 SessionID，就会变成服务器识别不了的字符串。
>
> 但即使 Cookie 没有签名，只要 Session ID 是随机且不可预测的，攻击者也很难凭空猜出有效的 Session ID。

接着说，浏览器的下次访问、下下次访问都会自动发送这个 SessionID 给服务器，直到 Cookie 的有效期失效之后，浏览器一般就会自行删除这个 Cookie，这就是会话结束了。



但是session ID会高度依赖服务器的本身存储，你想想每个对话都需要进行存储ID，如果有很多对话的话，服务器必然是会超载的，以及在分布式系统中多台服务器之间共享 Session 麻烦。

| 方式    | 登录状态放哪里 | 前端带什么 | 后端是否需要查登录状态 |
| ------- | -------------- | ---------- | ---------------------- |
| Session | 后端           | sessionId  | 需要                   |
| JWT     | Token 里       | JWT        | 通常不需要             |



## JWT

### 优势

-  JWT 是无状态的，服务器不用存数据，只靠 Token 本身验证
-  另外Session 依赖 Cookie 传递，受同源策略限制，JWT 放请求头里跨域更方便。

### 缺点

- 一旦签发，在过期前不太好主动失效
- Token 被偷会有风险
- Payload 不能放敏感信息

### 构成

- header头部

  - Header 部分声明需要用什么算法来生成签名

  - ```
    {
      "alg": "HS256",	//使用什么签名算法
      "typ": "JWT"		//这是一个 JWT
    }
    ```

- payload数据

  - Payload 部分是一些特定的数据，比如有效期

- signature签名

  - 前两部分内容会经过Base64编码，经过两段算法运算以及只存储在服务器端的密钥，得到签名

![ChatGPT Image 2026.5.18 14_52_01](./assets/ChatGPT%20Image%202026.5.18%2014_52_01.png)

### 过程

```
1. 用户输入账号密码
        ↓
2. 前端调用登录接口
        ↓
3. 后端验证账号密码
        ↓
4. 验证通过后，后端生成 JWT
        ↓
5. 后端把 JWT 返回给前端
        ↓
6. 前端保存 JWT
        ↓
7. 以后请求接口时，把 JWT 带上
        ↓
8. 后端验证 JWT 是否有效
        ↓
9. 有效：允许访问
   无效：返回 401 未登录
```



浏览器和服务器用 JWT 交互时，用户登录成功后，服务器会生成 JWT，包含三部分：Header 里是算法信息，Payload 里是用户 ID、权限、过期时间等非敏感数据，Signature 是用密钥对前两部分签名。

然后服务器把这个 JWT 返回给浏览器，浏览器存起来。之后每次请求受保护资源，浏览器会把 JWT 放在请求头的 Authorization 字段里发给服务器，服务器收到后验证 Signature，确认 Token 没被篡改且没过期，就从 Payload 里拿用户信息处理请求。

> 也就是说JWT不保存在服务器这里，服务器保存的是生成签名时使用的密钥。
>
> 至于过期时间，它是存储在payload里面，服务器收到请求后，会先解析 JWT 的 Payload，读取这个过期时间，和当前时间对比，如果已过期就拒绝请求。



### 场景

1. 登录成功后保存 token
2. Axios 请求拦截器自动携带 token
3. 响应拦截器处理 401
4. 路由守卫判断是否登录
5. 退出登录时清除 token

### 前端一般怎么用 JWT&&token是什么？

JWT 本身就是一种具体的 Token 实现，那一串用点分隔的字符串就是完整的 JWT Token。服务器生成 Token，里面有用户信息和有效期等。之后客户端用它访问需要认证的资源，服务器通过验证 Token 来确认用户身份和权限。

也就是说 token 直接被窃取的话就完蛋了，因为 JWT 是无状态的，服务器只认 Token 本身，一旦 Token 被窃取，攻击者就能用它冒充用户身份访问权限内的资源，直到 Token 过期。所以实际使用中会通过缩短 Token 有效期、用 HTTPS 加密传输、存储在 HttpOnly Cookie 里等方式降低被窃取的风险。

前端登录成功后拿到 token：

```
const res = await axios.post('/api/login', {
  username,
  password
})

const token = res.data.token
```

然后保存起来。

常见保存位置有：

```
localStorage
sessionStorage
Cookie
```

然后请求接口时带上：

```
axios.get('/api/user/info', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

实际项目里一般会用 Axios 拦截器统一加：

```
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

这样每个接口就不用手动写一遍 token 了。

### 后端怎么验证 JWT？

后端收到请求后，会读取请求头：

```
Authorization: Bearer xxxxx.yyyyy.zzzzz
```

然后做几件事：

```
1. 是否有 token
2. token 格式是否正确
3. 签名是否正确
4. token 是否过期
5. 用户是否存在
6. 用户是否有权限访问当前接口
```

验证通过，接口继续执行。

验证失败，返回：

```
401 Unauthorized
```

也就是未登录或登录失效。



## Access Token 和 Refresh Token

前者是短期有效，用于正常访问接口。

后者是长期有效，用于刷新前者。

```
Access Token 过期
        ↓
前端用 Refresh Token 请求刷新接口
        ↓
后端验证 Refresh Token
        ↓
返回新的 Access Token
```



## 对称加密、非对称加密与 JWT 签名

学习 JWT 时，经常会看到两类算法：

```
HS256
RS256
```

它们都可以用于 JWT 的签名，但背后的密钥使用方式不同。

需要先注意一点：

```
JWT 常见场景下不是加密，而是签名。
```

加密主要解决的是：

```
不想让别人看到内容
```

签名主要解决的是：

```
防止别人篡改内容
确认这个 Token 确实是可信的一方签发的
```

JWT 的 Header 和 Payload 默认只是 Base64URL 编码，别人拿到后可以解码查看。
 JWT 的 Signature 才是用来验证 Token 有没有被篡改的关键。

------

**对称方式：HS256**

HS256 属于对称方式。

所谓对称，可以简单理解为：

```
签名和验签使用同一个 secret
```

流程是：

```
服务器生成 JWT：
Header + Payload + secret -> Signature

服务器验证 JWT：
Header + Payload + 同一个 secret -> 重新计算 Signature
```

如果重新计算出来的 Signature 和 Token 里的 Signature 一样，说明 Token 没有被篡改。

示意：

```
生成签名：secret
验证签名：secret
```

所以 HS256 的重点是：

```
secret 必须严格保存在服务器端
不能放进 JWT
不能发给前端
不能暴露在前端代码里
```

如果 secret 泄露，攻击者就可以自己伪造合法的 JWT。

适合场景：

```
一个后端系统自己签发、自己验证 JWT
或者多个可信服务之间共享同一个 secret
```

但是多个服务共享 secret 时要小心，因为只要其中一个服务泄露 secret，所有服务的 Token 都可能不安全。

------

**2. 非对称方式：RS256**

RS256 属于非对称方式。

所谓非对称，可以简单理解为：

```
签名用私钥
验签用公钥
```

它有一对密钥：

```
私钥 private key：只能由签发方保存，用来生成签名
公钥 public key：可以发给其他服务，用来验证签名
```

流程是：

```
认证服务生成 JWT：
Header + Payload + 私钥 -> Signature

其他服务验证 JWT：
Header + Payload + 公钥 -> 验证 Signature
```

示意：

```
生成签名：私钥
验证签名：公钥
```

这个模式的好处是：

```
只有认证服务拥有私钥，因此只有认证服务能签发 Token
其他服务只有公钥，只能验证 Token，不能伪造 Token
```

适合场景：

```
微服务系统
单点登录 SSO
第三方平台登录
多个系统需要验证同一个认证中心签发的 Token
```

比如：

```
认证中心负责登录并签发 JWT
订单服务、用户服务、支付服务只保存公钥
它们可以验证 JWT 是否可信
但不能自己伪造新的 JWT
```

------

**3. HS256 和 RS256 对比**

| 对比项                 | HS256                      | RS256                          |
| ---------------------- | -------------------------- | ------------------------------ |
| 密钥类型               | 一个 secret                | 一对密钥：私钥 + 公钥          |
| 签名用什么             | secret                     | 私钥                           |
| 验签用什么             | secret                     | 公钥                           |
| 验签方能不能伪造 Token | 能，因为它也有 secret      | 不能，因为它只有公钥           |
| 密钥泄露风险           | 任意服务泄露 secret 都危险 | 公钥泄露通常没事，私钥必须保护 |
| 适合场景               | 单体应用、简单前后端分离   | 微服务、SSO、开放平台          |

------

**4. 简单记忆**

```
HS256：一把钥匙，签名和验证都用它。
RS256：一对钥匙，私钥签名，公钥验证。
```

再结合 JWT 来记：

```
JWT 的 Header 里写算法，比如 HS256 或 RS256。
JWT 的 Payload 里放用户身份信息。
JWT 的 Signature 用来防篡改。
密钥不在 JWT 里，永远由服务端保存。
```

## token放置的位置

### Cookie

登录成功后，后端通过响应头设置 Cookie：

```
Set-Cookie: token=xxxxx; HttpOnly; Secure; SameSite=Lax
```

之后浏览器请求同一个站点时，会自动带上：

```
Cookie: token=xxxxx
```

前端代码一般不需要手动加。

**优点**

最大的优点是浏览器自动携带、前端不用每个请求都手动写。

**缺点**

缺点：容易和 CSRF 扯上关系。

> 假设你已经登录了 `a.com`，然后你访问了恶意网站 `evil.com`，恶意网站诱导浏览器向 `a.com` 发请求时，浏览器可能也会自动带上 `a.com` 的 Cookie。

所以 Cookie 存 Token 时，一般要配合：

```
SameSite
CSRF Token
Origin / Referer 校验
```

**适合场景**

适合：

```
传统 Web 登录
服务端渲染项目
希望浏览器自动管理登录态
比较重视 XSS 防护
```

比如：

```
后台管理系统
官网登录
服务端渲染项目
```

### Authorization

这是前后端分离里最常见的方式。

登录成功后，前端拿到 token，自己保存，比如：

```
localStorage.setItem('token', token)
```

请求接口时放到请求头：

```
Authorization: Bearer xxxxx
```

Axios 里通常这样写：

```
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

**优点**

明确、规范、适合 API

**缺点**

前端要自己保存 token

> 如果你把 token 存在：
>
> ```
> localStorage
> sessionStorage
> ```
>
> 那么一旦页面出现 XSS 漏洞，攻击者可能通过 JS 读到 token。
>
> 所以这种方式要特别注意：
>
> ```
> 防 XSS
> 不要乱用 v-html
> 不要插入不可信脚本
> 接口使用 HTTPS
> ```

### Body

比如请求时这样传：

```
axios.post('/api/user/info', {
  token: 'xxxxx'
})
```

也就是 token 被放在请求体中。

能用，但不是主流认证方式。



### 一般项目怎么选

对你做前端来说，可以简单记：

```
前后端分离项目：常用 Authorization: Bearer token
传统 Web / SSR 项目：常用 Cookie
Body：一般不作为通用登录认证方式
```

更实际一点：

```
Vue + 后端 API：Authorization 请求头最常见
Next/Nuxt SSR + 服务端登录态：Cookie 更常见
刷新 Refresh Token：有时会放 Cookie，也可能放 Body
```



### 面试回答

Token 放在不同位置，主要区别是携带方式和安全风险不同。

如果放在 Cookie 中，浏览器会自动携带，后端也容易通过 Cookie 读取登录态。如果设置 `HttpOnly`，前端 JS 无法直接读取 Token，可以降低 XSS 偷 Token 的风险。但 Cookie 自动携带也带来 CSRF 风险，所以需要配合 `SameSite`、CSRF Token、Origin 校验等手段。

如果放在 Authorization 请求头中，通常使用 `Bearer Token` 格式，这是前后端分离和 REST API 中比较常见的方式。它语义清晰，不会像 Cookie 那样被浏览器自动附带到请求中，但前端需要自己保存 Token，比如 localStorage 或内存中，因此要注意 XSS。

如果放在 Body 中，也能传给后端，但不太适合作为通用认证方式。因为 GET 请求通常没有 Body，而且认证信息放在 Body 中不如放在 Authorization 请求头中规范。Body 更适合传业务参数，而不是通用身份凭证。

所以一般来说，前后端分离项目更常用 Authorization 请求头；传统 Web 或 SSR 登录态更常用 Cookie；Body 只适合少量特殊接口，不建议作为统一认证方案。



## XSS、CSRF

这两个就是学登录认证、Cookie、Token 时绕不开的两个安全词。

你可以先这样记：

```
XSS：坏人把“恶意 JS 代码”塞进你的网站里执行
CSRF：坏人借用“你已经登录的身份”去偷偷发请求
```

一个是**偷东西/执行脚本**，一个是**冒充你发请求**。
