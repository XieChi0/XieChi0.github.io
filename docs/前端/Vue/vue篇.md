## 🐬Vue 2.0 基础

### 什么是MVVM模式？

MVVM（Model-View-ViewModel）是一种软件架构设计模式，核心是 **ViewModel **层 ，负责转换 Model 中的数据对象来让数据变得更容易管理和使用。该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互。

![image 20241008094620300](https://s1.imagehub.cc/images/2024/11/25/1c1ea7c41b933de70655e3aa4ea9133a.png)

为什么要使用 MVVM？

 MVVM 模式和 MVC 模式一样，主要目的是分离视图（View）和模型（Model），有几大好处 

* 减少了大量DOM操作编写，可以更加专注逻辑操作。
* 分离数据和界面的呈现，降低了代码耦合度。
* 支持组件化开发，更利于中大型项目的代码组织。



MVVM

> * Model：模型层，在这里表示 JavaScript 对象 
>
> * View：视图层，在这里表示 DOM（HTML 操作的元素） 
>
> * ViewModel：连接视图和数据的中间件，Vue.js 就是 MVVM 中的 ViewModel 层的实现者

![image 20241008095742157](https://s1.imagehub.cc/images/2024/11/25/33ac1d28c249ae3451db0f959a08ceea.png)

> > View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建。
> >
> > Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，主要围绕数据库系统展开。这里的难点主要在于需要和前端约定统一的 接口规则 
> >
> > ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。



ViewModel功能

在 MVVM 架构中，是不允许 数据和视图 直接通信的，只能通过 ViewModel 来通信，而 ViewModel 就是定义了一个 Observer 观察者，ViewModel 能够观察到数据的变化，并对视图对应的内容进行更新。至此，我们就明白了，Vue.js 就是一个 MVVM 的实现者，他的核心就是实现了 DOM 监听与数据绑定。



ViewModel注意以及总结

需要注意的是 ViewModel 所封装出来的数据模型包括视图的状态和行为两部分，而 Model 层的数据模型是只包含状态的。视图状态和行为都封装在了 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。 

由于实现了双向绑定，ViewModel 的内容会实时展现在 View 层，这是激动人心的，因为前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图。 MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新，真正实现事件驱动编程 。 

View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交 互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的重要一 环。

> 解释视图的状态与行为：
>
> 比如页面的这一块展示什么，那一块展示什么这些都属于视图状态（展示）
>
> 页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互）



### Vue理解

Vue是一套用于构建用户界面的渐进式框架，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库 （如： vue-router ， vue-resource ， vuex ）或既有项目整合。

#### 一个完整的生命周期

要理解 Vue 实例的诞生和渲染过程，让我们从头开始，分解成几个简单的步骤。作为一个小白，这会帮助你逐步建立对 Vue.js 工作原理的认识。

#### 1. **什么是 Vue 实例？**

Vue 实例是 Vue 应用的核心部分。你可以把它看作是一个“控制中心”，它负责管理数据、模板渲染、事件处理等功能。我们创建一个 Vue 实例来管理页面中的某个部分，并让这个部分的数据和视图保持同步。

####  2. **创建 Vue 实例**

要创建一个 Vue 实例，首先需要写一点 JavaScript 代码。以下是创建一个简单 Vue 实例的基本步骤：

```
javascript复制代码var vm = new Vue({
  el: '#app',    // 1. 挂载点，Vue 实例控制的 DOM 元素
  data: {        // 2. 响应式数据
    message: 'Hello, Vue!'
  },
  methods: {     // 3. 方法，用于处理事件
    sayHello() {
      alert(this.message);
    }
  }
});
```

- **`el`** 是挂载点，它决定了 Vue 实例会控制页面上的哪个元素（如 `<div id="app">`）。
- **`data`** 定义了实例中要管理的数据，比如 `message`，Vue 实例会自动处理它的变化。
- **`methods`** 是事件处理函数，当用户与页面交互（如点击按钮）时，Vue 可以调用这些方法。

#### 3. **Vue 实例的创建过程**

#### 1) **初始化 Vue 实例**

当我们调用 `new Vue({...})` 时，Vue 实例会开始初始化。这个初始化包括：

- **处理 `el` 和 `data` 选项**：Vue 会找到页面上与 `el` 选择器对应的元素，并准备好数据（如 `message`）。
- **代理数据**：Vue 实例会代理 `data` 中的每一个属性，也就是说你可以直接通过 `vm.message` 来访问 `message`，而不是 `vm.data.message`。

#### 2) **响应式系统的创建**

Vue 实例通过响应式系统将 `data` 中的每个属性变成响应式的。什么意思呢？当你修改 `data` 中的某个属性时（例如修改 `message` 的内容），Vue 会自动检测到变化，并更新页面中的显示内容。这就是 Vue 的强大之处：**自动更新视图**。

#### 3) **编译模板**

Vue 会将页面中通过 `{{}}` 插值表达式使用的数据和 `data` 进行绑定。例如，如果你的模板中有 `{{ message }}`，Vue 会将 `message` 的值插入到页面的这个位置。这个过程称为 **模板编译**，它将你写的模板与数据绑定，生成可以被浏览器展示的 HTML 内容。

#### 4. **Vue 实例挂载和渲染**

#### 1) **挂载过程**

当 Vue 实例完成初始化并准备好数据后，它会将自己的模板渲染到页面的指定元素上，也就是 `el` 中指定的挂载点（例如 `<div id="app">`）。这一过程被称为 **挂载**。

- **beforeMount** 钩子函数：Vue 在将模板挂载到 DOM 之前会调用这个钩子函数。
- **mounted** 钩子函数：当模板已经成功挂载到 DOM 上时，这个钩子函数会被调用。

#### 2) **渲染（Render）**

渲染是指将 Vue 实例的模板内容和数据结合起来，生成最终的页面内容，并将其显示在浏览器上。渲染的过程中，Vue 会将数据插入到模板中（如 `{{ message }}`），并生成 HTML 来更新页面。

##### 初次渲染：

在 Vue 实例首次挂载时，会进行初次渲染。Vue 会解析模板并将 `data` 中的数据显示在页面上。比如：

```
<div id="app">
  <p>{{ message }}</p>  <!-- 初次渲染时，{{ message }} 会被替换为 "Hello, Vue!" -->
</div>
```

这意味着页面上 `<p>` 标签中的 `{{ message }}` 会被替换为 `Hello, Vue!`，这是 Vue 的初次渲染。

#### 3) **响应式更新**

当你修改 `data` 中的某个值时（例如 `vm.message = 'Hello, World!'`），Vue 会自动更新页面中使用到 `message` 的所有地方。这被称为 **响应式更新**，也是 Vue 的核心功能。

- Vue 会通过一个轻量级的 **虚拟 DOM** 来跟踪哪些部分的页面需要更新，只有发生变化的部分会被重新渲染，其他部分保持不变。

#### 5. **完整的生命周期**

Vue 实例从创建到销毁，经历了以下几个重要的生命周期阶段：

- **beforeCreate**：实例初始化之前调用，你还不能访问 `data` 和 `methods`。
- **created**：实例初始化完成，`data` 和 `methods` 已经可以使用，但还没有开始渲染页面。
- **beforeMount**：实例挂载之前调用，模板还没有渲染到页面上。
- **mounted**：实例挂载完成，模板已经渲染到页面上。（指的是DOM已经全部加载完毕（但不保证网络请求渲染的数据也加载完毕））
- **beforeUpdate**：当响应式数据更新之前调用。
- **updated**：响应式数据更新之后调用，页面上的视图已经被重新渲染。
- **beforeDestroy**：实例销毁之前调用。
- **destroyed**：实例销毁之后调用，所有的事件监听和响应式绑定都被移除。

#### 6. **总结 Vue 实例的诞生过程**

1. **创建 Vue 实例**：调用 `new Vue()` 时，Vue 开始初始化实例，包括将传入的选项（`el`、`data`、`methods`、`computed`、`watch` 等）挂载到实例上。
2. **初始化响应式数据**：Vue 实例会通过 `Object.defineProperty` 把 `data` 中的数据变成响应式的。当数据变化时，视图会自动更新。Vue 会为每个属性创建一个依赖收集系统，用于跟踪使用该属性的组件。
3. **模板编译**：Vue 解析模板，找到模板中的插值（例如 `{{ message }}`）和指令（例如 `v-if`、`v-for` 等），并生成渲染函数（render function）。这一步完成了模板与数据的绑定。
4. **挂载 DOM**：如果 `el` 选项中指定了目标 DOM 元素，Vue 实例会将生成的虚拟 DOM 树挂载到真实 DOM 中。如果没有指定，Vue 实例只会在内存中创建虚拟 DOM，直到手动调用 `vm.$mount()` 挂载到实际的 DOM 节点上。
5. **更新视图**：当响应式数据发生变化时，Vue 会自动触发视图更新。Vue 的响应式系统通过侦听数据的变化，并根据这些变化重新渲染虚拟 DOM，确保视图与数据同步。
6. **销毁实例**：当不再需要 Vue 实例时，它会进入销毁阶段，解除所有绑定和事件监听器，释放内存资源，防止内存泄漏。



### 组件化

* 页面上每个独立的可交互的区域视为一个组件

* 每个组件对应一个工程目录，组件所需的各种资源在这个目录下就近维护 

* 页面不过是组件的容器，组件可以嵌套自由组合（复用）形成完整的页面

每个组件实例（Vue实例）都有相应的 watcher 实例对象，它会在组件渲染（根据模板渲染数据时）把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

![image 20241008101450682](https://s1.imagehub.cc/images/2024/11/25/8f6ad05ac606a1aa5d69b888d39e8975.png)

### 实际基本介绍

渐进式js框架，渐进式是指由浅入深，可以一步步往更难的学习去使用。

#### 安装与引入

**安装（使用npm）**

```
# 最新稳定版$ npm install vue@^2
```



**引入**

https://v2.cn.vuejs.org/v2/guide/installation.html

<h6>js文件本地引入</h6>

js本地文件下载地址：https://v2.cn.vuejs.org/v2/guide/installation.html

然后在html文件中通过< script>< /script>

<h6>CDN引入</h6>

CDN的全称是“Content Delivery Network”，指的是内容分发网络。当你在前端引入文件时，例如JavaScript库或样式表，CDN可以确保这些资源从离用户最近的服务器加载，从而减少延迟和提高用户体验。所以CDN实际上就是通过多个地理位置分散的服务器来分发内容，旨在提高网站的加载速度和可用性。

3.0

生产环境：< script src="https://unpkg.com/vue@next/dist/vue.global.prod.js">< /script>

开发环境：< script src="https://unpkg.com/vue@next">< /script>

2.0

生产环境：< script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js">< /script> 

开发环境：< script src="https://cdn.jsdelivr.net/npm/vue@2">< /script> 



#### 💭根据代码继续基本理解

这里是一些比较简单的，没有体系的，为了自我加深理解而提出的许多问题，并且进行了相应解答。



💭在这段代码中，第二个 `<script>` 标签**不需要**再次指定 Vue 的 `src`，它会自动使用第一个 `<script>` 标签中加载的 Vue 库。这是因为浏览器在加载外部 JavaScript 文件（如 Vue.js）后，已经将其添加到全局作用域中，后续的 `<script>` 标签可以直接使用这个库中的功能和语法。

![image 20240928205209588](https://s1.imagehub.cc/images/2024/11/25/801d9bb00318f0c0477eb65aefd562ba.png)



💭`#app` 是一个 DOM 元素的选择器，表示 Vue 实例将挂载到该元素上。

`message` 是 Vue 实例 `app` 中的一个数据属性，具体来说，它属于 `data` 对象。你可以通过 `app.message` 来访问和修改它。这种结构让 Vue 可以监测 `message` 的变化并自动更新界面。

**注意我们不再和 HTML 直接交互了。一个 Vue 应用会将其挂载到一个 DOM 元素上 (对于这个例子是 `#app`) 然后对其进行完全控制。那个 HTML 是我们的入口，但其余都会发生在新创建的 Vue 实例内部。**

Vue 实例通过 `el` 选项或者手动调用 `$mount` 方法，将它的模板渲染/挂载到指定的**父元素**中，这个元素也是我们实例的父元素。



💭vue实例和挂载元素的关系是什么?

这二者的关系是Vue框架渲染和管理页面的核心机制之一。

挂载元素是通过el选项指定，它是Vue实例渲染数据的目标DOM元素，Vue实例会接管整个DOM元素和所有它的子元素，将指定的模板渲染到这个元素上，并对其进行动态更新和数据绑定。这里的模板可以是HTML中的内容，也可以是template选项。

💭data还是很抽象，感到难以理解？

data是Vue实例中的选项，它用于定义与实例关联的数据。

data是一个对象，其中的每个属性都可以在模板使用

当你修改data中属性，vue会自动更新DOM。（数据响应式）



💭vue实例怎样去访问数组数据呢？

<img src="https://s1.imagehub.cc/images/2024/11/25/9a7938b238fcdb046c9172b8a7a6b5d9.png" alt="image 20241018161913360" style="zoom:80%;" /><img src="https://s1.imagehub.cc/images/2024/11/25/4ceb9ee2eb003d6d170d1805d5ad2484.png" alt="image 20241018161942321" style="zoom:80%;" /><img src="https://s1.imagehub.cc/images/2024/11/25/c567dbe21cde644fc7ef8ae9e87b79f0.png" alt="image 20241018162004113" style="zoom:80%;" />



💭**常见的挂载方式：**

Vue 默认通过 `id` 选择器（例如 `el: '#app'`）来挂载实例，但它不仅限于 `id` 选择器，你可以用多种方式将 Vue 实例挂载到 DOM 元素上。Vue 允许你使用以下方式挂载实例：

1. *使用 `el` 选项：*

可以通过 `el` 绑定任意有效的 CSS 选择器，而不仅仅是 `id`。例如：

- 使用 class 选择器：

  ```html
  <div class="my-app"></div>
  ```

  ```javascript
  new Vue({
    el: '.my-app', // 使用类选择器
    data: {
      message: 'Hello, Vue!'
    },
    template: '<h1>{{ message }}</h1>'
  });
  ```

- 使用元素选择器：

  ```html
  <section></section>
  ```

  ```javascript
  new Vue({
    el: 'section', // 使用元素选择器
    data: {
      message: 'Hello, Vue!'
    },
    template: '<h1>{{ message }}</h1>'
  });
  ```

2. *使用 `$mount()` 方法手动挂载：*

除了 `el`，你还可以使用 `$mount` 方法手动将 Vue 实例挂载到任何 DOM 元素上。

```html
<div class="my-container"></div>
```

```javascript
var vm = new Vue({
  data: {
    message: 'Hello, World!'
  },
  template: '<h1>{{ message }}</h1>'
});

vm.$mount('.my-container'); // 手动挂载到 class 为 .my-container 的元素上
```

3. *挂载到 DOM 元素对象：*

你可以直接将 Vue 实例挂载到实际的 DOM 元素对象，而不仅仅是通过选择器。

```html
<div id="app"></div>
```

```javascript
var vm = new Vue({
  data: {
    message: 'Mounted to a DOM element!'
  },
  template: '<h1>{{ message }}</h1>'
});

var domElement = document.getElementById('app');
vm.$mount(domElement); // 直接传递 DOM 元素对象
```

4. *在 DOM 加载之后动态挂载*

```javascript
var vm = new Vue({
  data: {
    message: 'Mounted dynamically!'
  },
  template: '<h1>{{ message }}</h1>'
});

// 动态挂载
document.addEventListener('DOMContentLoaded', function() {
  vm.$mount('#dynamic-app');
});
```

#### methods/computed

computed是计算属性，它在书写的时候也是个函数。 

不过在计算属性里写的函数你在调用的时候**不能加括号**。

<img src="https://s1.imagehub.cc/images/2024/11/25/4dca0ff5e09c3aa8549fbf640169fd03.png" alt="image 20241018171046892"  /><img src="https://s1.imagehub.cc/images/2024/11/25/8045b2ab195bb3f4610693b0fc560d7f.png" alt="image 20241018171443165" style="zoom:67%;" />

这里的output()是我们在methods定义的函数，outputContent()是我们在computed中定义的函数。

虽然这两个函数各自写了三遍，但是前者methods会执行三次，computed中的函数只执行了一次。这是由于在我们做第一次计算时，计算属性会将计算结果在内部做一个缓存；在第二次计算时，如果数据没有变化，就不再做计算，直接拿取之前的结果，有利于优化性能。

### 侦听器watch

监听某个(响应式)数据是否有变化。

创立之初是为了在数据变化时可以选择做更多的事情。  

  watch: { 

 // 监听 firstName 的变化    

firstName(newVal, oldVal) {

​	this.fullName = newVal + ' ' + this.lastName;    

}  

}

这里是watch侦听器提供给我们的两个参数：

**newValue**：数据变化后的新值。

**oldValue**：数据变化前的旧值。

---

我们在watch里常常会配合handler一起使用，一起看看吧

handler是Vue在watch配置中一个约定俗成的属性名，用来指定监听器的回调函数。

<img src="https://s1.imagehub.cc/images/2024/11/25/7b0cb9fd31d4227eb36804fc4fcea1f3.png" alt="image 20241108010005023" style="zoom:80%;" />

<img src="https://s1.imagehub.cc/images/2024/11/25/815cb894836cd554f93cb3df796c8012.png" alt="image 20241108010017576" style="zoom:80%;" />

<img src="https://s1.imagehub.cc/images/2024/11/25/c82bef18a8bb97f6a6ed45b6e27c5d39.png" alt="image 20241108010034006" style="zoom:80%;" />









## 👧🏽渲染指令

### v-text

![image 20241018172413663](https://s1.imagehub.cc/images/2024/11/25/42dc8492ee48dc7b7ae8a0cbfdcc1577.png)

v-text会覆盖一对标签 中间 所有内容，而{{}}只是基于模板插值。

> 比起之前更加简洁，适合直接输出文本的场景。
>
> v-text插入的是纯文本，不会解析html元素



### v-html

v-html用于将数据作为html代码插入到元素中，与v-text不同，它可以将绑定的数据解析为 HTML 片段，并动态地插入到 DOM 中。![image 20241018172901416](https://s1.imagehub.cc/images/2024/11/25/7c4933873700ea2fc8aec5aabb7036bf.png)

但与v-text类似的是，v-html会覆盖元素中已有的内容，将其替换为新的 HTML 片段。



### v-if/v-show

根据布尔值决定元素是否创建或销毁。

不想销毁可以使用v-show

条件渲染

<img src="https://s1.imagehub.cc/images/2024/11/25/eebfc32091e3f0c30be11fe5c2190f80.png" alt="image 20241008110759548" style="zoom:67%;" />

![image 20241008110859155](https://s1.imagehub.cc/images/2024/11/25/3dbeb9f2023b7c48b685cb6d6b8c3157.png)

true的时候控制台上是Vue is awesome!

false的时候输出Oh no

### v-for

列表渲染。当你需要根据数组或对象动态生成一组元素时可以使用v-for。

<img src="https://s1.imagehub.cc/images/2024/11/25/6336adaf0f27a98a5b17afd59b233d2b.png" alt="image 20241008112316122" style="zoom:80%;" />

![image 20241008112322922](https://s1.imagehub.cc/images/2024/11/25/14b4beaab4846caa10ad359e93e466f9.png)

```
<li v-for="item in items" :key="item.id">  

{{ item.text }} 

</li>
```

<h3>参数</h3>

**遍历数组时：**

arr:['a','b','c','d'];

```
<ul>
  <li v-for="(item, index) in items" :key="index">
    {{ index }} - {{ item }}
  </li>
</ul>
```

item是数组中当前元素。

index是当前元素的索引。



**遍历对象时**：

在这里item是我们起的别名。:key是一个特殊的属性，用来优化Vue的虚拟DOM diff算法。在渲染大量列表时，我们最好为key指定一个唯一的标识。

```
<li v-for="(value, key, index) in object" :key="index">

  {{ index }}. {{ key }}: {{ value }}
  
</li>
```

```
<li v-for="(item, key, index) in object" :key="index">

  {{ index }}. {{ key }}: {{ item }}
  
</li>
```



我们常常会写三个参数，至于这三个参数在对象中的关系，可以看看中间一行，已经告知key:value。index是索引。

> 我们也可以写两个参数，（key,value），依然表示key:value

## 👧🏽属性指令

属性指令指的是绑定指令

### v-bind

`v-bind` 是 Vue.js 中的一个指令，用于将一个数据属性绑定到一个 HTML 元素的属性上。通过使用 `v-bind`，你可以动态地更新元素的属性值，确保它们与 Vue 实例中的数据保持同步。![image 20241018175927544](https://s1.imagehub.cc/images/2024/11/25/54ec1cb08771971ca0d286099d466791.png)

简化

将 `v-bind:` 简化为 `:`

### 动态类名绑定

*简单说说，因为vue文档讲的更为具体 https://v2.cn.vuejs.org/v2/guide/class-and-style.html*

**对象语法**： 使用对象语法，你可以根据条件返回一个对象，其中键是类名，值是布尔值，表示是否应用该类。

```
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
```

在这个例子中：

- 如果 `isActive` 为 `true`，`active` 类会被添加。
- 如果 `hasError` 为 `true`，`text-danger` 类会被添加。



## 👧🏽事件指令

### v-on

![image 20241018180350371](https://s1.imagehub.cc/images/2024/11/25/e8dbef314b83be4d33d8ff684ad86db8.png)

这里我们监听click事件，一旦button按钮的click发生，我们就会触发greet事件



### v-model

v-model是负责专用于表单元素进行双向数据绑定，比如< input>、< textarea>、< select>。

> 之前我们都是单向绑定，是数据先更改，再更新到视图中。
>
> 但是v-model可以让我们视图更改的时候，将值更新到数据中。
>
> (数据到视图，视图到数据)



> `v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 `data` 选项中声明初始值。

<img src="https://s1.imagehub.cc/images/2024/11/25/deadba9bb0f430c0d5d0ce7d7138008b.png" alt="image 20241008213540716" style="zoom:80%;" />

当input输入框的值进行变化，data的message会进行变化。

而app.message进行改变时，也就是p里面{{message}}进行变化时，input输入框的值也会变化。

![image 20241008213436369](https://s1.imagehub.cc/images/2024/11/25/698977fde3872c10c2931fda7e09e4c3.png)



## 🐬Vue2.0 组件基础

### 简单终端指令

**vue项目创建**

**vue create 项目名称**

或）vue ui



<img src="https://s1.imagehub.cc/images/2024/11/26/df5d7f0045d374e04ab005aca1f8fb1c.png" alt="image 20241018202407033" style="zoom:80%;" />

在左边文件列的package.json中有scripts对象，这个对象里每一条都是指令，当你输入npm run serve或npm run build或npm run lint就会运行（你也可以自定义指令）

**npm run serve**打开本地静态资源服务器

**npm run build**打包生成dist

**serve dist**快速启动静态服务器运行dist



### 目录结构理解

my-vue-project/

├── node_modules/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.vue
│   ├── main.js
├── .gitignore
├── babel.config.js
├── package.json
├── README.md
└── yarn.lock / package-lock.json

>  node_modules：存放所有项目依赖包。所有通过npm或者yarn安装的依赖都会下载到这个文件夹中，这都是自动生成的，不需要修改。
>
> public：保存不参与编译的资源，即公共静态资源。比如网站的图标文件，index.html（这个页面是整个应用的入口，vue会将应用的内容动态插入到这个文件的根标签中）
>
> src：保存参与编译的资源。这里是项目的源代码目录，存放所有的vue组件即页面样式等。
>
> > assets：存放静态资源，图片字体等。这些资源会被webpack处理通过JS或者CSS引用。
> >
> > components:存放所有自定义Vue组件
> >
> > app.vue：项目根组件，通常作为整个应用的起始组件，Vue所有内容会从这里渲染。`App.vue` 文件使用了 Vue 的单文件组件（Single File Component，SFC）格式，里面包含了 `<template>`、`<script>` 和 `<style>` 部分。
> >
> > main.js：项目的入口文件。在这里初始化Vue实例，挂载到index.html的< div id="app">< /div>，再进行渲染。
> >
> > ```
> > import Vue from 'vue';
> > import App from './App.vue';
> > 
> > Vue.config.productionTip = false;
> > 
> > new Vue({
> >   render: h => h(App),
> > }).$mount('#app');
> > ```
>
> package.json：文件包含项目的配置信息、依赖包、脚本等。它是nodejs的核心配置文件。
>
> 主要包括：![image 20241018211645372](https://s1.imagehub.cc/images/2024/11/26/595b4fac27d013aed23488b88e8ef71b.png)
>
> 其他：<img src="https://s1.imagehub.cc/images/2024/11/26/878ac6e7e08dd695eb0112a076e94b80.png" alt="image 20241018211716173" style="zoom:77%;" />
>
> <img src="https://s1.imagehub.cc/images/2024/11/26/20e0428e84f3db4a72b32279cb49646a.png" alt="image 20241018211738878" style="zoom:77%;" />









### 组件通信

组件：封装页面部分功能的方式

这里的组件通信大类分为父传子和子传父，

> 同级的也可以传
>
> * 子传父，父传子，相当于用父做中转
> * 通过Eventbus来处理，用额外的vue实例做数据存储
> * 既不是父子关系，也不是同级关系时，中间有很多层，逐级传递很麻烦，建议使用vuex

#### 单文件组件结构

在vue中我们使用.vue为后缀的文件，称为单文件组件。

典型的单文件组件结构如下：（分别是结构，逻辑，样式）

* < template>：定义组件的HTML模板

* < script>：定义组件的逻辑、数据等。

* < style>：定义组件的样式。

#### 父传子

**写的比较简单，可以没事先看看吴悠怎么写的，等我做项目有了更深的体会再更新**

props：接受父组件给子组件设置的属性的方式

父组件：

<img src="https://s1.imagehub.cc/images/2024/11/26/29945baf360a7a9e81bff580d6b13e52.png" alt="image 20241018225112501" style="zoom:80%;" />

定义了这几个属性或者事件（第三个countChange是涉及到子传父）

子组件：<img src="https://s1.imagehub.cc/images/2024/11/26/075b9344809e1644570676fb61c2fc2e.png" alt="image 20241018225303337" style="zoom:80%;" />

子组件中在对象中书写了props属性，对于父传过来的msg属性我们用string属性接收，

对于count属性由于我们有更多的定义，所以写了个对象

​	这里面的type和default和都是vue规定的配置项，具体可以查props配置属性

​	这里的type是说我们可以接收多个种类的参数，无论是字符串或者数字都可以

​	default是说父组件如果对于count的值什么都没有定义，我们默认100



#### 子传父

$emit：子组件传给父组件的函数

<img src="https://s1.imagehub.cc/images/2024/11/26/c62dcf982326ca554d967443d827a97c.png" alt="image 20241018225825034" style="zoom:80%;" />

> 子组件也可以像这样直接在button上传递，第一个参数是让父组件接收的函数，第二个参数是父组件接收的参数
>
> ![image 20241112153246517](https://s1.imagehub.cc/images/2024/11/26/2d06eee447a359438392163c953bd06b.png)

在子组件中我们最上面定义了button，我们监听button的点击事件，触发handler函数，这个函数内我们会改变本组件data里的值，我们想要将改变后的值传递给父组件。

于是书写$emit方法，第一个参数负责在调用时触发事件（事件会在父组件那里接收），第二个参数作为传递的值传递给父组件。



下面是父组件，在父组件的hellotest元素模板内，我们监听事件countChang(这个事件是子组件的$emit传给我们时触发的事件)在父组件监听到后我们触发handler（这个handler与子组件的handler完全无关，只是名字一样）

在父组件本地的methods中的handler里我们接收到子组件传递的参数childCount，要注意这里childCount是可以直接使用值，不需要加this或者that，这里我们将childCount赋予我们本地定义的值，这个本地值是需要用this来进行访问，最后我们输出本地值。

![image 20241018230343845](https://s1.imagehub.cc/images/2024/11/26/1a1adefeda0f19eb20720cd897366d7f.png)

在这当中我们达到了效果，在子组件中点击按钮，触发事件，事件修改count值并且emit告诉父元素，父元素对该值进行处理。



### 组件插槽

<img src="https://s1.imagehub.cc/images/2024/11/26/a81ec3563d5aa9b90be837ffa55fefff.png" alt="image 20241019103840273" style="zoom:80%;" />

#### 默认插槽

在app.vue中我们又书写了几对标签，第一对由于有msg，所以与其他标签文本不同

最后一对标签没有书写文本

<img src="https://s1.imagehub.cc/images/2024/11/26/2d15addf85ced782d60a4917c4a79484.png" alt="image 20241019005527966" style="zoom:80%;" />

在子组件中，我们定义了slot标签，让父组件标签中的值都插到这里面

<img src="https://s1.imagehub.cc/images/2024/11/26/5467d8605c09d2d0eb2650c7740efd58.png" alt="image 20241019005716291" style="zoom:80%;" />

为了区分开，我给.hello加了margin-bottom:40px;

<img src="https://s1.imagehub.cc/images/2024/11/26/a0677dc5d9d25770f3e233278d88a7c9.png" alt="image 20241019005805883" style="zoom:80%;" />

重点理解渲染的顺序。

#### 具名插槽

这时我们给子组件又放了插槽

![image 20241019010308111](https://s1.imagehub.cc/images/2024/11/26/23f4a55331bf8d55640ca4d2ea100377.png)

不对父组件做任何修改，看看渲染结果。

<img src="https://s1.imagehub.cc/images/2024/11/26/e895936ddd38313bfd7edfb796c0fe92.png" alt="image 20241019010338019" style="zoom:80%;" />

如果希望在父组件中修改footer插槽的内容，我们在父组件中修改如下![image 20241019010615012](https://s1.imagehub.cc/images/2024/11/26/5168c7a26d88b7224f7c5ad28a5e461b.png)

也可以这么写

![image 20241019010823672](https://s1.imagehub.cc/images/2024/11/26/5e2f741a592bb4dada3989361d9174e2.png)

<img src="https://s1.imagehub.cc/images/2024/11/26/518765ab8ee62d340aa215eb00b9fd2d.png" alt="image 20241019010748871" style="zoom:80%;" />

#### 作用域插槽

这里比较容易搞混

在子组件的具名插槽中，我们传递了自己本地的值，

对于这个等式 :childPassed="childCount"，等式右边是子组件中的数据，通过data或者props来绑定。

前面的:childPassed是子组件自己的数据通过插槽传递给父组件，父组件可以在**对应的**插槽中通过属性访问这个值。（这里的childPassed是我们自己起的名字，父组件不需要用同样的名字来接收）

<img src="https://s1.imagehub.cc/images/2024/11/26/a6931904291aec90eb90ef84fd0c182c.png" alt="image 20241019104624230" style="zoom:80%;" />

在父组件相应的位置上，我们先通过具名插槽确定位置，然后选择用dataobj来接收，这个是我们父组件自己起的名字，之所以起这个，是因为子组件通过作用域插槽直接传递过来的是**对象**

![image 20241019105036148](https://s1.imagehub.cc/images/2024/11/26/904366aaaccc9384f1ffe19770b9761b.png)

![image 20241019105227931](https://s1.imagehub.cc/images/2024/11/26/19bb15d232f1325d4bb81fb12c15086a.png)

**可以看到直接输出是一个对象，而且输出的这个名字还是由我们子组件命名的，与父组件起的dataObj完全无关，看来数据完全是由子组件操控的**

---

如果你在app.vue中这样书写

![image 20241019105457295](https://s1.imagehub.cc/images/2024/11/26/4931b3488ec41f9250427ff9ac51e648.png)

即我们用.来访问对象成员

<img src="https://s1.imagehub.cc/images/2024/11/26/ef8bbfd79f8221fed8cea483aa33f452.png" alt="image 20241019105524408" style="zoom:80%;" />

会输出相应的对象成员值，但是如果你在父组件中输入dataObj.childCount可是一点用没有，记得输入childPassed。

> 其实本来子组件在插槽传值的时候写的也是:childCount="childCount"，我觉得分不清，这样区分一下。如果你熟练了，就完全可以这样写。

---

![image 20241019105832876](https://s1.imagehub.cc/images/2024/11/26/80740fc9fb6993e6ebdc0f856fa1b4fa.png)

在父组件中你还可以这样写，你直接使用插值表达式输出相关值，但由于是对象，千万记得在左边用{}来接收

如果你不写这个{}，来看看结果

```
<template #footer="childPassed">第一个footer{{ childPassed }}</template>
```

<img src="https://s1.imagehub.cc/images/2024/11/26/5ba2ce7b7681211e4ddba8f3b8191a5e.png" alt="image 20241019110015509" style="zoom:50%;" />

如果你正确的书写，应该得到这个

<img src="https://s1.imagehub.cc/images/2024/11/26/077270dd7e65decc9c104c5e8ba05d0a.png" alt="image 20241019110050561" style="zoom:60%;" />

## 🐬VueRouter

### 💭前置理解

**多页面应用(Multi-Page Application,MPA)：**是指在一个网站或者应用中，多个页面之间采用请求-响应机制进行应用。每次用户请求一个新页面时，服务器都会返回一个完整的html页面，浏览器会刷新整个页面显示新内容。

**单页面应用 (Single Page Application，SPA)：**是一种网络应用程序架构模式，主要特点是整个应用只有一个HTML页面，所有的内容和页面切换都是通过JS（Vue）动态完成（局部刷新），而不需要重新刷新整个页面进行跳转。

我们是通过前端路由(vue router或react router)来管理URL和页面的切换，虽然URL在变化，但实际上没有加载新页面，而是改变页面中的一部分内容。

> 单页面应用的原理：
>
> 当应用第一次加载时，客户端会获取整个应用所需的html,css,js文件，
>
> 然后通过JS(Vue)管理URL和组件的切换，利用前端路由库(Vue Router)进行导航。
>
> 在需要新数据时，应用会通过AJAX等请求数据，局部渲染页面。
>
> 单页面应用好处与坏处：（简单聊聊）
>
> 由于只需要加载一次HTML页面和资源文件，后续无需重复加载整个页面，切换内容时速度更快，体验更流畅。
>
> 但由于首次加载需要大量的js,css文件，初次加载时间较长。

**局部刷新与单页面应用的关系：**

局部刷新是指页面的一部分内容更新，而不需要加载整个页面。我们可以通以下实现：

<img src="https://s1.imagehub.cc/images/2024/11/26/59096f5fc0dad3c8646b10bfbd83b726.png" alt="image 20241019223309908" style="zoom:77%;" />

但是局部刷新不是只有单页面应用才能用，多页面应用也可以使用AJAX等技术实现局部刷新。所以局部刷新不是单页面应用的专属功能。

单页面应用通常会使用局部刷新，但是局部刷新不一定是单页面应用。

---

**Vue里的路由是什么意思？**

首先Vue使用Vue Router作为官方路由管理器，负责在单页面应用中管理不同页面的路径导航。

当用户在浏览器访问某个URL时，应用程序需要展示相应的页面或视图。通过Vue Router根据这个URL显示相应的组件，从而实现页面内容的切换。（将URL与组件关联起来，这个过程叫映射）

**路由** 是用来管理应用程序中不同页面之间导航的机制。

路由是指URL与视图的对应关系，路由用于将不同的URL映射到不同的组件上。

> ​    这里的映射不要与高中学的那个词搞混，这里简单理解为URL是个木偶操纵师，操纵着许多的木偶，这个木偶就是组件。
>
> ​    用户先找到URL，浏览器根据URL的木偶线找到相对应的组件，将组件根据相应路由规则进行加载渲染。

### 💭详解语句代码

**💭router-link:**它是a标签的增强版，用它跳转不会刷新整个页面。

这个标签组件用于在单页面应用中创建导航链接。

<img src="https://s1.imagehub.cc/images/2024/11/26/3be6132badeb6a1a26f1e71eb4b264ad.png" alt="image 20241019232924190" style="zoom:67%;" />

这里的to属性必填，指定要导航的路径或命名路由。

<img src="https://s1.imagehub.cc/images/2024/11/26/4a0fdd866772af81968d8bad41d7f5f1.png" alt="image 20241019233426173" style="zoom:87%;" />

当用户点击 `<router-link>` 时：

1. Vue Router 会拦截这个点击事件。
2. URL 会被更新（但页面不会刷新）。
3. 匹配到的视图组件会被渲染到`<router-view>`位置。

（上面的图片里有这个一行，可以找找看）



**💭views文件是什么？**

![image 20241019234347877](https://s1.imagehub.cc/images/2024/11/26/64a2441d056653d4adfdbcf0f296fdd6.png)

在views文件夹中，每个文件通常代表应用中一个独立页面，例如AboutView.vue是欢迎页面，HomeView.vue是首页页面。这些组件通常与特定的路由相绑定。

> 当用户导航到某个路径，Vue Router会根据路径加载对应views文件夹中的组件。

#### 重点理解

💭在我们的router中，有这样一个属性name，它与谁是相关的呢？

[![image 20241020125817783](https://s1.imagehub.cc/images/2024/11/26/a8b00abbbf94dd8dbcdd56d4461026f0.md.png)](https://www.imagehub.cc/image/image-20241020125817783.Cxs60a)

1.它与路径相关，当你想要修改或者维护这个路径，你直接搜索这个名字可以找到相关路径

2.它在app.vue中可以直接根据名字访问

在使用 `router-link` 组件时，你可以通过 `to` 属性的对象语法来使用命名路由进行导航，而不是直接使用路径：

```
<router-link :to="{ name: 'home' }">Go to Home</router-link>
```

这种方式比直接写路径（`/This_is_home`）更灵活，因为路径可能在将来发生变化，而名字通常保持不变。

### 新建组件配置路由

这是一个基础教学，但是万物都是从基础开始的。

达成效果：想要新建一个简单页面，在导航栏可以访问到。



1️⃣由于新建的页面很简单，不需要引入组件，所以直接在views文件里新建立一个vue

![image 20241020133349786](https://s1.imagehub.cc/images/2024/11/26/6e344695b8fa2b1b952f6ecc6223957f.png)

配置如下，而且为了这些样式 不应用到其他view的文件里去，需要在style标签内加入scoped

2️⃣在router文件夹内写，我模仿了about页面的引入，只写了这一行

![image 20241020134112086](https://s1.imagehub.cc/images/2024/11/26/b7cfdad9c6c1e6543dd6beb8f28b1df0.png)

3️⃣在app.vue里开始展示，这里用了name来识别路由

![image 20241020134151034](https://s1.imagehub.cc/images/2024/11/26/85475fd5bb6cfcbb6789051a77b6fe25.png)

### 动态路由

最终效果：

当我们在App.vue里输入不同的id值，可以让最上面路径的路由跟着改变

![image 20241020141758516](https://s1.imagehub.cc/images/2024/11/26/39329cb52434a3b781815798f70b0183.png)

至于最下面圈出来的28只是为了更好的展示，我们的目的是为了动态改变上面的路径。



步骤：

1️⃣由于在app.vue内更改id时，它会先访问router文件夹里面的js文件，所以我们先修改这个。

（这里我们使用了props，虽然一般使用props是涉及父子传值，但这里app.vue和router里的文件并不算是父子关系，app.vue是整个文件的根组件，router的文件只是app.vue配置路由的工具。

这里使用props的原因是为了**方便地将路由参数传递给组件**，这并不是为了父子组件关系挂钩，而是为了简化参数传递。如果不配置props，这些参数想要获取或者修改只能通过 `$route` 对象来访问。

而因为我们配置了props，所以我们可以直接传递参数，而无需要依赖 `$route` 对象）

<img src="https://s1.imagehub.cc/images/2024/11/26/0f947462aa8de2fb73645e77f0123aee.png" alt="image 20241020144146160" style="zoom:80%;" />

![image 20241020142030465](https://s1.imagehub.cc/images/2024/11/26/51f6478ebc8f4e54208e1ba9b666bb5f.png)

在这里我们在path后面加了冒号，是为了动态改变这个参数叫做"id"的值。

> 这里的动态参数我们需要好好讲讲。
>
> 我们的路由中想要使用动态参数，比如同一个路径内匹配不同的URL叫做**动态路由**。在动态路由中我们常常需要路径传递参数，比如bilibili不同的视频的URL会写BV124fsefiuqh。
>
> 这个**动态参数**是随着URL的变化而变化。
>
> 如果要在路由路径中标记动态的部分，需要使用冒号 `:`。当你一旦在路由中使用冒号:  ，Router会将后面的部分诗作动态参数，并将匹配到的值解析为参数。
>
> 如果你在其他地方想要获取这个动态参数，可以通过 `this.$route.params` 来访问，此时动态参数就是这个params对象的属性。
>
> <img src="https://s1.imagehub.cc/images/2024/11/26/4104984bc93839e53ffa87364caa8726.png" alt="image 20241020142820942" style="zoom:80%;" />
>
> <img src="https://s1.imagehub.cc/images/2024/11/27/996aee5d4a80295b392b5198fbade878.png" alt="image 20241020142847047" style="zoom:80%;" />

2️⃣如何自由的修改这个id呢？

这里我们使用了param来访问，记着param是个对象，后面还要加{}

![image 20241020143029666](https://s1.imagehub.cc/images/2024/11/26/4a8dcad20aca9fb3b0a60a16818b3d19.png)



3️⃣（可选）

如果你想要在当前页面展示动态路由变化的部分，可以在响应的视图界面进行展示。

![image 20241020143153060](https://s1.imagehub.cc/images/2024/11/26/bd9bf2c4eb7513b8bb396e4c9f5778ee.png)

### 嵌套路由

想实现效果：

![image 20241020163756784](https://s1.imagehub.cc/images/2024/11/26/7ff52f7f61949d6a006645d96c7b56d4.png)

在当前“bieguan”页面下，还想要增加两个页面，分别是点赞信息，互动信息。

当我们点击“点赞信息”，会出现该页面相关信息，而且在最上面的路径也会发生变化

![image 20241020163823489](https://s1.imagehub.cc/images/2024/11/26/2bcbd6e64aaf82bd9aa3f33bd1a84523.png)





想要增加子页面的顺序很多，但最好形成条理，不然容易漏掉。

1️⃣在views下新建页面

由于我们这里两个页面是子页面，而且格式相似，所以放在一个文件夹里。

<img src="https://s1.imagehub.cc/images/2024/11/26/2ec95be5cd170657bbcb7e420cd7b19f.png" alt="image 20241020162849549" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/26/9dfc0b1dfc875229c4d93a0b8915ccc0.png" alt="image 20241020164020802" style="zoom:80%;" />

2️⃣在router里做路由⭐

在router文件中，我们首先在最上面根据路径引入文件

由于我们的子文件想接着之前bieguan页面的路径，所以在该组件内我们加上**children:**相关属性，然后加上path(路径设置),name(router-link要用),component(要与上面import的组件名字一致)

![image 20241020164226265](https://s1.imagehub.cc/images/2024/11/26/98be646015d8dee67e0564a0a863ed5e.png)

这样子我们的路由就算配置完毕了。如果想要在页面展示，还需要继续写。

3️⃣在父组件中配置

这里我们并没有在根组件app.vue进行配置，是因为根组件直接引入我们的父组件即可，我们只需要在父组件中展示info1和info2

在父组件zhuzhuview中，我们用routerlink标签通过name引入相关组件，分别是info1，info2，并且传入参数方便这两个页面的路径书写

> 在routerlink标签中间我们写入点赞信息和互动信息，这是在我们zhuzhuview的视图中展示的，等你分别点进去才能看到info1和info2的视图。

在底部我们加上了router-view，别忘记

![image 20241020164820256](https://s1.imagehub.cc/images/2024/11/26/cd348bbda5db06186a82c15187d81033.png)

在app.vue中没有做任何改动

![image 20241020165912061](https://s1.imagehub.cc/images/2024/11/26/f51ff6f3ac123170701b01b55e7b8a45.png)

在输入 页面之前我想要id有默认值。

在点击之后会进行修改。



### 编程式导航

**编程式导航**是指在 Vue Router 中通过 JavaScript 代码实现页面导航，而不是依赖于模板中的 `<router-link>` 标签或用户的点击操作。这种方式允许开发者在特定条件下控制路由跳转，例如在表单验证通过后、API 调用成功后，或在处理用户事件时。



做一个小小的案例看看实现方式，我们的目的是想要在zhuzhuview里点击info1的点赞信息时，3s后跳转到主页home。

<img src="https://s1.imagehub.cc/images/2024/11/26/55dafacdce97250cd3625401040d660a.png" alt="image 20241020191022080" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/26/60a96d78c09616e27b1373166dfad840.png" alt="image 20241020191100583" style="zoom:80%;" />

在这里我们通过created钩子（data methods等信息已经初始化），但是页面没有渲染（我们这里也是希望点赞信息还没有渲染时加载函数）

这里我们插入了settimeout，指的是三秒后跳到主页。在这三秒内，页面先加载点赞信息界面，三秒后调到主页。

这里的this.$router指的是调用router实例，push是实例的方法。



**push:**

在 Vue 中，`this.$router.push()` 是 **Vue Router** 提供的一个方法，用于编程式导航。它的作用是**跳转到指定的路由**，与点击 `<router-link>` 的效果类似，但它是通过 JavaScript 代码来实现的。



### 路由传参与导航守卫

先来介绍路由传参，指的是通过路由传递参数，以便我们在跳转新的页面或者组件时将相关的信息带过去。



想要效果：

在点赞信息（info1）内点击后三秒，将信息传递给互动信息（info2）

<img src="https://s1.imagehub.cc/images/2024/11/26/5e04159a1b247b7131cbaf6fab027a51.png" alt="image 20241020195344064" style="zoom:67%;" />



![image 20241020195413786](https://s1.imagehub.cc/images/2024/11/26/4d5f2b2e1fafa3c3d8d0f6ced18e09f0.png)

在info1界面的created钩子里，push负责切换导航，query负责传递数据，这里我传的就叫“info1传递的数据”。





在info2的相应钩子内做接收

通过this.$route获取实例数据（this.$router更多是路由跳转相关，this.$route更多是获取路由数据相关）

![image 20241020195653493](https://s1.imagehub.cc/images/2024/11/26/8831763456c947e8078769c79559db1f.png)

#### 区分两种动态路由参数和查询传参

**路由传参** 是指通过路由来传递数据或参数，以便在跳转到某个页面或组件时，将相关的信息带到新的视图中。在 Vue Router 中，路由传参主要有两种方式：

动态路由参数（params）

查询参数（query）

这两种方式允许你在导航时附带额外的信息，从而在目标页面或组件中根据这些参数来做出不同的处理。



<h3>动态路由参数（params）</h3>

动态路由参数是将参数嵌入到 URL 路径中的一种方式。通常用来传递关键数据，如用户 ID、文章 ID 等。这种参数在路由的路径中通过 `:` 语法定义。

**定义动态路由**

例如，假设我们有一个用户详情页面，需要根据用户 ID 来展示不同用户的详情，我们可以定义一个包含动态参数的路由：

```javascript
const routes = [
  {
    path: '/user/:id',  // :id 表示这个部分是一个动态参数
    name: 'user',
    component: UserView
  }
];
```

在这个例子中，`:id` 就是一个动态参数，当你访问 `/user/1` 时，`id` 参数的值就是 `1`。

**编程式导航传递 `params`**

当你通过编程式导航（即 `this.$router.push()`）时，可以传递动态参数：

```javascript
this.$router.push({ name: 'user', params: { id: 42 } });
```

这个代码会导航到 `/user/42`，并将 `id` 的值设为 `42`。

**获取动态参数**

在目标组件中，你可以通过 `this.$route.params` 来访问传递的动态参数。例如：

```javascript
export default {
  created() {
    console.log(this.$route.params.id);  // 输出 42
  }
};
```



<h3>查询参数（query）</h3>

查询参数是通过 URL 中的问号 `?` 后面附加的键值对，类似于 URL 的查询字符串。查询参数通常用于搜索、筛选等需要携带较多信息的场景。

**定义普通路由**

查询参数不需要在路由定义中显式声明，你可以在任何路由中使用查询参数。

```javascript
const routes = [
  {
    path: '/search',
    name: 'search',
    component: SearchView
  }
];
```

**编程式导航传递 `query`**

当你想传递查询参数时，可以通过 `query` 属性来传递：

```javascript
this.$router.push({ path: '/search', query: { keyword: 'vue', page: 1 } });
```

这个代码会导航到 `/search?keyword=vue&page=1`，并传递 `keyword` 和 `page` 两个查询参数。

**获取查询参数**

在目标组件中，你可以通过 `this.$route.query` 来访问查询参数。例如：

```javascript
export default {
  created() {
    console.log(this.$route.query.keyword);  // 输出 'vue'
    console.log(this.$route.query.page);  // 输出 1
  }
};
```

**动态参数与查询参数的区别**

| 特性         | 动态参数（params）              | 查询参数（query）              |
| ------------ | ------------------------------- | ------------------------------ |
| URL 形式     | `/user/42`                      | `/search?keyword=vue&page=1`   |
| 定义方式     | 在路由路径中用 `:param` 定义    | 不需要在路由路径中定义         |
| 传递方式     | `this.$router.push({ params })` | `this.$router.push({ query })` |
| 获取方式     | `this.$route.params`            | `this.$route.query`            |
| 典型应用场景 | 用户详情页、文章详情页等        | 搜索、分页、筛选等             |

<h3>总结</h3>

- **动态路由参数** 将参数嵌入在路径中，通常用于资源的唯一标识，如 `/user/1`。
- **查询参数** 通过 URL 后的查询字符串传递，适用于搜索、分页等可选参数的场景，如 `/search?keyword=vue&page=1`。

两者各有应用场景，选择哪种传参方式取决于你要实现的功能。



#### 导航守卫

即在导航触发之前都会进行导航守卫的触发

这个next()必须加，不然页面不渲染

![image 20241020201011263](https://s1.imagehub.cc/images/2024/11/26/be9266818271fc722dddac9c11f745a5.png)

这里语句块内语句后面没加符号;或者逗号  是JS语法

在{}内可以不加 因为可以通过换行符和}识别结束

但最好加上



## 🐬Vuex

全局状态存储工具。

### 基本用法

vuex我是在创建项目的直接选择已创建的，

创建好后在项目里就是这个样子

![image 20241101121953095](https://s1.imagehub.cc/images/2024/11/27/a561f7d2a11275aed360979c04bb811f.png)



### state

这里采用函数写法，把state:{}改成了state(){return{}}

**定义：**

state的作用我们在图片里写了，并且还定义了一个变量

![image 20241101122216558](https://s1.imagehub.cc/images/2024/11/27/71f473131068a8d49fee52a74ae366cb.png)

**使用：**

![image 20241101122339790](https://s1.imagehub.cc/images/2024/11/27/f187459f9255a3c52c4eff3cd45fc91f.png)

在上图中，我们在其中一个视图页面中，在两个生命周期内都使用了state中的变量<img src="https://s1.imagehub.cc/images/2024/11/27/4054827108886aa700922033bfd03c11.png" alt="image 20241101122850969" style="zoom:67%;" />

使用的时候我们首先用的this.$store访问实例，其次要访问state，再访问变量本身

> 在使用vuex时，访问state中的数据都需要加上前缀state.名字

**展示：**

![image 20241101123043320](https://s1.imagehub.cc/images/2024/11/27/779ef33cb1e68ead847d9b5f6afaad95.png)





### mutations

我们在修改状态，比如state当中的值时，假如你一会儿在A页面修改，一会儿在B页面修改，等将来你想要维护这个值时你都不知道自己在哪里修改。

所以我们这里在mutations当中修改

**定义：**

![image 20241101125215763](https://s1.imagehub.cc/images/2024/11/27/a15b0524ac03054b261502765e5c4aa0.png)

**使用：**

![image 20241101125328666](https://s1.imagehub.cc/images/2024/11/27/72a70f45bbbad6375231c2a3f59aa5ba.png)

**`this.$store.commit`**：这是 Vuex 提供的方法，用于触发一个 mutation。它的第一个参数是 mutation 的名称，第二个参数是你想传递给 mutation 的数据（载荷）。



### actions

actions是做异步包装的，但是你要清楚它只是做异步的。之前我们说过mutations可以用来修改state中的变量状态，如果你现在也想去修改状态，同步的就在mutations修改，异步的也不是在actions中修改，而是利用异步操作去回调mutation里面的东西。

> `actions` 可以包含任意异步操作（例如 API 请求、定时器等），并且不能直接更改状态；它们的职责是处理业务逻辑，然后调用 mutations 来实际修改状态。
>
> `actions` 允许你将业务逻辑与状态更新分离，从而使代码更清晰。

**定义：**

![image 20241101130624859](https://s1.imagehub.cc/images/2024/11/27/5050defb9049742137fd269bb594c20f.png)

> 可以看到我们在上面的delayChangeCount函数体中，并没有对state.count进行直接修改，而是使用commit去调用mutation，利用mutation进行state.count的修改。我们的actions只是做了异步的处理，我们加上的是setTimeout( )。

**使用：**

![image 20241101130905370](https://s1.imagehub.cc/images/2024/11/27/51b730028ace8e3a77b991009909525e.png)

在我们调用actions当中的函数使用的是dispatch。英文翻译是派遣。可能意思是先派遣它去执行，结果等会儿才返回。

**举例：（更复杂的actions使用）**

```JS
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment'); // 在异步操作完成后提交 mutation
      }, 1000);
    },
    decrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit('decrement'); // 使用 payload 可以传递参数
      }, payload.delay);
    },
  },
});

```

```js
methods: {
  increment() {
    this.$store.dispatch('incrementAsync'); // 调用 actions，异步增加 count
  },
  decrement() {
    this.$store.dispatch('decrementAsync', { delay: 500 }); // 调用 actions，异步减少 count，带有参数
  },
},
```



### getters

`getters` 类似于 Vue 的计算属性，它们**基于 state 进行计算**，并在相关状态改变时自动更新。

**定义：**

![image 20241101131950784](https://s1.imagehub.cc/images/2024/11/26/a3eaaeabd3f2a38ed629c6675b3336f3.png)

**使用：**

![image 20241101132057333](https://s1.imagehub.cc/images/2024/11/26/4f733a715318c5362abc8f01df0badb8.png)



**特性：**

getters具有**缓存性**

![image 20241101132345397](https://s1.imagehub.cc/images/2024/11/26/c612a08f7151dc7856c69982404419b3.png)

![image 20241101132419408](https://s1.imagehub.cc/images/2024/11/26/fa379320f6c4179ff0154af4a04ace43.png)

可以看到console.log('store当中的getters执行了');只执行了一遍



### modules

需要先介绍使用场景，可以看到在上面的store当中的state、getters、mutations等等当中我们定义了许多东西，但假如这些数据都是针对用户的。

如果我们需要再定义一些新的state、getters、mutations等等是针对产品的，那就需要一定的分类功能。

把一些数据交给功能A（用户），把另一些数据交给功能B（产品）

> modules将 store 划分为多个模块，使得代码更易于管理和理解。每个模块可以专注于特定的功能或部分状态。
>
> 模块可以独立开发、测试和重用，便于团队协作。



**命名空间**

默认情况下，所有模块的 state、mutations、actions 和 getters 都是全局的。为了避免命名冲突，Vuex 允许你使用命名空间。

在模块中启用命名空间的方法是在模块的定义中添加 `namespaced: true`：

```JS
const userModule = {
  namespaced: true, // 启用命名空间
  state: {
    userInfo: null,
  },
  mutations: {
    setUser(state, user) {
      state.userInfo = user;
    },
  },
  // ... actions 和 getters
};
```

启用命名空间后，你在访问模块的状态、方法时，需要加上模块的名称，例如 `user/setUser`、`user/fetchUser` 等。

**或按以下书写**



**Modules 的基本结构**

下面是一个使用 Vuex modules 的示例：

```js
//文件路径： store/modules/user.js(这是专门在modules文件夹下创建user.js文件，如果你的内容少，你也可以直接在store的index.js当中书写)

const Module1 = {
  state: {
    userInfo: null,
  },
  mutations: {
    setUser(state, user) {
      state.userInfo = user;
    },
  },
  actions: {
    fetchUser({ commit }) {
      // 模拟异步获取用户信息
      setTimeout(() => {
        const user = { name: 'Alice', age: 25 };
        commit('setUser', user);
      }, 1000);
    },
  },
  getters: {
    userName(state) {
      return state.userInfo ? state.userInfo.name : 'Guest';
    },
  },
};


const Module2 = {
  state: {
    products: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    fetchProducts({ commit }) {
      // 模拟异步获取产品信息
      setTimeout(() => {
        const products = [
          { id: 1, name: 'Product A', price: 100 },
          { id: 2, name: 'Product B', price: 200 },
        ];
        commit('setProducts', products);
      }, 1000);
    },
  },
  getters: {
    productCount(state) {
      return state.products.length;
    },
  },
};

// 创建 Vuex store
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: Module1,
    products: Module2,
  },
});

