## 概述

浏览器浏览html,其实是先从服务器下载代码，再渲染出网页。

标签和元素是一个意思，浏览器渲染时，会把源码渲染成标签树，每个标签都是树的节点。这种节点就是元素。所以标签是从源码角度看的，元素是从编程角度看的。

网页的第一个标签通常是`<!doctype>`，表示文档类型，告诉浏览器如何解析网页。

`<html>`标签是网页的顶层容器，即标签树结构的顶层节点，也称为根元素（root element），其他元素都是它的子元素。一个网页只能有一个`<html>`标签。

## URL

URL的意思是统一资源定位符（Uniform Resource Locator），表示各种资源的地址。

```
https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor
```

上面是个网址，简单来讲，由协议（https://）、主机（域名）、端口（：80）、路径、键值对（用&分隔，键值名和键值通过等号连接）。

具体的看wangdoc。

**合法字符：**URL只由这些构成{26个英文字母、10个阿拉伯数字、.（句点） 、- （连词号）、_（下划线）}

**保留字符：**还有十八个字符例如！ ？只能在URL的特定位置出现，比如端口的：只能紧跟着域名出现，？只能在键值对（查询参数）的开头出现。

如果这十八个字符想在其他位置出现，需要使用转义形式，比如`&`：%26

> 既不属于合法字符、也不属于保留字符的其他字符（比如汉字），理论上不需要手动转义，可以直接写在 URL 里面，比如`www.example.com/中国.html`，浏览器会自动将它们转义，发给服务器。

**绝对URL和相对URL：**

绝对URL指的是只靠URL本身就能确定资源的位置。因此，绝对URL带有资源的完整信息，包括协议、主机、路径等。

相对URL指URL不含有资源的全部信息，必须结合当前网页的位置，才能定位资源。

> URL有一些特殊简写，比如.表示当前目录，..表示上级目录。
>
> 相对 URL 如果以斜杠（`/`）开头，就表示网站的根目录。否则，必须以当前目录为起点，推算资源的位置。比如，相对 URL `/foo/bar.html`表示网站根目录的子目录`foo`，`foo/bar.html`表示在当前目录的`foo`子目录。

**< base >**

< base >标签指定 网页内部 所有相对URL的计算基准。整张网页只能有一个< base >标签，而且只能放在< head >里。

```
<base href="https://www.example.com/files/" target="_blank">
```

`<base>`标签必须至少具有`href`属性或`target`属性之一。

## Unicord字符集

首先我们网页会通过HTTP头信息，声明网页编码方式。

```
Content-Type: text/html; charset=UTF-8
```

这里指的是服务器发送的数据类型是text/html

编码方式是UTF-8

UTF-8编码是表达Unicord字符集的一种方式，这个字符集的目的是收录世界上所有字符。

**数字表示法：**每个字符都有一个Unicord号码，称为码点。码点是唯一的，是一个整数，用来表示该字符。字符的码点表示法是`&#N;`（十进制，`N`代表码点）或者`&#xN;`（十六进制，`N`代表码点），比如，字符`a`可以写成97（十进制）或者61（十六进制），字符`中`可以写成20013（十进制）或者4e2d（十六进制），浏览器会自动转换它们。

**实体表示法：**不过呢，码点用数字来记还是太难了，所以呢，为了能够快速输入，HTML 为一些特殊字符，规定了容易记忆的名字，允许通过名字来表示它们，这称为实体表示法（entity）。

- `<`：&lt
- `>`：&gt
- `"`：&quot
- `'`：&apos
- `&`：&amp
- `©`：&copy
- `#`：&num
- `§`：&sect
- `¥`：&yen

##  --------------------------

## 常用标签

## 🌲结构标签

### article/section/aside

< article >标签表示页面中一块独立存在的内容，即使页面中其他部分不存在，article本身存在也有它的意义。

< aside >标签用来放置与网页或文章内容间接相关的部分。比如放置侧边栏、评论栏这类补充栏目。

< section >通常表示一个章节，section通常是好几个标签一起出现的，因为要有好几个章节。所以section表示的章节是相对独立。

不过section和article没有绝对的区分大小，有时候section也会包含article，取决当前界面含义。

### hgroup

是一个放置多级标题的小框架。

```
<hgroup>
  <h1>Heading 1</h1>
  <h2>Subheading 1</h2>
  <h2>Subheading 2</h2>
</hgroup>
```

里面只能放置h1~h6

> 结构类标签还有header/footer/nav 这里就不解释了

## 🌲文本标签

### br/wbr

br是指无论发生什么情况，我这里都是要断句的，比如说诗歌。

```
<p>
  床前明月光，<br>
  疑是地上霜。<br>
  举头望明月，<br>
  低头思故乡。
</p>
```

不过br一般是一个块内的断句，对于块与块之间的断句，一般我们用CSS指定。

wbr是指在页面有空位置的时候是不断句的，实在哪里要断句了，就在这个位置断一下。

```
<p>
Fernstraßen<wbr>bau<wbr>privat<wbr>finanzierungs<wbr>gesetz
</p>
```

### pre

pre是一个块级标签。保留空格和换行，英文叫preformatted（预格式化的）。

```
<pre>hello

   world</pre>
```

### strong/em/i

strong表示包含的内容有很强的重要性，浏览器会以**粗体**显示内容。

```
<p>开会时间是<strong>下午两点</strong>。</p>
```

这一小章节我们要理解语义的重要性。

em表示emphasize，即强调，浏览器会用*斜体*表示。

i表示Italic，也会用斜体表示，不过呢，我们一般使用em，因为i只有斜体的意思，没有强调的感觉，我们称之为只有样式，没有语义、所以使用em多一点。

