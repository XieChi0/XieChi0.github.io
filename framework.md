## 在根目录中，
package.json中配置了了开发服务器、生产环境构建的命令以及一些插件生态
在gitinore中额外配置了vuepress构建输出，包含缓存目录
deploy.sh是shell脚本，会自动化部署到gitHub Page,
github/workflow/docs.yml:github自动化部署
> 触发条件：推送到main分支
### 开发环境配置
.vscode/launch.json：vscode本地调试配置
.temp/：vuepress临时文件目录
.cache/：vuepress缓存目录
node_modules/：npm依赖目录
### 文档文件
README.md：文件中的
---
permallink:/
---
是YAML前置块，通常用于静态网站生成器（如vuepress）配置页面元数据
docs/文件夹是文档资源
### vuepress配置层
config.ts：vuepress主配置网站
> 包含网站信息，seo配置，插件生态，开发服务器(8080端口、热更新、轮询监听)，主题配置(自定义logo、导航栏、侧边栏)
navbar.ts：顶部导航栏配置
sidebar.ts：侧边栏配置
sidebars/：侧边栏配置目录
publics/：静态资源目录

## git提交标准
feat：新功能。
fix：修复 bug。
docs：文档变更。
style：代码风格调整（不影响逻辑）。
refactor：重构代码（不添加功能或修复 bug）。
perf：性能优化。
test：添加或修改测试。
chore：杂项（如更新依赖）。
ci：CI 配置变更。
revert：回滚提交。