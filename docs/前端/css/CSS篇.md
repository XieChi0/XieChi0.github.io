

## 前言

整个CSS文章整体架构是基于MDN的学习笔记，补充了一些在b站看到的更为细节的知识笔记。

**初学者建议：**

MDN的CSS的文章标题起的是很好的，但实际学起来是有点乱的。实际上在我看来它分为入门篇和应用篇。

入门篇：https://developer.mozilla.org/zh-CN/docs/Learn

应用篇（除了入门篇就是应用篇）：https://developer.mozilla.org/zh-CN/docs/Web/CSS

在案例上面，MDN里的好处在于案例较多，且较为实际，缺点在于案例太多，每个都做也不见得就会掌握的多牢固，挑一些自己实在不熟的做做即可。

在语言叙述上面，MDN有的方面很简洁生动，有的地方过于死板，毕竟是英译中，所以看不懂的去别的网站或者找个视频几分钟就看懂了。

## 杂

* CSS 语言有一些规则来控制在发生冲突的情况下哪个选择器更强大。这些规则被称为**层叠**（cascade）和**优先级**（specificity）。

  后面的样式会替换样式表中较早出现的冲突样式。这就是**层叠**规则。

  一个类选择器被认为是比元素选择器更具体的，因此它比元素选择器**优先级**更高。

* 虽然CSS和HTML都支持注释，但它们的注释语法和用法有一些不同。

  <h4>HTML注释：</h4>
  
  HTML注释使用以下语法：
  ```html
  <!-- 这是HTML的注释 -->
  ```
  - HTML注释以 `<!--` 开始，以 `-->` 结束。
  - HTML注释可以跨行，但不能嵌套。
  
  <h4>CSS注释：</h4>
  
  CSS注释使用以下语法：
  ```css
  /* 这是CSS的注释 */
  ```
  - CSS注释以 `/*` 开始，以 `*/` 结束。
  - CSS注释可以跨行，也可以嵌套。
  
  <h4>JS注释</h4>
  
  ```JS
  //这是JS的注释
  ```
  
  


* CSS运行是怎样运行的呢？

  虽然每个浏览器步骤有些许不一样，不过大体都是这样的，请看。

  首先加载HTML文档，然后将HTML转化成DOM树。然后拉取HTML的相关资源，比如图片视频CSS。将这些资源解析后应用到DOM树上面相关的节点，称为渲染树。然后渲染树依照应该出现的结构进行布局，最后网页展示在屏幕上，称为着色。
  
  > JavaScript脚本的加载和执行通常会在页面的渲染过程中进行，但具体是在渲染之前还是之后取决于脚本的位置和加载方式。
  >
  > 一般情况下：
  >
  > 1. **阻塞加载（Blocking Script Loading）：** 如果脚本位于 `<head>` 标签内，或者在页面内容中出现在渲染开始之前，浏览器会首先加载和执行这些脚本。这可能会导致页面的渲染被延迟，直到所有相关的脚本都被下载和执行完毕。
  > 2. **异步加载（Asynchronous Script Loading）：** 如果脚本使用了 `async` 属性（例如 `<script async src="script.js"></script>`），浏览器会异步加载该脚本，并在加载完成后立即执行，而不会阻塞页面的渲染。异步加载的脚本执行时机通常是在它被下载完毕之后，但不一定是页面渲染完毕之前。
  > 3. **延迟加载（Deferred Script Loading）：** 如果脚本使用了 `defer` 属性（例如 `<script defer src="script.js"></script>`），浏览器会异步加载该脚本，但会等到页面解析完毕（DOMContentLoaded 事件触发之前）再执行。这使得脚本能在文档解析完成后执行，但仍旧是在渲染之前。
  >
  > 综上所述，JavaScript脚本的加载和执行过程与页面的渲染密切相关，但具体的执行时机受脚本标签位置、加载属性（async 或 defer）以及脚本内容的复杂性影响。

<h4>属性和值</h4>

color:blue;

color是属性，blue是值。当一个属性和值配对的时候，这种配对称为<u>CSS声明</u>。多个声明组合在一起称为CSS声明块。

声明块与选择器配对，叫做CSS规则集。



<h4>vendor prefix</h4>

这个叫做供应商前缀。指的是有的浏览器会有一些新的属性在试用，你可以选择试用，但是万一试用影响自己本来有的属性怎么办呢？

```
 -webkit-filter: drop-shadow(5px 5px 1px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(5px 5px 1px rgba(0, 0, 0, 0.7));
```

比如在这里，-webkit-就是Chrome,Safari,Opera的前缀，我们现在有两行代码，这两行效果其实一模一样，指的是第一行代码如果不影响第二行，那我们就用第一行而不需要用第二行。如果第一行代码会影响第二行的效果，系统会选择第二条。

---



## 选择器

选择器所选择的元素，叫做“选择器的对象”。

如果想要用一行代码选择多个元素，让它们都应用相同样式，那么这些单独的选择器可以被混编为一个**“选择器列表”**，这样，规则就可以应用到所有的单个选择器上了。

我们将这些选择器使用逗号进行分隔，

```
h1, .special {
  color: blue;
}
```

> 注意要有逗号
>
> 注意空格有没有都可以，而且空格加在逗号前或后都可以。



### 类型、类和ID选择器

<h4>类型选择器</h4>

需要知道的是，类型选择器对大小写不敏感，哪怕你写成了这样SPan{}也可以识别到。

**类型选择器**有时也叫做*标签名选择器*或者*元素选择器*，因为它在文档中选择了一个 HTML 标签/元素。

​	

<h4>全局选择器（*）</h4>

全局选择器，是由一个星号（`*`）代指的，它选中了文档中的所有内容（或者是父元素中的所有内容）。

> 除了我们熟知的用途，即真正意义的选中全局。还可以有其他用途。
>
> 比如article:first-child{}是指选中article作为first-child的项
>
> article :first-child{}，这当中加了个空格，意思可是完全不一样了，代表的是article的第一个孩子
>
> 但是空格在观看上差别很细微，所以我们一般不像上面那样表达，而是使用article*:first-child{}
>
> 表示的是这里的全局是article，在这个全局里寻找fisrt child，那自然就是article的first child。



<h4>类选择器</h4>

CSS选择器对于html的class类这样表示：

.highlight {
  background-color: yellow;
}



但是假如有两个元素都有一样的类，一个是< span class="highlight">< /span>，一个是< h1 class="highlight">< /h1>。

我们只想选中前者怎么办？

可以这样表示

span.highlight{ }



如果说有一个元素同时具有三个类（< h1 class="a b c">），你想选中同时具有这三个类的元素，

可以这样表示

.a.b.c{ }

*请注意上面的几个类之间没有空格，没有逗号。*



如果是.a , .b{  }

两个选择器之间用逗号表示，就代表这两个选择器是并列的，有a或者有b的都能被选中

但是.a.b{ }就是得同时具有这两个类才行。



<h4>ID选择器</h4>

一篇文档中，一个ID只能用一次。

```
<p id="one">Gumbo beet greens corn</p>
<h1 id="heading">ID selector</h1>
```

#one {
  background-color: yellow;
}

h1#heading {
  color: rebeccapurple;
}



### 属性选择器



<h4>存否和值选择器</h4>

这些选择器允许按照属性值  或者  元素是否存在相匹配