### u/s

这俩标签都是行内元素，u显示出来是一个下划线，它的意思是这里可能会出现拼写错误。

```
一个容易写错的成语是把<em>安分守己</em>写成<u>安份守己</u>。
```

不过呢，带链接的部分也是下划线，所以u和a的样式容易搞混，所以一般我们使用CSS，不然用户一看觉得你这是链接，结果点进去什么也没有。

`<s>`标签是一个行内元素，为内容加上删除线。

### blockquote/cite

blockquote是一个块级标签，也是一个有语义的标签，一般我们把表示引用的部分放在里面。

<img src="https://s1.imagehub.cc/images/2024/11/26/0c44cede862059da79ef6d9bc9f658e8.png" alt="image 20240806120039799" style="zoom:80%;" />

```
<blockquote cite="https://quote.example.com">
  <p>天才就是 1% 的天赋和99%的汗水。</p>
</blockquote>
<cite>-- 爱迪生</cite>
```

这里我们的cite既可以作为属性，也可以作为标签。

作为属性代表着引言URL来源，在浏览器中不会显示，

作为标签代表着引言作者或者资料来源，会默认以斜体显示。

cite不一定要放到blockquote里，也可以单独列出来。

### kbd/samp

都是行内元素

kbd代表从键盘输入各种元素

<img src="https://s1.imagehub.cc/images/2024/11/26/927161575d81a48e9feb475e7adc2578.png" alt="image 20240806120206603" style="zoom:50%;" />

samp以等宽字体显示。

<img src="https://s1.imagehub.cc/images/2024/11/26/ed19a9f03d5ba95990ab8e66253495c2.png" alt="image 20240806120528581" style="zoom:67%;" />

### mark

行内标签，表示突出显示的内容，chrome浏览器内部默认以亮黄色显示。不过不要为了这个样式而用这个标签，如果单纯为了样式可以去用CSS。

```
<p>我们讨论以后决定，<mark>运行会在下周三举办</mark>。</p>
```

### time/data

time表示时间，data表示数据，但为什么需要这两个标签呢，请看例子。

```
<p>运动会预定<time datetime="2015-06-10">下周三</time>举行。</p>
```

```
<p>本次马拉松比赛第一名是<data value="39">张三</data></p>。
```

这里的“下周三””张三“这样的数据是给人类看的，但是time data标签里的内容就是给机器看的了。这些都是机器更方便读入的数据。

这个datetime属性还有其他表达形式，可以自己查。

https://wangdoc.com/html/text#address

### address

<img src="https://s1.imagehub.cc/images/2024/11/26/55cf2d282872ace757ed565192f672aa.png" alt="image 20240806120616412" style="zoom:67%;" />

< address >表示人或组织的联系方式，里面必须是联系信息，不要写无关的内容。`<address>`不能嵌套，并且内部不能有标题标签（`<h1>`~`<h6>`），也不能有`<article>`、`<aside>`、`<section>`、`<nav>`、`<header>`、`<footer>`等标签。

### abbr

abbr是缩写的意思，

```
<abbr title="Crazy In Love">CIL</abbr>
```

当鼠标悬停在CIL上时，title属性会作为提示，会显示出Crazy In Love。（即缩写的完整形式）

### dfn

行内标签，意思是“术语”，即definition。具有title属性。

```
<p>
通过 TCP/IP 协议连接的全球性计算机网络，叫做
<dfn title="全球性计算机网络">Internet</dfn>。
</p>
```

当鼠标放在internet时，会浮现出“全球计算机网络”。

有时候，术语本身就是缩写，这时候可以和abbr结合使用。

```
<p>
<abbr title="Crazy In Love"><dfn>CIL</dfn></abbr>是itzy出的一张专辑。
</p>
```

### ins/del

都是行内元素，表示添加或者删除的内容，默认具有下划线或者删除线的效果。

这两个标签都有以下属性。

- `cite`：该属性的值是一个 URL，表示该网址可以解释本次删改。
- `datetime`：表示删改发生的时间。

<img src="https://s1.imagehub.cc/images/2024/11/26/074d964578b2b3a1d08b0836a04223db.png" alt="image 20240806122403599" style="zoom:80%;" />

### bdo/bdi

主要是控制文字阅读方向的，有一个dir属性，dir属性有两个值，一个是rtl（从右向左），一个是ltr（从左向右）。

```
<p>床前明月光，<bdo dir="rtl">霜上地是疑</bdo>。</p>
```

这里面霜上地是疑就是从右向左阅读。

```
<p><bdi>床前明月光，疑是地上霜。</bdi></p>
```

bdi是指不确定文字阅读方向的时候，让浏览器自行决定。

因为阿拉伯语和希伯来语都是从右向左阅读的，所以有时候有用户自行输入的内容时，不确定阅读方向。

## 🌲列表标签

列表分为有序列表、无序列表。

### ol

```
<ol>
  <li>列表项 A</li>
  <li>列表项 B</li>
  <li>列表项 C</li>
</ol>
```

ol标签有序列表容器（ordered list），会在标签内部的列表项前面产生数字编号。（< ol >是块级元素）

> 列表项可以嵌套。
>
> ```
> <ol>
>   <li>列表项 A</li>
>   <li>列表项 B
>     <ol>
>       <li>列表项 B1</li>
>       <li>列表项 B2</li>
>       <li>列表项 B3</li>
>     </ol>
>   </li>
>   <li>列表项 C</li>
> </ol>
> ```
>
> ```
> 1. 列表项 A
> 2. 列表项 B
>   1. 列表项 B1
>   2. 列表项 B2
>   3. 列表项 B3
> 3. 列表项 C
> ```

