---
title: python_api_test-python_syntax_guide
published: 2026-06-05
description: '结合 Python API 测试项目讲解常见语法，帮助初学者理解配置、函数、类与请求参数结构。'
image: ''
tags: ['Python', '语法入门']
category: '业务/正式'
private: true
draft: false
---

# Python 语法入门：结合 python_api_test1 项目理解

> 这篇文档的目标不是系统讲完整个 Python，而是帮助你看懂 `python_api_test1` 这个项目。你可以把它当成“第一次读 Python 项目时的导航图”：先知道语法长什么样，再知道这些语法在项目里承担什么作用。

## 1. 先建立 Python 代码的阅读方式

Python 和 Java、JavaScript、C++ 最大的区别之一是：它不用 `{}` 表示代码块，而是靠缩进表达层级。

```python
if code != 200:
    # 业务 code 不是 200，说明接口没有按预期成功
    raise Exception("接口调用失败")

print("这行不在 if 里面")
```

上面这段代码里，`raise Exception(...)` 前面有缩进，所以它属于 `if` 代码块；`print(...)` 没有缩进，所以它不属于 `if`。

阅读 Python 文件时，可以优先看这几类结构：

- `import`：这个文件依赖了哪些模块。
- 全局变量：例如 `BASE_URL`、`PROJECTS`。
- `class`：定义类，通常表示一个对象或一组能力。
- `def`：定义函数，表示一段可复用逻辑。
- `if __name__ == "__main__"`：这个文件被直接运行时，从这里开始执行。

在这个项目里，最典型的入口是 `runner/run_tests.py`：

```python
def main():
    """程序入口：串起登录、生成用例、执行测试、生成报告的完整流程。"""
    # 创建 HTTP 客户端，后续接口请求都通过它发送
    client = HttpClient(BASE_URL)

    # 登录系统，成功后 token 会保存在 client 对象里
    token = client.login(LOGIN_USERNAME, LOGIN_PASSWORD)

    # 根据 apis/ 和配置自动生成测试用例
    test_cases = get_test_cases(PROJECTS)

    # 执行所有测试用例，并收集测试结果
    case_results = run_all_tests(test_cases, client, batch_id=batch_id)

    # 根据测试结果生成 HTML 报告
    generate_html_report(case_results, output_path)


if __name__ == "__main__":
    main()
```

你可以先不用理解每个函数内部细节，只要知道：运行 `python runner/run_tests.py` 时，Python 会执行 `main()`，然后主流程从这里展开。

## 2. 变量与基础类型

Python 定义变量不需要提前声明类型，直接写名字并赋值即可。

```python
# config.py

# 接口服务地址
BASE_URL = "http://10.53.10.96:8088"

# 登录账号和密码
LOGIN_USERNAME = "admin"
LOGIN_PASSWORD = "admin123"

# 普通变量示例：整数、布尔值、空值
timeout = 30
use_cpu = False
empty_value = None
```

这里出现了几种基础类型：

- `"http://..."`：字符串，Python 里叫 `str`。
- `30`：整数，Python 里叫 `int`。
- `False`：布尔值，只有 `True` 和 `False`。
- `None`：空值，表示“没有值”。

这个项目里经常看到大写变量，例如 `BASE_URL`、`PROJECTS`、`SKIP_APIS`。这是一种命名习惯，通常表示配置常量，也就是运行过程中一般不希望它被随意修改。

## 3. 字符串 str：接口路径、账号、项目 ID 都是字符串

字符串可以用单引号或双引号，一般项目里更常用双引号。

```python
# 接口路径，本质上是字符串
path = "/business/project/getWeirInfo"

# 项目 ID，也是字符串
project_id = "a43427b6-baa2-4933-a8f2-c0d020f0b414"

# 登录用户名
name = "admin"
```

Python 里常见的字符串拼接方式是 f-string，也就是在字符串前面加 `f`，然后用 `{}` 插入变量。

```python
# 用 f-string 把 base_url 和 path 拼成完整 URL
url = f"{self.base_url}{path}"
```

