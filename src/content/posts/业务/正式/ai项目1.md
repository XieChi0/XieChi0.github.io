---
title: ai项目1
published: 2026-06-25
updated: 2026-06-25
description: '路书编辑器AI架构分析：Vue页面、Agent Runtime、业务模型与LLM服务集成'
image: ''
tags: [AI, Agent, Vue]
category: '业务/正式'
draft: false
---

```
Vue 页面与组件
    ↓
Composable / Agent Runtime
    ↓
BookEditor 业务模型
    ↓
API、地图、状态管理
    ↓
原项目后端与 LLM 服务
```

最重要的业务对象是：

- Book：一本路书。
- Day：路书中的一天。
- BookPoi：某一天里的景点、酒店、餐厅等地点。
- SeventyBookEditor：真正管理路书增删改查、地图、路线、保存的编辑器对象。

## **两套 AI 架构**

项目中实际存在两种不同的 Agent 模式。

## 1. 编辑器内嵌 Agent

入口是 useBookAgent.ts。

它是一个主要运行在浏览器里的 Agent Runtime：

```
用户在路书编辑器里输入需求
→ 前端拼接系统提示词+当前路书快照
→ 浏览器请求 LLM
→ LLM 返回工具调用 tool calls
→ 前端校验工具参数并执行工具
→ 工具去读/改 BookEditor 或调业务 API
→ 把 tool result 工具结果 回传给模型
→ 模型进行判断，不行的话循环直到生成最终回答
→ 用户确认
→ 前端执行修改
→ 用户点击保存，路书到后端
```

核心文件：

- useBookAgent.ts：Agent 主循环。
- llmClient.ts：模型协议适配。
- bookAgentTools.ts：工具定义和执行。
- types.ts：Agent 类型系统。
- AiAgentPanel.vue：聊天和技能 UI。

llmClient.ts 同时支持：

- OpenAI Responses API
- Chat Completions API
- Chat Completions SSE 流式返回
- auto 模式下 Responses 不支持时自动降级

这是一个比较实用的“兼容 OpenAI 协议模型客户端”。

**内嵌 Agent 的关键设计**
Agent 每轮都会生成当前路书快照，包括：

- 路书名称、日期、天数。
- 当前选中的天和 POI。
- 每天首尾地点。
- 酒店衔接。
- 每日距离和时间。
- 路线优化预览。
- 最近搜索结果和推荐结果。

它没有直接把整个复杂编辑器对象序列化给模型，而是构建受控摘要。这是很值得学习的 Context Engineering 方法。

Agent 状态机分为：

```
planning → awaiting_plan_confirmation → executing
```

生成多天路线时必须先规划，再通过 present_choices 让用户确认。未确认前，代码会拦截搜索 POI、替换日程、修改路书等执行工具。

## 2. 独立 AI 聊天页

入口是 useAiChat.ts。

这套模式下，前端只负责：

- 管理会话列表。
- 发送消息。
- 展示 Markdown。
- 关联路书附件。
- 接收 SSE。
- 展示后端正在调用哪个工具。

真正的 Agent 循环、工具执行和消息持久化主要在后端：

```
用户在 AI 聊天页输入消息
→ 前端把消息发给后端
→ 后端决定会话、上下文、模型、工具
→ 后端跑 Agent loop
→ 后端通过 SSE 把文本和工具状态推给前端
→ 前端增量渲染
→ 用户继续追问
```

所以独立聊天页不是前端 Agent Runtime，而是后端 Agent 的 UI 客户端。

## 对比

`BookEdit` 内嵌 Agent

前端自己就是Agent Runtime的一部分，强依赖“当前编辑器状态”，深度操作当前前端页面已有业务能力。

- 前端自己做 runtime
- 前端自己处理 tool call
- 更适合学习 Agent loop

---

`AiChat` 独立聊天页

前端只是后端Agent的展示壳

- 前端只是客户端
- 后端完成 Agent orchestration
- 更适合学习 SSE 聊天 UI 设计

> 更适合放在后端做：
>
> - 会话持久化
> - Agent 编排
> - 工具注册
> - 权限校验
> - 模型路由
> - 日志记录
>
> 前端只做一个消费 SSE 的 UI。

