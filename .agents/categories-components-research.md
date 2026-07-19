# Categories 组件点击行为调研

调研时间：2026-07-19

本次只做前期调研，没有修改业务代码。当前桌面上看到的两个 Categories 入口，其实走的是同一份分类树数据，但展示组件和交互策略完全不同：

| 位置 | 组件 | 主要文件 | 当前点击行为 |
| --- | --- | --- | --- |
| 顶部导航栏下拉级联菜单 | `CascadeSelector.svelte` | `src/components/Navbar.astro`、`src/components/CascadeSelector.svelte` | 只有没有 `children` 的叶子节点会跳转 |
| 左侧/桌面侧边栏卡片 | `Categories.astro` | `src/components/widget/SideBar.astro`、`src/components/widget/Categories.astro`、`src/components/widget/WidgetLayout.astro` | 父节点和叶子节点都有链接，可以直接使用 |

## 结论先行

顶部导航栏“非叶子节点不能点击”，不是分类数据没有父级 URL，也不是归档页不支持父分类筛选，而是 `src/components/CascadeSelector.svelte` 的 `clickItem()` 主动限制了只有叶子节点才导航。

关键代码在 `src/components/CascadeSelector.svelte`：

```ts
function clickItem(colIdx: number, itemIdx: number) {
	const item = menus[colIdx][itemIdx];
	if (!item.children || item.children.length === 0) {
		isOpen = false;
		activePath = [];
		window.location.href = `/archive/?category=${encodeURIComponent(item.value)}`;
	}
}
```

这里的 `if (!item.children || item.children.length === 0)` 就是现象来源：父节点有 `children`，所以点击后什么也不会发生。

从数据链路看，父节点是有完整路径的，例如 `基本功`、`基本功/网络`：

- `src/utils/content-utils.ts` 会给每个 `CategoryNode` 生成 `url`。
- `src/components/Navbar.astro` 的 `convertToCascaderOptions()` 会给每个节点生成完整 `value`。
- `src/components/ArchivePanel.svelte` 支持父分类匹配子分类：`post.data.category === cat || post.data.category.startsWith(`${cat}/`)`。

所以如果后续要让顶部父节点也能点，重点是改级联菜单的交互，不是重做分类树或归档筛选。

## 共享数据来源

两个组件都依赖 `src/utils/content-utils.ts` 的 `getCategoryTree()`。

数据结构：

```ts
export type CategoryNode = {
	name: string;
	count: number;
	url: string;
	children?: CategoryNode[];
};
```

分类树构建过程大致是：

1. 读取所有文章 frontmatter 的 `category`。
2. 通过 `/` 拆分路径，例如 `前端/JavaScript/其他`。
3. 插入树结构。
4. 给父节点补全 `count`，父节点数量等于自身文章数加所有子节点文章数。
5. 给每个节点生成归档页 URL。

父级节点 URL 是有效的。比如 `基本功` 最终会变成：

```txt
/archive/?category=%E5%9F%BA%E6%9C%AC%E5%8A%9F
```

归档页入口是 `src/pages/archive.astro`，它把文章列表交给 `src/components/ArchivePanel.svelte`。归档页筛选逻辑已经支持“选父分类时展示该父分类下所有子分类文章”。

## 顶部导航栏 Categories

相关文件：

- `src/config.ts`
- `src/constants/link-presets.ts`
- `src/components/Navbar.astro`
- `src/components/CascadeSelector.svelte`

链路如下：

1. `src/config.ts` 的 `navBarConfig.links` 里配置了 `LinkPreset.Category`。
2. `src/components/Navbar.astro` 遍历导航配置，遇到 `LinkPreset.Category` 时不渲染普通 `<a>`，而是设置 `showCascadeSelector = true`。
3. `Navbar.astro` 调用 `getCategoryTree()`。
4. `Navbar.astro` 用 `convertToCascaderOptions()` 把 `CategoryNode` 转成 `CascadeSelector` 需要的数据：

```ts
{
	value: fullPath,
	label: node.name,
	children: ...
}
```

这里的 `value` 是完整路径，不只是当前节点名称。也就是说顶部组件已经知道父分类应该跳到哪里。

`CascadeSelector.svelte` 的核心状态：

- `isOpen`：面板是否展开。
- `activePath`：每一列当前 hover 的节点下标，例如 `[1, 2]`。
- `menus`：根据 `activePath` 推导出当前应该展示的多列菜单。

顶部级联菜单的交互是 hover 展开、click 跳转：

- `onmouseenter={() => hoverItem(colIdx, itemIdx)}` 用来展开下一列。
- `onclick={() => clickItem(colIdx, itemIdx)}` 用来跳转。
- 但 `clickItem()` 里只允许叶子节点跳转，所以父节点点击无效。

这也是当时 AI 可能改很久的原因：这不是简单的“给父节点补 URL”，而是要决定父节点同一行到底承担几个动作：