| 选择器            | 示例                            | 描述                                                         |
| :---------------- | :------------------------------ | :----------------------------------------------------------- |
| `[attr]`          | `a[title]`                      | 匹配带有一个名为*attr*的属性的元素——方括号里的值。           |
| `[attr="value"]`  | `a[href="https://example.com"]` | 匹配带有一个名为*attr*的属性的元素，其值正为*value*——引号中的字符串。 |
| `[attr~="value"]` | `p[class~="special"]`           | 匹配带有一个名为*attr*的属性的元素，其值正为*value*，或者其属性有多个值**，至少有一个值和*value*匹配**。注意，在一列中的好几个值，是用空格隔开的。 |
| `[attr|="value"]` | `div[lang|="zh"]`               | 匹配带有一个名为*attr*的属性的元素，其值可正为*value*，或者开始为*value*，后面紧随着一个连字符。 |

<h4>子字符串匹配选择器</h4>

这些选择器让更高级的属性的值的子字符串的匹配变得可行。例如，如果你有两个元素，class分别是`box-warning`和`box-error`，想把开头为“box-”字符串的每个元素都匹配上的话，你可以用`[class^="box-"]`来把它们两个都选中。

| 选择器          | 示例                | 描述                                                         |
| :-------------- | :------------------ | :----------------------------------------------------------- |
| `[attr^=value]` | `li[class^="box-"]` | 匹配带有一个名为*attr*的属性的元素，其值开头为*value*子字符串。 |
| `[attr$=value]` | `li[class$="-box"]` | 匹配带有一个名为*attr*的属性的元素，其值结尾为*value*子字符串 |
| `[attr*=value]` | `li[class*="box"]`  | 匹配带有一个名为*attr*的属性的元素，其值的字符串中的任何地方，至少出现了一次*value*子字符串。 |


<h4>大小写敏感</h4>

如果你想在大小写不敏感的情况下，匹配属性值的话，你可以在闭合括号之前，使用`i`值。

li[class^="a" i] {
  color: red;
}



### 伪类和伪元素

<h4>区别</h4>

* < a class="">在这个标签中，必然是先产生元素，后产生类。可以说，类是基于元素产生的。放到伪类伪元素同样如此，伪类是基于伪元素产生的。

  **伪类是基于DOM产生不同的状态，并不产生新对象。伪元素则是创建不存在DOM里的新对象，并且对新对象进行操作。**

  > 伪类其实也可以为 伪状态，这里的伪可以理解成伪装，此时它伪装成了这个状态，但它不一定一直是这个状态

* 首先伪类是长这样：   伪元素长这样::

  不过以前CSS2不论伪类还是伪元素都只用一个冒号表示，所以有的程序为了兼容老款程序，也只用一个冒号表示。

* 一个选择符可以有多个伪类，但只能用一个伪元素。

  比如input:out-of-range:focus可行，但是input::before::after不可行

* 伪类可以出现在选择符的前方或者后方，但是伪元素只能出现在选择符的最后方。

  > https://www.bilibili.com/video/BV1h7411P7Pz/?spm_id_from=333.999.0.0&vd_source=5437c606fea007bf0f9d56d7836dd0ea
  >
  > 将伪类类比为太监，将伪元素类比为皇帝。



<h4>伪类</h4>

伪类：选择处于特定状态的元素。

伪类就是开头为单冒号`:`的关键字。

- `:last-child`
- `:only-child`
- `:invalid`

一些伪类只会在用户以某种方式和文档交互的时候应用。这些**用户行为伪类**，有时叫做**动态伪类**，表现得就像是一个类在用户和元素交互的时候加到了元素上一样。

- [`:link`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link)—— 匹配未曾访问的链接。
- [`:visited`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited)——匹配已访问链接。
- [`:hover`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover)——只有用户将指针挪到元素上的时候才会激活。
- [`:active`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active)——在用户激活（例如点击）元素的时候匹配。
- [`:focus`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus)——只会在用户使用键盘控制，选定元素的时候激活。
- [`:checked`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:checked)—— 匹配处于选中状态的单选或者复选框。
- [`:enabled`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:enabled)——匹配有disabled属性且可用的表单元素。
- [`:disabled`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:disabled)——匹配有disabled属性且不可用的表单元素。

> 结构伪类（以p元素被选中举例）
>
> * [`:first-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-child)——匹配p作为第一个孩子的项目。
> * [`:last-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-child)——匹配p作为最后一个孩子的项目。
> * [`:nth-child`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)(n)——匹配p作为第n个孩子的项目。
> * [`:first-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:first-of-type)——匹配p作为同类型的第一个项目。
> * [`:last-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:last-of-type)——匹配p作为同类型的最后一个项目。
> * [`:nth-of-type`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-of-type)(n)——匹配p作为同类型的第n个项目。





<h4>伪元素</h4>

伪元素以类似方式表现，不过表现得是像你往标记文本中加入全新的 HTML 元素一样，伪元素开头为双冒号`::`。

> 还可以把伪类和伪元素结合起来

<h5>::before ::after</h5>

有一组特别的伪元素，它们和[`content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content)属性一同使用，使用 CSS 将内容插入到你的文档中。

这些伪元素经常用于插入空字符串，其后可以像页面上的其他元素被样式化。

* [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before)——配合content属性使用，使用CSS将内容放置到现有元素内容之前
* [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after)——配合content属性使用，使用CSS将内容放置到现有元素之后
* [`::first-letter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter)——匹配元素的第一个字母
* [`::first-line`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line)——匹配元素的第一行
* [`::selection`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::selection)——匹配文档中被选择的那部分。





### 关系选择器

<h4>后代选择器</h4>

用空格组合哦，选择body当中的article当中的p元素

body article p{   }



<h4>子代选择器</h4>

选择直接子元素，指的是第一级子元素，而不是第一个子元素

article > p{   }



<h4>邻接兄弟选择器</h4>

一个是要相邻，一个是得是兄弟（在继承关系上同级）

p + img{    }

**注意你选的是img，而不是p**

​	

<h4>通用兄弟选择器</h4>

指的是你想选择兄弟，但是不相邻的元素。

p ~ img{   }



## 层叠、优先级与继承

属性值计算过程：

1. 确定声明值
2. 层叠 （多个样式应用到了一个元素上，发生了重叠）
3. 继承
4. 使用默认值