```
用户在 AI 聊天页输入消息
→ 前端把消息发给后端
→ 后端决定会话、上下文、模型、工具
→ 后端跑 Agent loop
→ 后端通过 SSE 把文本和工具状态推给前端
→ 前端增量渲染
→ 用户继续追问
```



## **工具系统**

Agent 暴露约 45 个工具，大致分为：

- 读取：获取路书、天详情、当前选择。
- 目的地规划：查询城市、可达城市和城市间距离。
- 搜索：搜索 POI、附近 POI、素材详情。
- 编辑：添加天、改标题、改贴士、移动或复制 POI。
- 路线优化：生成预览、接受或拒绝排序。
- 推荐：相似日程、专业日程。
- 交互：present_choices 结构化选择。

工具调用不会直接信任模型：

1. 解析 JSON 参数。
2. 校验工具名与参数。
3. 把搜索结果保存到 Map。
4. 后续操作必须引用真实返回的 ID。
5. 生成 AgentPlannedAction。
6. 危险操作等待用户确认。
7. 最后调用 SeventyBookEditor 的业务方法执行。

这形成了很典型的：

```
LLM 决策层 → Tool Adapter 适配层 → Domain Model 业务层
```

## **安全边界**

这个项目做了几层控制：

- 规划阶段禁止执行修改工具。
- 搜索结果只能通过真实 ID 引用。
- 删除、替换、批量重排需要确认。
- 工具失败最多重试三次。
- 支持 AbortController 停止生成。
- Agent 修改的只是内存中的编辑器数据。
- 最终仍需要用户点击“保存”才提交后端。

但也存在一个重要学习点：内嵌 Agent 的 API Key 配置保存在浏览器本地并由前端直接请求模型。这适合内部实验或学习，不适合公开生产环境。



## **建议学习顺序**（针对agent1）

1. 先读 BookBo.ts，理解 Agent 操作的数据。
2. 再读 useBookEdit.ts，理解真正的业务能力。
3. 阅读 types.ts，掌握 Agent 数据结构。
4. 阅读 llmClient.ts，理解工具调用协议和流式解析。
5. 阅读 useBookAgent.ts，理解 Agent 循环和状态机。
6. 最后读 bookAgentTools.ts，逐类研究工具如何映射到业务方法。

本次只修改了 Markdown。项目没有 node_modules，因此没有安装依赖或运行类型检查。

### 第一层：先懂业务对象

1. `src/model/Book/BookBo.ts`
2. `src/model/Book/useBookEdit.ts`

目标：

- 理解 Book / Day / BookPoi
- 理解 Agent 最终操作的真实业务对象是谁
- 理解“能改什么、怎么改”

### 第二层：再懂 Agent 契约

1. `src/views/Book/BookEdit/agent/types.ts`
2. `src/views/Book/BookEdit/agent/llmClient.ts`

目标：

- 理解 message / tool / action / runtime context 类型
- 理解模型协议适配

### 第三层：读 Agent 主循环

1. `src/views/Book/BookEdit/agent/useBookAgent.ts`

目标：

- 理解 system prompt
- 理解 snapshot 构造
- 理解状态机
- 理解一轮对话如何跑完

### 第四层：读工具层

1. `src/views/Book/BookEdit/agent/bookAgentTools.ts`

目标：

- 理解工具如何映射到业务方法
- 理解读写边界与确认机制

### 第五层：看 UI 如何产品化

1. `src/views/Book/BookEdit/components/AiAgentPanel.vue`
2. `src/views/AiChat/composables/useAiChat.ts`
3. `src/views/AiChat/index.vue`

目标：

- 理解技能化入口
- 理解独立聊天页和后端 Agent 的 UI 协议

## cursor的讲解

这个项目的核心业务不是聊天，而是：

“路书（旅行行程）编辑”

最重要的领域对象在 `src/model/Book/BookBo.ts` 里：

- `Book`：一本路书
- `Day`：路书中的一天
- `BookPoi`：一天中的景点 / 酒店 / 美食 / 其他 POI

这些对象承载的是旅行规划领域模型。



