---
title: wch1d-打包部署
published: 2026-06-05
updated: 2026-06-05
description: '梳理 WCH1D 当前前后端打包部署流程，并说明如何逐步接入 GitLab CI/CD。'
image: ''
tags: []
category: '业务/正式'
private: true
draft: false
---

**你本地同时 push 到 Gitee 和 GitLab**

比如你以后一个命令同时推两个远端：

```
git push gitee main git push gitlab main
```

GitLab 作为 CI/CD 主仓库，Gitee 作为代码托管或备份。

## 当前已有流程

前端脚本现在做的是：

```
指定 version/branch
删除旧目录
git clone 指定分支
替换 yarn.lock 里的 npm 源
yarn install
npm run build:win
复制 dist 里的 exe 和 latest.yml 到 artifacts 目录
```

后端脚本更完整，已经很像 CI 流水线了：

```
切 Node 18
指定 version/branch
准备 dist 目录
复制基础 wch1d 目录
git clone 后端代码
cnpm install --production
pkg 打 exe
复制 template.db
生成完整 zip
生成 update zip
启动测试服务
跑 Node 集成测试
跑 Python API 测试
复制测试报告
停止测试服务
复制制品到 artifacts
scp 上传 update 包到远程机器
```


你现在其实已经有一个“人工打包流水线”。

前端在 wuchuan-master/wch_hydro1d：

```
1. 手动运行 bat
2. 拉取指定版本/分支的前端代码
3. 安装依赖
4. 执行 `npm run build:win`
5. 生成 Electron Windows 安装包 exe
6. 复制 `exe/latest.yml` 到本地 `artifacts` 目录
```

后端在 wuchuan-Backend/wch1d_modelingtool_crossplatform：

```
1. 手动运行 bat
2. 拉取指定版本/分支的后端代码
3. 安装生产依赖
4. 用 `pkg` 打成 `WCH1D.exe`
5. 组装 Windows 后端运行目录
6. 压缩完整包和 update 包
7. 启动打包后的后端服务
8. 跑 Node 集成测试
9. 跑 Python API 测试
10. 生成测试报告
11. 复制 zip 和报告到本地 `artifacts` 目录
12. 用 `scp` 上传 update 包到远程服务器
```

后端 Linux 这边也已经有基础：

```
1. `Dockerfile`
2. `podman-xbuild.toml`
3. `compose` 示例
4. `quadlet` 示例
5. `s6-overlay` 启动配置
6. `Caddy` 反向代理
7. `template_db` 初始化脚本
```

也就是说：**Windows 打包测试已经靠 bat 跑起来了，Linux 容器化基础也已经存在，但两边还没有被统一纳入 GitLab 流水线。**

代码主仓库：Gitee 或 GitLab
GitLab：有完整代码
Runner：直接构建 GitLab 当前 commit
产物：保存到 GitLab artifacts / registry / release

GitLab 只需要做三件事：

```
1. 执行构建/测试命令
2. 找到产物
3. 把产物保存到 GitLab 自己的体系里
```

## 流程

```
你提交代码到 Gitee
        ↓
GitLab 同步/镜像这份代码
        ↓
GitLab Runner 开始执行 pipeline
        ↓
Windows Runner 构建前端 Windows 安装包
        ↓
Windows Runner 构建后端 Windows 包并跑测试
        ↓
Linux Runner 构建后端 Linux 镜像并跑测试
        ↓
GitLab 保存所有产物和测试报告
        ↓
正式版本时创建 GitLab Release
        ↓
需要部署时，人工点击 deploy job 部署到客户机器
```

## **GitLab 如何处理产物**

GitLab Runner 执行完构建后，会根据 .gitlab-ci.yml 里的配置，把指定文件上传回 GitLab。

比如：

```
前端 exe/latest.yml
后端 zip/update zip
Python API 测试报告
RPA 测试报告
build-info.json
```

这些在 GitLab 里叫 artifacts。你可以理解成：

```
某一次 pipeline 的附件
```

正式发布时，再把这些 artifacts 整理成 Release。

Release 可以理解成：

```
一个正式版本的下载页/发布页
```

里面挂：

```
前端安装包
后端 Windows 包
后端 Linux 镜像地址
测试报告
版本信息
部署说明
```

## **Windows 和 Linux 怎么统一**

不是强行做成同一种包，而是统一“版本”和“流程”。

Windows 产物：

```
frontend.exe backend.zip update-backend.zip
```

Linux 产物：

```
Docker/Podman 镜像 compose.yml 或 quadlet 配置
```

统一点是：

```
同一个 commit
同一个版本号
同一次 pipeline
同一套测试报告
同一个 Release 页面
```

所以不是：

```
Windows 和 Linux 打成同一个东西
```

而是：

```
Windows 是目录包/安装包 Linux 是容器镜像 但它们属于同一个发布版本
```

**现阶段最应该做的版本**
先做这个：

```
1. GitLab 同步 Gitee 代码
2. Windows Runner 执行前端构建命令
3. Windows Runner 执行后端 Windows 打包和测试命令
4. Linux Runner 使用 Dockerfile 构建后端镜像
5. GitLab 保存 exe、zip、镜像地址、测试报告
```

暂时不急着做客户一键部署。

因为做到这里，你就已经从“我本地手动打包”升级成：

```
代码提交后，自动构建 Windows / Linux 交付产物，并自动执行测试和归档报告
```

这个就是你目前最适合写进简历的第一版。