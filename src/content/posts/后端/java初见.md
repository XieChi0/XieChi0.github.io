---
title: "Java 初见"
published: 2026-05-18
description: "Java 基础概念：JDK、JRE、JVM 的关系与理解"
tags: [Java, 后端]
category: "后端"
draft: false
---

## JDK vs JRE vs JVM 的关系

```txt
JDK                         // Java 开发工具包：开发 + 编译 + 运行
├── JRE                     // Java 运行环境：运行已编译好的 Java 程序
│   ├── JVM                 // Java 虚拟机：真正执行 Java 字节码
│   └── 标准类库             // String、集合、IO、网络等基础能力
└── 开发工具                 // javac、jar、jdb、javadoc 等
```

简单理解

- **JVM**：真正执行 Java 字节码的虚拟机
- **JRE**：运行 Java 程序需要的环境，包含 JVM + 标准类库
- **JDK**：开发 Java 程序需要的完整工具包，包含 JRE + 开发工具



JVM：负责加载、解释/执行 Java 字节码，并管理内存、垃圾回收等运行时工作，即JVM — Java 虚拟机，真正执行 Java 字节码。

JRE — Java 运行环境，用来运行已经编译好的 .class / .jar 程序

## 与前端的类比

| 前端世界                 | Java 世界              |
| ------------------------ | ---------------------- |
| `.js / .ts` 源码         | `.java` 源码           |
| 浏览器 / Node.js 运行 JS | JVM 运行 Java 程序     |
| npm / pnpm               | Maven / Gradle         |
| package.json             | pom.xml / build.gradle |
| Vue / React              | Spring Boot            |
| 打包成 dist              | 打包成 jar / war       |



## jvm

> **一次编写，到处运行。**

```
Java 源码
   ↓ 编译
字节码 .class
   ↓ 交给 JVM运行
在 Windows / Linux / macOS 上运行
```

Java 不像 C 语言那样直接编译成某个系统专用的机器码，而是先编译成一种中间产物，叫：字节码 bytecode。

然后不同系统上安装不同的 JVM，由 JVM 去运行这些字节码。

```
Windows JVM 运行 Java 字节码
Linux JVM 运行 Java 字节码
macOS JVM 运行 Java 字节码
```



## 和前端的类比

你可以这样类比：

**前端 JS**

```
你写 JS
   ↓
浏览器 V8 引擎执行
```

**Node.js**

```
你写 JS
   ↓
Node.js 运行
```

**Java**

```
你写 Java
   ↓
javac 编译成 .class
   ↓
JVM 运行
```

所以 JVM 有点像：

```
Java 世界里的“运行引擎”
```

而 JDK 有点像：

```
Node.js + npm + 编译工具 + 运行工具 的组合
```

不过这个类比不是完全一模一样，只是方便你先理解。