如果说 `Book/Day/BookPoi` 是数据模型，

那 `src/model/Book/useBookEdit.ts` 里的 `SeventyBookEditor` / `BookEditor` 就是：

整个路书编辑器的业务引擎

这个类很关键，它负责：

- 路书初始化
- 当前激活 day / poi
- 变更追踪
- 增删改查 day / poi
- 排序优化
- 保存路书
- 地图联动
- 推荐逻辑
- 事件协作

也就是说：

Agent 并不是直接修改 Vue 组件状态，而是通过工具层去调用 `BookEditor` 的业务方法。



这是整个项目最值得学习的一层抽象：

```
Vue页面/UI
→ Agent Runtime / composable
→ Tool Adapter
→ BookEditor 业务模型
→ API / 地图 / 状态管理
```



1. Agent 不直接操作 UI，而是操作领域模型
2. 上下文不是全量对象，而是受控摘要快照
3. 工具系统是安全边界，不是简单 function list
4. 规划、确认、执行是分阶段状态机
5. 同一个产品里可以同时存在浏览器侧 Agent 与后端 Agent UI 两种模式
6. 真正可落地的 Agent 前端，一定深度依赖原业务结构，而不是孤立聊天框



## 精讲

## 第一个agent

这个agent依附在`BookEditor`，

- `BookEditor` 负责业务能力
- Agent 负责理解用户意图并调用业务能力

当用户发出提问时，前端或者后端（在这里是前端）会构造一个专门的上下文包，里面包含prompt、一些关于路书编辑器的信息提取，

即把“复杂页面状态”翻译成“模型能消费的结构化上下文”，业务状态 → LLM 可理解文本/结构

模型拿到了 `用户请求`，`当前路书快照`，`可用工具`，`系统规则`，然后看用户的提问，如果上下文里有，那就直接回答，如果没有，那就触发工具调用。

然后前端工具层接收到触发，对参数进行解析，校验，然后调用真实业务。

在调用时，前端会调用`BookEditor`，修改后不会直接保存，由用户决定是否保存。



**在分层上，Agent 是通过工具层去调用业务层**

> 如果用户的问题难度较高，且信息较少，会先继续提问用户，挖掘出更多信息，比如路线结构、去程回程、每天节奏、中转城市、是否返程、大体安排。

### 怎么把主观偏好稳定地转成一组客观约束

而这个项目采用的办法，其实是三件套：

#### 1. Prompt 里写规则

让模型知道“轻松节奏”在产品里大概意味着什么。

#### 2. 状态机拆阶段

先规划、再确认、再执行，避免一步到位出错。

#### 3. 工具负责现实校验

让模型的“主观规划”接受真实数据约束。



**面试时回答：**

我们没有把这类主观需求直接映射成某一个工具调用，因为“节奏轻松”不是结构化的字段，而是需要一个规划偏好，把LLM放在规划层，让它结合prompt和上下文，把用户的表达翻译成可执行的约束，比如减少单日驾驶强度，然后再由工具层去做两类事情：一类是查询和验证，比如查询城市间距离，多久可达，另一类是执行，比如添加酒店，

对于复杂生成任务，我们还会先让模型给出整体规划方案，等用户确认后再逐天执行，避免对这种主观需求一步到位直接改路书。





## 第二个agent

这里前端只负责：展示会话，发送消息，接收流式回复，是消费SSE的UI展示。

后端负责：会话持久化、Agent编排、工具注册、权限校验、模型路由、日志



当用户发送消息。

后端会判断有没有uid，没有的话创建新会话，有的话就在原会话上继续，

然后会去看会话有没有带上下文，有没有可以用的工具，

然后后端会进行上下文组装，里面包含了system prompt、历史消息、附件、工具...



然后调用模型，模型的输出有三种可能，1.直接回答，2.追问用户更多信息，3.工具调用，

如果模型有工具调用的意图，后端agent负责执行，然后模型总结，再返回给用户



前端在这个过程中会同步用SSE接收这个信息，前端负责增量渲染和状态展示。

后端将会话流式推给前端，

> - `meta`：会话信息
> - `text`：文本增量
> - `tool_start`：某个工具开始执行
> - `tool_end`：某个工具执行结束
> - `error`：错误

