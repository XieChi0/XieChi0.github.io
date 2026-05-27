---
title: Hermes 实际应用
published: 2026-05-27
description: 个人使用 Hermes 时的常用命令记录
tags: [Hermes, AI, 命令行]
category: AI
draft: false
---

这里是我个人使用Hermes时会用到的一些命令， 在此记录，不然记不住~

## 启动hermes

首先打开一个终端，我喜欢用powershell

在里面输入

```
wsl -d ubuntu
```

然后输入

```
hermes
```

就可以进入。

## 命令行中换行

`ctrl+J`

记住输入shift+enter没用

## model切换

可以直接在启动hermes后

输入

```
/model
```

（不过这个我自己的没用）

还有一种方法就是在没打开hermes的情况下（如果打开了就输入`ctrl+c`）

输入

```
hermes model 
```

然后选就完了，

我会备两个model，一个是codex gpt登录相连的本地model，一个是有api密钥的中转codex model

## api

openai的baseurl `https://api.openai.com/v1`

## chat会话管理

### 直接继续上次会话

在没打开hermes的情况下输入

```
hermes --continue
```

或

```
hermes -c
```



进入hermes后输入

```
/resume
```



如果想恢复某次特定会话

```
hermes --continue "名字"
```

```
hermes --resume id
```

```
hermes --resume "名字"
```

continue有继续的意思，resume是恢复的意思，他俩都能用。

### 浏览历史会话

在没打开hermes的情况下输入

```
hermes sessions browse
```

或者

```
hermes sessions list
```

然后在列表中去找会话，选中恢复

### 给已有会话改名字

```
hermes sessions rename ID "新名字"
```

标题里最好别带空格

### 删除已有会话

```
hermes sessions delete ID
```



## skill读取

位置位于`/home/用户/.hermes/skills`，即`~/.hermes/skills`

可以用命令查看

```
hermes skills list
```

> | 列名         | 含义                                                         |
> | ------------ | ------------------------------------------------------------ |
> | **Name**     | skill 的名字，比如 `codex`、`claude-code`、`technical-resume-positioning` |
> | **Category** | 分类，只是方便归类，比如 `creative`、`career`、`devops`、`autonomous-ai-agents` |
> | **Source**   | 来源，重点看这一列：`builtin` 表示 Hermes 自带；`local` 表示本地安装/本地添加的 |
> | **Trust**    | 信任级别：`builtin` 是官方内置可信；`local` 是本地来源可信   |
> | **Status**   | 当前是否启用：`enabled` 表示已启用，会被 Hermes 使用；如果是 `disabled` 就是不启用 |

如果想查看某个skill内容

```
hermes skills inspect 名字
```

（这个我试了没用）

我是用这个方式去查看skill内容

```
cat ~/.hermes/skills/目录/名字/SKILL.md
```

如果已经打开hermes，可以直接输入`/skills`，或者`/skill 名字`



## agent协同

先说清，我这里的协同指的是把不同的chat恢复，加载hermes实例，作为agent进行协调。

### 手动协调

人工协调，最简单

你开多个终端，每个终端跑一个 Hermes 会话。

例如：

终端 1：

```    bash
hermes --resume "简历主控"
```

终端 2：
   ``` bash
   hermes --resume "WC1D 项目分析"
   ```

终端 3： 
   ``` bash
   hermes --resume "tbDock 项目分析"
   ```

然后你手动把 A agent 的结论复制给 B，或者把 B 的输出复制给 A。
适合你现在这种“简历主线 + 多项目细节沉淀”的工作流。
比如：

```
WC1D 会话：负责深挖技术细节
tbDock 会话：负责分析项目架构
简历主控会话：负责把内容改写成简历表达
```

### 临时派生子agent

它适合“短期并行工作”，不适合长期维护。

 优点：
   - 不需要你手动开多个终端。
   - 适合并行做研究、代码分析、项目复盘。
   - 主 agent 负责统筹，子 agent 负责专项任务。



缺点：
 - 子 agent 是临时的，不是长期存活。
 - 父会话被中断时，子 agent 任务也可能被取消。
 - 子 agent 没有完整继承你其他会话里的上下文，除非主 agent 明确把上下文传给它。



### 用共享文件协作

这是非常实用的一种方式。

你可以规定：

    简历主控 agent 只读/写：
    /mnt/f/wu_yun/resume-workspace/main.md
    
    WCH1D agent 只写：
    /mnt/f/wu_yun/resume-workspace/wch1d-analysis.md
    
    tbDock agent 只写：
    /mnt/f/wu_yun/resume-workspace/tbdock-analysis.md
    
    校园餐 agent 只写：
    /mnt/f/wu_yun/resume-workspace/campus-food-analysis.md

然后主 agent 定期读取这些文件，进行整合。

这种模式很适合你：

    子 agent：负责项目事实、技术细节、代码证据
    主 agent：负责简历表达、结构、信息密度、问题-方案-结果改写

它们不需要直接聊天，只需要通过文件交付结果。



### 用hermes Kanban机制去做agent协作

kanban的设计就是给多agent协作使用的

```
主控/编排 agent：拆任务
worker agent：领取任务
board：记录任务状态、依赖、评论、完成情况
dispatcher：调度不同 profile 的 agent
```

这个有一定学习成本，目前先不学。



## 会话共享记忆

会话历史不会共享

persistent memory会共享，比如用户的长期偏好，长期事实，环境信息。

skills会共享。

