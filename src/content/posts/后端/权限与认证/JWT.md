---
title: Cookie、Session、Token、JWT 核心知识总结
published: 2026-05-18
updated: 2026-05-21
description: 全面对比 Cookie、Session、通用 Token 与 JWT 的核心概念、适用场景及安全性差异，涵盖分布式认证方案详解。
image: ''
tags: [JWT,token,哈希]
category: '后端/权限与认证'
draft: false
---

# Cookie、Session、Token、JWT 核心知识总结

这篇文章主要解决一个问题：

> **登录态到底可以怎么表示？Cookie、Session、Token、JWT 分别是什么关系？**

所以这里重点讲概念和 JWT 本身，不展开讲 XSS、CSRF、HTTPS 这些安全细节。安全方案可以单独看《XSS 与 CSRF》和《登录态安全与接口防护》。

## 一、核心概念对比表

| 技术           | 核心本质                                      | 存储位置                                              | 核心工作流程                                                 | 核心优势                                                     | 核心劣势                                                     | 典型适用场景                                          |
| :------------- | :-------------------------------------------- | :---------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :---------------------------------------------------- |
| **Cookie**     | 浏览器原生支持的**客户端小型数据载体**        | 浏览器 Cookie 文件（自动管理）                        | 1. 服务器通过`Set-Cookie`响应头发送数据<br />2. 后续同域请求浏览器**自动携带**所有 Cookie | 原生支持、无需手动处理、传输透明                             | 容量极小（≈4KB）、易受 CSRF 攻击、易受同源策略严格限制（由自身属性决定） | 简单状态保持、传递 Session ID、记住登录状态           |
| **Session**    | 服务器端的**用户会话数据存储**                | 服务器内存 / 数据库 / Redis（仅 Session ID 存客户端） | 1. 用户登录后服务器生成唯一 Session ID<br />2. Session ID 通过 Cookie 返回客户端<br />3. 后续请求通过 Session ID 索引服务器端会话数据 | 敏感数据存在服务端、可**主动立即失效**、权限控制灵活       | Session ID 被偷仍可能被冒用、分布式系统需共享存储（如 Redis）、扩展成本更高 | 单体 Web 应用、企业后台、高安全要求的内部系统         |
| **通用 Token** | 服务器签发的**无状态身份凭证字符串**          | 客户端（localStorage/sessionStorage/Cookie）          | 1. 用户登录后服务器生成Token<br />2. 客户端手动存储，后续请求放在`Authorization`请求头<br />3. 服务器验证 Token 有效性 | 跨域友好、无状态、不依赖 Cookie、适合 API 接口               | 无法主动失效、泄露后有效期内可被滥用、需手动处理传输         | 前后端分离应用、移动端 API、第三方接口认证            |
| **JWT**        | **结构化的 Token 标准实现**（JSON Web Token） | 客户端（同通用 Token）                                | 1. 服务器将用户 ID、权限等信息编码进 Token<br />2. Token 包含 Header+Payload+Signature 三部分<br />3. JWT 验证签名后，服务器可以直接读取 Payload 中的用户 ID、角色等信息。<br/>但如果要确认用户是否被禁用、权限是否最新、Token 是否在黑名单中，仍然可能需要查数据库或 Redis。 | 彻底无状态、无需共享存储、跨服务认证无缝、解决分布式单点故障 | 无法主动撤销、Payload 不能存敏感信息、Token 体积较大         | 微服务分布式架构、跨域单点登录 (SSO)、无状态 API 网关 |

## 二、关键补充说明

1. **包含关系澄清**：JWT 是 Token 的一种**具体实现标准**，与token不是并列关系。我们常说的 "Token" 如果没有特别说明，很多时候实际指的就是 JWT。
2. **主动失效能力差异（安全性核心区别）**
   - Session：最强。检测到异常登录或用户登出时，直接删除服务器端的 Session 数据，即使 Session ID 泄露也立即失效
   - 通用 Token：较弱。若存储在服务器（如 Redis 白名单）可实现失效，但失去了无状态优势
   - JWT：最弱。一旦签发，除非到达过期时间，否则无法主动撤销。泄露后只能等待过期，因此必须配合**短过期时间 + 刷新 Token 机制**使用