---

**属性：**

**reversed**

```
<ol reversed>
  <li>列表项 A</li>
  <li>列表项 B</li>
  <li>列表项 C</li>
</ol>
```

列表项ABC的前面的编号分别是321



**start**

表示起始编号

```
<ol start="3">
<li>yeji</li>
<li>lia</li>
<li>ryujin</li>
<li>chaeyoung</li>
<li>yuna</li>
</ol>
```

编号的时候会从3号开始编，分别是34567



**type**

制定li项前面编号的样式

- `a`：小写字母
- `A`：大写字母
- `i`：小写罗马数字
- `I`：大写罗马数字
- `1`：整数（默认值）

```
<ol type="a">
  <li>列表项 A</li>
  <li>列表项 B</li>
  <li>列表项 C</li>
</ol>
```

> 如果想组合start和type，
>
> ```
> <ol type="a" start="3">
>   <li>列表项 A</li>
>   <li>列表项 B</li>
>   <li>列表项 C</li>
> </ol>
> ```
>
> 即使我们的type是从a开始，但是想指定起始位置，依然从3开始



### ul

`<ul>`标签是一个无序列表容器（unordered list），会在内部的列表项前面产生实心小圆点，作为列表符号。列表项的顺序无意义时，采用这个标签。

```
<ul>
  <li>列表项 A</li>
  <li>列表项 B</li>
  <li>列表项 C</li>
</ul>
```

上面代码的渲染结果是，列表项 A、B、C 前面，分别产生一个实心小圆点，作为列表符号。

`<ul>`标签内部可以嵌套`<ul>`或`<ol>`，形成多级列表。



### li

`<li>`表示列表项，用在`<ol>`或`<ul>`容器之中。

**有序列表**`<ol>`之中，`<li>`有一个`value`属性，定义当前列表项的编号，后面列表项会从这个值开始编号。

```
<ol>
  <li>列表项 A</li>
  <li value="4">列表项 B</li>
  <li>列表项 C</li>
</ol>
```

上面代码中，`value`属性指定第二个列表项的编号是`4`，因此三个列表项的编号，分别为1、4、5。



### dl/dt/dd

有分级关系。块级。翻译过来分别是description list（术语列表）、description term（术语名）、description detail（术语解释）。

```
<dl>
  <dt>CPU</dt>
  <dd>中央处理器</dd>

  <dt>Memory</dt>
  <dd>内存</dd>

  <dt>Hard Disk</dt>
  <dd>硬盘</dd>
</dl>
```

dd会默认在dt下面缩进显示。

```
CPU
  中央处理器

Memory
  内存

Hard Disk
  硬盘
```

多个dt可以对应一个dd，一个dt也可以对应多个dd

## 🌲图像标签

### img

img是一个行内元素，与前后的文字是处在同一行，图片会把当前行的行高撑开。

```
<img src="foo.jpg">
```

常用的属性是src，表示图片网址。

img可以放在a标签内部，使得图片变成一个可以点击的链接

```
<a href="example.html">
<img src="foo.jpg">
</a>
```

**属性：**

**alt**

`alt`属性用来设定图片的文字说明。图片不显示时（比如下载失败，或用户关闭图片加载），图片的位置上会显示该文本。

```
<img src="foo.jpg" alt="示例图片">
```



**width/height**

图片默认以原始大小插入网页，`width`属性和`height`属性可以指定图片显示时的宽度和高度，单位是像素或百分比。

```
<img src="foo.jpg" width="400" height="300">
```

1.一旦设置这两个属性，即使图片加载不出来，浏览器也会预留出相应大小

2.一般来说，img的高宽我们会在css里设置

3.img的width height一般设置一个就好，另外一个系统会根据图片比例设计



**srcset/sizes**

下面会讲



**referrerpolicy**

加载img时会有些请求，请求时就会带有头信息，这个属性用于修改头信息



**crossorigin**

```
<img src="foo.jpg" crossorigin>
```

有点像布尔属性？想打开就这样写。

图片在加载时会有跨域的可能性，如果你同意跨域，就打开这个属性，默认是不打开。

一旦打开该属性，它可以设为两个值。

- `anonymous`：跨域请求不带有用户凭证（通常是 Cookie）。
- `use-credentials`：跨域请求带有用户凭证。

```
<img src="foo.jpg" crossorigin="anonymous">
```



**loading**

loading属性可以指定懒加载，即用户的滚动条滚动到这里时再加载，这样可以节省带宽。

`loading`属性可以取以下三个值。

- `auto`：浏览器默认行为，等同于不使用`loading`属性。
- `lazy`：启用懒加载。
- `eager`：立即加载资源，无论它在页面上的哪个位置。

由于行内图片的懒加载，可能会导致页面布局重排，所以使用这个属性的时候，最好指定图片的高和宽。



### figure/figcaption

figure是一个语义容器，除了可以封装图片和相关信息，还可以封装引言、代码、诗歌。

figcaption可以放置标题。

```
<figure>
  <img src="https://example.com/foo.jpg">
  <figcaption>示例图片</figcaption>
</figure>
```



##   --------------------------

## 响应式图像 

**像素不同时如何选择合适的图片？**

### 🌵img 标签

由于我们需要不同的设备（手机、电脑）显示相同或者不同的图像比例，尽可能地显示一样的清晰度，所以我们需要响应式设计。

响应式设计：网页在不同尺寸的设备上，都能产生良好的显示效果。（responsive web design）

响应式设计当中的网页图像，就叫响应式图像（responsive image）

### srcset属性