export default store;
```

**访问 Modules**

在 Vue 组件中，你可以通过 `mapState`、`mapGetters`、`mapActions` 和 `mapMutations` 访问模块中的状态和方法：

*访问 state 和 getters：*

```vue
<template>
  <div>
    <h1>User: {{ userName }}</h1>
    <h2>Total Products: {{ productCount }}</h2>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['userInfo']), // 访问 user 模块的 state
    ...mapGetters('products', ['productCount']), // 访问 products 模块的 getter
    userName() {
      return this.$store.getters['user/userName']; // 访问 user 模块的 getter
    },
  },
};
</script>
```

*访问 actions 和 mutations：*

```vue
<template>
  <button @click="fetchUser">Fetch User</button>
  <button @click="fetchProducts">Fetch Products</button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('user', ['fetchUser']), // 访问 user 模块的 action
    ...mapActions('products', ['fetchProducts']), // 访问 products 模块的 action
  },
};
</script>
```



小结

- Vuex 的 `modules` 允许你将 store 分割成多个模块，提高代码的可维护性和可读性。
- 每个模块可以有自己的 state、mutations、actions 和 getters，并且可以通过命名空间来避免命名冲突。
- 使用模块化的 Vuex store 有助于组织大型应用程序的状态管理。



### 小应用（涉及map知识点）

（如果有不懂的地方，我都在代码下方进行解释）

这里用一个小小的计数器简单的回顾vuex的用法

在我们的组件展示页面，

```VUE
<template>
    <div>
      <button @click="add">点击我+1</button>
      <span>仓库的数据{{ count }}</span>	//count是来自vuex中的state
      <button @click="sub">点击我-1</button>
     </div>