所以用户在界面上能看到一种“Agent 正在思考/调工具/输出结果”的过程感。



前端的核心价值在于

> 会话侧
>
> - 会话列表
> - 时间分组
> - 选择会话
> - 删除会话
> - 恢复 URL 对应会话
>
> 消息侧
>
> - 流式拼接 assistant 消息
> - pending 状态
> - Markdown 展示
>
> 状态侧
>
> - 当前是否有后台任务
> - 当前工具状态是什么
> - 是否正在流式中
>
> 也就是说，这套前端更像一个：
>
> 流式 AI 应答终端



### 阶段 1：先把前端链路讲透

目标： 你能说清楚独立 AI 聊天页面前端做了什么，不做什么。

这一阶段我会带你看：

#### 页面入口

- `src/views/AiChat/index.vue`

这里是聊天页的页面编排层，它负责：

1.页面骨架（Layout UI）

2.同步路由和会话（通过 `conversationUid` 同步）

3.把真正的逻辑交给 `useAiChat.ts`（`useAiChat(syncRoute)`）

```
页面组件 index.vue
    ↓
useAiChat 提供状态和动作
    ↓
各展示组件消费这些状态和动作
```

> 关于useAichat提供的方法
>
> 1.页面展示状态
>
> `collapsed`：控制左侧边栏是否折叠。
>
> `hasMessages`：当前是否已有消息，用来决定右侧显示欢迎页还是会话页。
>
> `loading`：当前是否正在发送 / 等待 AI 返回。
>
> `taskRunning`：看名字就知道，它比 `loading` 更偏“当前 AI 流程是否仍在运行中”。
>
> `toolStatus`：当前工具调用状态，用来让页面知道后端 Agent 是否在执行某个工具。
>
> ---
>
> 2. 会话相关状态
>
> `activeConversationUid`：当前激活的会话 ID。
>
> `sessionGroups`：左侧边栏展示的会话分组数据。
>
> `sessionsLoaded`：会话列表是否已经初始化完成。
>
> `sessionsHasMore`：是否还有更多历史会话可加载。
>
> ---
>
> 3. 行为方法
>
> `selectSession`：切换到某个会话。
>
> `deleteSession`：删除某个会话。
>
> `loadMoreSessions`：加载更多历史会话。
>
> `sendMessage`：发送消息。

##### 欢迎页与正式会话页的分离

```
<main class="relative z-10 flex min-w-0 flex-1 flex-col">
  <ChatConversation
    v-if="hasMessages"
    v-model="input"
    :messages="messages"
    :loading="loading"
    :disabled="taskRunning"
    :tool-status="toolStatus"
    @send="handleSend"
  />
  <ChatWelcome
    v-else
    v-model="input"
    :loading="loading"
    :disabled="taskRunning"
    :tool-status="toolStatus"
    @send="handleSend"
    @send-prompt="handleSendPrompt"
  />
</main>
```

这样写最大的好处就是**解耦**。如果有一天产品经理说：“我们要在首页加上最近浏览的文档历史！”，你只需要去改 `ChatWelcome` 就行了，完全不用担心会把复杂的聊天气泡逻辑给弄崩。

##### conversationUid

这个是记录会话的id，也是aiChat的核心线索。

因为在独立 AI 聊天页面里：

**会话不是前端临时数组，而是后端资源**

用户不是只在一个页面本地聊天，而是在和一个“可恢复的会话”交互。

所以前端必须知道：

- 当前在聊哪一个会话
- URL 对应的是哪个会话
- 刷新页面时如何恢复该会话

##### 同步路由和会话

指的是让url里显示的会话和实际上打开的会话保持一致

`/ai-assistant/aaa`和`activeConversationUid = "aaa"`

> url变了，页面里的当前会话也要跟着变
>
> 页面里变了，url也要变

页面中的会话与 路由保持一致

```
watch(
  () => route.params.conversationUid,
  (uid) => {
    const uidStr = Array.isArray(uid) ? uid[0] : uid;
    if (uidStr) {
      if (activeConversationUid.value !== uidStr) {
        selectSession(uidStr);
      }
    }
  },
);
```

