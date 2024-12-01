![image 20240922140319852](https://s1.imagehub.cc/images/2024/11/25/ad2c20fa7e279c2153058a29c3674e7a.png)

## 🐬Node.js

Node.js是一个基于Chrome V8引擎的JavaScript运行环境，使得JavaScript可以在服务器端运行，而不仅仅是在浏览器中。

npm是Node.js自带的包管理工具，拥有丰富的第三方库和模块，可以轻松地进行依赖管理和安装。

nvm（Node Version Manager）和npm（Node Package Manager）有关系，但它们的功能不同。nvm用于管理Node.js的版本，而npm是Node.js的包管理工具。

## 🐬NPM

### 基本认识

> 命令行简单命令
>
> 比如目前是在C盘，你想要切换到别的盘去
>
> 直接输入F：
>
> 就直接切换到这个盘
>
> 
>
> 想要去这个盘的某个文件夹，比如nvm
>
> 直接输入cd nvm
>
> 弹出F:\nvm>
>
> 
>
> 想要到上一层，也就是F层
>
> 可以输入cd ..
>
> 或者cd F:\
>
> 或者cd \  这个命令会带你去当前盘符的根目录
>
> 
>
> 在命令行中，`Ctrl + C` 是一个常用的快捷键，用于发送中断信号（SIGINT）给当前正在运行的进程。这通常会导致该进程立即终止。其主要用途包括：
>
> 1. **停止运行的程序**：如果你在命令行中运行一个长时间执行的命令或脚本，可以使用 `Ctrl + C` 来中断它，返回到命令提示符。
> 2. **退出交互式命令**：在某些交互式程序中，如 `npm start` 或其他命令行工具，使用 `Ctrl + C` 可以退出这些程序。
>
> 

cls 是清空当前命令行

重新安装npm  （npm install npm-g）整个-g是global全局的意思，加不加都可以。意思是下载完后这个npm任何盘任何项目都能打开，在任何位置也能打开

卸载npm (npm uninstall)

<img src="https://s1.imagehub.cc/images/2024/11/25/c665f4c5fba47130265970b461f4f18d.png" alt="image 20240922140746815" style="zoom:50%;" />

### 镜像的设置

获取当前镜像源(npm config get registry）最后一个单词的意思是注册表

> 镜像源通常分为你设置的，和默认的。可以互相切换

设置当前镜像源(npm config set registry url) 有时候不起作用，可以看看下面的图片，有别的方法。



<img src="https://s1.imagehub.cc/images/2024/11/25/f4e26ccab269d11dc8e35afd821218c0.png" alt="image 20240922143719792" style="zoom:67%;" />

### 基本使用

> 使用的场景有命令行、开发工具自带的终端

npm install jquery@3.0.0 我们利用@完成了jquery指定版本的下载

npm list jquery 查看当前版本

npm update jquery 更新当前的jquery到最新版本

> 运行时依赖：项目在运行时带着这个包
>
> 开发时依赖：在开发的时候用这个包，在上线之后会把它删掉
>
> `--save` 和 `-save-dev` 是 npm 安装包时使用的选项，用于指定依赖的类型。
>
> 这两个选项分别用于将依赖添加到 `dependencies` 和 `devDependencies`，前者是生产环境需要的，比如库和框架。而后者只在开发过程中使用，比如测试框架、构建工具和开发服务器。
>
> 从 npm 5 版本开始，默认会将依赖添加到 `dependencies` 中，因此你可以直接使用 `npm install package-name`，而不必显式地添加 `--save`。
>
> **这个可以加到中间，也可以加到最后。ll建议我写中间，这样最后一个直接是文件名**
>
> npm install --save moduleName
>
> npm install moduleName --save

<img src="https://s1.imagehub.cc/images/2024/11/25/e7e743da81458296ed138e11059fd331.png" alt="image 20240922144434461" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/25/05cd2ad78c93ea60556038b3fa1773b3.png" alt="image 20240922180408396" style="zoom:67%;" />

### 	Package.json属性说明

假设目前你没有package

生成package.json（npm init）这个命令是用于创建一个新的package.json 文件，这个文件用于管理项目的依赖，脚本和其他元数据。

> 但是输入完这个，里面的内容不会自动填充，它会一个个问你每个属性填什么值，是一个交互性的。
>
> 具体的看本章节下面的附录。



![image 20240922150825338](https://s1.imagehub.cc/images/2024/11/25/98a3b6db6f017a6c44445ebc55c605db.png)

<h3>附录：</h3>

`npm init` 是用于创建一个新的 `package.json` 文件的命令，它是每个 Node.js 项目的基础。这个文件用于管理项目的依赖、脚本和其他元数据。

> 基本用法
>
> 运行以下命令：
>
> ```bash
> npm init
> ```
>
> 这会启动一个交互式的向导，提示你输入项目的各种信息，如：
>
> - **name**：项目名称
> - **version**：项目版本（默认为 `1.0.0`）
> - **description**：项目描述
> - **entry point**：入口文件（默认为 `index.js`）(就是一进去运行什么文件)
> - **test command**：测试命令
> - **git repository**：Git 仓库地址
> - **keywords**：关键词（用空格分隔）
> - **author**：作者信息
> - **license**：许可证类型（默认为 `ISC`）
>
> **快速初始化**
>
> 如果你想使用默认值快速生成 `package.json` 文件，可以使用：
>
> ```bash
> npm init -y
> ```
>
> 这会自动创建一个包含默认设置的 `package.json` 文件。
>
> **生成的 package.json 文件**
>
> 生成的 `package.json` 文件包含你提供的信息，以及一些 npm 使用的基本字段，这对于管理项目的依赖和配置非常重要。



<img src="https://s1.imagehub.cc/images/2024/11/25/1359df5fe1df2f984161e1b74e2e3a31.png" alt="image 20240922162241792" style="zoom:67%;" />package里也可以加入这样的成员。`scripts` 字段用于定义可执行的脚本命令。这些脚本可以通过 `npm run <script-name>` 来调用，常用于简化开发和构建流程。

`npm run test`就会运行当前的目录结构，`npm run hello`就会运行当前的版本

<img src="https://s1.imagehub.cc/images/2024/11/25/0c5fb1914c95ee4504b2fb79e5fcaf16.png" alt="image 20240922162849730" style="zoom:67%;" />

这里面会记录你已有的module-name，并且按照运行时依赖和开发时依赖帮你分类好。即使你本地没有这些文件，package里也不会消失这些内容。

如果现在你本地没有这些module，比如jquery，bootstrap，想要进行下载。直接输入`npm install`

![image 20240922163156781](https://s1.imagehub.cc/images/2024/11/25/0f49375fd7c43972f8244f5db28a9a10.png)

有时候还会生成package-lock.json文件，用于记录项目中依赖包的确切版本号（版本锁定）及其结构。确保在不同环境（如开发、测试和生产）中安装的依赖一致。

![image 20240922163523290](https://s1.imagehub.cc/images/2024/11/25/85c3c71a3599337b682363d67158ce72.png)

![image 20240922163421532](https://s1.imagehub.cc/images/2024/11/25/25ded2442d5cdf1e7579b3a11afc10bb.png)

这里的^符号上指，保持第一位不动，更新后两位到最新的版本

这里的波浪线上指，保持前两位不动，比如3.5不动，使得最后一个x更新到最新版本







### 兼容性解决

<img src="https://s1.imagehub.cc/images/2024/11/25/778ed40d7be1521b37c81131b24107b1.png" alt="image 20240922180425722" style="zoom:67%;" />

举例：某些内容用ES6写的，但客户端不支持，所以可以编译成其他版本，最好是我们这里提前编译好旧版本，这样用户那边就不用再加载了。

常用的工具有下面这些。

<img src="https://s1.imagehub.cc/images/2024/11/25/92061cdabe21016a01ddfa6c7940d11f.png" alt="image 20240922181144017" style="zoom:67%;" />

使用有一点点复杂，看不懂看这个https://www.bilibili.com/video/BV1Dv411W7XP?p=7&vd_source=5437c606fea007bf0f9d56d7836dd0ea

<img src="https://s1.imagehub.cc/images/2024/11/25/5e5d206657adfc1a142a5f684936222d.png" alt="image 20240922181702682" style="zoom:67%;" />





## 🐬yarn

### 优势

与npm是竞品

<img src="https://s1.imagehub.cc/images/2024/11/25/992489ff845ee1471872a8d0cd899790.png" alt="image 20240922183404403" style="zoom:67%;" />

**优势：**

* 并行安装：npm在安装时上是一个个下载的，但是yarn是可以并行下载
* 离线模式：如果之前安装过一个软件包，再安装时，yarn会从缓存过去，就不会再次下载。
* 版本统一：虽然具体没懂，不过大意是说yarn会具体去锁住某个你上次项目用的版本，下次再用这个项目，它会再次锁住？
* <img src="https://s1.imagehub.cc/images/2024/11/25/1abd6e6f7483003bfca87104066831b6.png" alt="image 20240926132011958" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/25/bcc574d7702f7838cbcae8b87f62a9a4.png" alt="image 20240926132057671" style="zoom:67%;" />













### 基本介绍

​	<img src="https://s1.imagehub.cc/images/2024/11/25/14fac599c7cd57a8e997566173cbaaf3.png" alt="image 20240926125317562" style="zoom:67%;" />

​	<img src="https://s1.imagehub.cc/images/2024/11/25/752a30fdd9156b38c427987f08153898.png" alt="image 20240926125446224" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/25/41ec78477513e4cd1671e6f6a3aa0a3a.png" alt="image 20240926130921632" style="zoom:67%;" />



## 🐬网络请求

### Ajax

全称Asynchronous JavaScript And XMl

翻译成异步的JS和XML

异步无刷新技术。

> 异步是指不用等待请求返回 也能继续操作。无刷新是说做了一些操作页面不会刷新，依然留在当前技术。
>
> ajax适用于无刷新或者局部刷新。

AJAX是一种通过JS在后台与服务器进行通信的技术。

JS本身没有网络通信能力，我们通过JS代码触发事件，然后通过浏览器与服务器取得联系。

浏览器与服务器取得联系需要通过一定的规范，这个规范是指浏览器内的**XMLHttpRequest构造函数**。JS可以操作这个构造函数，这个构造函数可以创建自己的对象，此对象具有自己的属性方法。

<img src="https://s1.imagehub.cc/images/2024/11/25/edfe71f3f9d1f3cebf24aa60794240b2.png" alt="image 20241010135808849" style="zoom:67%;" />

先来介绍XML，XMLHttpRequest是浏览器提供的API，允许 网页 与 服务器 的异步通信。如上所说，XML构造函数有许多自己的属性方法。

open方法指定建立HTTP连接时候的一些细节

readystate会用*响应状态码*记录请求响应时处于哪个过程。（与send同步进行，在用open配置完请求，调用send后，readyState会从1到4变化，它用于监控请求）

* 0表示未调用open方法
* 1表示调用了open方法，但是没用调用send方法
* 2表示发送请求，但未收到响应
* 3表示收到了部分响应
* 4表示响应接收完了（表示我们可以把响应内容显示在页面了）

我们使用*onreadystatechange*监视*readyState*属性值的变化，当你获取不同的变化值时，你可以自己拟定相应的函数进行处理。

send() 真正把HTTP请求发送给服务器，它发完请求不需要等待响应就直接返回（因为是异步），它不会阻塞程序执行。

一旦拿到服务器返回的数据，AJAX 不会刷新整个网页，而是只更新网页里面的相关部分，从而不打断用户正在做的事情。

C:\Program Files\Google\Chrome\Application\chrome.exe  --disable-web-security --user-data-dir=文件夹的路劲

> 注意，AJAX 只能向同源网址（协议、域名、端口都相同）发出 HTTP 请求，如果发出跨域请求，就会报错.

```AJAX
var xhr = new XMLHttpRequest();
xhr.onreadyStateChange=function(){
	if(xhr.readyState===4){
		if(xhr.status===200)
			console.log(xhr.responseText);
	}
	else{
		console.log(xhr.statusText);
	}
};

xhr.onerroe=function(e){
	console.error(xhr.statusText);
};

xhr.open('GET','/endpoint',true);
xhr.send(null);
```

![image 20241010141921452](https://s1.imagehub.cc/images/2024/11/25/539fdea8be1d3dbba98724a73f264a60.png)

### Axios

Axios是一个基于**promise**的网络客户端，用于在浏览器和nodejs中发送异步请求。

它支持许多请求方法，不止GET、POST，还有PUT、DELETE等，它还带有许多功能，比如自动转换JSON数据，拦截请求和响应，超时设置，处理并发需求等。

Axios其实相当于简化版的AJAX。

特点：

* Axios由于基于Promise，所以可以使用.then()和.catch()
* 支持多种环境下使用，比如浏览器、Nodejs
* 自动处理JSON数据转换

与AJAX的XMLHTTPRequest相比，Axios更加简洁，API也更丰富，并且支持Promise，简化了异步代码的处理。

![image 20241012202510371](https://s1.imagehub.cc/images/2024/11/25/49a7805c4130e25be51ae83cce7d7842.png)

#### GET与POST请求

首先想导入包的话，

```
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```



也可以本地npm下载。



**GET请求：**

用于从服务器获取数据。

![image 20241012192719116](https://s1.imagehub.cc/images/2024/11/25/9c308b48ef69bab5818c4855b30b9995.png)

第一个回调函数会在请求完成响应时触发，第二个回调函数会在请求失败时触发。

![image 20241012192833970](https://s1.imagehub.cc/images/2024/11/25/bb7151f254d1822d97af09116e9a2a0c.png)

key是文档提供的，value是要具体查询的数据。

> 下面的get请求有两个参数，第一个参数是请求的URL，第二个参数是可选的配置对象，用于指定参数、请求头等。（第二个参数还可以用param指定）
>
> 这里我们通过params发送查询参数
>
> ```
> axios.get('https://api.example.com/users', {
> params: { id: 123 } // 通过 `params` 发送查询参数
> })
> .then(response => {
> console.log(response.data);
> })
> .catch(error => {
> console.error(error);
> });
> ```
>
> 

**POST请求：**

用于向服务器发送数据。

![image 20241012193053180](https://s1.imagehub.cc/images/2024/11/25/44bd0733d4ebc3f7c7c0ef7c5a33d569.png)

key是文档提供的，value是具体要传输的数据。

> 它接受三个参数：
>
> 第一个：请求的URL。
>
> 第二个：请求体，即要发送的数据。
>
> 第三个：可选的配置对象，用于指定请求头。
>
> ```
> axios.post('https://api.example.com/users', {
> name: 'John Doe',
> email: 'johndoe@example.com'
> })
> .then(response => {
> console.log(response.data);
> })
> .catch(error => {
> console.error(error);
> });
> ```

#### 配置对象

在上面的参数中，我们反复提到有配置对象，那么下面看看一些常用的配置对象：

* url:请求的URL
* method：请求的HTTP方法（GET/POST/PUT/DELETE）
* baseURL：设置自定义请求头
* params：设置查询字符串参数（GET）
* data：发送的数据（POST/GET）
* timeout：设置请求的超时时间，单位为ms毫秒。
* withCredentials：是否允许发送跨域请求时携带cookie

```js
axios({
  method: 'post',
  url: 'https://api.example.com/login',
  baseURL: 'https://api.example.com',
  data: {
    username: 'user1',
    password: 'pass123'
  },
  timeout: 1000, // 超时时间为 1000 毫秒
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Request failed', error);
});
```

#### 创建实例

我们可以创建axios实例，可以让我们设置多个具有不同配置的客户端

```
axios.create([config])
```

举例：

![image 20241101094736255](https://s1.imagehub.cc/images/2024/11/25/4cb1dae7772adcecae2da1335fb38aba.png)

更重要的是我们可以在实例上设置拦截器，在发出请求或者接收时进行统一的处理。

```axios
const instance = axios.create();

instance.interceptors.response.use(
  response => response,
  error => {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

```



#### 请求与响应拦截器

axios允许在请求或者响应被处理之前进行拦截和修改，常用于请求的验证或者全局错误处理。

![image 20241101095054361](https://s1.imagehub.cc/images/2024/11/25/8b0f913f6fc9aefe724e81c6db7055df.png)

请求拦截器：

```
axios.interceptors.request.use(config => {
  // 在请求发出之前可以做一些处理，例如添加 token
  config.headers.Authorization = 'Bearer your-token';
  return config;
}, error => {
  return Promise.reject(error);
});
```

响应拦截器：

```
axios.interceptors.response.use(response => {
  // 处理响应数据
  return response;
}, error => {
  // 处理响应错误
  console.error('Response error:', error);
  return Promise.reject(error);
});
```

也可以在实例上添加拦截器：

```
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

移除拦截器：

```
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

## 🐬Git

![image-20241201110048753](C:/Users/朱嘉宜/AppData/Roaming/Typora/typora-user-images/image-20241201110048753.png)