在 `http_client.py` 里，拼接完整请求地址就用了这种方式。

## 6. 嵌套字典和列表：请求参数为什么看起来很复杂

接口请求体经常是嵌套结构，也就是字典里套列表，列表里再套字典。

```python
# test_def/test_config.py

TEST_ARGS_CONFIG = {
    "put_weir_info": {
        "weir_info": [
            {
                "id": 1,
                "projectId": "__PROJECT_ID__",
                "name": "测试堰",
                "reachId": 3,
                "chainage": "7300",
                "bottom": "28.5",
                "length": "343",
            }
        ]
    }
}
```

可以这样拆开看：

```text
TEST_ARGS_CONFIG 是一个大字典
└── "put_weir_info" 对应一个字典
    └── "weir_info" 对应一个列表
        └── 列表里的每一项是一个字典，表示一个堰的信息
```

这类结构本质上就是接口 JSON 请求体的 Python 写法。

## 7. 函数 def：把一段逻辑封装起来

Python 用 `def` 定义函数。

```python
# apis/one_dimensional.py

def get_weir_info(client: HttpClient, project_id: str):
    """查询一维模型中的堰信息，并返回接口响应里的 data。"""
    # 定义当前接口的请求路径
    path = "/business/project/getWeirInfo"

    # 组装请求体，后端需要 projectId 来定位项目
    body = {"projectId": project_id}

    # 交给通用 POST JSON 方法统一发送请求
    return post_json(client, path, body)
```

这段代码可以拆成几部分：

```text
def get_weir_info(...):
    定义一个函数，函数名叫 get_weir_info

client: HttpClient
    第一个参数，表示 HTTP 客户端

project_id: str
    第二个参数，表示项目 ID

path = ...
    定义接口路径

body = ...
    组装请求体

return post_json(...)
    调用通用请求函数，并把结果返回出去
```

这个项目里，`apis/*.py` 下的大多数函数都是这种模式：函数名表达业务含义，内部只负责 path 和 body。

## 8. return：函数的返回值

`return` 表示函数执行完后，把一个结果交还给调用方。

```python
def add(a, b):
    """把两个数字相加，并返回相加结果。"""
    # return 会把 a + b 的结果交还给调用方
    return a + b

result = add(1, 2)
print(result)  # 3
```

项目里的接口函数也是这样：

```python
def get_weir_info(client: HttpClient, project_id: str):
    """查询一维模型中的堰信息，并返回接口响应里的 data。"""
    # 定义当前接口的请求路径
    path = "/business/project/getWeirInfo"

    # 组装请求体
    body = {"projectId": project_id}

    # 返回 post_json 的执行结果
    return post_json(client, path, body)
```

`post_json(...)` 会真正发请求，然后返回响应里的 `data`。所以 `get_weir_info(...)` 的返回值就是接口响应里的 `data`。

## 9. 默认参数：不给参数时使用默认值

函数参数可以有默认值。

```python
def one_d_calculate(
    client: HttpClient,
    project_id: str,
    use_cpu: bool = False,
    use_hydro1d: bool = False,
    is_generate_result: bool = True,
):
    """发起一维模型计算任务，可以控制是否使用 CPU、Hydro1D 以及是否生成结果。"""
    # 组装计算接口需要的请求体
    body = {
        "projectId": project_id,
        "useCPU": use_cpu,
        "useHydro1d": use_hydro1d,
        "isGenerateResult": is_generate_result,
    }
```

如果调用时不传 `use_cpu`，它默认就是 `False`。

```python
one_d_calculate(client, project_id)
```

等价于：

```python
one_d_calculate(
    client,
    project_id,
    use_cpu=False,
    use_hydro1d=False,
    is_generate_result=True,
)
```

在 `test_cases.py` 里，如果某个参数没有配置，但函数本身有默认值，工具会使用默认值。

## 10. 类型注解：帮助人读代码，不等于强制类型

你会看到很多类似这样的写法：