> 监听地址栏的conversationUid，一旦发生变化，就会立刻触发后面的函数，并将新的值作为参数 `uid` 传进去。（`yoursite.com/chat/111` 变成了 `yoursite.com/chat/222`）
>
> 并且如果这个uid和当前页面上的会话不一样，就切换到那个会话。

路由中的会话与页面中激活的保持一致

>  路由的切换不能自动监听+跳转来实现，因为这样变化太灵敏，会打断SSE的响应式链路，所以这里用函数来保存，在会话创建/切换/删除时显示调用。
>
> ```
> function syncRoute(uid: string | null) {
>   if (uid) {
>     router.replace({ name: "AiAssistant", params: { conversationUid: uid } });
>   } else {
>     router.replace({ name: "AiAssistant" });
>   }
> }
> ```

##### 新建会话

不是立即创建后端资源，而是只有在用户发出第一次条消息时，再由后端创建真实会话。

```
/**
 * 点击"开启新会话"不调后端，仅置空 activeConversationUid 回到欢迎页。
 * 用户发送第一条消息时，sendMessage 携带无 conversationUid 触发后端自动创建会话。
 */
const handleNewSession = () => {
  activeConversationUid.value = null;
  input.value = "";
  // 开启新会话时同步清除 URL 中的 conversationUid
  syncRoute(null);
};
```



---

#### 真正逻辑

- `src/views/AiChat/composables/useAiChat.ts`

- 搞清楚：
  - 状态
  
  - 发送消息
  
  - 会话管理

  - SSE 处理

  - 工具状态
  

这个页面是专门服务AiChat的composable，它主要是存储当前会话状态，提供关于会话和消息的方法
```
useAiChat = 聊天页的大脑：负责数据和逻辑
index.vue = 聊天页的脸：负责展示和响应
```

```
index.vue（页面）
   |
   | 调用
   v
useAiChat(syncRoute)
   |
   | 返回一堆状态 + 方法
   v
页面拿到：
messages / loading / sessionGroups / sendMessage / selectSession ...
   |
   | 用户点击发送
   v
sendMessage()
   |
   | 发请求 + 接收流
   v
streamSSE()
   |
   | 不断把文本 chunk 回传
   v
messages 里的 assistant.content 一点点变长
   |
   v
页面自动重新渲染，看到“AI在打字”
```





##### 重要的状态

**1）`sessions`**

```293:293:frontend/src/views/AiChat/composables/useAiChat.ts
const sessions = ref<ChatSession[]>([]);
```

它表示：

**所有聊天会话的总表**

每个元素都是一个会话，每个会话里又有自己的消息数组。

你可以脑补成：

```ts
[
  { conversationUid: "a1", title: "日本旅游", messages: [...] },
  { conversationUid: "b2", title: "成都攻略", messages: [...] }
]
```

所以整个文件本质上就是在维护这个数组。

---

**2）`activeConversationUid`**

```295:295:frontend/src/views/AiChat/composables/useAiChat.ts
const activeConversationUid = ref<string | null>(null);
```

它表示：

**当前用户正在看哪个会话**

也就是“当前焦点”。

---

**3）`activeSession`**

```319:321:frontend/src/views/AiChat/composables/useAiChat.ts
const activeSession = computed(
  () => sessions.value.find((s) => s.conversationUid === activeConversationUid.value) || null,
);
```

这个是从前两个状态推出来的：

- `sessions` 是总表
- `activeConversationUid` 是当前选中的 uid
- `activeSession` 是“当前会话对象本体”

也就是：

```ts
当前会话 = 从 sessions 里找出 uid 匹配的那一项
```



> `sessions` 是总数据，`activeConversationUid` 是当前指针，`activeSession` 是当前指针指向的对象。



**业务行为**

##### 切换会话 `selectSession`

```470:476:frontend/src/views/AiChat/composables/useAiChat.ts
async function selectSession(conversationUid: string) {
  stopPolling();
  activeConversationUid.value = conversationUid;
  onRouteSync?.(conversationUid);
```

用户点击左边某个聊天会话时：

1. 停掉旧任务轮询
2. 把当前会话 uid 改成你点的那个
3. 同步 URL