3. **分布式场景适配性**
   - Session：需要 Redis 等中心化存储实现会话共享，Redis 瘫痪会导致全系统认证失败
   - JWT：每个服务只需持有相同的签名密钥即 可独立验证，彻底解决分布式系统的认证单点故障问题
4. **传输方式差异**
   - Cookie：浏览器自动携带，无需前端代码处理，但天然受同源策略限制
   - Token/JWT：通常放在 HTTP 请求头中，前端需要手动处理存储和传输，但跨域更灵活

## 三、历程的详细介绍

在较早的时期，登录的流程通常是这样的，首先是在登录页输入用户和密码，然后每一次请求都会带上用户名和密码，为了确保是这个用户拥有权限。

但是把cookie放在浏览器里面，明文存储是很不安全的，所以有了新的概念**session**。

> Session 可以理解为服务器为某个用户维护的一段登录状态

当用户这边进行登录，服务器收到以后去数据库进行比对，

如果验证通过，服务器创建一份 Session 数据，并给客户端一个 Session ID，通过**Set-Cookie**发送给浏览器，再把会话结束时间对应设置为这个 Cookie 的有效期。

浏览器的下次访问、下下次访问都会自动发送这个 SessionID 给服务器，直到 Cookie 的有效期失效之后，浏览器一般就会自行删除这个 Cookie，这就是会话结束了。

> 一般cookie有效期长于session有效期，因为
>
> Cookie 还在，但服务器 Session 已过期 → 还是要重新登录
>
> Cookie 没了，但服务器 Session 还在 → 浏览器也找不到这个会话了

### Session ID 被偷了，会不会被冒用？

会。

因为 Session 认证的核心逻辑是：

```txt
浏览器带着 Session ID 来
        ↓
服务器用 Session ID 去查自己的 Session 存储
        ↓
查到了，就认为这是已登录用户
```

所以如果攻击者偷到了有效的 Session ID，并且服务器没有做额外校验，攻击者就可以把这个 Session ID 放到 Cookie 里，伪装成这个用户发请求。

这类问题叫：

```txt
Session Hijacking
会话劫持
```

所以 Session 不是“绝对不会被偷”，而是：

> **Session 把真正的登录状态放在服务端，客户端只保存一个随机 ID。这个随机 ID 被偷了仍然危险，但服务端更容易主动控制它。**

### 那为什么很多企业还要选 Session？

因为企业更看重的是：**服务端可控、可以立即失效、权限变化能及时生效**。

Session 的优势主要有这几个：

| 优势 | 说明 |
|-----|------|
| 可以立即踢人 | 后端直接删除 Session，用户下次请求马上失效 |
| 可以集中管理登录态 | 所有登录状态都在服务端或 Redis 里，方便查、删、统计 |
| 权限变更更及时 | 用户被禁用、角色被改，后端可以立刻让 Session 失效 |
| 客户端不存用户信息 | Cookie 里通常只有随机 Session ID，不直接放用户 ID、角色等信息 |
| 适合内部后台系统 | 企业后台更重视可控性，而不是完全无状态 |

JWT 的问题是：一旦签发出去，在过期前默认很难主动收回。除非加黑名单、版本号、短 Access Token + Refresh Token 等机制。



面试时可以这样说：

> Session ID 被偷后确实可能被冒用，所以也要配合 HTTPS、HttpOnly、Secure、SameSite、登录异常检测等措施。但企业仍然常用 Session，是因为 Session 的登录状态保存在服务端，服务端可以主动删除、修改和集中管理。相比 JWT，Session 在踢人、权限变更、风控控制上更直接，所以很多后台系统和企业内部系统仍然会选择 Session。



## JWT

### 优缺点

**优点**

- JWT 是无状态的，服务器不用存数据，只靠 Token 本身验证
- 另外Session 依赖 Cookie 传递，受同源策略限制，JWT 放请求头里跨域更方便。

**缺点**

- 一旦签发，在过期前不太好主动失效
- Token 被偷会有风险
- Payload 不能放敏感信息

### 无状态的含义