```
<img srcset="foo-320w.jpg,
             foo-480w.jpg 1.5x,
             foo-640w.jpg 2x"
     src="foo-640w.jpg">
```

`srcset`属性用来指定多张图像，适应不同像素密度的屏幕。

srcset属性的不同值之间，通过逗号分隔。

在同一个值当中，首先是图像的url，然后是一个空格，接着是像素密度。



像素密度：倍数+x

1x代表单倍像素密度。**浏览器根据当前设备的像素密度，选择合适的图片。**

**注意，最后面还有一个src属性。这是指上面的图片都不符合要求时，就用这个图片。**

---



**宽度不同时如何选择合适的图片？**

### sizes属性

注意是sizes属性不是size属性。

用像素密度来匹配图片，只适用于不同设备需要一样大小的图片，如果需要不同大小的图片，就需要sizes属性。

> 先解释一下px和w的区别，px是像素单位，w是宽度描述符（通常用于响应式设计）。像素单位在不同的设备上可能有不同的物理大小，但是在同一设备上相对稳定。w不是一个单位，而是响应式图片设计中用作宽度描述的特殊标识符，w并不是一个长度单位，它只是一个描述符。

> 解释物理像素与CSS像素的区别，单词分别是Physical Pixel,CSS Pixel。物理像素表示显示器上的一个点，是硬件层面概念，每个物理像素都可以发光或者表示颜色，是绝对单位。CSS像素是浏览器使用的抽象单位，用于度量网页上元素大小，是相对单位。一个CSS像素可能对应多个物理像素。

**第一步**，`srcset`属性列出所有可用的图像。

```
<img srcset="foo-160.jpg 160w,
             foo-320.jpg 320w,
             foo-640.jpg 640w,
             foo-1280.jpg 1280w"
     src="foo-1280.jpg">
```

上面代码中，`srcset`属性列出四张可用的图像，每张图像的 URL 后面是一个空格，再加上宽度描述符。

宽度描述符：图像原始的宽度，加上字符`w`。上例的四种图片的原始宽度分别为160像素、320像素、640像素和1280像素。



**第二步**，`sizes`属性列出不同设备的图像显示宽度。

`sizes`属性的值是一个逗号分隔的字符串，除了最后一部分，前面每个部分都是一个放在括号里面的媒体查询表达式，后面是一个空格，再加上图像的显示宽度。

```
<img srcset="foo-160.jpg 160w,
             foo-320.jpg 320w,
             foo-640.jpg 640w,
             foo-1280.jpg 1280w"
     sizes="(max-width: 440px) 100vw,
            (max-width: 900px) 33vw,
            254px"
     src="foo-1280.jpg">
```

`sizes`属性给出了三种屏幕条件，以及对应的图像显示宽度。宽度不超过440像素的设备，图像显示宽度为100%；宽度441像素到900像素的设备，图像显示宽度为33%；宽度900像素以上的设备，图像显示宽度为`254px`。

**第三步**，浏览器根据当前设备的宽度，从`sizes`属性获得图像的显示宽度，然后从`srcset`属性找出最接近该宽度的图像，进行加载。

假定当前设备的屏幕宽度是`480px`，浏览器从`sizes`属性查询得到，图片的显示宽度是`33vw`（即33%），等于`160px`。`srcset`属性里面，正好有宽度等于`160px`的图片，于是加载`foo-160.jpg`。

如果不写`sizes`属性，那么浏览器将根据实际的图像显示宽度，从`srcset`属性选择最接近的图片。

如果一旦使用`sizes`属性，就必须与`srcset`属性搭配使用，单独使用`sizes`属性是无效的。

### &src

在HTML中，`src` 和 `srcset` 是用于指定图像资源的属性，它们有以下区别：

1. **src属性**：
   - **用途**：`src` 属性用于指定图像的源文件路径（source），即浏览器应该从哪里加载图像。
   - **兼容性**：所有主流浏览器都支持 `src` 属性。
   - **示例**：`<img src="image.jpg" alt="Image">`

2. **srcset属性**：
   - **用途**：`srcset` 属性允许您提供一组候选图像，浏览器可以根据屏幕的像素密度（DPR，Device Pixel Ratio）选择加载哪个图像。这对于提供不同分辨率的图像版本以适应不同设备非常有用。
   - **语法**：`srcset` 属性包含多个由逗号分隔的图像描述符，每个描述符包括图像路径和描述符宽度（可选），如 `url 1x, url 2x`。
   - **示例**：`<img src="image.jpg" srcset="image-1x.jpg 1x, image-2x.jpg 2x" alt="Image">`
   - **工作原理**：浏览器根据当前设备的像素密度（通常为1x、2x、3x等），选择合适的图像进行加载。例如，如果设备的像素密度是2x，浏览器会选择加载 `image-2x.jpg`。

**总结**：
- `src` 是必需的属性，指定图像的默认来源。
- `srcset` 是可选的属性，用于提供多个候选图像，以便根据设备的像素密度选择加载合适的图像。



### 🌵picture标签

img具有srcset属性和sizes属性，上面我们列举了当像素不同时怎么设置选择图片，当宽度不同时怎么设置选择图片。

但是现在当像素不同和宽度不同同时存在时如何设置选择图片？

这时我们需要用到picture标签。

---

### source标签

`<picture>`标签是一个容器标签，内部标签有`<source>`和`<img>`。

```
<picture>
  <source media="(max-width: 500px)" srcset="cat-vertical.jpg">
  <source media="(min-width: 501px)" srcset="cat-horizontal.jpg">
  <img src="cat.jpg" alt="cat">
</picture>
```

