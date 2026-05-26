---
title: Docker / 容器化部署入门完全指南
published: 2026-05-26
updated: 2026-05-26
description: Docker/Podman 容器化部署入门指南，涵盖镜像、容器、compose、Quadlet 等核心概念，以及 Rocky Linux 部署实战
image: ''
tags: [Docker, Podman, 容器化, 容器, 镜像, Linux, Rocky]
category: 后端
draft: false
---

# Docker / 容器化部署入门

## 什么是 Docker / Podman


| 概念                  | 说明                                            |
| ------------------- | --------------------------------------------- |
| **Docker / Podman** | 容器化平台，把应用及其依赖打包成"容器"，可理解为轻量级虚拟机               |
| **镜像 (Image)**      | 容器的模板，像 `class`                               |
| **容器 (Container)**  | 镜像的实例，像 `object`                              |
| **区别**              | Docker 是老牌工具，Podman 是 Docker 的替代品（无需守护进程，更安全） |


```
镜像 (Image) = 模具
    │
    │  podman run / docker run
    ▼
容器 (Container) = 月饼
    │
    │  podman run again
    ▼
更多容器 = 更多月饼（每个都是独立的）
```

---

## 核心概念对比

### 镜像 vs 容器 vs 实例


| 概念                 | 生活中的类比    | 代码中的类比        |
| ------------------ | --------- | ------------- |
| **镜像 (Image)**     | 模具/模板     | Class（类）      |
| **容器 (Container)** | 用模具做出来的月饼 | Object（对象/实例） |
| **实例 (Instance)**  | 同上，就是容器   | 同上            |


**简单理解：**

- **镜像** - 只读的模板（类似安装包）
- **容器** - 镜像的运行实例（类似正在运行的程序）
- 启动 3 次镜像 = 产生 3 个独立容器

---

## Linux 发行版

### 常见 Linux 发行版家族

```
┌─────────────────────────────────────────────────────────────┐
│                     Linux 发行版家族                         │
├─────────────────────────────────────────────────────────────┤
│  Red Hat 系列                                              │
│  ├── RHEL (Red Hat Enterprise Linux) - 付费，商业支持      │
│  ├── CentOS - 免费，RHEL 的社区版                          │
│  └── Rocky Linux - CentOS 的替代品（现在是免费的）          │
├─────────────────────────────────────────────────────────────┤
│  Debian 系列                                               │
│  ├── Debian - 社区驱动，稳定优先                           │
│  ├── Ubuntu - 最流行的桌面/服务器 Linux                    │
│  └── Linux Mint - 基于 Ubuntu，适合新手                    │
├─────────────────────────────────────────────────────────────┤
│  SUSE 系列                                                 │
│  ├── openSUSE - 社区版                                    │
│  └── SUSE Enterprise - 商业版                             │
└─────────────────────────────────────────────────────────────┘
```

### Linux vs Windows 类比

```
Windows 家族                    Linux 家族
─────────────────────────────────────────────────────────────
Windows 11                      Ubuntu 24.04 (最新版)
Windows 10                      Ubuntu 22.04 (LTS 长期支持版)
Windows Server 2022             Rocky Linux 9 (企业服务器版)

┌───────────────────────┐    ┌──────────────────────────────┐
│ Microsoft              │    │ Red Hat (红帽公司)           │
│ (微软)                 │    │   企业级 Linux 供应商         │
│   │                   │    │     │                        │
│   ├── 个人桌面系统     │    │     ├── RHEL (付费版)        │
│   └── 服务器系统       │    │     ├── CentOS (免费版)      │
│                       │    │     └── Rocky Linux (替代品) │
└───────────────────────┘    └──────────────────────────────┘
```


| 对比项      | Rocky Linux    | Ubuntu            |
| -------- | -------------- | ----------------- |
| **血统**   | Red Hat 家族     | Debian 家族         |
| **特点**   | 稳定、保守、企业级      | 创新、桌面友好、社区活跃      |
| **目标用户** | 企业服务器、关键业务     | 桌面、开发者、云服务器       |
| **包管理器** | `dnf` / `yum`  | `apt` / `apt-get` |
| **常见用途** | 银行、政府、大型企业     | 网站、云服务、开发环境       |
| **类似**   | Windows Server | Windows 桌面版       |


---

## 项目文件说明

### 目录结构

```
deploy-examples/
├── README.md              # 部署说明文档
├── compose/               # Docker/Podman Compose 方式
│   └── compose.yml        # 容器编排配置
└── quadlet/               # Podman Quadlet 方式（推荐）
    ├── wch1d.container    # 容器配置
    └── wch1d-data.volume  # 数据卷配置
```