```python
from typing import Optional, Dict, Any, List

def post_json(
    client: HttpClient,
    path: str,
    body: Dict[str, Any],
    headers: Optional[Dict[str, str]] = None,
) -> Any:
    """发送 POST JSON 请求，并返回接口响应中的业务 data。"""
    # 这里只展示函数签名，重点是看懂类型注解
    ...
```

这些叫类型注解。

```text
client: HttpClient
    client 应该是 HttpClient 对象

path: str
    path 应该是字符串

body: Dict[str, Any]
    body 应该是字典，key 是字符串，value 可以是任意类型

headers: Optional[Dict[str, str]] = None
    headers 可以是字典，也可以是 None

-> Any
    这个函数可以返回任意类型
```

Python 的类型注解主要是帮助阅读、IDE 提示和静态检查。它不像 Java 那样在运行时严格限制类型。

比如：

```python
def hello(name: str):
    """打印传入的名字。"""
    # name: str 只是提示这里期望字符串
    print(name)

hello(123)
```

这段代码在普通 Python 运行时不一定会立刻报类型错误，因为 `: str` 更多是提示“这里期望字符串”。

## 11. import：从其他文件引入代码

Python 里一个 `.py` 文件就是一个模块。`import` 用来引入别的模块。

```python
import requests
import json
import time
```

也可以只从某个模块中引入指定内容：

```python
from http_client import HttpClient
from base_api import post_json
```

在 `apis/one_dimensional.py` 里：

```python
from http_client import HttpClient
from base_api import post_json


def get_weir_info(client: HttpClient, project_id: str):
    """查询一维模型中的堰信息。"""
    # path 是接口地址中的路径部分
    path = "/business/project/getWeirInfo"

    # body 是发送给后端的 JSON 请求体
    body = {"projectId": project_id}

    # post_json 来自 base_api.py
    return post_json(client, path, body)
```

意思是：

- 从 `http_client.py` 引入 `HttpClient`。
- 从 `base_api.py` 引入 `post_json`。
- 当前文件就可以直接使用它们。

如果一个文件夹里有 `__init__.py`，Python 通常会把这个文件夹当作包来处理。所以项目里的 `apis/`、`test_def/` 都可以被导入。

## 12. class：把数据和行为封装成对象

类用 `class` 定义。这个项目里最容易理解的类是 `HttpClient`。

```python
# http_client.py

class HttpClient:
    """HTTP 客户端：保存服务地址、token、session，并统一发送接口请求。"""

    def __init__(self, base_url: str, timeout: int = 30):
        """初始化客户端对象，保存基础地址、超时时间和会话对象。"""
        # 去掉 base_url 末尾的 /，避免后面拼 URL 时出现 //
        self.base_url = base_url.rstrip("/")

        # 请求超时时间
        self.timeout = timeout

        # 登录前 token 为空，登录成功后会赋值
        self.token = None

        # requests.Session 可以复用连接和公共状态
        self.session = requests.Session()

    def login(self, username: str, password: str) -> str:
        """登录系统并把 token 保存到当前 HttpClient 对象里。"""
        # 拼出登录接口完整 URL
        url = f"{self.base_url}/user/login"

        # 组装登录请求体
        body = {
            "name": username,
            "password": password,
        }

        # 发送登录请求
        resp = self.session.post(url, json=body, timeout=self.timeout)

        # 把响应体解析成 Python 字典
        result = resp.json()

        # 从响应 data 中取出 token 并保存到对象属性
        self.token = result.get("data")
        return self.token

    def post(self, path: str, json=None, headers=None):
        """发送 POST 请求，path 是接口路径，json 是请求体。"""
        # base_url + path 得到完整请求 URL
        url = f"{self.base_url}{path}"
        ...
```

几个关键概念：

- `class HttpClient`：定义一个类，名字叫 `HttpClient`。
- `__init__`：构造函数，创建对象时自动执行。
- `self`：当前对象自己。
- `self.base_url`：当前对象身上的属性。
- `client = HttpClient(BASE_URL)`：创建一个 `HttpClient` 对象。
- `client.login(...)`：调用这个对象的方法。

为什么 HTTP 客户端适合用类？

因为它需要保存一些状态，例如：