这里source标签具有media和srcset属性。其实也具有sizes属性，但由于有了media属性，所以sizes属性不需要了。

上面例子中，设备宽度如果不超过`500px`，就加载竖屏的图像，否则加载横屏的图像。

---

### &img标签

```
<picture>
  <source srcset="homepage-person@desktop.png,
                  homepage-person@desktop-2x.png 2x"
          media="(min-width: 990px)">
  <source srcset="homepage-person@tablet.png,
                  homepage-person@tablet-2x.png 2x"
          media="(min-width: 750px)">
  <img srcset="homepage-person@mobile.png,
               homepage-person@mobile-2x.png 2x"
       alt="Shopify Merchant, Corrine Anestopoulos">
</picture>
```

这里我们加入了img标签，指的是上面的条件都不满足时，就使用img里的。



### 图像格式的选择

除了响应式图像，picture还可以用来加载不同格式的图像。

```
<picture>
  <source type="image/svg+xml" srcset="logo.xml">
  <source type="image/webp" srcset="logo.webp"> 
  <img src="logo.png" alt="ACME Corp">
</picture>
```

这里的type是MIME类型，srcset是对应的图像的url。

上面例子中，图像加载优先顺序依次为 svg 格式、webp 格式和 png 格式。

##  --------------------------

## a标签

a可以把任何东西变为自己自己的链接。

比如

```
<a href="https://wikipedia.org/">维基百科</a>
```

这里a标签里放置的是文字

还可以放置图像、段落、多媒体等。

https://wangdoc.com/html/a

### 属性

- href：可以给出完整URL，也可以给出锚点形式。< a href="#demo">示例< /a>
- hreflang：表示语言的。 可以配合href使用，表示语言的网址，与html的lang属性类似。当有多种语言时，可以设置hreflang="x-default"，表示默认
- title：给出链接说明信息，当鼠标悬停在信息上方，会有个提示块
- target：指定如何打开链接。值可以是一个一个毫不相关的名字，< a href=""  target="itzy.com">这样网站会新建一个窗口叫itzy
  * 也可以是_self：当前窗口打开（默认）； _blank：新窗口打开； _parent：上层窗口打开； _top：顶层窗口打开
- rel：说明链接与当前页面的关系。比如帮助、许可证、作者链接、外部参考文档
- referrerpolicy：修改头信息的。比如发送字段限制
- ping：< a href="http://localhost:3000/other" ping="http://localhost:3000/log">当用户点击href链接，电脑会通过向ping里的网址发出POST请求，服务器端接收到这个请求，就知道用户点击了这个链接。（通常用于跟踪用户行为。）
  * ping属性只对链接可以跟踪，不可以跟踪 点击button等
- type：表示链接的MIME类型（是网页、图像还是文件）
- download：布尔属性，加上就行。< a href="demo.txt" download>下载< /a>。加上代表当前链接是一个下载链接，用户点了以后会直接下载，不会跳转到新的界面。但前提是这个链接是当前用户所在链接是同源（同属一个网站）。download也可以有值，比如download=“bar.exe"，可以用于给下载文件命名
- 邮件链接：< a href="mailto:contact@example.com">联系我们< /a>。这里的mailto是一个协议，当用户点击联系我们，会打开本机默认的邮件程序，让用户向指定的地址发送邮件
- 电话链接：< a href="tel:13312345678">13312345678< /a>。使用tel协议，当用户点击这串数字，会唤起拨号页面，直接拨打号码

<h4>邮件、电话链接</h4>

链接也可以指向一个邮件地址，使用`mailto`协议。用户点击后，浏览器会打开本机默认的邮件程序，让用户向指定的地址发送邮件。

```
<a href="mailto:contact@example.com">联系我们</a>
```



如果是手机浏览的页面，还可以使用`tel`协议，创建电话链接。用户点击该链接，会唤起电话，可以进行拨号。

```
<a href="tel:13312345678">13312345678</a>
```

上面代码在手机中，点击链接会唤起拨号界面，可以直接拨打指定号码。

## link标签

将当前网页与外部资源联系起来，常见用途是加载CSS样式表。

```
<link href="default.css" rel="stylesheet" title="Default Style">
<link href="fancy.css" rel="alternate stylesheet" title="Fancy">
<link href="basic.css" rel="alternate stylesheet" title="Basic">
```

这里title是必须写的，是在浏览器菜单中列出这些样式表的名字。可以看到第一个是默认样式表，不过在rel里并没有体现。

第二个第三个样式表是替换样式表，这时在rel里就有所体现了，因为rel是描述当前资源与外部资源关系的属性。



link标签除了用于加载样式表，还可以用于加载图标文件，或者提供相关文档的链接。

---

### 属性

<h3>href</h3>

表示link标签链接的资源。

<h3>rel</h3>

表示外部资源与当前文档的关系，是link的必须属性。

- `alternate`：文档的另一种表现形式的链接，比如打印版。
- `help`：帮助文档的链接。
- `icon`：加载文档的图标文件。
- `license`：许可证链接。
- `prev`：表示当前文档是系列文档的一篇，这里给出上一篇文档的链接。
- `search`：提供当前网页的搜索链接。
- `stylesheet`：加载一张样式表。
- `prefetch`
- `preload`
- `prerender`

还有一些不太常用的属性。



<h3>hreflang</h3>

`hreflang`属性用来表示`href`属性链接资源的所用语言，通常指当前页面的其他语言版本。

```
<link href="https://example.com/de" rel="alternate" hreflang="de" />
```

上面示例中，`hreflang`表示`href`属性所链接页面使用德语，即当前页面的德语版本。