JWT 的“无状态”，说白了就是：

> **后端不需要像 Session 那样，专门保存一份“这个用户”的会话记录。**

Session 的思路是：

```txt
前端带 sessionId
        ↓
后端拿 sessionId 去 Redis / 内存里查 Session
        ↓
查到了，说明用户已登录
```

JWT 的思路是：

```txt
前端带 JWT
        ↓
后端验证签名、过期时间
        ↓
验证通过，就认为这个 Token 是可信的
```

也就是说，JWT 把用户 ID、过期时间、角色等信息放进 Token 里，再用签名保证它没有被篡改。后端只要保存签名密钥，就能验证这个 Token。

举个很简单的理解：

```txt
Session：像去前台报手机号，前台查系统确认你是不是会员
JWT：像拿一张带防伪签名的门票，门口验票通过就让你进
```

但注意：无状态不是“后端永远不查数据库”。

如果系统还需要判断：

```txt
用户是否被禁用
权限是否刚刚被修改
Token 是否进入黑名单
```

那后端仍然可能查数据库或 Redis。只是 JWT 默认不需要像 Session 一样，每次都查一份“登录态记录”。

### 构成

- header头部

  - Header 部分声明需要用什么算法来生成签名

  - ```
    {
      "alg": "HS256", //使用什么签名算法
      "typ": "JWT"  //这是一个 JWT
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

> JWT不保存在服务器这里，服务器保存的是生成签名时使用的密钥。
>
> 至于过期时间，它是存储在payload里面，服务器收到请求后，会先解析 JWT 的 Payload，读取这个过期时间，和当前时间对比，如果已过期就拒绝请求。

### 前端一般怎么用 JWT？

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

### 退出登录时怎么清除 Token？

JWT 退出登录，本质上分两种情况：

```txt
1. 只做前端退出：清掉浏览器里的 Token
2. 要让 Token 立刻失效：后端配合黑名单或版本号机制
```

#### 1. Token 存在 Storage

如果 token 存在 `localStorage`，退出登录时直接删掉：

```typescript
function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}
```

这样前端以后请求接口时就拿不到 token，也就不会再带 `Authorization` 请求头。



如果 token 存在 `sessionStorage`：

```typescript
function logout() {
  sessionStorage.removeItem('token')
  window.location.href = '/login'
}
```

`sessionStorage` 本来就会在浏览器标签页关闭后清空，适合一些临时登录场景。

#### 2. Token 存在普通 Cookie

如果是前端 JS 能读写的普通 Cookie，可以把 Cookie 过期时间设置成过去：

```typescript
document.cookie = 'token=; Max-Age=0; path=/'
```

这样浏览器会删除这个 Cookie。

#### 3. Token 存在 HttpOnly Cookie

如果 token 存在 **HttpOnly Cookie**，前端 JS 不能直接删除它。

因为 `HttpOnly` 的含义就是：

```txt
前端 JS 不能读取，也不能直接操作这个 Cookie
```

所以前端只负责通知后端“我要退出”，真正清 Cookie 的动作由后端完成。

后端示例：

```javascript
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  })

  res.json({ message: '退出成功' })
})
```



#### 4. 清掉前端 Token 后，旧 JWT 还有效吗？

如果只是前端删除 token，旧 JWT 本身在过期前仍然可能有效。

比如攻击者之前已经偷到了这个 token，即使你本地清掉了，他仍然可能继续使用，直到 token 过期。

所以更安全的做法是：

```txt
Access Token 设置短过期时间
Refresh Token 退出时从服务端删除
必要时把 JWT 的 jti 加入 Redis 黑名单
```

面试时可以这样回答：

> JWT 退出登录时，前端会清除本地保存的 Token，比如删除 localStorage、sessionStorage，或者调用后端接口清除 HttpOnly Cookie。但因为 JWT 是无状态的，已经签发出去的 Token 在过期前默认仍然有效。如果要做到真正的立即失效，需要后端配合黑名单、Token 版本号，或者使用短 Access Token + Refresh Token 机制。

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

**正常刷新流程：**

Access Token 过期后，客户端用还没过期的 Refresh Token 请求后端的"刷新 Token 接口"，后端验证 Refresh Token 有效后，返回新的 Access Token 和新的 Refresh Token。

如果 Refresh Token 也过期了，客户端引导用户重新登录，这时候才需要输入账号密码等凭证——而不是直接拿 Cookie 请求。Cookie 里可能存的是 Refresh Token，但核心还是靠有效的 Refresh Token 去换，过期了就只能重登。

需要先注意一点：

```
Base64URL 只是编码，任何拿到 Token 的人都可以解码 Header 和 Payload。
Signature 只是用来防止篡改，不负责隐藏内容。
JWT 默认只是编码 + 签名，不是加密。
```

在深入了解 JWT 签名之前，我们需要先弄清楚三个容易混淆的概念：

```
加密、哈希、签名
```

它们看起来有点像，但解决的是完全不同的问题。

### 区分踢人和彻底拉黑

| 场景 | 操作 | 黑名单 TTL |
|-----|------|-----------|
| **踢人**（只让当前 Token 失效） | 拉黑 Access Token | 和 Access Token 过期时间一致 |
| **彻底拉黑**（让用户完全无法使用） | 拉黑 Access Token + Refresh Token | 各自和自己的过期时间一致 |

因为 Access Token 是直接用来访问接口的，踢人时主要是让这个 Access Token 立刻失效，所以黑名单过期时间设为和 Access Token 一样，能确保在它有效期内一直被拦截。

而 Refresh Token 是用来换 Access Token 的，如果要让用户彻底下线，除了拉黑当前 Access Token，也可以把对应的 Refresh Token 一起拉黑，这时 Refresh Token 的黑名单过期时间就和它自身的过期时间一致。

------

## 加密、哈希、签名的区别

### 1. 哈希（Hash）

哈希也叫散列，它的核心特点：

```
输入任意长度内容 -> 输出固定长度摘要
```

常见算法：`MD5`、`SHA-1`、`SHA-256`、`SHA-512`

**哈希的两个关键特性：**

```
不可逆：无法从摘要反推出原始内容
抗碰撞：几乎不可能找到两个不同的内容产生相同的摘要
```

**举个例子：**

```
输入："hello world"
      ↓
      SHA-256
      ↓