- `base_url`
- `timeout`
- `token`
- `session`

如果不用类，这些状态就会散落在很多函数参数里；用类封装后，后续函数只要拿到 `client`，就能复用这些状态。

## 13. self：为什么类里面总有 self

`self` 表示“当前这个对象”。

```python
class HttpClient:
    """演示 self 用法的简化版 HTTP 客户端。"""

    def __init__(self, base_url):
        """创建对象时，把传入的 base_url 保存到当前对象里。"""
        # self.base_url 是对象属性
        self.base_url = base_url

    def show_url(self):
        """打印当前对象保存的 base_url。"""
        # 通过 self 访问当前对象自己的属性
        print(self.base_url)


client = HttpClient("http://example.com")
client.show_url()
```

这里：

- `client` 是一个具体对象。
- `self.base_url` 就是这个对象自己的 `base_url`。
- 调用 `client.show_url()` 时，Python 会自动把 `client` 传给 `self`。

所以你看到方法定义里有 `self`：

```python
def login(self, username, password):
    """类方法示例：self 表示当前对象，username/password 是调用时传入的参数。"""
```

但调用时不需要手动传 `self`：

```python
client.login("admin", "admin123")
```

## 14. if / elif / else：条件判断

条件判断用 `if`。

```python
code = resp_json.get("code")

# 如果业务 code 不是 200，说明接口返回了业务失败
if code != 200:
    raise Exception("接口调用失败")
else:
    # 接口成功时返回 data
    return resp_json.get("data")
```

常见判断符号：

```text
==    等于
!=    不等于
>     大于
<     小于
>=    大于等于
<=    小于等于
and   并且
or    或者
not   取反
```

项目里常见写法：

```python
if func_name in SKIP_APIS:
    # 当前接口在跳过列表中，本轮循环直接跳过它
    continue

if schema:
    # 如果配置了 schema，就做响应结构校验
    validation_result = validator.validate_structure(result, schema, func_name)

if not step_result["success"]:
    # 只要有一个 step 失败，整个 case 就标记为失败
    case_result["success"] = False
```

注意 Python 里很多值可以直接当条件：

- `None` 当作 False。
- 空字符串 `""` 当作 False。
- 空列表 `[]` 当作 False。
- 空字典 `{}` 当作 False。
- 非空值通常当作 True。

所以：

```python
if schema:
    ...
```

意思是：如果 `schema` 不是空值，就执行里面的逻辑。

## 15. for 循环：批量处理数据

Python 用 `for` 遍历列表、字典、文件集合等。

```python
for test_case in test_cases:
    # 每次循环执行一个测试用例
    result = run_test_case(test_case, client)
```

意思是：从 `test_cases` 里一个一个取出测试用例，每次命名为 `test_case`，然后执行。

遍历字典可以这样写：

```python
for key, value in PROJECTS.items():
    # key 是模块名，value 是项目 ID
    print(key, value)
```

遍历时如果还想拿到序号，可以用 `enumerate`：

```python
for index, step in enumerate(steps):
    # index 是序号，step 是当前步骤
    print(index, step)
```

项目中循环非常多，主要用于：

- 遍历 `apis/` 目录下的 Python 文件。
- 遍历模块里的函数。
- 遍历所有测试用例。
- 遍历每个测试步骤。
- 遍历 schema 字段。
- 遍历列表响应，逐项校验。

## 16. continue：跳过当前循环

`continue` 表示跳过本轮循环，进入下一轮。

```python
for func_info in api_functions:
    # 从函数信息中取出真实函数名
    func_name = func_info["func"].__name__

    if func_name in SKIP_APIS:
        # 如果这个接口被配置为跳过，就不生成测试 case
        continue

    # 只有没有被跳过的接口，才会走到这里
    create_test_case(func_info)
```

在这个项目里，`SKIP_APIS` 用来控制哪些接口暂时不跑。发现当前函数名在跳过列表中，就 `continue`。

## 17. try / except：捕获异常，避免整个测试中断

接口调用可能失败，例如：

- 网络失败。
- 登录失败。
- 接口返回 `code != 200`。
- 响应不是预期 JSON。
- schema 校验失败。