如果一个页面有多个语言的版本，`hreflang`属性可以设为`x-default`，表示哪一个页面是默认版本。

```
<link href="https://example.com" rel="alternate" hreflang="x-default" />
<link href="https://example.com/de" rel="alternate" hreflang="de" />
```

上面示例中，`hreflang`设为`x-default`表示该页面为默认版本。

<h3>media</h3>

两种使用方法。

1.外部资源生效的媒介条件。

```
<link href="print.css" rel="stylesheet" media="print">
<link href="mobile.css" rel="stylesheet" media="screen and (max-width: 600px)">
```

上面代码中，打印时加载`print.css`，移动设备访问时（设备宽度小于600像素）加载`mobile.css`。



2.条件加载

下面是使用`media`属性实现条件加载的例子。

```
<link rel="preload" as="image" href="map.png" media="(max-width: 600px)">
<link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```

上面代码中，如果屏幕宽度在600像素以下，则只加载第一个资源，否则就加载第二个资源。



<h3>as</h3>

`rel="preload"`或`rel="prefetch"`时，设置外部资源的类型

<h3>type</h3>

外部资源的 MIME 类型，目前仅用于`rel="preload"`或`rel="prefetch"`的情况



## 资源的预加载

### prefetch

后续会用到这个资源，不过不强制，优先级较低。

```
<link rel="prefetch" href="https://www.example.com/">
```

### preload

尽快加载这个资源，优先级较高

这个资源可能是CSS文件，字体文件。不过只是加载，并不会执行，比如只是加载样式文件，并不执行样式文件。（页面并未渲染，只是帮助减少渲染时间）

```
<link rel="preload" href="image.png" as="image">
```

可以用于加载关键资源。（指在当前页面加载的时候就去请求这些资源，但并不阻塞当前页面的渲染）

> preload可以配合`as`属性，告诉浏览器预处理资源的类型，以便正确处理。
>
> `as`属性指定加载资源的类型，它的值一般有下面几种。如果不指定`as`属性，或者它的值是浏览器不认识的，那么浏览器会以较低的优先级下载这个资源。
>
> - "script"
> - "style"
> - "image"
> - "media"
> - "document"
>
> 有时还需要`type`属性，进一步明确 MIME 类型。
>
> ```
> <link rel="preload" href="sintel-short.mp4" as="video" type="video/mp4">
> ```
>
> **不过preload也有立即执行的方法，就是需要配合onload回调函数**



### prerender

尽快加载网页，不仅加载网页，还要提前渲染网页，当用户要点的时候，希望立即就加载完（需要提前预测用户点不点，如果用户确实点，会很有帮助）

可以在用户浏览器空闲的时候使用这个。

```
<link rel="prerender" href="http://example.com/">
```

可以用于预加载用户会浏览的界面。



## 多媒体标签

用于放置视频和音频。

### video/audio/track/source/embed



### video

< video>标签是一个块级元素，用于放置视频。

如果浏览器支持video的视频格式，就会显示播放器；如果不支持，就会显示video内部的内容。

```
<video src="example.mp4" controls>
  <p>你的浏览器不支持 HTML5 视频，请下载<a href="example.mp4">视频文件</a>。</p>
</video>
```

< video>有以下属性

- `src`：视频文件的网址。

- `controls`：播放器是否显示控制栏。该属性是布尔属性，只要写上属性名，就表示打开。

  如果不想使用浏览器默认的播放器，而想使用自定义播放器，就不要使用该属性。

- `width`：视频播放器的宽度，单位像素。

- `height`：视频播放器的高度，单位像素。

- `autoplay`：视频是否自动播放，该属性为布尔属性。

- `loop`：视频是否循环播放，该属性为布尔属性。

- `muted`：是否默认静音，该属性为布尔属性。

- `poster`：视频播放器的封面图片的 URL。

- `preload`：视频播放之前，是否缓冲视频文件。这个属性仅适合没有设置`autoplay`的情况。它有三个值，分别是`none`（不缓冲）、`metadata`（仅仅缓冲视频文件的元数据）、`auto`（可以缓冲整个文件）。

- `playsinline`：iPhone Safari 浏览器播放视频会自动全屏，该属性可以禁止这种行为。该属性为布尔属性。

- `crossorigin`：是否采用跨域的方式加载视频。它可以取两个值，分别是`anonymous`（跨域请求时，不发送用户凭证，主要是 Cookie），`use-credentials`（跨域时发送用户凭证）。

- `currentTime`：指定当前播放位置（双精度浮点数，单位为秒）。如果尚未开始播放，则会从这个属性指定的位置开始播放。

- `duration`：该属性只读，指示时间轴上的持续播放时间（总长度），值为双精度浮点数（单位为秒）。如果是流媒体，没有已知的结束时间，属性值为`+Infinity`。

为了避免浏览器不支持视频格式，可以使用`<source>`标签，放置同一个视频的多种格式。

```
<video controls>
  <source src="example.mp4" type="video/mp4">
  <source src="example.webm" type="video/webm">
  <p>你的浏览器不支持 HTML5 视频，请下载<a href="example.mp4">视频文件</a>。</p>
</video>
```

### audio

< audio>标签是一个块级元素，用于放置音频，用法与< video>标签基本一致。

```
<audio controls>
  <source src="foo.mp3" type="audio/mp3">
  <source src="foo.ogg" type="audio/ogg">
  <p>你的浏览器不支持 HTML5 音频，请直接下载<a href="foo.mp3">音频文件</a>。</p>
</audio>
```

属性

