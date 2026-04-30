import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// 文件职责： 提供获取博客文章列表、分类列表、标签列表的工具函数，是内容层的数据中枢。

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}
// 树形分类的一个节点,原先是Category，现在为了区分叫做CategoryNode
// 之所以定义在这里是因为这是函数计算结果的类型，不需要让别人调用ts时进行检查
export type CategoryNode = {
	name: string;
	count: number;
	url: string;
	children?: CategoryNode[]; //可选字段：子节点数组，如果有子节点就写，没有的话就是undefined，因为这里的type后面有个问号
};

// 路径解析函数，如输入"编程/算法"，则返回["编程", "算法"]
function parseCategoryPath(path: string): string[] {
	return path
		.split("/")
		.map((p) => p.trim())
		.filter((p) => p);
}
// split接收字符串，输出字符串数组 ["a",' b ','c']（字符串方法）
// map接收数组，然后逐个处理每个字符串，该有的前后空格去掉 ["a",'b','c']
// filter接收map处理完的数组，留下非空字符串，filter的规则遇到true就保留，返回false就丢掉，所以""会被filter直接丢掉
// 而之所以要用map和filter的前后组合是因为map是对数组里每一项加工一遍，它一个都不会减少，只能改不能删
// 而filter会对不合格的可以扔掉
// 将博客文章数组转换为分类树的核心算法

// 将博客文章数组转换为分类树的核心算法（支持任意层级）
// 接收格式
// Posts = [
//     { data: { category: "Examples" }, ... },
//     { data: { category: "前端/CSS" }, ... },
//     { data: { category: "业务/水文" }, ... },
// ]
function buildCategoryTree(
	posts: { data: { category: string | null } }[],
): CategoryNode[] {
	// 统计每个分类的文章数（叶子节点），leftCounts是字典，key是完整路径，val是文章数
	// leafCounts = {
	// 	"未分类": 2,
	// 	"前端/CSS": 1
	//   }
	const leafCounts: { [key: string]: number } = {};
	posts.forEach((post) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			leafCounts[ucKey] = (leafCounts[ucKey] || 0) + 1;
			return;
		}
		const categoryName = String(post.data.category).trim();
		leafCounts[categoryName] = (leafCounts[categoryName] || 0) + 1;
	});

	// 树根节点数组
	const root: CategoryNode[] = [];

	// 传入一个节点和剩余路径，函数把第一段插进去，然后调用自己处理剩余的路径段。
	// 内部函数，只能在buildCategoryTree内部调用
	function insertNodeRecursive(
		parent: CategoryNode,
		parts: string[], //剩余的路径段
		fullPath: string,
		count: number,
		parentPath: string, //从根到目前parent（父节点）的完整路径
	) {
		// 如果没有剩余路径，说明已经插入完了，直接返回，是递归终止条件
		if (parts.length === 0) return;

		const [currentName, ...rest] = parts; //把parts的第一个元素叫currentName，剩余元素组成一个数组叫rest（ES6解构赋值）
		const currentFullPath = `${parentPath}/${currentName}`; //把currentName拼接到parentPath后面，得到当前的完整路径

		// 懒创建 children：只有当需要添加子节点时才创建数组
		if (!parent.children) parent.children = [];
		let node = parent.children.find((n) => n.name === currentName); //数组方法，返回让第一个函数返回true的元素
		// 如果rest为空，说明这是叶子节点，直接创建或累加计数
		if (rest.length === 0) {
			if (!node) {
				parent.children.push({
					name: currentName,
					count: count,
					url: getCategoryUrl(currentFullPath),
					children: undefined,
				});
			} else {
				node.count += count;
				node.url = getCategoryUrl(currentFullPath);
			}
		} else {
			// 非叶子节点：确保子节点存在，然后继续往下递归
			if (!node) {
				node = {
					name: currentName,
					count: 0,
					url: getCategoryUrl(currentFullPath),
				};
				parent.children.push(node);
			}
			insertNodeRecursive(node, rest, fullPath, count, currentFullPath);
		}
	} //insertNodeRecursive函数结束

	// 遍历所有叶子路径，逐个插入树中
	Object.keys(leafCounts).forEach((fullPath) => {
		const parts = parseCategoryPath(fullPath);
		if (parts.length === 0) return;

		// 尝试在根节点中查找第一个段
		let node = root.find((n) => n.name === parts[0]);

		if (parts.length === 1) {
			// 单级分类：直接在根节点处理
			if (!node) {
				root.push({
					name: parts[0],
					count: leafCounts[fullPath] || 0,
					url: getCategoryUrl(fullPath),
				});
			} else {
				node.count += leafCounts[fullPath] || 0;
				node.url = getCategoryUrl(fullPath);
			}
		} else {
			// 多级分类：先确保根节点存在，再递归插入
			if (!node) {
				node = {
					name: parts[0],
					count: 0,
					url: getCategoryUrl(parts[0]),
				};
				root.push(node);
			}
			// 递归插入时传入第一段的完整路径作为 parentPath
			insertNodeRecursive(
				node,
				parts.slice(1),
				fullPath,
				leafCounts[fullPath] || 0,
				parts[0],
			);
		}
	});

	// 计算每个节点的总数（父节点 count = 自身 + 所有后代之和）
	function computeParentCount(node: CategoryNode) {
		if (node.children && node.children.length > 0) {
			node.children.forEach(computeParentCount);
			node.count += node.children.reduce((sum, child) => sum + child.count, 0);
		}
	}
	root.forEach(computeParentCount);

	// 对所有层级的节点按字母排序（递归）
	function sortNodes(nodes: CategoryNode[]) {
		nodes.sort((a, b) =>
			a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
		);
		nodes.forEach((node) => {
			if (node.children && node.children.length > 0) {
				sortNodes(node.children);
			}
		});
	}
	sortNodes(root);

	return root;
}

// 入口函数，负责从内容集合中取出所有文章
export async function getCategoryTree(): Promise<CategoryNode[]> {
	// getCollection是内容集合API，会自动扫描src/content/posts目录下所有md文件，把frontmatter（YAML）解析成结构化数据
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		// 如果是生产环境，过滤掉草稿（draft）
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	// 把文章数组传给这个函数去进一步处理
	return buildCategoryTree(allBlogPosts);
}

// ps：buildCategoryTree最终返回树形结构
// [
// 	{
// 	  "name": "Examples",
// 	  "count": 1,
// 	  "url": "/archive/?category=Examples",
// 	  "children": undefined
// 	},
// 	{
// 	  "name": "前端",
// 	  "count": 1,
// 	  "url": "/archive/?category=前端",
// 	  "children": [
// 		{
// 		  "name": "CSS",
// 		  "count": 1,
// 		  "url": "/archive/?category=前端/CSS",
// 		  "children": undefined
// 		}
// 	  ]
// 	},
// 	{
// 	  "name": "业务",
// 	  "count": 1,
// 	  "url": "/archive/?category=业务",
// 	  "children": [
// 		{
// 		  "name": "水文",
// 		  "count": 1,
// 		  "url": "/archive/?category=业务/水文",
// 		  "children": undefined
// 		}
// 	  ]
// 	}
//   ]