如果不捕获异常，一个接口失败可能导致整个测试进程直接结束。测试框架通常要捕获异常，把错误记录下来，然后继续执行后面的接口。

```python
# test_def/test_runner.py

try:
    # 动态调用当前 step 对应的接口函数
    result = func(client, **args)

    # 没有抛异常，说明这一阶段执行成功
    step_result["success"] = True

    # 把接口返回结果转成格式化 JSON 字符串，方便写入报告
    step_result["response"] = json.dumps(result, ensure_ascii=False, indent=2)

except Exception as e:
    # 捕获异常后，不让整个测试进程中断，而是记录当前 step 失败
    step_result["success"] = False

    # 结构化记录错误类型、错误信息和堆栈
    step_result["error"] = {
        "type": type(e).__name__,
        "message": str(e),
        "traceback": traceback.format_exc(),
    }
```

这里：

- `try` 里面放可能失败的代码。
- `except Exception as e` 捕获错误。
- `e` 是错误对象。
- `traceback.format_exc()` 可以拿到完整错误堆栈。

这个设计让“单个接口失败”和“整轮回归失败”分开。某个接口失败后，工具仍然可以继续跑其他接口，最后在报告里统一展示失败原因。

## 18. raise Exception：主动抛出错误

除了系统自动报错，我们也可以主动抛出错误。

```python
code = resp_json.get("code")

if code != 200:
    # 主动抛出异常，让上层测试执行器把它记录为失败
    raise Exception(f"接口调用失败 [code={code}]: {resp_json}")
```

在 `base_api.py` 里，如果业务响应 `code` 不是 200，就主动抛出异常。这样上层 `test_runner.py` 可以捕获这个异常，并把它记录成测试失败。

你可以把 `raise Exception(...)` 理解成：

> 这里已经不符合预期了，不应该继续当作成功流程执行。

## 19. with open：文件读写

项目里保存历史结果、baseline、报告时会用到文件读写。

```python
with open(output_path, "w", encoding="utf-8") as f:
    # 把生成好的 HTML 字符串写入报告文件
    f.write(html_content)
```

解释：

- `open(output_path, "w")`：以写入模式打开文件。
- `encoding="utf-8"`：用 UTF-8 编码写中文。
- `as f`：把打开的文件对象命名为 `f`。
- `with`：代码块结束后自动关闭文件。

读取 JSON 文件：

```python
with open(self.baseline_file, "r", encoding="utf-8") as f:
    # 从 baseline.json 中读取当前基线批次信息
    baseline_info = json.load(f)
```

写入 JSON 文件：

```python
with open(current_batch_file, "w", encoding="utf-8") as f:
    # 把当前接口响应保存成 JSON，供后续历史比对使用
    json.dump(current_data, f, ensure_ascii=False, indent=2)
```

其中：

- `json.load(f)`：从文件读取 JSON，变成 Python 字典或列表。
- `json.dump(data, f)`：把 Python 字典或列表写成 JSON 文件。
- `ensure_ascii=False`：中文不要转成 `\u4e2d\u6587` 这种形式。
- `indent=2`：格式化缩进，方便人看。

## 20. os / sys / pathlib：处理路径和模块搜索

项目里有些文件会先把项目根目录加入 Python 搜索路径：

```python
import sys
import os

# 当前文件的绝对路径
_current_file = os.path.abspath(__file__)

# 当前项目根目录：从当前文件路径往上找两级
_project_root = os.path.dirname(os.path.dirname(_current_file))

if _project_root not in sys.path:
    # 把项目根目录加入 Python 模块搜索路径
    sys.path.insert(0, _project_root)
```

这段代码可以拆开理解：

- `__file__`：当前 Python 文件的路径。
- `os.path.abspath(__file__)`：拿到当前文件的绝对路径。
- `os.path.dirname(...)`：拿到所在目录。
- 连续调用两次 `dirname`：从当前文件目录往上走两级，得到项目根目录。
- `sys.path`：Python 查找模块的路径列表。
- `sys.path.insert(0, _project_root)`：把项目根目录放到模块搜索路径最前面。