- `autoplay`：是否自动播放，布尔属性。
- `controls`：是否显示播放工具栏，布尔属性。如果不设置，浏览器不显示播放界面，通常用于背景音乐。
- `crossorigin`：是否使用跨域方式请求。
- `loop`：是否循环播放，布尔属性。
- `muted`：是否静音，布尔属性。
- `preload`：音频文件的缓冲设置。
- `src`：音频文件网址。



<h2>track</h2>



指定字幕，结尾是.vtt格式。

```
<video controls src="sample.mp4">
   <track label="英文" kind="subtitles" src="subtitles_en.vtt" srclang="en">
   <track label="中文" kind="subtitles" src="subtitles_cn.vtt" srclang="cn" default>
</video>
```

track没有结束标签。

解释一下属性。label是字幕名称。

kind有两个值，一个是subtitles，表示翻译字幕。一个是captions，表示原始声音的文字描述。

src是字幕文件的网址

srclang是字幕语言

default是布尔属性，指是否默认打开。



### source

`<source>`标签用于`<picture>`、`<video>`、`<audio>`的内部，用于指定一项外部资源。单标签是单独使用的，没有结束标签。

它有如下属性，具体示例请参见相应的容器标签。

- `type`：指定外部资源的 MIME 类型。
- `src`：指定源文件，用于`<video>`和`<audio>`。
- `srcset`：指定不同条件下加载的图像文件，用于`<picture>`。
- `media`：指定媒体查询表达式，用于`<picture>`。
- `sizes`：指定不同设备的显示大小，用于`<picture>`，必须跟`srcset`搭配使用。



<h2>embed</h2>

用于嵌入外部内容。

```
<embed src="whoosh.swf" quality="medium"
       bgcolor="#ffffff" width="550" height="400"
       name="whoosh" align="middle" allowScriptAccess="sameDomain"
       allowFullScreen="false" type="application/x-shockwave-flash"
       pluginspage="http://www.macromedia.com/go/getflashplayer">
```

有一些自己的属性。具体的可以自己查。

大概是说embed插入的外部内容，然后外部内容需要相应的插件打开，这个插件需要浏览器自行调用。

比如这里的插件是需要flash打开的，那么浏览器自己会调用，如果没有，你可以用pluginspage去指定网址让用户去下载



<h2>object</h2>

容器元素。与embed相似，但没有历史遗留问题，更推荐使用。

```
<object type="application/pdf"
    data="/media/examples/In-CC0.pdf"
    width="250"
    height="200">
</object>
```

可以用data指定资源的URL

然后用type指定资源MIME类型



## iframe

### 基本用法

< iframe>标签会生成一个指定区域，在该区域可以嵌入其他网页，它是一个容器元素。

```
<iframe src="https://www.example.com"
        width="100%" height="500" frameborder="0"
        allowfullscreen sandbox>
  <p><a href="https://www.example.com">点击打开嵌入页面</a></p>
</iframe>
```

如果浏览器不支持< iframe>。就会显示内部的子元素。

上面代码首先嵌入一个网页，然后指定显示区域的宽度是100%，高度是500px，不绘制边框，允许全屏，打开网页所有权限。

以及如果不支持iframe，就会显示p元素。

<h4>属性</h4>

* allowfullscreen:允许网页全屏显示
* frameborder:是否绘制边框，0是不绘制，1是绘制。尽量不要用这个属性，而是用CSS设置。
* src：嵌入网页的URL
* width：显示区域的宽度
* height：显示区域的高度
* sandbox：设置嵌入网页的权限，下文有
* importance：浏览器下载嵌入网页的优先级。有以下三个值，high表示高优先级，low表示低优先级，auto表示由浏览器自己决定
* name：内嵌窗口名称，可以与a、form、base标签的target属性配合使用
* referrerpolicy:请求嵌入网页时，HTTP请求的referer字段的设置



### sandbox

指的是嵌入网页的权限，只输入这个属性就代表全打开，但是你也可以设置一些值来指定它的权限。

- `allow-forms`：允许提交表单。
- `allow-modals`：允许提示框，即允许执行`window.alert()`等会产生弹出提示框的 JavaScript 方法。
- `allow-popups`：允许嵌入的网页使用`window.open()`方法弹出窗口。
- `allow-popups-to-escape-sandbox`：允许弹出窗口不受沙箱的限制。
- `allow-orientation-lock`：允许嵌入的网页用脚本锁定屏幕的方向，即横屏或竖屏。
- `allow-pointer-lock`：允许嵌入的网页使用 Pointer Lock API，锁定鼠标的移动。
- `allow-presentation`：允许嵌入的网页使用 Presentation API。
- `allow-same-origin`：不打开该项限制，将使得所有加载的网页都视为跨域。
- `allow-scripts`：允许嵌入的网页运行脚本（但不创建弹出窗口）。
- `allow-storage-access-by-user-activation`：`sandbox`属性同时设置了这个值和`allow-same-origin`的情况下，允许`<iframe>`嵌入的第三方网页通过用户发起`document.requestStorageAccess()`请求，经由 Storage Access API 访问父窗口的 Cookie。
- `allow-top-navigation`：允许嵌入的网页对顶级窗口进行导航。
- `allow-top-navigation-by-user-activation`：允许嵌入的网页对顶级窗口进行导航，但必须由用户激活。
- `allow-downloads-without-user-activation`：允许在没有用户激活的情况下，嵌入的网页启动下载。



### loading

< iframe>指定的网页一般立即加载，但我们并不总是希望如此。可以用loading属性设置。

loading属性可以设置以下三个值，

* auto：浏览器默认行为，与不使用loading属性效果一致
* lazy：懒加载< iframe> ，即将滚动进入视口时开始加载
* eager：立即加载，无论在页面上的位置在哪里。