> 后面还有两件补充事：
>
> - 如果这个会话的历史消息还没加载，就去拉消息
> - 如果这个会话后台还有任务在跑，就继续轮询
>
> 但这些都是附加逻辑。

---

##### **发送消息 `sendMessage`**

这是全文件最重要的函数。

```549:551:frontend/src/views/AiChat/composables/useAiChat.ts
async function sendMessage(rawText: string, tripUid?: string, skillCode?: string) {
  const text = rawText.trim();
  if (!text || loading.value) return;
```

> 当用户发一句话后，它要让 UI 立刻出现这句话，并且把 AI 的回复一段一段接回来显示。

这个目标分两种情况：

---

**情况 A：当前已经有会话**

- 这个聊天窗口已经存在了
- 它已经有 `conversationUid`

这时逻辑是：

1. 先把用户消息塞进当前会话
2. 再塞一个“assistantMsg 空消息占位”
3. 然后发 SSE 请求
4. 后面流式返回时不断修改这个占位消息的 `content`

对应的核心代码：

```583:604:frontend/src/views/AiChat/composables/useAiChat.ts
const userMsg: ChatMessage = {
  messageUid: tempId(),
  role: "user",
  content: text,
  createdAt: Date.now(),
  attachment: attachment || undefined,
};
session.messages.push(userMsg);	//这个是用户消息

const assistantMsg: ChatMessage = {
  messageUid: tempId(),
  role: "assistant",
  content: "",
  createdAt: Date.now(),
  pending: true,
};
session.messages.push(assistantMsg);	//把空的助手消息放进去
assistantReactive = session.messages[session.messages.length - 1];
```

它不是等后端完整返回后再更新页面。

它是：

- 先自己造一个用户消息
- 再自己造一个助手占位消息
- 后面流式返回时不断修改这个占位消息的 `content`

---

**情况 B：当前没有会话，是新会话**

这时比较特殊，因为你还没有 `conversationUid`。

所以流程变成：

1. 先发请求给后端
2. 后端创建新会话
3. 端把这个新会话的 uid 通过 SSE 的 `onmeta` 事件发回来
4. 前端收到 uid 后，才创建本地会话sessions里
5. 然后再往里面塞 用户消息+ai占位消息

```
sendMessage调用了streamSSE,并且传入请求地址，请求体，事件处理函数，中断信号。
而事件处理函数中有onmeta事件，接收uid
```

老会话和新会话最大的区别不是“发消息方式不同”，而是：

- **老会话：uid 已知，可以直接往那个会话里塞消息**
- **新会话：uid 未知，得先等后端告诉你新 uid**

###### 过程（形象版）

最开始的messages是空的，还没人发消息呢，所以sessions里的messages是空的

用户先说：帮我规划百京三日游，然后助手消息发空消息占位

到后面sse有回复，所以assitantChat也就有消息了，此时content的内容会一直往后追加，知道最后sse状态结束了，pending状态也结束了，那可以说是后端回复完毕了。

###### 完整过程







---

#### streamSSE

这个函数是在sendMessages里被调用的

```
index.vue（页面）
   |
   | 调用
   v
useAiChat(syncRoute)
   |
   | 返回一堆状态 + 方法
   v
页面拿到：
messages / loading / sessionGroups / sendMessage / selectSession ...
   |
   | 用户点击发送
   v
sendMessage()
   |
   | 发请求 + 接收流
   v
streamSSE()
   |
   | 不断把文本 chunk 回传
   v
messages 里的 assistant.content 一点点变长
   |
   v
页面自动重新渲染，看到“AI在打字”
```

##### SSE

**SSE = Server-Sent Events**（服务器发送事件），就是服务器给浏览器单向、持续地 “吐” 数据，用来做**流式输出**（打字机效果）。

**核心特点**

- 单向：只从服务器→客户端推，客户端不用频繁发请求。
- 基于普通 HTTP：不用升级协议，防火墙 / 代理都能过。
- 浏览器原生支持：有 `EventSource`，断了会**自动重连**。
- 格式简单：`data: 内容\n\n`，用 `\n\n` 分隔每条消息。
- 轻量：比 WebSocket 简单，不用管双向通信、心跳、握手。