输出："b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
```

**注意：** 哈希不是加密，因为它不能解密，无法还原。有人说"MD5 加密密码"是错误的说法，正确说法是"用 MD5 做哈希处理"。

### 2. 对称加密（Symmetric Encryption）

对称加密的核心特点：

```
用同一把钥匙加密和解密
```

```
明文 + 密钥1 -> 密文（加密）
密文 + 密钥1 -> 明文（解密）
```

**可以理解成：** 一个保险箱，一把钥匙，锁和开都靠这把钥匙。

常见算法：

| 算法         | 密钥长度    | 特点                          |
| ------------ | ----------- | ----------------------------- |
| `DES`        | 56 位       | 已淘汰，太容易被破解           |
| `3DES`       | 168 位      | DES 的加强版，也逐渐淘汰        |
| `AES`        | 128/192/256 位 | 目前最常用的对称加密算法      |
| `ChaCha20`   | 256 位      | 适合移动设备，性能好            |

**对称加密的用途：**

| 场景         | 说明                       |
| ---------- | ------------------------ |
| HTTPS 传输数据 | 真正传输大量网页/API 数据时，主要靠对称加密 |
| 数据库字段加密    | 比如手机号、身份证号、银行卡号等敏感字段     |
| 文件加密     | 比如加密配置文件、SQLite 文件、压缩包   |
| 磁盘加密       | 比如电脑硬盘加密                 |
| 内部系统之间加密通信 | 两边提前约定好同一个 key           |

**一个简单的加密/解密例子（AES-256-GCM）：**

```javascript
const crypto = require('crypto');

// 密钥必须是 32 字节（256 位）
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12); // 初始化向量

// 加密
const plaintext = 'Sensitive data';
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const authTag = cipher.getAuthTag();

