# 部分架构（鱼皮）
## vuepress文件
sidebars目录用于存放详细的侧边栏配置
## theme
二次开发的纯代码
config.ts是vuepress核心配置文件，
extraSidebars是吸附侧边栏
navbar.ts是导航栏
footer是底部信息
# 整体架构(ai生成版)

这是一个基于 VuePress 1.x 构建的个人博客/文档网站，主要用于展示你的技术文章和笔记。项目采用了 VuePress 的默认主题并进行了一些扩展和定制。

## 目录结构

1. **根目录**：
   - `package.json` 和 `package-lock.json`：项目依赖管理
   - `README.md`：网站首页内容
   - `deploy.sh`：部署脚本，用于将网站部署到 GitHub Pages
   - `.gitignore`：Git 忽略文件

2. **.vuepress 目录**：VuePress 核心配置
   - `config.ts`：主要配置文件，定义了网站标题、描述、插件等
   - `navbar.ts`：导航栏配置
   - `sidebar.ts`：侧边栏配置
   - `footer.ts`：页脚配置
   - `extraSideBar.ts`：额外侧边栏配置
   - `public/`：存放静态资源
   - `theme/`：主题定制，基于 VuePress 默认主题扩展
   - `sidebars/`：详细的侧边栏配置，按分类组织

3. **docs 目录**：所有文档内容
   - `基本功/`：包含数据结构、C++、算法、计算机组成原理等基础知识
   - `前端/`：包含 HTML、CSS、JavaScript、Vue、Axios 等前端技术文章

## 技术栈

1. **框架**：VuePress 1.9.10
2. **主题**：基于 VuePress 默认主题扩展
3. **插件**：使用了多种插件增强功能
   - 返回顶部
   - Google 分析
   - 图片缩放
   - SEO 优化
   - 站点地图
   - 百度自动推送
   - 标签系统
   - 代码复制
   - RSS 订阅
   - 图片懒加载
   - 阅读进度条
   - 阅读时间估计
   - 社交分享

## 内容组织

内容主要分为两大类：
1. **基本功**：包含计算机基础知识，如数据结构、C++、算法和计算机组成原理
2. **前端**：包含前端技术栈，如 HTML、CSS、JavaScript、Vue 和 Axios

## 部署方式

使用 `deploy.sh` 脚本将生成的静态文件部署到 GitHub Pages，通过 `XieChi0.github.io` 域名访问。

## 主要功能

1. 文档展示与导航
2. SEO 优化
3. 百度统计与 Google 分析
4. 代码高亮与复制
5. 阅读进度指示
6. 社交分享
7. 响应式设计

网站目前正在建设中，已经有基本的导航结构和内容分类，但部分功能（如评论系统）尚未完全配置。