**和 WebSocket 怎么选（面试常问）**

- 用 SSE：只要服务器往客户端发（聊天回复、流式输出、通知），简单够用。
- 用 WebSocket：需要双向交互（用户中途打断、实时语音、多人协作）。

```
const parts = buffer.split("\n\n"); // 按 SSE 分隔符切
buffer = parts.pop() || ""; // 最后一截不完整的留到下次拼
```

- SSE 每条消息必须以 `\n\n` 结尾。
- 网络是 “一段段” 来的，可能多条完整消息 + 一条半截消息。
- `split("\n\n")` 切开，`pop()` 把不完整的留到下次，剩下的就是能直接显示的完整消息。

##### 具体

streamSSE可以理解成“听流的翻译员”，流解析器。

它负责打开这条流，不断读取里面的数据，识别数据属于的事件，分发给外面定义好的回调函数。

**流里的事件类型：**

- `meta`：先给你一些“元信息”
- `text`：正文内容，chunk拼接，所以ai回复显得像打字机
- `error`：出错了
- `tool_start`：AI 开始调工具了
- `tool_end`：AI 工具调完了

```
后端发来一大坨流文本
   |
   v
前端先按“空行”切块
   |
   v
每一块里找：
- 这块是什么事件(event)
- 这块真正的数据是什么(data)
   |
   v
然后把它交给对应处理函数
```



### 六、总结

**AI 里 SSE 就是 “流式输出” 的标准方案**：HTTP 长连接、单向、逐字推、浏览器原生支持，让用户不用等全文，马上看到 AI “正在打字”。

要不要我给你写一个极简的 SSE 前端 + 后端可运行小例子？



这个你一定要抓住，因为这是聊天页体验的核心。

在 SSE 回调里有这一句：

```661:669:frontend/src/views/AiChat/composables/useAiChat.ts
onText(chunk: string) {
  if (!assistantReactive) return;
  assistantReactive.content += chunk.replace(//g, "\n");
  activeSession.value && (activeSession.value.updatedAt = Date.now());
}
```

它的意思是：

- 后端每次返回一小段文字 `chunk`
- 前端就把这段文字拼到助手消息后面

本质就是：

```ts
assistant.content = assistant.content + chunk
```

所以你看到的“AI 在打字”，其实不是神奇动画，而是不断字符串拼接。

---

# 222

为了不乱，我下一条只讲一个主题，你选：

- **A. 只讲 `sendMessage`，按执行顺序拆开讲**
- **B. 只讲 `streamSSE`，解释流式返回为什么这么写**
- **C. 只讲 `useAiChat` 返回值和 `index.vue` 的配合关系**

如果你愿意，我建议先讲 **A**，因为它是整个文件最核心的主线。

# 333

#### 组件怎么拆

- `ChatSidebar`
- `ChatConversation`
- `ChatWelcome`
- `ChatComposer` 等

1. 前端维护了哪些状态

   - 当前会话
   - 消息列表
   - loading
   - toolStatus
   - 是否有更多会话
   - 当前输入框

2. 前端如何处理 SSE

   - 文本流
   - `tool_start`
   - `tool_end`
   - `meta`
   - `error`

3. 前端如何把一个“后端 Agent 过程”渲染成聊天体验

#### 这一阶段结束后，你应该能回答：

- 这个页面和普通聊天页有什么不同？
- 它为什么要有会话 UID？
- 为什么用 SSE？
- 为什么前端知道工具状态但不执行工具？

------

### 阶段 2：再把后端链路对上

等你前端理解清楚后，我会带你去看你拿到的后端代码，重点找这些点：

1. 请求入口在哪里
2. 会话怎么创建和续接
3. prompt 怎么组装
4. 工具怎么注册
5. 工具调用如何执行
6. SSE 怎么返回
7. 消息怎么持久化

这一阶段的目标是：

把前端看到的每个现象，在后端都找到来源。

比如：

- 前端为什么会收到 `tool_start`
- 前端的 `conversationUid` 从哪来
- 为什么消息能流式展示
- 为什么能恢复历史会话

------