### 文件作用


| 文件                   | 做什么               |
| -------------------- | ----------------- |
| `Dockerfile`         | 定义"如何打包这个应用成一个镜像" |
| `compose.yml`        | 定义"如何在服务器上运行这个容器" |
| `.env.container`     | 定义"容器内应用的行为配置"    |
| `podman-xbuild.toml` | 定义"如何构建不同配置的镜像变体" |


---

## Dockerfile 详解

### 什么是 Dockerfile

Dockerfile 是镜像构建配方，告诉 Docker/Podman "如何制作这个应用的镜像"。

### 流程图解

```
┌─────────────────────────────────────────────────────────────┐
│  第一阶段：构建 Node.js 应用                                │
│  FROM rockylinux → 安装 Node.js → npm install → pkg 打包  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  第二阶段：整合水文引擎                                      │
│  复制 hydrology.jar (水文引擎)                              │
│  复制 SWMM 引擎库                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  最终镜像 (输出)                                            │
│  1D 应用 + Java 21 + Caddy 反向代理 + S6 初始化系统     │
│  暴露端口 80                                                │
└─────────────────────────────────────────────────────────────┘
```

### 关键指令


| 指令           | 说明          |
| ------------ | ----------- |
| `FROM`       | 基于什么镜像开始    |
| `RUN`        | 执行命令（如安装依赖） |
| `COPY`       | 复制文件到镜像     |
| `ENTRYPOINT` | 容器启动命令      |


---

## compose.yml 详解

### 什么是 compose.yml

定义如何运行容器（用什么端口、数据存哪、硬件访问等）。

### 完整配置示例

```yaml
services:
  wch1d:
    image: <镜像名>           # 使用哪个 Docker 镜像
    container_name: wch1d    # 容器叫什么名字

    cap_add:
      - SYS_RAWIO            # 允许访问硬件（用于加密狗）

    devices:
      - /dev/disk/by-label/UsbKey:/dev/disk/by-label/UsbKey:rw  # USB 加密狗
      - nvidia.com/gpu=all   # GPU 访问（如果有）

    volumes:
      - /etc/wuchuanwater.com:/etc/wuchuanwater.com:ro,z  # 软件许可证目录
      - wch1d-data:/wch1d-data  # 数据持久化卷

    ports:
      - 8000:80/tcp          # 主机 8000 → 容器 80

    environment:
      - AUTH_FLAG=false      # 关闭认证（开发环境）
      - DEBUG_DATA_ROUTE_PREFIX=/wch  # 反向代理路径前缀

    restart: always          # 容器崩溃后自动重启
```

### 部署命令

```bash
docker compose -f deploy-examples/compose/compose.yml up -d
```

---

## .env.container 详解

容器内环境变量 - 应用运行时的默认配置。

```env
DATASOURCE_TYPE=sqlite        # 使用 SQLite 数据库
SERVER_PORT=81                # 服务监听 81 端口
PROJECT_DIR=/wch1d-data/projects  # 项目数据存放目录
AUTH_FLAG=true                # 启用认证
SYNC_TABLES=true              # 启用表同步
```

---

## 镜像版本矩阵

### podman-xbuild.toml 的作用

定义多平台镜像构建矩阵（CPU/GPU × 有无加密狗 × Rocky 8/9）。

```toml
[profile.matrix]
base-img = ["rocky8", "rocky9"]        # 操作系统版本
hw = ["cpu", "gpu"]                     # 硬件类型
key = ["", "key", "softkey"]           # 许可证类型

# 组合结果：2 × 2 × 3 = 12 种镜像
# rocky8-cpu
# rocky8-cpu-key
# rocky8-cpu-softkey
# rocky8-gpu
# rocky8-gpu-key
# rocky8-gpu-softkey
# rocky9-cpu
# rocky9-cpu-key
# ... 以此类推
```

### 版本说明


| 版本                     | 说明                     | 适用场景            |
| ---------------------- | ---------------------- | --------------- |
| **rocky8-cpu**         | Rocky Linux 8 + 仅 CPU  | 普通服务器、无 GPU     |
| **rocky8-gpu**         | Rocky Linux 8 + GPU 加速 | 有 NVIDIA 显卡的工作站 |
| **rocky8-cpu-key**     | Rocky Linux 8 + 硬件加密狗  | 需要 USB 加密狗授权    |
| **rocky8-cpu-softkey** | Rocky Linux 8 + 软件许可证  | 使用软授权（不用插 USB）  |


**为什么要这么多版本？**

