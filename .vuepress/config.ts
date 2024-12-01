import { defineConfig } from "vuepress/config";
import navbar from "./navbar";
import sidebar from "./sidebar";
import footer from "./footer";
import extraSideBar from "./extraSideBar";

const author = "谢池";
const domain = "https://XieChi0.github.io/";
const tags = ["程序员", "编程", "博客"];

export default defineConfig({
  title: "XChi的个人网站",
  description: "这是我网站的描述",
  head: [
    // 站点图标
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // SEO
    [
      "meta",
      {
        name: "keywords",
        content:
          "谢池的网站简介,A,B",
      },
    ],
    // 百度统计
    [
      "script",
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?2675818a983a3131404cee835018f016";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],
  // permalink: "/:slug",

  // 监听文件变化，热更新
  extraWatchFiles: [".vuepress/*.ts", ".vuepress/sidebars/*/*"],  //允许额外触发热更新的文件范围
  markdown: { //自定义额外的md渲染规则
    // 开启代码块的行号
    lineNumbers: true,
    // 支持 4 级以上的标题渲染
    extractHeaders: ["h2", "h3", "h4", "h5", "h6"],
  },
  // @ts-ignore
  plugins: [
    ["@vuepress/back-to-top"],
    // Google 分析
    [
      "@vuepress/google-analytics",
      {
        ga: "GTM-WVS9HM6W", // 补充自己的谷歌分析 ID，比如 UA-00000000-0
      },
    ],
    ["@vuepress/medium-zoom"],
    // https://github.com/lorisleiva/vuepress-plugin-seo
    [
      "seo",
      {
        siteTitle: (_, $site) => $site.title,
        title: ($page) => $page.title,
        description: ($page) =>
          $page.frontmatter.description || $page.description,
        author: (_, $site) => $site.themeConfig.author || author,
        tags: ($page) => $page.frontmatter.tags || tags,
        type: ($page) => "article",
        url: (_, $site, path) =>
          ($site.themeConfig.domain || domain || "") + path,
        image: ($page, $site) =>
          $page.frontmatter.image &&
          (($site.themeConfig.domain &&
            !$page.frontmatter.image.startsWith("http")) ||
            "") + $page.frontmatter.image,
        publishedAt: ($page) =>
          $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: ($page) => $page.lastUpdated && new Date($page.lastUpdated),
      },
    ],
    // https://github.com/ekoeryanto/vuepress-plugin-sitemap
    [
      "sitemap",
      {
        hostname: domain,
      },
    ],
    // https://github.com/IOriens/vuepress-plugin-baidu-autopush
    ["vuepress-plugin-baidu-autopush"],
    // https://github.com/zq99299/vuepress-plugin/tree/master/vuepress-plugin-tags
    ["vuepress-plugin-tags"],
    // https://github.com/znicholasbrown/vuepress-plugin-code-copy
    [
      "vuepress-plugin-code-copy",
      {
        successText: "代码已复制",
      },
    ],
    // https://github.com/webmasterish/vuepress-plugin-feed
    [
      "feed",
      {
        canonical_base: domain,
        count: 10000,
        // 需要自动推送的文档目录
        posts_directories: [],
      },
    ],
    // https://github.com/tolking/vuepress-plugin-img-lazy
    ["img-lazy"],
    // 进度条
    // https://github.com/tolking/vuepress-plugin-reading-progress
    ["reading-progress", {
      readingDir: /[^/]+$/
    }],
    // 建议阅读时间
    // https://github.com/darrenjennings/vuepress-plugin-reading-time
    ['vuepress-plugin-reading-time'],
    // 分享插件
    // https://github.com/ntnyq/vuepress-plugin-social-share/blob/v1/docs/guide/README.md
    ['social-share', {
      networks: ['qq', 'wechat', 'twitter'],
    }],
    // 评论区
    // https://github.com/JoeyBling/vuepress-plugin-mygitalk
    // ['vuepress-plugin-mygitalk', {
    //   home: false,
    //   gitalk: {
    //     clientID: '',
    //     clientSecret: '',
    //     repo: '',
    //     owner: '',
    //     admin: [],
    //   },
    // }],
  ],
  // 主题配置
  themeConfig: {
    // logo: "/logo.png",
    logo:"https://s1.imagehub.cc/images/2024/11/27/0ead02493a39c5b0e7a6333222bb3a35.th.jpg",
    nav: navbar,
    sidebar,
    sidebarDepth: 4,
    lastUpdated: "最近更新",

    // GitHub 仓库位置
    // repo: "",
    // docsBranch: "",

    // 编辑链接
    editLinks: true,
    editLinkText: "完善页面",

    // @ts-ignore
    // 底部版权信息
    footer,
    // 额外右侧边栏
    extraSideBar,
  },
  devServer: {
    hot: true,
    port: 8080,
    host: 'localhost',
    watchOptions: {
      poll: true,      // 启用轮询
      ignored: /node_modules/,
      aggregateTimeout: 300  // 防抖时间
    }
  },
  // 设置首页的 permalink
  // permalink: "/",
});