</template>

<script>
    import {mapState}from 'vuex'
    
    export default{
        computed:{
            ...mapState(['count'])
        },
        methods:{
            add(){
        		this.$store.dispatch('add');//在这里我们的点击事件是异步的，但是点击后触发的//事件是同步的，所以总体来说不算异步。但是为了应对更复杂的逻辑还是采用了actions异步的写法
          	},
      		sub(){
        		this.$store.dispatch('sub');
     		}
        }
    }
</script>
```

> 在这里我们使用了map辅助函数，它是帮助我们在vuex当中取值的。在本typora文档前面vuex的教学中都没有使用map，那我们是怎么取值的呢？
>
> this.$store.dispatch，或者this.$store.state.loginStatus
>
> 这样子你取一个两个还好，取的多了很麻烦
>
> vuex提供了map辅助函数，包含(`mapState`、`mapGetters`、`mapActions` 和 `mapMutations`) 
>
> 关于map怎么具体引入我在本章节最后的map小分节进行介绍
>
> > 如果你要取state当中的数据，可以在该组件中提前加载mapState，如果你要取getters当中的数据，可以提前加载mapGetters。
> >
> > 引入好的数据我们需要在computed当中进行接收。（在 `computed` 计算属性中使用这些映射使得组件对 Vuex store 中的状态保持响应式，确保了数据更新的自动性和一致性，从而提高了用户体验）
> >
> > 但如果你只引入mapState和mapGetter，却想要使用actions当中的数据，那你可就要使用this.$store.dispatch
>
> 对于引入好的数据，你可以在模板中使用插值表达式进行使用
>
> <img src="https://s1.imagehub.cc/images/2024/11/26/49fcc90a1111b8705e4f19f7615ac779.png" alt="image 20241102190430208" style="zoom:77%;" />
>
> 也可以作为事件进行绑定
>
> <img src="https://s1.imagehub.cc/images/2024/11/26/bf29046a0ec098ca06aaa2dc8ab1fae9.png" alt="image 20241102190543765" style="zoom:80%;" />

在store文件夹的index.js中

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		count:10
	},
    getters:{},
    mutations:{
        ADD(state){
            state.count++;
        },
        SUB(state){
            state.count--;
        }
        
    },
    actions:{
        add(context){
            const commit=context.commit;
            commit('ADD');
        },
        sub({commit}){
            commit('SUB');
        }
    },
    modules:{}
})
```

> 在这里actions当中的可以看到有个参数叫做context，这是vuex赋予actions的官方参数，这个参数（context）包含了与当前模块或者全局状态 相关的所有方法、属性，它还具有操作vuex状态，提交mutation等功能。
>
> <img src="https://s1.imagehub.cc/images/2024/11/27/c788ee75755f7f64446169054f803618.png" alt="image 20241102184751408" style="zoom:80%;" />
>
> 但是你可以看到我们的add和sub的写法并不一样，这里用了解构赋值。由于context包含了很多东西，我们用{}取走其中的commit方法，直接使用。

#### map

map可以进行一次性引入，

![image 20241102190924335](https://s1.imagehub.cc/images/2024/11/26/b7b8750089efba28e75eaa0eda0f9803.png)

> 为什么有的放到computed中，有的放到methods中，
>
> 这是因为mapState和mapGetters是响应式更新的，放在computed计算属性中，vue会在组件更新时及时计算属性。状态变化时组件会自动响应式更新。
>
> mapActions和mapMutations是为了响应用户的交互，放在methods中符合逻辑。

这里的`...`是解构赋值的展开运算符，可以将对象的属性展开放到目标对象中