为什么要这样做？

因为运行入口在 `runner/run_tests.py`，它需要导入根目录下的 `config.py`、`http_client.py`，以及 `test_def/` 包。把项目根目录加入 `sys.path` 后，导入会更稳定。

`pathlib` 是另一种更现代的路径处理方式：

```python
from pathlib import Path

# 把项目根目录和 apis 拼成 apis 目录路径
apis_dir = Path(_project_root) / "apis"

for py_file in apis_dir.glob("*.py"):
    # 遍历 apis 目录下所有 .py 文件
    print(py_file)
```

这里的 `/` 不是除法，而是 `Path` 对象重载后的路径拼接写法。

## 21. importlib / inspect：这个项目最核心的高级语法

这个项目能自动发现接口，靠的是 `importlib` 和 `inspect`。

```python
# test_def/test_cases.py

module_name = "apis.one_dimensional"

# 根据模块名动态导入 apis/one_dimensional.py
module = importlib.import_module(module_name)

for name, obj in inspect.getmembers(module, inspect.isfunction):
    # 读取函数签名，例如 (client, project_id)
    sig = inspect.signature(obj)

    # 把函数参数转成列表，方便取第一个参数
    params = list(sig.parameters.values())

    if params and params[0].name == "client":
        # 第一个参数叫 client，就认为它是一个可测试 API 函数
        api_functions.append({
            "func": obj,
            "module_file": "one_dimensional",
        })
```

逐句解释：

```python
module = importlib.import_module("apis.one_dimensional")
```

意思是：运行时动态导入 `apis/one_dimensional.py` 这个模块。

```python
inspect.getmembers(module, inspect.isfunction)
```

意思是：从这个模块里找出所有函数。

```python
sig = inspect.signature(obj)
```

意思是：读取这个函数的参数签名。

```python
params[0].name == "client"
```

意思是：判断第一个参数是不是叫 `client`。

所以这个工具的自动发现规则是：

> 只要 `apis/*.py` 里的函数第一个参数是 `client`，就认为它是一个可以被测试框架执行的接口函数。

这就是为什么新增接口时，只要在 `apis/` 里新增函数，再补充配置，就能自动纳入测试。

## 22. `**args`：把字典展开成函数参数

这是你看懂 `test_runner.py` 的关键语法。

项目里有这种写法：

```python
result = func(client, **args)
```

假设：

```python
args = {
    # args 是一个字典，key 对应函数参数名
    "project_id": "abc-123",
    "locations": [
        {
            "reachName": "YDH_1",
            "chainage": "0",
        }
    ],
}
```

那么：

```python
func(client, **args)
```

等价于：

```python
func(
    # client 是普通位置参数
    client,

    # **args 展开后，相当于下面这些关键字参数
    project_id="abc-123",
    locations=[
        {
            "reachName": "YDH_1",
            "chainage": "0",
        }
    ],
)
```

也就是说，`**args` 会把字典展开成关键字参数。

为什么这个项目需要它？

因为 `test_cases.py` 会根据函数签名和配置动态生成参数字典。`test_runner.py` 并不知道当前接口到底需要 `locations`、`weir_info`、`type` 还是 `grid_no`，所以它统一用：

```python
func(client, **args)
```

这样就能调用任何参数结构不同的接口函数。

## 23. 递归：为什么 schema 校验和历史比对能处理嵌套结构

递归就是函数调用自己。它适合处理树状结构或嵌套结构。

接口响应通常是嵌套 JSON，例如：

```python
data = {
    "name": "测试项目",
    # weirs 是列表，里面每一项又是字典
    "weirs": [
        {
            "id": 1,
            "name": "测试堰",
            "data": [
                {"time": "2024-01-01", "value": 1.2}
            ],
        }
    ],
}
```

这种结构里有：

- 字典。
- 列表。
- 列表里的字典。
- 字典里的列表。

如果要校验每一层字段，只靠一层 `for` 循环不够，所以项目里用了递归。