但是如果< iframe>是隐藏的，则loading属性无效，会立即加载。

> 只要满足以下任一个条件，Chrome 浏览器就会认为`<iframe>`是隐藏的。
>
> > - `<iframe>`的宽度和高度为4像素或更小。
> > - 样式设为`display: none`或`visibility: hidden`。
> > - 使用定位坐标为负`X`或负`Y`，将`<iframe`>放置在屏幕外。



## script标签

< script>标签用于在网页插入脚本，< noscript>标签用于指定浏览器不支持脚本时的显示内容。

 < script>用于加载脚本代码

```
<script>
console.log('hello world');
</script>
```

上面代码嵌入网页，会立即执行。

---

加载外部脚本：

src给出外部脚本的地址。

```
<script type="text/javascript" src="javascript.js"></script>
```

type给出脚本的类型。

> 对于那些不支持 ES6 模块的浏览器，可以设置`nomodule`属性。支持 ES6 模块的浏览器，会不加载指定的脚本。这个属性通常与`type="module"`配合使用，作为老式浏览器的回退方案。
>
> ```
> <script type="module" src="main.js"></script>
> <script nomodule src="fallback.js"></script>
> ```
>
> 上面第一行是说脚本类型是module，意为“模块”，指的是这是ES6新版脚本。
>
> 下一行是指浏览器不支持新版脚本的时候，可以使用这个脚本。里面是nomodule
>
> 这两句话常常配合使用。核心是type="module"

---

js还有一些其他属性。

- `async`：该属性指定 JavaScript 代码为异步执行，不是造成阻塞效果，JavaScript 代码默认是同步执行。
- `defer`：该属性指定 JavaScript 代码不是立即执行，而是页面解析完成后执行。
- `crossorigin`：如果采用这个属性，就会采用跨域的方式加载外部脚本，即 HTTP 请求的头信息会加上`origin`字段。
- `integrity`：给出外部脚本的哈希值，防止脚本被篡改。只有哈希值相符的外部脚本，才会执行。
- `nonce`：一个密码随机数，由服务器在 HTTP 头信息里面给出，每次加载脚本都不一样。它相当于给出了内嵌脚本的白名单，只有在白名单内的脚本才能执行。
- `referrerpolicy`：HTTP 请求的`Referer`字段的处理方法。



```
<noscript>
  您的浏览器不能执行 JavaScript 语言，页面无法正常显示。
</noscript>
```

上面这段代码，只有浏览器不能执行 JavaScript 代码时才会显示，否则就不会显示。



##  

## 表格标签

### 一级元素

#### table

是一个块级容器标签，所有表格内容都要放到这个标签里。

< caption>是表格里的**第一个子元素**，表示表格的标题。不过caption是可选元素，也可以不写。

### 一级子元素

#### thead/tbody/tfoot

`<thead>`、`<tbody>`、`<tfoot>`都是块级容器元素，且都是`<table>`的一级子元素，分别表示表头、表体和表尾。

```
<table>
  <thead>... ...</thead>
  <tbody>... ...</tbody>
  <tfoot>... ...</tfoot>
</table>
```

这几个元素有先后顺序，不能逾越。不过大型表格内部可以使用多个`<tbody>`，表示连续的多个部分。

#### colgroup/col

< colgroup>是< table>的一级子元素，用来包含**列的定义**。< col>是< colgroup>的子元素，是**一组列的定义。**

< col>是空元素，没有子元素。作用一个是申明表格结构，二个是为表格添加附加样式。

**span属性：**< col>有一个span属性，值是正整数，默认为1。表示该列的宽度包含几列。



#### tr

< tr>全称是table row。表示一行。

它可以放在`<thead>`、`<tbody>`、`<tfoot>`当中，

也可以直接放在`<table>`的下一级当中。

既可以当一级标题，也可以当二级标题。

### 二级子元素

#### th/td

位于< tr>中，这俩的全称分别是table header cell、table data cell。

既标题单元格，数据单元格。

注意这俩都是单元格，不要与行搞混了。

**属性：**

**（1）`colspan`属性，`rowspan`属性**

单元格会有跨越多行或多列的情况，这要通过`colspan`属性和`rowspan`属性设置，前者表示单元格跨越的栏数，后者表示单元格跨越的行数。它们的值都是一个非负整数，默认为1。

**（2）`headers`属性**

```
<table>
  <tr>
    <th id="no">学号</th><th id="names">姓名</th>
  </tr>
  <tr>
    <td headers="no">001</td><td headers="names">张三</td>
  </tr>
  <tr>
    <td headers="no">002</td><td headers="names">李四</td>
  </tr>
</table>
```

如果表格很大，单元格很多，源码里面会看不清，哪个单元格对应哪个表头，这时就可以使用`headers`属性。

`headers`属性的值总是对应`<th>`标签的`id`属性的值。

由于一个单元格可以对应多个标题栏（跨行的情况），所以`headers`属性可以是一个空格分隔的字符串，对应多个`id`属性的值。

### 属性

#### scoup

是专门给< th>用的，不给< td>用。

表示该`<th>`单元格到底是栏的标题，还是列的标题。

`scope`属性可以取下面这些值。

- `row`：该行的所有单元格，都与该标题单元格相关。
- `col`：该列的所有单元格，都与该标题单元格相关。
- `rowgroup`：多行组成的一个行组的所有单元格，都与该标题单元格相关，可以与`rowspan`属性配合使用。
- `colgroup`：多列组成的一个列组的所有单元格，都与该标题单元格相关，可以与`colspan`属性配合使用。
- `auto`：默认值，表示由浏览器自行决定。