> **第一步确定声明值**，
>
> 在这一步中电脑会观察两个样式表，
>
> 作者样式表、浏览器默认样式表。
>
> 前者是程序员亲自书写的样式表，后者是浏览器默认样式user agent stylesheet(用户代理样式表)
>
> ![image 20241029184649027](https://s1.imagehub.cc/images/2024/11/26/996754a23af186f0abdb1e275aa81430.png)



> **第二步层叠：**
>
> 这里圈出来的都是层叠，因为它们具有**冲突**。
>
> ![image 20241029184700436](https://s1.imagehub.cc/images/2024/11/26/45b4a5d7d4872a9e5e3f8a49688ffd74.png)
>
> ![image 20241029184706532](https://s1.imagehub.cc/images/2024/11/26/d72db74ae497afc046635f33377b3765.png)
>
> 在这里排除掉font-size2em大小
>
> ![image 20241029184712021](https://s1.imagehub.cc/images/2024/11/26/5e0ddc45e9c1145670b4ed3aceda5e4e.png)
>
> 通过第二法则去计算作者样式表的四条样式
>
> 分别是0 0 1 0 、 0 0 0 1 、 0 0 1 2 、 0 0 1 2
>
> 所以留下最后两条样式
>
> ![image 20241029184718833](https://s1.imagehub.cc/images/2024/11/26/622a144c17dbc21f2458b6fd79420fbc.png)
>
> 所以留下最后一条



> **第三步继承：**
>
> 到目前为止还有很多属性没有没有确定值，
>
> ![image 20241029164117740](https://s1.imagehub.cc/images/2024/11/26/31b5ee86e1df79700681d28957030a5d.png)
>
> 文字相关的属性一般可以被继承，比如行高，字体大小，字体类型，字体颜色。非文字相关的比如宽高，内外边距、位置不能被继承。（若属性可以继承，我们开始继承）
>
> 具体的查阅MDN。



> **第四步使用默认值：**
>
> 对仍然没有值的属性使用默认值。



注意：

我们常常会给一个选择器里的语句加上inherits

比如color:inherits

这指的是与父元素用一样的元素。但并不是因为继承（第三步）。而是第一步我们设置的作者样式表，所以在这一步往往就结束了，不需要再到第三步去确认。

## initial、unset、revert

当你给属性设置initial，比如line-height:initial，表示把属性设置为默认值。

这样子在CSS的属性值前两步就已经确定好了它的值，不需要到第四步再去使用默认值什么的了。很方便。



unset的效果是清除已有样式。

<img src="https://s1.imagehub.cc/images/2024/11/26/570030b4ed86b20bb6724ddb35ae32fb.png" alt="image 20241029172122060" style="zoom:67%;" />

对于前两个步骤设置的样式自动取消掉，直接从第三四步开始，该继承继承，该使用默认使用默认。

可以使用`all:unset`直接进行所有选择器内的样式清除





revert指的是恢复，当你想将浏览器样式恢复默认样式的时候使用revert

可以使用`all:revert`直接进行所有选择器内的样式恢复







## 盒子显示类型🕊️

在CSS中，元素有两种重要的显示类型：外部显示类型（外部盒子类型）和内部显示类型（内部盒子类型），它们指的是元素在布局时的表现方式和计算方式。

1. **外部显示类型（Outer Display Type）**：
   
   - **Block-level**（块级元素）：元素会生成一个块级框，**占据一整行的空间**，不会与其他元素共享水平空间。
   - **Inline-level**（行内元素）：元素会生成一个行内框，它会尽量与其他行内元素在同一行内显示，可以和其他行内元素共享水平空间。
   
   这些显示类型是指元素在文档流中的布局方式，它们可以通过CSS属性 `display` 来控制和修改，例如：
   ```css
   /* 设置 <div> 元素为块级元素 */
   div {
       display: block;
   }
   
   /* 设置 <span> 元素为行内元素 */
   span {
       display: inline;
   }
   ```
   
2. **内部显示类型（Inner Display Type）**：
   
   - **Flow-root**（流动根）：指元素的内部如何布局其子元素。当一个元素成为 `flow-root` 时，它会形成一个新的块格式化上下文（BFC），这影响了它的子元素如何定位和布局。
   - **Flow**（流动）：当元素不是 `flow-root` 时，其子元素会按照正常的文档流布局，即从上到下逐行排列，如果没有特殊的定位或浮动规则。
   
   内部显示类型主要用于更细粒度地控制子元素的布局行为，例如处理浮动、清除浮动等情况时非常有用。

这两种显示类型的区别在于，外部显示类型影响元素本身在文档流中的布局方式（如块级或行内），而内部显示类型则影响元素内部子元素的布局和定位方式。理解和正确使用这些概念有助于更有效地控制和管理网页布局和样式。

### 常见的inline inline-block block元素

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| inline       | a、input、span、img、lable、abbr（缩写）、em（强调）、big、cite（引用）、i（斜体）、q（短引用）、textarea、select、small、sub、sup，strong、u（下划线）、img（待定） |
| inline-block | input、button                                                |
| block        | address、div、p、pre、h1~h6、ol、ul、dl、table、tr、blockquote、form、article、footer |

![image 20240806222644524](https://s1.imagehub.cc/images/2024/11/26/193a6fc86f0da67a2f995db891b009d0.png)

### 行内盒子

宽度和高度会被忽略。

比如< p>
  I am a paragraph and this is a < span>spanpsanspanspan< /span> inside that paragraph. A span is an inline element and so does not respect width and height.
< /p>

这是p套了个span。你对span设置width height没用。

![image 20240806221159879](https://s1.imagehub.cc/images/2024/11/26/090977c835fa13a0a04da416395cf765.png)

但是呢~spanpsanspanspann设计了上下左右的padding和margin和border。

对于左右的margin和padding和border，很显然是有用的，它们会将左右内容从方框中推开。

但是对于上下的padding和margin和border，盒子虽然会变大，但是不会把内容给推开。

### inline-block

可以使用display:inline-block设置

如果不希望项目换行，但又希望它使用 `width` 和 `height` 值并避免出现上述重叠现象，请使用它。

一个元素使用 `display: inline-block`，实现我们需要的块级的部分效果：

- 设置 `width` 和`height` 属性会生效。（会将盒子变大且将周围内容推开）
- `padding`、`margin` 和 `border` 会在上下左右层面推开其他元素。

不过，**它不会换行**，只有在明确添加 `width` 和 `height` 属性后，才会变得比其内容大。

下面我们使用inline-block和inline属性，请你看看区别。主要在于是否会推开其他元素。

> 这里的inline-block推开了其他元素，但就是不换行~

<img src="https://s1.imagehub.cc/images/2024/11/26/7fbf3b5e995183394075286ff4109fd0.png" alt="image 20240806221925723" style="zoom:80%;" /><img src="https://s1.imagehub.cc/images/2024/11/26/b6b13903e5abb5cedb946530641c27a2.png" alt="image 20240806222000113" style="zoom:80%;" />

下面一行左边是inline，右边是block。

#### 应用

<img src="https://s1.imagehub.cc/images/2024/11/26/24652dfed7e0d4e745ec236bd037fbdb.png" alt="image 20240806222211470" style="zoom:80%;" /><img src="https://s1.imagehub.cc/images/2024/11/26/b2a12b7a3f3bba0059dfb92d2e764c53.png" alt="image 20240806222235487" style="zoom:80%;" />

我们通过给a元素添加inline-block让它的上下padding能够生效，推开周围的li元素

## 盒模型

<h4>盒子组成部分</h4>

盒模型的定义是：定义了盒子的不同部分，比如外边距、边框、内边距和内容是如何协同工作以创建一个页面上看到的盒子。

盒模型分成标准盒和替代盒，我们默认使用标准盒。

**组成：**

* 内容盒子：显示内容的区域。
* 内边距盒子：填充内容周围的空白处。
* 边框盒子：边框盒子包裹住内容和填充。使用border等确定大小。
* 外边距盒子：外边距是最外层的，包裹内容

<img src="https://s1.imagehub.cc/images/2024/11/26/ee1ba3fc0d584112a6267db9831dd0d4.png" alt="image 20240806231424463" style="zoom:80%;" />

<h4>内容盒模型/标准盒模型</h4>

<img src="https://s1.imagehub.cc/images/2024/11/26/655b1973160a817bdf37d871973c0350.png" alt="image 20240806222909753" style="zoom:80%;" />

盒子的面积只包括内容，不包括内边距、边框、外边距（margin）。外边距指定的区域只影响盒子与其他元素之间的距离，不会影响盒子内部的布局。



<h4>替代盒模型</h4>

![image 20240806232154606](https://s1.imagehub.cc/images/2024/11/26/bb67c2fed10e0d7f31ace2b621db0a7c.png)

宽度高度包含border,padding。不包含margin。

---

要在所有元素中使用替代方框模型（这是开发人员的常见选择），请在 `<html>` 元素上设置 `box-sizing` 属性，并将所有其他元素设置为继承该值：

```
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
```



## 外边距塌陷与合并

### 外边距塌陷

:ferry::外边距塌陷是什么？

<img src="https://s1.imagehub.cc/images/2024/11/26/dde83926049f99b83a1f26b9dee950b5.png" alt="image 20240826233748818" style="zoom:67%;" />

<img src="https://s1.imagehub.cc/images/2024/11/26/9f486397e9a0b3c54464425c45e7c65e.png" alt="image 20240826233803008" style="zoom:50%;" /><img src="https://s1.imagehub.cc/images/2024/11/26/56089a47b83cb48d804803d7233f3ecf.png" alt="image 20240826233814324" style="zoom:50%;" />

inner1 inner2是子元素，第一个子元素的margin-top和第二个margin-bottom没有生效，被父元素给抢走了，也就是说整个父元素的margin-top和margin-bottom此时是50px。（不过第一个子元素的margin-bottom和第二个子元素的margin-top是生效的）

这是历史遗留问题，早期的制定标准者认为第一个子元素的margin-top和最后一个子元素的margin-bottom直接交给父亲是一个比较好的选择。

**解决方案：**给父元素加上overflow：hidden（这里虽然和溢出没什么字面上的关系，但是overflow就像一个偏方，莫名的有效果）

给父元素加上border或者padding。但是设置0px无效

<img src="https://s1.imagehub.cc/images/2024/11/26/0ef09c0d7512cee55f28913af44c7f05.png" alt="image 20240826234653906" style="zoom:80%;" />

### 外边距合并

<img src="https://s1.imagehub.cc/images/2024/11/26/c6832eb8541120c6905f125ccdea9f7e.png" alt="image 20240826234820011" style="zoom:50%;" /><img src="https://s1.imagehub.cc/images/2024/11/26/7c384daf3ad04032b6c397e24c6bed7c.png" alt="image 20240826234830070" style="zoom:50%;" /><img src="https://s1.imagehub.cc/images/2024/11/26/d3d07d1ca8cb614be3cec7eb742ccd63.png" alt="image 20240826234850250" style="zoom:50%;" />

尽管设置了两个50px，但是两个盒子之间的间距依然是50px，发生了外边距合并。

外边距的合并只存在于上下兄弟之间，不存在于左右兄弟之间

解决方案：给下面的兄弟加上float，但是对于周围的元素有影响。所以不用非得去解决这个问题，不用的解决。

- 两个正外边距将合并。其大小等于最大的单个外边距。
- 两个负外边距会合并。其大小等于最小（离零最远）的值。
- 如果其中一个外边距为负值，其值将从总值中*减去*。

外边距何时折叠，何时不折叠，由许多规则决定。

需要记住的主要一点是，外边距折叠是指在使用外边距创建空间时，如果没有获得预期的空间，就会发生外边距折叠。



## 背景与边框

### 背景

<h5>background-color</h5>



<h5>background-image</h5>

background-image : url(lalala.png);

如果你填充的图片比较大，那就会自动截一部分以适应框框，

如果你填充的图片比较小，会默认平铺。

（如果你填充的图案是透明底色，那么也可以和background-color结合起来）



<h5>linear-gradient属性</h5>

做渐变的

background-image:linear-gradient();

这个可以设置的东西太多了，暂时不了解



<h5>background-repeat</h5>

用于控制平铺行为。

可选的属性值有以下几点：

repeat-x: 横向平铺

repeat-y: 纵向平铺

no-repeat: 不平铺

repeat: 默认值。在横向和纵向两个方向平铺。



<h5>background-size</h5>

可以设置长度或者百分比，调整图像大小。

可以直接写值，也就是关键字：contain或者cover。

contain：背景图像按比例缩放，使其在不被裁剪的情况下**完全适应背景区域**。这可能会导致背景区域内出现空白，但图像不会被裁剪

cover：背景图像会按比例缩放，以确保 **覆盖整个背景区域**。这可能导致某些部分被裁剪，但背景会完全覆盖元素。

<img src="https://s1.imagehub.cc/images/2024/11/26/925b7de635e766a547201d09a25098c2.png" alt="image 20241025005726825" style="zoom:67%;" />
<img src="https://s1.imagehub.cc/images/2024/11/27/1b5c7f3e358cd203b68deed39c14a840.png" alt="image 20241025005737453" style="zoom:67%;" />

> 下面也会用到cover和contain，这里说下区别
>
> `background-size：cover` 和 `object-fit: cover` 在某些方面有相似之处，但在使用和适用的上下文中有一些区别。
>
> 1. **相似性**:
>    - **覆盖对象**: `background-size: cover` 和 `object-fit: cover` 都被设计用来确保背景图像或者替换元素（比如 `<img>` 标签）尽可能地覆盖其容器。
>    - **保持纵横比**: 两者都会保持图像的纵横比，以避免图像变形。
>    - **裁剪**: 当图像尺寸与容器不匹配时，两者都会裁剪图像来适应容器尺寸，通常是根据容器宽高比来决定裁剪的部分。
>
> 2. **区别**:
>    - **适用对象**:
>      - `background-size: cover` 是用于背景图像的 CSS 属性，可以应用于任何元素的背景。
>      - `object-fit: cover` 是应用于替换元素（比如 `<img>`、`<video>` 等）的 CSS 属性，用于控制替换元素在其容器中的显示方式。
>    - **兼容性**: `object-fit` 在处理替换元素（如 `<img>`）时有更好的兼容性，而 `background-size` 适用于更广泛的背景应用。
>    - **语法和应用方式**: `background-size: cover` 是作为背景属性的一部分设置的，而 `object-fit: cover` 是应用于具有 `display: block` 属性的替换元素的属性。
>
> 因此，尽管它们都可以实现类似的视觉效果，但在具体使用时要考虑到元素类型和具体需求，选择合适的属性进行设置。



**object-fit**

object-fit:cover/contain;

也可以设置关键字，cover和contain。

- **cover**：填充整个背景区域，可能会裁剪图片以填满区域，保持图片比例不变。
- **contain**：完全包含在背景区域内，保持图片完整性和比例，不会裁剪图片。

选择`cover`或`contain`取决于你希望如何展示背景图片：是填满整个区域并可能裁剪部分，还是完全包含并保持图片完整性。






<h5>background-position</h5>

`background-position` 属性允许你选择背景图片出现在它所应用的盒子上的位置。这使用了一个坐标系统，其中方框的左上角是 `(0,0)`，方框沿水平（`x`）和垂直（`y`）轴定位。

你可以使用像 `top` 和 `right` 这样的关键字

```
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: top center;
}
```



或者使用[长度](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)和[百分比](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage)值：

```
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: 20px 10%;
}
```



你也可以将关键字与长度或百分比混合在一起，在这种情况下，第一个值必须指水平位置或偏移，第二个值指垂直位置。例如：

```
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: 20px top;
}
```



最后，你还可以使用四值语法来指示到盒子的某些边的距离——在本例中，长度单位是与其前面的值的偏移量。所以在下面的 CSS 中，我们将背景定位在距顶部 20px 和右侧 10px 处：

```
.box {
  background-image: url(star.png);
  background-repeat: no-repeat;
  background-position: top 20px right 10px;
}
```



<h5>多个背景图像</h5>

最后列出的背景图片位于最下层，而之前的每张图片都堆在代码中紧随其后的那张图片之上。

```
background-image: url(image1.png), url(image2.png), url(image3.png), url(image4.png);
```

紧接着，

```
background-repeat: no-repeat, repeat-x, repeat;
background-position:
  10px 20px,
  top right;
```

当不同的属性具有不同数量的值时，会发生什么情况呢？答案是较小数量的值会循环——在上面的例子中有四个背景图像，但是只有两个背景位置值。前两个位置值将应用于前两个图像，然后它们将再次循环——`image3` 将被赋予第一个位置值，`image4` 将被赋予第二个位置值。



<h5>background-attachment</h5>

决定背景图像的位置是在视口内固定，还是随着包含它的区块滚动。

https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment

- `scroll`：背景相对元素本身固定，但是当元素滚动时，背景也会滚动。
- `fixed`：背景在视口内固定
- `local`：背景在元素本身和视口内都不固定。



### 边框

常常用简写属性，

.box{

​	border:1px solid black;	//或者写成border-top:1px solid black;

}



.box {
  border-width: 1px;	//或者写成border-top-width:1px;
  border-style: solid;
  border-color: black;
}



<h5>border-radius</h5>

定义圆角用的。

值可以是长度可以是百分比。





## 内容溢出

CSS每个元素都是盒子，当你往盒子塞进太多内容时，就会溢出~

 

<h4>给父元素设置overflow</h4>



<h5>overflow:visible</h5>

默认属性，指的是溢出时可见。因为CSS担心你如果溢出隐藏的话，会隐藏掉重要的信息，所以干脆溢出。



<h5>overflow:auto</h5>

使用 `overflow: auto`由浏览器决定是否显示滚动条。就是不溢出时没有滚动条，溢出时有滚动条。桌面浏览器一般仅仅会在有足以引起溢出的内容的时候这么做。



<h5>overflow:hidden(常用)</h5>

溢出时隐藏掉。不过这个比较暴力，直接裁。



<h5>overflow:scroll</h5>

指的是如果溢出去了可以滚动

> overflow:scroll;这个设置的时候就是你哪里超出去了哪里就有滚动条。
>
> 如果横着竖着都超出去了所以x,y方向都有滚动条。
>
> > overflow-x:scroll;
>>
> > overflow-y:scroll;
> >
> > 可以设置仅仅在x方向或仅仅在y方向滚动。



**overflow: scroll hidden你还可以这样设置。指的是在 `overflow-x` 是 `scroll`，而 `overflow-y` 则为 `hidden`。**



在开发网站的时候，你应该一直把溢出的问题挂在心头，你应该用或多或少的内容测试设计，增加文本的字号，确保你的 CSS 可以正常地协调。



## CSS的值与单位

CSS把常用的值分为了几类，

比如px，em这些都是值，大概分为了整数类，小数类，尺寸规格类，百分比类。

这些分好类的我们用<>表示，但并不代表它们是标签。

只是说它们是同一类型的值的集合。



<h5>数字、长度和百分比</h5>

**数字**

| 数值类型       | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| `<integer>`    | `<integer>` 是一个整数，比如 `1024` 或 `-55`。               |
| `<number>`     | `<number>` 表示一个小数——它可能有小数点后面的部分，也可能没有，例如 `0.255`、`128` 或 `-1.2`。 |
| `<dimension>`  | `<dimension>` 是一个 `<number>` 它有一个附加的单位，例如 `45deg`、`5s` 或 `10px`。`<dimension>` 是一个伞形类别，包括 `<length>`、`<angle>`、`<time>` 和 `<resolution>` 类型。 |
| `<percentage>` | `<percentage>` 表示一些其他值的一部分，例如 `50%`。百分比值总是相对于另一个量。例如，一个元素的长度相对于其父元素的长度。 |

**长度**

最常见的长度类型，< length>，常见单位有px,em。

CSS中的长度分为相对长度和绝对长度。



绝对长度：它们与其他任何东西都没有关系，通常被认为总是相同的大小。

| 单位 | 名称         | 等价换算                 |
| :--- | :----------- | :----------------------- |
| `cm` | 厘米         | 1cm = 37.8px = 25.2/64in |
| `mm` | 毫米         | 1mm = 1/10th of 1cm      |
| `Q`  | 四分之一毫米 | 1Q = 1/40th of 1cm       |
| `in` | 英寸         | 1in = 2.54cm = 96px      |
| `pc` | 派卡         | 1pc = 1/6th of 1in       |
| `pt` | 点           | 1pt = 1/72th of 1in      |
| `px` | 像素（物理） | 1px = 1/96th of 1in      |

相对长度：相对于其他东西

- `em` 和 `rem` 分别相对于父元素和根元素的字体大小。
- `vh` 和 `vw` 分别相对于视口的高度和宽度。

> `em` 和 `rem` 是你在从框到文本调整大小时最常遇到的两个相对长度。
>
> <img src="https://s1.imagehub.cc/images/2024/11/26/15b0bcffa6cd75b189f7f422f38d132f.png" alt="image 20240807100742545" style="zoom:67%;" />
>
> 可以看到虽然粉色字体只设置了一个大小，但是却有三层大小，第一层的li以html为父元素，大小是16*1.3，第二层li以外面的li为父元素，大小是16 * 1.3 *1.3，第三层同理。
>
> 而对于紫色字体，由于始终以根元素作为大小基准，所以大小没变过

**百分比**

百分比是一个相对长度单位，你比如设置百分之一百，那就是父元素的百分之百。

比如父元素是html，它就占据那么宽，父元素是另一个，它就占据辣么宽~

![image 20240807101511276](https://s1.imagehub.cc/images/2024/11/26/66669a2a02539e0c7ed69f0c7a72f4fb.png)

这俩一个父元素是html，一个是div盒子。

下面的例子说明了，随着父元素的改变，字体也在逐渐变小。

<img src="https://s1.imagehub.cc/images/2024/11/26/51ee384316502ed507c6e7adc2344af4.png" alt="image 20240807101652664" style="zoom:80%;" />

---

<h4>颜色</h4>

* 十六进制：#AABBCC，每两位依次代表红绿蓝。可选的值有0~9 A~F

* rgb()：三个参数，可选的值是0~255
* rgba():第四个参数是alpha，0到1，越往上越不透明（你可以想成杂质越多）
* hsl(色相，饱和度，亮度)：色相代表底色，是0~360。饱和度是指颜色的饱和程度，0~100%，从白色到全色。亮度从0~100%，从黑色到白色
* hsla()



---

<h4>位置</h4>

通过`background-image`调节。一个典型的位置值由两个值组成——第一个值水平地设置位置，第二个值垂直地设置位置。如果只指定一个轴的值，另一个轴将默认为 `center`。



---

<h4>函数</h4>

函数也是一个值。

进行数值计算时可以采用calc()； width: calc(20% + 100px);	//这里的20%是指父元素

这里你知道父类的宽度。很多时候你不知道，所以你可以写20%。



## 在CSS中调整大小

CSS中的元素有它固有的，自己的尺寸。

<h4>具体尺寸</h4>

不过你可以给它指定尺寸。比如使用width height指定盒子的尺寸。

> 也可以使用百分数作为指定尺寸。这个百分数是父元素宽度（外部容器）的百分数。

你也可以使用百分数作为margin，padding的值。

> 比如padding:10%; 这个百分号就是基于**父元素的宽度**。
>
> ![image 20240807111032851](https://s1.imagehub.cc/images/2024/11/26/77c5ba1031bce20ef49515afdf126898.png)
>
> 比如这里的padding写得是百分之十，是指我画箭头的这个父元素的纯内容盒子的宽度的百分之十
>
> 有一点需要注意，当你设置padding:10%时，你的此时这个盒子是指上下左右都是百分之十，这个百分号的值会应用到上下左右。

<h4>半固定尺寸</h4>

可以设置min-height,max-height尺寸。



## 图像、媒体和表单元素

可替换元素：指的是这个元素本身有自己的图案，你无法改变它自己的样式，但是可以改变它的位置（比如图片）。

> 当可替换元素超过盒子大小时，可以从以下几个点来设置，
>
> max-width:100%;
>
> object-fit:contain/cover;( width: 100%;height: 100%;)

在使用grid或者flex布局时，常常会将元素进行拉伸，但是图像不会。而会对齐到网格区域或者弹性容器的起始处。

只要记住替换元素在成为网格或者弹性布局的一部分时，有不同的默认行为就好了。这一默认行为很有必要，因为它避免了替换元素被布局拉伸成奇怪的样子。

为了强制图像拉伸，以充满其所在的网格单元，你必须做类似于下面的事情：

img {
  width: 100%;
  height: 100%;
}



**继承表单元素**

```
button,input,select,textarea 
{
  font-family: inherit;
  font-size: 100%;
}
```



## 高级区块效果

### 盒子阴影

box-shadow：允许将阴影作用于盒子中。

<img src="https://s1.imagehub.cc/images/2024/11/26/a5f3f6a1ab57b6c1d61a477770300a7a.png" alt="image 20240807111905418" style="zoom:80%;" />

> 这个盒子此时有一个粉色的border，我们再施加黑色的box-shadow。
>
> 如果盒子不写border，添加box-shadow是这个效果
>
> ![image 20240807111939169](https://s1.imagehub.cc/images/2024/11/26/8bebdd8b3902d6fb28ce2f38f215da68.png)
>
> 一般我们默认是往右下加。
>
> 有时候元素本身有背景颜色，这时候可以不用写border，box-shadow直接在元素的外边框加阴影



<h4>元素属性值</h4>

我们在`box-shadow`属性值中有 4 个项：

1. 第一个长度值是水平偏移量（**horizontal offset** ）——即向右的距离，阴影被从原始的框中偏移 (如果值为负的话则为左)。
2. 第二个长度值是垂直偏移量（**vertical offset**）——即阴影从原始盒子中向下偏移的距离 (或向上，如果值为负)。
3. 第三个长度的值是模糊半径（**blur radius**）——在阴影中应用的模糊度。
4. 颜色值是阴影的基本颜色（**base color**）。

> eg:box-shadow:1px 1px 2px red;



还可以在box-shadow中添加多个，叠加写

> 比如第一个阴影水平垂直偏移1px
>
> 第二个偏移2px
>
> ![image 20240807112038754](https://s1.imagehub.cc/images/2024/11/26/17851132c41d541fdab4e974c5f90389.png)
>
> 这里的阴影是几层黑的，几层红色的，最后一层是黑色的
>
> 注意，叠加的时候，前面几行结尾是逗号，最后一层结尾是分号。打错了是没有效果的。

**inset关键字**

把它放在一个影子声明的开始，使它变成一个内部阴影，而不是一个外部阴影。

这个关键字写出来是这样的

```
 box-shadow:
    1px 1px 1px yellow,
    inset 2px 3px 5px green,
    inset -2px -3px 5px pink;
```

效果就是（box-shadow原本是外部阴影，用inset之后是）**内部阴影**。

> ![image 20240807112626184](https://s1.imagehub.cc/images/2024/11/26/32cf03c6992db43d5af538de63f065e4.png)
>
> 像这个按钮，右下角有一个外部的黑色阴影，在内部，左上角和右下角分别有一个暗色阴影和亮白色阴影。
>
> 在元素中，还使用了linear-gradient做渐变



### filter滤镜

filter是一个属性，具体使用可以是这样，还有很多函数可以自己去查

```
 filter: drop-shadow(5px 5px 1px rgba(0, 0, 0, 0.7));
```

> 这里这个滤镜可以安在任何一个元素上，块元素或者行内元素都可以。
>
> ![image 20240807112844301](https://s1.imagehub.cc/images/2024/11/26/e5ae87eb3c4a71e848c49019350f9b50.png)
>
> 这是drop-shadow的效果与box-shadow的对比图
>
> ![image 20240807112907542](https://s1.imagehub.cc/images/2024/11/26/5cb781c502a80726ae2c41fb995652a6.png)
>
> 如果你元素加上边框，那么这是整体的效果



### 混合模式

指的是两个元素重叠的时候产生的效果。

比如下面这里

```
<div class="m"></div>
<div class="multiply"></div>

<style>
div {
  width: 250px;
  height: 130px;
  padding: 10px;
  margin: 10px;
  display: inline-block;
  background: url(colorful-heart.png) no-repeat center 20px;
  background-color: green;	//
}

.multiply {
  background-blend-mode: multiply;
   
}
</style>
```

 我们有两对div元素。然后第一个开启混合元素，我们有两个background 和url图像都会混在一起

（我们的图像就是桃心，不过是一张方形的图片，里面有桃心）

<img src="https://s1.imagehub.cc/images/2024/11/26/974a6a32dc00bb9b968e290571cf14b7.png" alt="image 20240807113635847" style="zoom:67%;" />

下面我介绍一下这个两个属性的区别

**`background-blend-mode`:**当image和background-color在一起混的时候，只混和image和背景重叠的部分

**`mix-blend-mode`:**当image和和background-color混在一起，会都混。

<img src="https://s1.imagehub.cc/images/2024/11/26/b101ab5f9fbc351c208e00c090a0d5cf.png" alt="image 20240807114021725" style="zoom:80%;" />





## CSS文本和字体样式

文本内容从内容区域的左上角开始，一直延续到行的结束部分，一旦到达行的尽头（除非到达尽头，否则不会换行），就会延续到行的下一行，直到所有内容都放进了盒子里。

- **文本布局风格**: 作用于文本的间距以及其他布局功能的属性，比如，允许操纵行与字之间的空间，以及在内容框中，文本如何对齐。
- **字体样式**: 作用于字体的属性，会直接应用到文本中，比如使用哪种字体，字体的大小是怎样的，字体是粗体还是斜体，等等。

> 文字中的文本是一个单一的实体，你很难去选择文本中的一部分
>
> 除非用到伪元素，或者< span>、< strong>来包装



### 字体




<h4>颜色</h4>



<h4>字体种类</h4>

用到`font-family`属性，如果你写的字体浏览器有，那就用了，如果没有，浏览器会找默认字体替代。

不过我们还是应该尽可能的应用那些适合大部分网页的字体

|                 |            |                                                              |
| :-------------- | :--------- | :----------------------------------------------------------- |
| 字体名称        | 泛型       | 注意                                                         |
| Arial           | sans-serif | 通常认为最佳做法还是添加 Helvetica 作为 Arial 的首选替代品，尽管它们的字体面几乎相同，但 Helvetica 被认为具有更好的形状，即使 Arial 更广泛地可用。 |
| Courier New     | monospace  | 某些操作系统有一个 Courier New 字体的替代（可能较旧的）版本叫 Courier。使用 Courier New 作为 Courier 的首选替代方案，被认为是最佳做法。 |
| Georgia         | serif      |                                                              |
| Times New Roman | serif      | 某些操作系统有一个 Times New Roman 字体的替代（可能较旧的）版本叫 Times。使用 Times 作为 Times New Roman 的首选替代方案，被认为是最佳做法。 |
| Trebuchet MS    | sans-serif | 你应该小心使用这种字体——它在移动操作系统上并不广泛。         |
| Verdana         | sans-serif |                                                              |

> 字体名称是指具体的字体，它们定义了特定的字形和样式。
>
> 泛型字体家族是更广泛的字体类别,包括以下几种：
>
> - ![image 20240807114243157](https://s1.imagehub.cc/images/2024/11/26/a030c628252fd0631523f0bfb948d336.png)
>
> > CSS 定义了 5 个常用的字体名称：`serif`, `sans-serif`, `monospace`, `cursive`, 和 `fantasy`. 这些都是非常通用的，当使用这些通用名称时，使用的字体完全取决于每个浏览器，而且它们所运行的每个操作系统也会有所不同。
> 
> **什么时候使用字体名称 vs 泛型字体家族**
> 
> 使用字体名称：
> 
>- 当你想要保证特定的外观效果时。例如，你希望使用品牌特有的字体。
> - 当你知道用户的设备上很可能安装了你指定的字体时。
>
> 使用泛型字体家族：
>
> - 当你希望字体选择具有更大的灵活性和兼容性时。
>- 作为字体名称的后备选择，确保在指定字体不可用时，文本仍然具有可接受的外观。
> 
> 
>
> 一般情况下，建议使用字体名称和泛型字体家族的组合（字体栈），以确保最佳的兼容性和回退机制。例如：
>
> ```
> body {
>    font-family: "Helvetica Neue", Arial, sans-serif;
> }
>```





<h4>字体大小</h4>

元素的 `font-size` 属性是从该元素的父元素继承的

**一个简单的 size 示例**

当调整你的文本大小时，将文档 (document) 的基础 `font-size` 设置为 10px 往往是个不错的主意，这样之后的计算会变得简单，所需要的 (r)em 值就是想得到的像素的值除以 10，而不是 16。做完这个之后，你可以简单地调整在你的 HTML 中你想调整的不同类型文本的字体大小。在样式表的指定区域列出所有`font-size`的规则集是一个好主意，这样它们就可以很容易被找到。

我们的新结果是这样的：

```
html {
  font-size: 10px;
}

h1 {
  font-size: 2.6rem;
}

p {
  font-size: 1.4rem;
  color: red;
  font-family: Helvetica, Arial, sans-serif;
}
```



<h4>字体样式、字体粗细、文本转换、文本装饰</h4>

CSS 提供了 4 种常用的属性来改变文本的样子：

- `font-style`

  : 用来打开和关闭文本 italic (斜体)。可能的值如下 (你很少会用到这个属性，除非你因为一些理由想将斜体文字关闭斜体状态)：

  - `normal`: 将文本设置为普通字体 (将存在的斜体关闭)
  - `italic`: 如果当前字体的斜体版本可用，那么文本设置为斜体版本；如果不可用，那么会利用 oblique 状态来模拟 italics。
  - `oblique`: 将文本设置为斜体字体的模拟版本，也就是将普通文本倾斜的样式应用到文本中。

- `font-weight`

  : 设置文字的粗体大小。这里有很多值可选 (比如 light,normal,bold,extrabold,black, 等等), 不过事实上你很少会用到normal和bold以外的值：

  - `normal`, `bold`: 普通或者**加粗**的字体粗细
  - `lighter`, `bolder`: 将当前元素的粗体设置为比其父元素粗体更细或更粗一步。`100`–`900`: 数值粗体值，如果需要，可提供比上述关键字更精细的粒度控制。
  
- `text-transform`

  : 允许你设置要转换的字体。值包括：

  - `none`: 防止任何转型。
  - `uppercase`: 将所有文本转为大写。
  - `lowercase`: 将所有文本转为小写。
  - `capitalize`: 转换所有单词让其首字母大写。
  - `full-width`: 将所有字形转换成全角，即固定宽度的正方形，类似于等宽字体，允许拉丁字符和亚洲语言字形（如中文，日文，韩文）对齐。

- `text-decoration`

  : 设置/取消字体上的文本装饰 (你将主要使用此方法在设置链接时取消设置链接上的默认下划线。) 可用值为：

  - `none`: 取消已经存在的任何文本装饰。
  - `underline`: 文本下划线。
  - `overline`: 文本上划线
  - `line-through`: 穿过文本的线。

  你应该注意到`text-decoration`可以一次接受多个值，如果你想要同时添加多个装饰值，比如

  ```
  text-decoration: underline overline
  ```

  同时注意`text-decoration`是一个缩写形式，它由 `text-decoration-line`,`text-decoration-style`和

  `text-decoration-color`构成。你可以使用这些属性值的组合来创建有趣的效果，比如

  ```
  text-decoration: line-through red wavy
  ```



<h4>文字阴影</h4>

你可以为你的文本应用阴影，使用 [`text-shadow`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow) 属性。这最多需要 4 个值，如下例所示：

```
text-shadow: 4px 4px 5px red;
```

4 个属性如下：

1. 阴影与原始文本的水平偏移，可以使用大多数的 CSS 单位 [length and size units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#length_and_size), 但是 px 是比较合适的。这个值必须指定。
2. 阴影与原始文本的垂直偏移;效果基本上就像水平偏移，除了它向上/向下移动阴影，而不是左/右。这个值必须指定。
3. 模糊半径 - 更高的值意味着阴影分散得更广泛。如果不包含此值，则默认为 0，这意味着没有模糊。可以使用大多数的 CSS 单位 [length and size units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#length_and_size).
4. 阴影的基础颜色，可以使用大多数的 CSS 颜色单位 [CSS color unit](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#colors). 如果没有指定，默认为 `black`.



### 文本布局

<h4>文本对齐</h4>

[`text-align`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align) 属性用来控制文本如何和它所在的内容盒子对齐。可用值如下，并且在与常规文字处理器应用程序中的工作方式几乎相同：

- `left`: 左对齐文本。
- `right`: 右对齐文本。
- `center`: 居中文字
- `justify`: 使文本展开，改变单词之间的差距，使所有文本行的宽度相同。你需要仔细使用，它可以看起来很可怕。特别是当应用于其中有很多长单词的段落时。如果你要使用这个，你也应该考虑一起使用别的东西，比如 [`hyphens`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/hyphens)，打破一些更长的词语。



<h4>行高</h4>

[`line-height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-height) 属性设置文本每行之间的高，可以接受大多数单位 [length and size units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#length_and_size)，不过也可以设置一个无单位的值，作为乘数，通常这种是比较好的做法。无单位的值乘以 [`font-size`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size) 来获得 `line-height`。当行与行之间拉开空间，正文文本通常看起来更好更容易阅读。推荐的行高大约是 1.5–2 (双倍间距。) 所以要把我们的文本行高设置为字体高度的 1.5 倍，你可以使用这个：

```
line-height: 1.5;
```




<h4>字母和单词间距</h4>

[`letter-spacing`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/letter-spacing) 和 [`word-spacing`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-spacing) 属性允许你设置你的文本中的字母与字母之间的间距、或是单词与单词之间的间距。你不会经常使用它们，但是可能可以通过它们，来获得一个特定的外观，或者让较为密集的文字更加可读。它们可以接受大多数单位 [length and size units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#length_and_size).



### font简写

许多字体的属性也可以通过 [`font`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 的简写方式来设置 . 这些是按照以下顺序来写的： [`font-style`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style), [`font-variant`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant), [`font-weight`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-weight), [`font-stretch`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-stretch), [`font-size`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size), [`line-height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-height), and [`font-family`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family).

如果你想要使用 `font` 的简写形式，在所有这些属性中，只有 `font-size` 和 `font-family` 是一定要指定的。

[`font-size`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size) 和 [`line-height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/line-height) 属性之间必须放一个正斜杠。

一个完整的例子如下所示：

```
font:
  italic normal bold normal 3em/1.5 Helvetica,
  Arial,
  sans-serif;
```



<h4>更多</h4>

![image 20240807114749699](https://s1.imagehub.cc/images/2024/11/26/5204731cf1d4ed48309fc778c8fccbc2.png)

![image 20240807114803828](https://s1.imagehub.cc/images/2024/11/26/fd894cec946a49b124b00e327fff8435.png)

### 字体下载

你会经常担心浏览器是否支持你的字体，尤其是你觉得某种特殊字体太适配你的网站的时候。这时候你可以提供字体下载，这样浏览器在访问时可以顺便下载字体。

用这个块来指定你要下载的字体

```
@font-face {
  font-family: "myFont";
  src: url("myFont.ttf");
}
```

```
html {
  font-family: "myFont", "Bitstream Vera Serif", serif;
}
```

应用的时候可以这样应用









## CSS布局

整体介绍，不过这里面我没有写Grid布局，也叫做网格布局，因为一方面MDN讲的啰嗦，在上面学不如看视频；另一方面暂时用不到。不过这个对于找工作可能还是有点用，到时候再学吧。

<h5>正常布局</h5>

就是说天生是block，就按照Block来排列；天生是inline，就按照inline来排列



<h5>display属性</h5>

更改默认的显示方式：`display：block`  ,  `display:inline`

更改更大的布局方面：`display:flex`  ， `display:grid`



<h5>弹性盒子</h5>

创建横向或者纵向的一维页面布局

在父元素上设置flex，子元素上设置点flex-item的项即可



<h5>Grid布局</h5>

用于同时在两个维度上把元素按行和列排列整齐



<h5>浮动 (float) </h5>

把元素浮动起来后，不仅使得元素本身脱离正常布局流，也会使得原本在正常布局流中跟随该元素的元素 脱离正常布局流。

这一元素会浮动到左侧或右侧，并且从正常布局流 (normal flow) 中移除，这时候其他的周围内容就会在这个被设置float 的元素周围环绕。

我们可以为一个元素设置float属性，然后定义它浮动到左边或者右边。



<h5>定位 (position)</h5>

定位 (positioning) 能够让我们把一个元素从它原本在正常布局流 (normal flow) 中应该在的位置移动到另一个位置。定位 (positioning) 并不是一种用来给你做主要页面布局的方式，它更像是让你去管理和微调页面中的一个特殊项的位置。

- **静态定位**（Static positioning）是每个元素默认的属性——它表示“将元素放在文档布局流的默认位置——没有什么特殊的地方”。
- **相对定位**（Relative positioning）允许我们相对于元素在正常的文档流中的位置移动它——包括将两个元素叠放在页面上。这对于微调和精准设计（design pinpointing）非常有用。
- **绝对定位**（Absolute positioning）将元素完全从页面的正常布局流（normal layout flow）中移出，类似将它单独放在一个图层中。我们可以将元素相对于页面的 `<html>` 元素边缘固定，或者相对于该元素的*最近被定位祖先元素*（nearest positioned ancestor element）。绝对定位在创建复杂布局效果时非常有用，例如通过标签显示和隐藏的内容面板或者通过按钮控制滑动到屏幕中的信息面板。
- **固定定位**（Fixed positioning）与绝对定位非常类似，但是它是将一个元素相对浏览器视口固定，而不是相对另外一个元素。这在创建类似在整个页面滚动过程中总是处于屏幕的某个位置的导航菜单时非常有用。
- **粘性定位**（Sticky positioning）是一种新的定位方式，它会让元素先保持和 `position: static` 一样的定位，当它的相对视口位置（offset from the viewport）达到某一个预设值时，它就会像 `position: fixed` 一样定位。



<h5>多列布局</h5>

在容器内设置column-count(多少列)或者column-width(一个列多宽)	诸如此类



## 常规流布局

默认情况下，一个块级元素会填充父元素所有的行向空间，并沿着其块伸长以容纳其内容。

行级元素的大小就是它本身的大小。





## 特殊

### line-height

用于调整行高。可以在父容器上设置，也可以在子元素上设置。如果在父容器上设置，那么容器内所有的元素的行高都会被影响（继承）。

line-height可以影响`inline`/`inline-block`/`block`元素的行高，对于单行文本情况下，line-height等于元素高度时可以**实现文本垂直居中。**

 行高的取值可以使用：

数字（比如1.5，这是根据当前元素的字体大小比例设置的）

百分比（150%，这是基于当前字体大小的百分比）

固定长度（20px，明确指定行高为某个固定长度，适合高度固定的布局）



### text-align

用于设置水平对齐方式，可选值有left（左对齐）、right（右对齐）、center（居中对齐）、justify（两端对齐）

> 这里有很多前提，`text-align` 是给**父容器**设置的样式属性，影响**块级容器内的行内或行内块级 子元素**（例如文本、图片、按钮等）的水平对齐方式。
>
>  `text-align` 只作用于inline和inline-block子元素的内容，对block子元素没用。
>
>  
>
> 但是对p元素设置text-align是有效果的，这是因为p元素虽然是块级元素，但我们把它看做父容器，它内部的文本是行内元素inline content。



### margin:0 auto

:fishing_pole_and_fish:：text-align与margin

`text-align` 应该**应用于容器元素**，而不是元素本身。它的作用是控制容器内的**inline**或**inline-block**元素（如文本、图片、按钮）的水平对齐方式。

`margin: 0 auto;` 应该应用于**元素本身**，而不是父元素。这个样式会让块级元素在其父容器中水平居中。



### vertical-align

:fishing_pole_and_fish:`vertical-align` 用于控制inline元素或inline-block元素相对于其行盒的垂直对齐方式。父容器可以是任何元素。vertical-align作用的对象是你要对齐的元素本身。