```python
# response_validator.py

def _validate_recursive(self, data, schema, func_name, path, errors, warnings):
    """递归校验接口响应结构，能处理字典、列表等嵌套 JSON。"""
    # 读取当前 schema 期望的数据类型
    expected_type = schema.get("type")

    if isinstance(data, dict) and "fields" in schema:
        # 当前数据是字典时，继续校验每个字段
        for field, field_schema in schema.get("fields", {}).items():
            if field in data:
                # 字段仍然可能是嵌套结构，所以继续递归
                self._validate_recursive(
                    data[field],
                    field_schema,
                    func_name,
                    f"{path}.{field}" if path else field,
                    errors,
                    warnings,
                )

    if isinstance(data, list) and "item_schema" in schema:
        # 当前数据是列表时，继续校验列表里的每一项
        for index, item in enumerate(data):
            self._validate_recursive(
                item,
                schema["item_schema"],
                func_name,
                f"{path}[{index}]",
                errors,
                warnings,
            )
```

你可以这样理解：

- 如果当前数据是字典，就继续校验它的每个字段。
- 如果当前数据是列表，就继续校验列表里的每一项。
- 每深入一层，就把路径记录下来，比如 `weirs[0].data[0].value`。

历史基线比对也类似，因为它也要比较嵌套 JSON 的每一层。

## 24. lambda / filter：这个项目里可能见到的函数式写法

有些 Python 代码会用 `lambda` 写短函数。

```python
api_names = ["get_info", "_private", "update_data"]

# 过滤掉以下划线开头的函数名
public_apis = list(filter(lambda name: not name.startswith("_"), api_names))
```

这段代码的意思是：过滤掉以下划线开头的函数名。

不过在这个项目真实代码里，更多是用普通 `if`：

```python
if name.startswith("_"):
    # 以下划线开头的函数一般当作内部函数，自动发现时跳过
    continue
```

所以你不用急着掌握复杂的函数式写法。先看懂 `def`、`if`、`for`、`dict`、`list`、`class` 更重要。

## 25. `if __name__ == "__main__"`：Python 文件从哪里开始运行

在 `runner/run_tests.py` 末尾可以看到：

```python
if __name__ == "__main__":
    # 只有当前文件被直接运行时，才执行 main()
    main()
```

这句话的意思是：

- 如果这个文件是被直接运行的，就执行 `main()`。
- 如果这个文件是被别的文件 import 的，就不要自动执行 `main()`。

例如：

```bash
python runner/run_tests.py
```

这时 `runner/run_tests.py` 是直接运行，所以 `__name__ == "__main__"` 成立，会执行 `main()`。

但如果另一个文件写：

```python
from runner.run_tests import generate_batch_id
```

这时只是导入它，不希望自动跑完整测试流程，所以 `main()` 不会自动执行。

## 26. 用一个接口串完整流程：get_weir_info

现在用 `get_weir_info` 把项目里主要语法和流程串起来。