- 不同客户的服务器配置不同
- 有的用 Rocky 8，有的用 Rocky 9
- 有的有 GPU，有的没有
- 有的用硬件狗，有的用软授权

---

## 部署方式对比

### Quadlet vs Compose


| 方式          | 文件                | 说明                       | 适用场景      |
| ----------- | ----------------- | ------------------------ | --------- |
| **Compose** | `compose.yml`     | Docker/Podman 通用，兼容性更好   | 快速部署、开发测试 |
| **Quadlet** | `wch1d.container` | Podman 专用，与 systemd 深度集成 | 生产环境（推荐）  |


### Quadlet vs Compose 区别

```
┌─────────────────────────────────────────────────────────────┐
│                      Quadlet (推荐)                          │
├─────────────────────────────────────────────────────────────┤
│  • Podman 4.6+ 原生支持                                      │
│  • 自动和 systemd 集成（开机自启、进程管理）                   │
│  • 放置位置: /etc/containers/systemd/ 或 ~/.config/          │
│  • 支持 rootful / rootless 模式                              │
│  • 硬件加密狗需要 rootful 模式                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Compose                                │
├─────────────────────────────────────────────────────────────┤
│  • Docker 原生，Podman 兼容                                  │
│  • 通用性更强，但 systemd 集成较弱                            │
│  • 部署后 compose 文件可以删除                               │
│  • 适合快速启动、临时测试                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 部署架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        物理服务器                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Docker / Podman 容器                    │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  Caddy 反向代理 (80→81)                        │ │   │
│  │  ├─────────────────────────────────────────────────┤ │   │
│  │  │  WCH1D Node.js 应用 (端口 81)                   │ │   │
│  │  ├─────────────────────────────────────────────────┤ │   │
│  │  │  S6 初始化系统                                  │ │   │
│  │  ├─────────────────────────────────────────────────┤ │   │
│  │  │  水文引擎 (Java)  │  SWMM 引擎  │  Hydrus     │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  数据卷: /wch1d-data/projects (项目数据)                    │
│  许可证: /etc/wuchuanwater.com (加密狗/软授权)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 完整部署流程（Quadlet 方式）

```bash
# 1. 构建镜像
podman build -t wch1d-service:latest .

# 2. 导出镜像（如果需要迁移）
podman save wch1d-service:latest -o wch1d.tar
podman load -i wch1d.tar

# 3. 复制 quadlet 文件到 systemd 目录
cp deploy-examples/quadlet/wch1d.container /etc/containers/systemd/
cp deploy-examples/quadlet/wch1d-data.volume /etc/containers/systemd/

# 4. 编辑镜像名（替换 <WCH1D_IMAGE_NAME>）
vim /etc/containers/systemd/wch1d.container

# 5. 重载 systemd 并启动
systemctl --user daemon-reload
systemctl --user start wch1d.service
```

---

## 一图理解整个部署流程

```
┌─────────────────────────────────────────────────────────────┐
│                      开发机器                               │
│                                                             │
│  1. 写代码 → 2. Dockerfile 定义镜像 → 3. podman build    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼ 打包成镜像
┌─────────────────────────────────────────────────────────────┐
│                    Docker Registry (镜像仓库)                │
│                                                             │
│  wch1d-service:rocky9-cpu-20251119-161838                │
│  wch1d-service:rocky9-gpu-key-20251119-154323             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼ 下载镜像
┌─────────────────────────────────────────────────────────────┐
│                      生产服务器                              │
│                                                             │
│  podman run wch1d-service:rocky9-cpu                      │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              容器 1 (项目A)                          │  │
│  │  Rocky Linux + Node.js + Java + 水文引擎           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  podman run wch1d-service:rocky9-cpu                      │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              容器 2 (项目B)                          │  │
│  │  Rocky Linux + Node.js + Java + 水文引擎           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 总结


| 问题                    | 答案                               |
| --------------------- | -------------------------------- |
| 镜像是什么？                | 模板/模具，只读，不可运行                    |
| 容器是什么？                | 镜像的实例，正在运行的程序                    |
| Rocky 是什么？            | 一种 Linux 操作系统（类似 Windows Server） |
| rocky8-cpu 是什么？       | 基于 Rocky Linux 8，仅用 CPU 的版本      |
| 为什么有这么多版本？            | 适配不同客户的硬件和许可证需求                  |
| 为什么武进用 Rocky？         | 企业级稳定，长期支持，适合服务器                 |
| Quadlet 和 Compose 区别？ | Quadlet 与 systemd 集成更好，推荐生产使用    |