// 解密
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(authTag);
const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
```

**对称加密的缺点：**

```
这把 key 怎么安全地交给对方？
这个后面讨论。
```

### 3. 非对称加密（Asymmetric Encryption）

非对称加密的核心特点：

```
用公钥加密，私钥解密（或者反过来）
```

```
明文 + 公钥 -> 密文（只有私钥能解开）
密文 + 私钥 -> 明文（只有私钥持有者能解密）
```

**可以理解成：** 公钥像一个只能投信的邮箱口，私钥像打开邮箱的钥匙。别人都可以往你的邮箱里投信，但只有你能打开。

常见算法：

| 算法       | 密钥长度       | 主要用途                          |
| ---------- | -------------- | --------------------------------- |
| `RSA`      | 2048/4096 位   | 加密、小数据签名、最广泛使用       |
| `ECC`      | 256/384 位     | 性能好，适合移动端和嵌入式设备     |
| `DH`       | 2048 位        | 密钥交换协议                       |
| `ECDH`     | 256 位         | 基于 ECC 的密钥交换                |

**非对称加密适合什么场景？**

| 场景             | 说明                   |
| -------------- | -------------------- |
| HTTPS 握手阶段     | 用非对称机制协商出后续通信要用的对称密钥 |
| 给某个人发送加密信息     | 用对方公钥加密，只有对方私钥能解     |
| 登录/认证系统中的公私钥体系 | 证明某个服务确实是可信的         |
| 证书体系           | 比如网站证书、CA 证书         |
| SSH 登录         | 你的公钥放服务器上，私钥在你电脑里    |

**非对称加密有个问题：它比对称加密慢，不适合直接加密大量数据。**

所以真实系统里经常是：

```
非对称加密：负责安全地交换一把临时 key
对称加密：负责后面大量数据的加密传输
```

**一个简单的加密/解密例子（RSA）：**

```javascript
const crypto = require('crypto');

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 用公钥加密
const plaintext = 'Secret message';
const encrypted = crypto.publicEncrypt(
  { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
  Buffer.from(plaintext)
);

// 用私钥解密
const decrypted = crypto.privateDecrypt(
  { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
  encrypted
);
```

### 4. 三者的核心区别

| 特性         | 哈希（Hash）        | 对称加密              | 非对称加密              |
| ------------ | ------------------- | --------------------- | ---------------------- |
| 密钥         | 无                  | 一把（相同）          | 两把（公钥 + 私钥）    |
| 可逆性       | 不可逆              | 可逆                  | 可逆                    |
| 用途         | 摘要、校验          | 数据加密              | 密钥交换、数字签名      |
| 性能         | 快                  | 快                    | 慢（比对称慢 100-1000 倍）|
| 常见算法     | SHA-256、MD5        | AES、ChaCha20         | RSA、ECC               |

**一句话总结：**

```
哈希：把内容变成不可逆的"指纹"
对称加密：用同一把钥匙锁门和开门
非对称加密：用一把锁锁门，用另一把钥匙开门
签名：用私钥"签字"，用公钥"验字"
```

### 5. "非对称加密"和"非对称签名"有什么关系？

它们都用到：

```
公钥 + 私钥
```

但目的不同：

| 类型         | 怎么用       | 目的       |
| ----------- | --------- | -------- |
| 非对称加密 | 公钥加密，私钥解密 | 不让别人看到内容 |
| 非对称签名 | 私钥签名，公钥验签 | 防篡改，证明来源 |

可以这样记：

```
想让别人秘密发消息给我：
用我的公钥加密，我用私钥解密。

想证明这东西是我发的：
我用私钥签名，别人用我的公钥验证。
```

### 6. HTTPS 里为什么两个都用？

比如你访问 `https://example.com`，大概可以理解成：

**第一步：非对称机制先出场**

浏览器和服务器先通过证书、公钥、私钥这一套机制，确认：

```
这个服务器是真的 example.com，不是冒牌货。
```

然后双方协商出一把临时的对称密钥。

**第二步：对称加密负责真正传数据**

后面你发请求、收响应，比如：

```
登录信息
接口数据
网页内容
图片资源
```

这些大量数据主要靠对称加密传输。

原因很简单：

```
非对称加密适合建立信任和交换密钥；
对称加密适合加密大量数据。
```

------

## JWT 中的哈希与密钥

了解了上面的概念后，我们再来看 JWT 签名具体用到了什么。

### HS256 用了什么？

```
HMAC-SHA256
```

拆解一下：

```
HMAC：Hash-based Message Authentication Code，基于哈希的消息认证码
SHA-256：哈希算法，输出 256 位（32 字节）摘要
密钥：用户自定义的 secret
```

**HS256 的完整流程：**

```
1. 把 Header 和 Payload 分别做 Base64URL 编码
2. 拼接：Base64URL(Header) + "." + Base64URL(Payload)
3. 用 secret 对拼接后的字符串做 HMAC-SHA256 哈希
4. 把哈希结果 Base64URL 编码，作为 Signature

实际计算（伪代码）：
signature = HMAC-SHA256(secret, base64url(header) + "." + base64url(payload))
```

### RS256 用了什么？

```
RSA + SHA-256
```

拆解一下：

```
SHA-256：哈希算法，对 Header + Payload 做摘要
RSA：非对称加密算法，用私钥对这个哈希值进行加密（实际是签名运算）
密钥：一对 RSA 密钥（私钥签名，公钥验签）
```

**RS256 的完整流程：**

```
1. 把 Header 和 Payload 分别做 Base64URL 编码
2. 拼接：Base64URL(Header) + "." + Base64URL(Payload)
3. 对拼接后的字符串做 SHA-256 哈希，得到摘要
4. 用 RSA 私钥对这个哈希摘要进行签名运算
5. 把签名结果 Base64URL 编码，作为 Signature

实际计算（伪代码）：
hash = SHA-256(base64url(header) + "." + base64url(payload))
signature = RSA_sign(private_key, hash)
```

### 其他常见的 JWT 签名算法

| 算法      | 类型        | 密钥               | 说明                          |
| --------- | ----------- | ------------------ | ----------------------------- |
| `HS256`   | 对称签名    | secret             | HMAC-SHA256，最常用            |
| `HS384`   | 对称签名    | secret             | HMAC-SHA384                   |
| `HS512`   | 对称签名    | secret             | HMAC-SHA512                   |
| `RS256`   | 非对称签名  | RSA 私钥 + 公钥    | RSA-SHA256，最安全场景        |
| `RS384`   | 非对称签名  | RSA 私钥 + 公钥    | RSA-SHA384                    |
| `RS512`   | 非对称签名  | RSA 私钥 + 公钥    | RSA-SHA512                    |
| `ES256`   | 非对称签名  | ECDSA 私钥 + 公钥  | 椭圆曲线，比 RSA 更高效        |
| `ES384`   | 非对称签名  | ECDSA 私钥 + 公钥  | 椭圆曲线-SHA384               |
| `ES512`   | 非对称签名  | ECDSA 私钥 + 公钥  | 椭圆曲线-SHA512               |
| `PS256`   | 非对称签名  | RSA 私钥 + 公钥    | RSA-PSS，比 PKCS#1 v1.5 更安全 |
| `none`    | 无          | 无                 | 不签名，不安全，生产环境禁用    |

### 选 HS256 还是 RS256？

```
选 HS256：
- 单体应用或少量服务
- 所有服务都在同一个后端
- 性能要求高
- 密钥管理简单

选 RS256 / ES256：
- 微服务架构
- 需要第三方验证 Token
- 单点登录（SSO）
- 对安全性要求极高
- 需要频繁轮换密钥
```

------

## 简单记忆

```
HS256：一把钥匙，签名和验证都用它。
RS256：一对钥匙，私钥签名，公钥验证。
```

再结合 JWT 来记：

```
JWT 的 Header 里写算法，比如 HS256 或 RS256。
JWT 的 Payload 里放用户身份信息。
JWT 的 Signature 用来防篡改。
HS256 的 secret 不能放进 JWT，也不能暴露给前端。
RS256 的私钥必须由签发方严格保存；公钥可以分发给需要验签的服务。
```

## Token 放置位置：这里只做选型对比

Token 放在哪里，不改变 JWT 的本质，只影响**前端怎么携带**和**主要安全风险是什么**。

| 放置方式 | 怎么携带 | 主要优点 | 主要风险 | 常见场景 |
|---------|---------|---------|---------|---------|
| HttpOnly Cookie | 浏览器自动带上 | 前端 JS 读不到，降低 XSS 偷 Token 的风险 | Cookie 自动携带，要防 CSRF | 传统 Web、SSR、同域系统 |
| Authorization Header | 前端手动加请求头 | 语义清晰，适合 API 和前后端分离 | Token 常由前端保存，要防 XSS | SPA、移动端、跨域 API |

### Authorization Header 示例

前后端分离项目里，经常用 `Authorization: Bearer token`：

```typescript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

这段代码的意思是：每次 Axios 发请求前，先从 `localStorage` 取出 token，如果有 token，就统一加到请求头里。

### HttpOnly Cookie 示例

同域或 SSR 项目里，也经常让后端直接设置 Cookie：

```javascript
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
})
```

这段代码的意思是：后端把 token 写进 Cookie，`httpOnly` 让前端 JS 读不到，`secure` 要求 HTTPS，`sameSite` 用来减少 CSRF 风险。

### 面试回答

Token 常见有两种放法：一种是放在 `Authorization` 请求头里，适合前后端分离和 API 调用；另一种是放在 HttpOnly Cookie 里，适合同域 Web 登录态。

放在 Header 里不会被浏览器自动携带，CSRF 风险较小，但前端要自己保存 token，所以要注意 XSS。放在 Cookie 里前端 JS 读不到，能降低 XSS 偷 token 的风险，但浏览器会自动带 Cookie，所以要配合 `SameSite`、CSRF Token、Origin 校验等方式防 CSRF。

简单记：**Header 方式重点防 XSS，Cookie 方式重点防 CSRF。**

---

## 强制下线：Redis 黑名单 TTL 要和 Token 过期时间一致


### 如果 Redis 过期时间更短

```
Token 今天 24:00 过期
Redis 黑名单今天 12:00 过期
```

12:00 后，黑名单记录没了，但 Token 还没过期。如果用户继续拿这个 Token 请求，后端只验证 JWT 本身，可能发现它还有效，踢人就失效了。

### 如果 Redis 过期时间更长

```
Token 今天 24:00 过期
Redis 黑名单明天 24:00 过期
```

今天 24:00 后token已经自然失效了，Redis 再多存一天没有价值，只是浪费空间。

### 最合理的做法

```
Redis 黑名单过期时刻 = Token 自身过期时刻
```

这样有三个好处：

- Token 有效期内，黑名单一直有效，踢人不会失效
- Token 过期后，Redis 自动清理，不浪费存储
- 逻辑简单，不需要维护两套过期规则

### 真实代码示例

```java
// 1. 用户退出登录 / 管理员踢人
void kickUser(String token) {
    // 2. 获取这个 Token 自己还有多久过期
    long expireTime = getTokenExpireTime(token);

    // 3. 存入 Redis 黑名单，过期时间 = Token 本身的过期时间
    redis.set("blacklist:" + token, "true", expireTime);
}
```

```java
// 接口请求时校验
boolean checkToken(String token) {
    // 查 Redis，如果在黑名单里，直接拒绝
    if (redis.hasKey("blacklist:" + token)) {
        return false;
    }
    return true;
}
```

就这么简单。

### 区分踢人和彻底拉黑

### 面试回答

JWT 可以放在 HttpOnly Cookie，也可以放在 Authorization Header。Cookie 方案的好处是前端 JS 读不到 token，但因为浏览器会自动带 Cookie，所以要防 CSRF；Header 方案更适合前后端分离和 API，但 token 通常由前端保存，所以要防 XSS。
SSO 场景下，内部同域系统常用 Cookie 或统一登录中心，第三方登录更常用 OAuth2/OIDC。强制下线时，如果用 Redis 黑名单记录失效 Token，黑名单 TTL 应该设置到 Token 自身过期时刻，这样既能保证踢人有效，也不会让 Redis 存无意义的数据。

记忆口诀：

```
Cookie 防伪造，Header 防脚本；黑名单存到 Token 过期就够了。
```