```python
# 1. runner/run_tests.py

def main():
    """测试工具入口：登录、生成测试用例、执行测试并生成报告。"""
    # 创建 HTTP 客户端
    client = HttpClient(BASE_URL)

    # 登录并保存 token
    client.login(LOGIN_USERNAME, LOGIN_PASSWORD)

    # 自动生成测试用例
    test_cases = get_test_cases(PROJECTS)

    # 执行所有测试用例
    case_results = run_all_tests(test_cases, client, batch_id=batch_id)

    # 生成 HTML 报告
    generate_html_report(case_results, output_path)


# 2. test_cases.py 自动发现

def discover_api_functions():
    """动态导入 API 模块，并从模块中发现可测试的接口函数。"""
    # 导入一维接口模块
    module = importlib.import_module("apis.one_dimensional")

    # 遍历模块里的所有函数
    for name, obj in inspect.getmembers(module, inspect.isfunction):
        # inspect.signature 可以读取函数参数
        if inspect.signature(obj).parameters:
            # 第一个参数叫 client，就认为这是一个 API 函数
            if list(inspect.signature(obj).parameters.values())[0].name == "client":
                api_functions.append({"func": obj, "module_file": "one_dimensional"})


# 3. apis/one_dimensional.py 里的接口函数

def get_weir_info(client: HttpClient, project_id: str):
    """查询一维模型中的堰信息。"""
    # 接口路径
    path = "/business/project/getWeirInfo"

    # 请求体
    body = {"projectId": project_id}

    # 调用通用请求方法
    return post_json(client, path, body)


# 4. base_api.py 统一发送请求

def post_json(client: HttpClient, path: str, body: Dict[str, Any]) -> Any:
    """统一发送 POST JSON 请求，并处理业务 code。"""
    # 通过 HttpClient 发送请求
    resp = client.post(path, json=body)

    # 取出响应 JSON
    resp_json = resp.get("json_data")

    if resp_json.get("code") != 200:
        # 业务 code 不成功，主动抛异常
        raise Exception(f"接口调用失败: {resp_json}")

    # 只返回业务 data
    return resp_json.get("data")


# 5. test_runner.py 统一执行函数

def execute_step(step, client):
    """执行单个测试步骤：取出函数和参数，然后动态调用接口。"""
    # 当前步骤要执行的接口函数
    func = step["func"]

    # 当前步骤对应的参数字典
    args = step["args"]

    # **args 会把字典展开成函数关键字参数
    result = func(client, **args)
    return result
```

完整链路是：

```text
运行 runner/run_tests.py
    -> 创建 HttpClient
    -> 登录拿 token
    -> 自动扫描到 get_weir_info
    -> 根据 one_dimensional 模块选择项目 ID
    -> 根据 test_config.py 生成 args
    -> test_runner.py 执行 func(client, **args)
    -> get_weir_info 组装 path 和 body
    -> post_json 调用 client.post
    -> HttpClient 真正发送 HTTP 请求
    -> 返回 data
    -> response_validator.py 做校验和历史比对
    -> report_generator.py 生成报告
```

如果你能看懂这条链路，这个项目的主干就已经通了。

## 27. 你应该优先掌握的 Python 语法顺序

如果你是第一次接触 Python，不建议从最难的 `inspect`、递归开始。建议按这个顺序学：

```text
第 1 层：能看懂基本代码
    变量、字符串、数字、True/False、None
    list、dict
    if、for

第 2 层：能看懂项目函数
    def、参数、return
    import
    类型注解
    默认参数

第 3 层：能看懂项目结构
    class、self、对象方法
    __init__
    if __name__ == "__main__"

第 4 层：能看懂测试框架核心
    try/except
    raise Exception
    with open
    json.load/json.dump
    **args

第 5 层：能看懂高级设计
    importlib
    inspect
    递归
```

对这个项目来说，最关键的几个语法是：

- `dict`：因为配置、请求、响应、测试结果都是字典。
- `def`：因为每个 API 都被封装成函数。
- `class` 和 `self`：因为 HTTP 客户端是类。
- `import`：因为项目按文件拆分。
- `for`：因为测试框架会批量扫描和执行。
- `try/except`：因为接口失败要被记录而不是中断。
- `**args`：因为测试执行器要动态调用不同参数的接口函数。
- `inspect`：因为自动发现 API 函数依赖反射。

## 28. 看懂这个项目后，你可以达到什么程度

读完这篇，再回头看项目代码，你应该能做到：

- 看懂 `config.py` 里的环境和项目 ID 配置。
- 看懂 `apis/*.py` 里每个接口函数在做什么。
- 看懂 `test_config.py` 里为什么有很多嵌套字典和列表。
- 理解 `TEST_ARGS_CONFIG` 如何变成函数参数。
- 理解 `func(client, **args)` 为什么能动态调用接口。
- 理解 `HttpClient` 为什么要用类封装。
- 大致理解 `test_cases.py` 如何自动发现接口。
- 大致理解 `response_validator.py` 为什么使用递归。
- 明白整个工具从入口运行到生成报告的大致流程。

这时你再去准备面试表达，就不是背代码，而是能讲清楚：这些 Python 语法如何服务于“自研 API 回归测试工具”这个目标。