- hover 展开子菜单；
- click 跳转父分类；
- 箭头或空白区域是否还要只负责展开；
- 用户点击父节点时，是想进入父分类，还是只是想展开下一列。

当前组件用的是 `<button>`，不是 `<a>`。如果要让父节点也可点击，可能要继续用 `window.location.href`，或者把菜单项重构成链接/按钮组合。

## 侧边栏 Categories 卡片

相关文件：

- `src/components/widget/SideBar.astro`
- `src/components/widget/Categories.astro`
- `src/components/widget/WidgetLayout.astro`

链路如下：

1. `src/layouts/MainGridLayout.astro` 渲染 `SideBar`。
2. `src/components/widget/SideBar.astro` 引入并渲染 `<Categories />`。
3. `Categories.astro` 自己调用 `getCategoryTree()`。
4. `Categories.astro` 用 `renderCategoryNodes()` 递归拼 HTML 字符串。
5. 最后通过 `<div class="category-tree" set:html={categoryTreeHtml}></div>` 注入 DOM。

父节点渲染为：

```html
<details class="category-parent">
	<summary class="category-summary">
		<a href="${node.url}" class="category-link">${node.name.trim()}</a>
		<span class="category-count">${node.count}</span>
		<span class="category-arrow">...</span>
	</summary>
	<div class="category-children">...</div>
</details>
```

叶子节点渲染为：

```html
<a href="${node.url}" class="category-leaf">
	<span class="leaf-name">${node.name.trim()}</span>
	<span class="category-count">${node.count}</span>
</a>
```

所以侧边栏能“自由使用”的直接原因是：父节点本来就是 `<a href="${node.url}">`，叶子节点也是 `<a href="${node.url}">`。

不过这里也有一个细节：父节点链接被放在 `<summary>` 内。点击文字区域会触发链接，点击 summary 其他区域会折叠/展开。这个交互刚好把“进入父分类”和“展开子分类”拆开了。

## 两套组件的关键差异

| 维度 | 顶部级联菜单 | 侧边栏卡片 |
| --- | --- | --- |
| 数据来源 | `getCategoryTree()` | `getCategoryTree()` |
| 父级 URL | 有，通过 `value: fullPath` 生成 | 有，直接使用 `node.url` |
| 展开方式 | hover 进入下一列 | `<details>/<summary>` 原生展开 |
| 跳转方式 | `window.location.href` | 原生 `<a href>` |
| 父节点点击 | 被 `clickItem()` 的叶子判断拦截 | 父节点文字链接可跳转 |
| 改动复杂点 | 同一菜单项同时承担 hover 展开和 click 跳转 | 已经拆成链接区域与 summary 区域 |

## 如果后续要改顶部组件

可以考虑三个方案。

方案 A：最小改动，让所有节点点击都跳转。

思路：去掉 `clickItem()` 里的叶子节点判断，让父节点也执行：

```ts
window.location.href = `/archive/?category=${encodeURIComponent(item.value)}`;
```

优点：改动最小，数据已经支持，归档页也支持。

风险：父节点整行点击都会跳转。虽然 hover 仍然能展开子列，但用户如果习惯点击父节点来“展开”，会被直接带到归档页。

方案 B：拆分父节点的点击区域。

思路：参考侧边栏，把父节点文字做成链接，把右侧箭头/行 hover 保留为展开区域。

优点：交互语义最清楚，父节点能点，子菜单也不容易误触。

风险：需要重构 `CascadeSelector.svelte` 的菜单项结构，处理 `<a>`、`button`、hover、click outside、键盘可访问性和样式，改动量比方案 A 大。

方案 C：保留当前顶部交互，只在侧边栏使用父分类跳转。

优点：零风险，符合现状。

缺点：顶部 Categories 的父分类依旧不可直接进入，两个 Categories 入口体验不一致。

我的倾向：如果只是解决“父节点能点”，方案 A 足够；如果想把交互做得更稳，方案 B 更像长期方案。考虑到你之前提到 AI 改了很久，后续动手前建议先明确：顶部父节点整行点击是否可以直接跳转。如果可以，事情会简单很多。

## 额外观察

- 当前部分源码注释出现乱码，可能是历史编码问题。改逻辑时最好避免顺手大面积重写注释，否则 diff 会很乱。
- `Categories.astro` 使用 `set:html` 拼接 HTML 字符串，当前分类名来自本地 frontmatter，风险较低；如果未来分类名来自外部输入，需要考虑转义。
- `content-utils.ts` 里分类树基础排序是按名称排序；侧边栏又在 `renderCategoryNodes()` 内把有子节点的分支排在叶子前面。顶部级联菜单目前主要沿用数据层排序，不一定和侧边栏显示顺序完全一致。
- 当前工作区已有其他未提交改动，本次调研文档不触碰这些文件。
