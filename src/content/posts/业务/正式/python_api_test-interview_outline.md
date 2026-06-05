---
title: 自研 Python API 回归测试工具
published: 2026-06-05
description: '面向面试讲解的 Python API 回归测试工具项目大纲，梳理背景、分层架构、配置驱动与测试价值。'
image: ''
tags: ['Python', 'API测试']
category: '业务/正式'
private: true
draft: false
---

# 自研 Python API 回归测试工具

> 简历目标：设计并实现 Python API 回归测试工具，覆盖 80+ 核心接口，支持场景化参数配置与历史基线比对，测试回归人力成本降低 70%。

## 1. 项目背景：为什么要自研自动化测试工具

WCH1D 项目的外部 API 覆盖一维模型、二维模型、水文模型、项目管理、数据同化等多个业务模块。接口数量多，参数结构复杂，而且很多接口依赖具体项目 ID、模型类型、边界条件、时间序列、计算结果类型等业务数据。

在没有自动化工具之前，接口回归主要依赖人工调试：通过 Postman 或手写脚本逐个调用接口，手动修改参数，手动观察响应结果。这种方式在接口数量较少时还能接受，但当核心接口扩展到 80+ 后，主要问题会集中在几个方面：

- 接口数量多，人工逐个执行耗时高。
- 参数场景复杂，同一个接口可能需要覆盖多组业务输入。
- 只看 HTTP 成功不够，接口返回结构或字段类型变化也需要被发现。
- 历史结果缺少自动对比，接口返回“成功但结果变了”不容易定位。
- 测试报告不直观，失败后需要翻控制台日志排查。

因此这个工具的核心目标不是简单写一批请求脚本，而是把接口回归流程抽象成一个可维护、可扩展、可复用的小型测试框架。

## 2. 架构总览：文件树与职责划分

项目采用分层结构，把环境配置、HTTP 通信、业务接口封装、测试用例生成、测试执行、响应校验、历史比对和报告生成拆开。

```text
python_api_test1/
├── config.py                        # 环境、账号、项目 ID 配置
├── http_client.py                   # HTTP 客户端封装，负责登录、token、请求发送
├── base_api.py                      # 通用 API 调用封装，统一处理 POST JSON 和响应 code
├── apis/                            # 业务接口封装层
│   ├── hydrologic.py                 # 水文模块接口
│   ├── one_dimensional.py            # 一维模型接口
│   ├── two_dimensional.py            # 二维模型接口
│   └── project_manage.py             # 项目管理、数据同化相关接口
├── test_def/                        # 测试定义与执行核心
│   ├── test_config.py                # 测试参数、场景、跳过接口、脏数据接口、比对配置
│   ├── test_cases.py                 # 自动发现 API 函数并生成测试用例
│   ├── test_runner.py                # 测试执行器，负责执行、异常捕获、结果收集
│   ├── response_validator.py         # 响应结构校验与历史基线比对
│   ├── report_generator.py           # HTML 报告生成
│   └── schemas/                      # 各业务模块响应 schema
├── runner/
│   └── run_tests.py                  # 一键运行入口
└── test_results_history/             # 历史测试结果与 baseline
```

整体调用链可以概括为：

```text
runner/run_tests.py
    -> 初始化 HttpClient
    -> 登录获取 token
    -> test_cases.py 自动发现接口并生成测试用例
    -> test_runner.py 执行测试步骤
    -> response_validator.py 做结构校验和历史基线比对
    -> report_generator.py 生成 HTML 报告
```

## 3. 分层封装：把 HTTP、业务接口、测试执行解耦

这个工具的第一个架构重点是分层封装。

它没有把所有接口请求都堆在一个脚本里，而是把

- “怎么发请求”
- “调用哪个业务接口”
- “如何生成测试用例”
- “如何执行并校验结果”拆成不同层

### 3.1 基础配置层 config.py

这一层负责存放环境级和项目级配置，例如服务地址、登录账号、密码、不同业务模块使用的项目 ID。它解决的是“环境和测试数据不应该散落在代码逻辑里”的问题。

```python
# config.py

BASE_URL = "http://10.53.10.96:8088"

LOGIN_USERNAME = "admin"
LOGIN_PASSWORD = "admin123"

PROJECTS = {
    "demo_2d": "a5dd766c-c4a3-44b1-82ae-6a80820f5397",
    "dirty_data": "a5dd766c-c4a3-44b1-82ae-6a80820f5397",
    "hydrologic": "d4b81cde-2ecc-4252-b71f-13ae67dc018e",
    "one_dimensional": "a43427b6-baa2-4933-a8f2-c0d020f0b414",
    "two_dimensional": "a43427b6-baa2-4933-a8f2-c0d020f0b414",
    "project_manage": "d4b81cde-2ecc-4252-b71f-13ae67dc018e",
}
```

面试里可以强调：这里把不同业务模块的项目 ID 提前配置好，后续测试用例生成时可以根据接口所在模块自动选择项目 ID，避免每个接口都手动传参。

### 3.2 HTTP 通信层 http_client.py

这一层封装底层 HTTP 细节，包括 `requests.Session`、登录、token 保存、请求头拼装、GET/POST 请求发送。业务接口层不直接感知 `requests` 的使用细节。

```python
# http_client.py

class HttpClient:
    """统一管理 HTTP 会话、认证信息和请求发送。"""

    def __init__(self, base_url: str, timeout: int = 30):
        self.base_url = base_url.rstrip("/")  # 统一去尾部斜杠，避免拼接时重复
        self.timeout = timeout
        self.token = None
        self.session = requests.Session()  # 复用 TCP 连接，提升请求效率

    def login(self, username: str, password: str) -> str:
        url = f"{self.base_url}/user/login"
        body = {"name": username, "password": password}

        resp = self.session.post(url, json=body, timeout=self.timeout)
        resp.raise_for_status()  # HTTP 4xx/5xx 直接抛异常，避免后续处理脏响应
        result = resp.json()

        if result.get("code") != 200:
            raise Exception(f"登录失败: {result}")

        self.token = result.get("data")  # 将 token 存入实例，后续请求自动注入
        return self.token

    def post(self, path: str, json=None, headers=None):
        url = f"{self.base_url}{path}"
        default_headers = {"Content-Type": "application/json"}

        if self.token:
            default_headers["Authorization"] = self.token  # 登录态请求统一带 token
        if headers:
            default_headers.update(headers)

        resp = self.session.post(
            url,
            json=json,
            headers=default_headers,
            timeout=self.timeout,
        )
        resp.raise_for_status()

        return {
            "status_code": resp.status_code,
            "json_data": resp.json(),
        }
```

这里可以把 `http_client.py` 理解成底层通信层：它定义的是“HTTP 请求怎么发”，只处理 URL 拼接、鉴权头、Session 复用、超时和 HTTP 状态码这些通用能力。

### 3.3 通用 API 调用层 base_api.py

这里可以把 `base_api.py` 理解成建立在 HTTP 通信层之上的通用 API 层，后面 `apis/` 里的真实业务接口函数，调用的就是这一层，而不是自己直接去操作底层 HTTP。

这一层负责处理所有业务接口都共有的逻辑：发送 POST JSON、判断业务状态码 `code == 200`、记录最近一次请求 path 和响应信息。

```python
# base_api.py

def post_json(client: HttpClient, path: str, body: Dict[str, Any], headers=None) -> Any:
    # 统一业务接口调用入口：发送 POST 请求并校验响应 code
    client._last_request_path = path

    resp = client.post(path, json=body, headers=headers)
    http_status_code = resp.get("status_code")
    resp_json = resp.get("json_data")

    code = resp_json.get("code")
    if code != 200:
        raise Exception(f"接口调用失败 [path={path}, code={code}]: {resp_json}")

    client._last_response_info = {
        "http_status_code": http_status_code,
        "code": code,
        "data": resp_json.get("data"),
    }

    return resp_json.get("data")
```

### 3.4 业务接口封装层 apis/*.py

这一层每个函数对应一个业务接口，

只负责组装 url 和请求 body。

项目按业务域拆分为水文、一维、二维、项目管理，方便维护 80+ 接口。

```python
# apis/one_dimensional.py

def get_weir_info(client: HttpClient, project_id: str):
    path = "/business/project/getWeirInfo"
    body = {"projectId": project_id}  # 业务层只负责按接口要求组织请求参数
    return post_json(client, path, body)


def put_weir_info(client: HttpClient, project_id: str, weir_info: List[Dict[str, Any]]):
    path = "/business/project/putWeirInfo"
    body = {
        "projectId": project_id,
        "weirInfo": weir_info,  # 将调用方准备好的堰配置直接透传给后端
    }
    return post_json(client, path, body)


def query_one_d_result(client: HttpClient, project_id: str, locations: List[Dict[str, str]]):
    path = "/business/point-result/queryByReachIdAndChainagesAndProjectIdForExternal"
    body = {
        "projectId": project_id,
        "locations": locations,  # 用断面位置列表作为结果查询条件
    }
    return post_json(client, path, body)
```

这里的接口函数写得很薄，这是刻意设计的。它们不负责测试逻辑、不负责报告、不负责历史对比，只表达“某个业务接口需要什么 path 和 body”。

### 3.5 测试用例生成层 test_def/test_cases.py

这一层负责把 `apis/` 下的业务接口函数转成可执行测试用例。它会自动发现函数、匹配项目 ID、读取参数配置、展开场景。

```python
# test_def/test_cases.py

def discover_api_functions():
    api_functions = []
    apis_dir = Path(_project_root) / "apis"

    for py_file in apis_dir.glob("*.py"):
        if py_file.name == "__init__.py":
            continue  # 跳过包初始化文件，避免把非业务接口文件纳入测试

        module_file = py_file.stem
        module_name = f"apis.{module_file}"
        module = importlib.import_module(module_name)

        for name, obj in inspect.getmembers(module, inspect.isfunction):
            if name.startswith("_"):
                continue  # 约定以下划线开头的函数不参与自动发现

            sig = inspect.signature(obj)
            params = list(sig.parameters.values())

            if params and params[0].name == "client":
                api_functions.append({
                    "func": obj,
                    "module_file": module_file,  # 记录所属模块，后续用于匹配项目 ID
                })

    return api_functions


def get_project_id_by_module(module_file: str, projects: Dict[str, str]) -> str:
    project_id = projects.get(module_file)
    if project_id:
        return project_id
    return projects.get("demo_2d", "")  # 找不到专属项目时回退到默认演示项目


def build_test_args(func: Callable, project_id: str, scene_args=None) -> Dict[str, Any]:
    args = {}
    sig = inspect.signature(func)
    config_args = scene_args or get_test_args(func.__name__)

    for param in list(sig.parameters.values())[1:]:
        if param.name == "project_id":
            args["project_id"] = project_id  # project_id 由框架统一注入
        elif param.name in config_args:
            args[param.name] = _replace_project_id_in_value(
                config_args[param.name],
                project_id,
            )  # 把配置中的占位项目 ID 替换成当前实际项目
        elif param.default != inspect.Parameter.empty:
            args[param.name] = param.default  # 对未配置参数回退到函数默认值

    return args
```

这里体现了框架化设计：测试执行器不需要知道有哪些接口，接口函数只要符合“第一个参数是 client”的约定，就能被自动纳入测试。

### 3.6 测试执行与结果处理层 test_def/test_runner.py

这一层负责真正执行测试 case，记录每一步的开始时间、结束时间、耗时、请求参数、响应结果、异常信息，并继续执行后续 case。

```python
# test_def/test_runner.py

def execute_step(step: Dict[str, Any], client: HttpClient) -> Dict[str, Any]:
    func = step["func"]
    args = step.get("args", {})

    step_result = {
        "name": step["name"],
        "success": False,
        "start_time": time.time(),  # 记录步骤开始时间，后续计算耗时
        "end_time": None,
        "duration": 0,
        "request": json.dumps(args, ensure_ascii=False, indent=2),  # 预先保存请求参数，失败时也能回溯
        "response": None,
        "error": None,
    }

    try:
        result = func(client, **args)

        step_result["url"] = getattr(client, "_last_request_path", None)  # 从 client 取回最近一次请求地址
        step_result["success"] = True

        validator = ResponseValidator(batch_id=getattr(execute_step, "_batch_id", None))
        schema = get_response_schema(func.__name__)

        if schema:
            step_result["validation"] = validator.validate_structure(
                result,
                schema,
                func.__name__,
            )  # 如果存在 schema，就做响应结构校验

        compare_config = get_compare_config(func.__name__, scene_id=step.get("scene_id"))
        if compare_config:
            step_result["compare"] = validator.compare_with_previous(
                func.__name__,
                args.get("project_id", ""),
                result,
                compare_config,
                scene_id=step.get("scene_id"),
            )  # 如果配置了比对规则，就和历史 baseline 做比较

        step_result["response"] = json.dumps(result, ensure_ascii=False, indent=2)

    except Exception as e:
        step_result["success"] = False
        step_result["error"] = {
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc(),  # 保留完整堆栈，便于报告和排查
        }

    step_result["end_time"] = time.time()
    step_result["duration"] = (step_result["end_time"] - step_result["start_time"]) * 1000
    return step_result
```

这一层的重点是稳定性：单个接口失败不会中断整个回归流程，失败信息会被结构化记录，后续报告可以直接展示。

### 3.7 质量校验与报告层

对应文件：`response_validator.py`、`schemas/`、`report_generator.py`

这一层让工具不只是“调接口”，而是能判断接口返回是否符合预期，并把结果可视化。

- `schemas/`：维护各业务模块响应结构。
- `response_validator.py`：负责 schema 校验和历史 baseline 对比。
- `report_generator.py`：负责生成 HTML 报告。

分层设计的最终收益是：调用链清晰，职责边界明确。接口新增、参数调整、校验规则调整、报告样式调整都能在对应层处理，不会互相污染。

## 4. 配置驱动：用配置管理环境、项目和测试参数

`test_config.py`

关于API的一些具体的配置都在这里面配置。

配置驱动是这个工具的第二个核心设计。它把“哪些接口跑、传什么参数、哪些接口跳过、哪些接口会污染数据、哪些接口需要历史比对”都放到配置里，而不是写死在执行流程中。

```python
# test_def/test_config.py

# SKIP_APIS：声明本轮自动化执行时要跳过的接口名列表
SKIP_APIS = [
    "one_d_calculate",
    "query_two_dim_all_result",
    "query_two_dim_node_info",
]

# DIRTY_DATA_APIS：声明会新增、修改、删除项目数据的接口名列表
DIRTY_DATA_APIS = [
    "put_weir_info",
    "put_gate_info",
    "delete_projects",
    "clean_project",
    "modify_two_dim_simulation_time",
]

TEST_ARGS_CONFIG = {
    # get_weir_info：接口名；空字典表示这个接口没有额外业务参数需要传入
    "get_weir_info": {},

    "query_one_d_result": {
        # locations：一维结果查询的位置列表，可以一次传多个断面/桩号点
        "locations": [
            {
                # reachName：河道或断面所属河段名称
                "reachName": "某河道",
                # chainage：沿河道的桩号/里程位置
                "chainage": "0",
            }
        ]
    },

    "put_weir_info": {
        # weir_info：堰信息列表，列表里的每个元素都是一条要提交的堰数据
        "weir_info": [
            {
                # id：堰记录主键或业务 ID
                "id": 1,
                # projectId：所属项目 ID，运行时会替换成当前测试项目
                "projectId": "__PROJECT_ID__",
                # name：堰名称
                "name": "测试堰",
                # reachId：所属河段 ID
                "reachId": 3,
                # chainage：堰所在桩号位置
                "chainage": "7300",
                # bottom：堰底高程
                "bottom": "28.5",
                # length：堰长度
                "length": "343",
            }
        ]
    },
}
```

这里有几个关键点：

- `SKIP_APIS` 用来跳过耗时、暂不稳定或不适合自动化的接口。
- `DIRTY_DATA_APIS` 用来标记会修改、删除、导入数据的接口，运行时可以切换到隔离项目。
- `TEST_ARGS_CONFIG` 让每个接口的测试参数外置，新增或调整测试数据时不用改执行器。
- `__PROJECT_ID__` 是占位符，运行时会替换为当前模块对应的真实项目 ID。

面试时可以强调：配置驱动让这个工具具备可运营性。测试范围、测试数据、跳过规则、比对规则都可以通过配置调整，而不是每次都改主流程代码。

## 5. 自动发现：通过反射自动生成测试用例

`test_def/test_cases.py`

为了覆盖 80+ 接口，如果手动维护一份测试用例注册表，成本会很高，也容易漏掉新增接口。因此工具使用 Python 的动态导入和反射能力，从 `apis/` 目录自动发现接口函数。

核心约定是：接口函数的第一个参数必须是 `client`。只要符合这个约定，就认为它是一个可被测试框架识别的 API 函数。

```python
# test_def/test_cases.py

def discover_api_functions() -> List[Dict[str, Any]]:
    api_functions = []
    apis_dir = Path(_project_root) / "apis"

    for py_file in apis_dir.glob("*.py"):
        if py_file.name == "__init__.py":
            continue  # 跳过包初始化文件，避免把非业务接口文件当成可测试 API

        module_file = py_file.stem
        module_name = f"apis.{module_file}"
        module = importlib.import_module(module_name)  # 按模块名动态导入业务接口文件

        for name, obj in inspect.getmembers(module, inspect.isfunction):
            if name.startswith("_"):
                continue  # 约定私有函数不参与自动发现

            sig = inspect.signature(obj)
            params = list(sig.parameters.values())

            if not params:
                continue  # 没有参数的函数不符合接口函数约定

            first_param = params[0]
            if first_param.name == "client":
                func_module = inspect.getmodule(obj)
                if func_module and func_module.__name__ == module_name:
                    api_functions.append({
                        "func": obj,
                        "module_file": module_file,  # 记录所属模块，后面用于匹配项目 ID 和报告展示
                    })

    return api_functions
```

这个设计的好处是：

- 新增接口时，不需要修改测试执行主流程。
- 只要在 `apis/xxx.py` 新增符合约定的函数，工具就能自动发现。
- `test_runner.py` 不需要关心具体有哪些 API，只执行 `test_cases.py` 生成出来的 case。
- 对 80+ 接口来说，维护成本比手动注册低很多。

面试表达可以这样说：

> 我这里用了 Python 的 importlib 和 inspect，把接口函数自动转成测试用例。我们约定接口函数第一个参数必须是 client，这样框架就能自动识别可测试 API。新增接口时只需要补充接口函数和测试参数配置，不需要改测试执行主流程。

## 6. 场景化测试：一个接口支持多组业务参数

`test_def/test_config.py`

很多接口不是只测一组参数就够了。例如二维结果查询，同一个接口可能需要分别查询水深、流速、水位；修改初始条件接口，也可能要覆盖不同类型的初始条件。

因此工具在 `TEST_ARGS_CONFIG` 中支持 `scenarios` 配置。一个接口函数可以根据不同场景展开成多个测试 case。

```python
# test_def/test_config.py

TEST_ARGS_CONFIG = {
    "query_two_dim_result": {
        "scenarios": {
            "type1": {
                "type": "1",
                "grid_no": 10,
            },
            "type2": {
                "type": "2",
                "grid_no": 10,
            },
            "type3": {
                "type": "3",
                "grid_no": 10,
            },
        }  # 同一个接口按不同结果类型拆成多个独立测试场景
    },

    "set_one_d_initial_parameter": {
        "scenarios": {
            "level": {
                "global_initial_parameter": {
                    "projectId": "__PROJECT_ID__",
                    "type": "level",
                    "value": "1.2",
                    "quantity": "0",
                },
                "initial_parameter": [],  # 这里只测全局初始条件，所以明细数组保持为空
            },
            "depth": {
                "global_initial_parameter": {
                    "projectId": "__PROJECT_ID__",
                    "type": "depth",
                    "value": "1.2",
                    "quantity": "0",
                },
                "initial_parameter": [],
            },
        }  # 用场景名区分不同业务输入，后续会展开成多个 case
    },
}
```

测试用例生成时，如果发现某个接口配置了 `scenarios`，就会把每个场景单独生成一个 case。例如 `query_two_dim_result` 会生成：

- `query_two_dim_result_type1`
- `query_two_dim_result_type2`
- `query_two_dim_result_type3`

这样可以用同一个 API 函数覆盖多种业务输入，而不用复制多份接口函数。

这个设计解决的是“接口少，但业务场景多”的问题。它让参数维度通过配置扩展，而不是通过代码分支扩展。

## 7. 响应校验：用 schema 检查接口返回结构

`test_def/schemas/one_dimensional_schemas.py`

接口测试不能只判断请求是否成功。很多回归问题表现为：HTTP 状态码正常，业务 `code` 也是 200，但返回字段缺失、字段类型变化、嵌套结构变化。这类问题如果靠人工看响应，很容易漏掉。

因此工具在 `schemas/` 下按业务模块维护响应结构，在 `response_validator.py` 中递归校验接口返回。

```python
# test_def/schemas/one_dimensional_schemas.py

ONE_DIMENSIONAL_SCHEMAS = {
    "get_weir_info": {
        "type": "list",
        "item_schema": {
            "type": "dict",
            "required_fields": ["id", "name", "reachId", "chainage"],
            "fields": {
                "id": {"type": "int"},
                "projectId": {"type": "str"},
                "name": {"type": "str"},
                "reachId": {"type": ["int", "str"]},
                "chainage": {"type": ["int", "float", "str"]},
                "bottom": {"type": ["int", "float", "str", "null"]},
                "length": {"type": ["int", "float", "str", "null"]},
            },
        },
    }
}


# test_def/response_validator.py

def validate_structure(self, data: Any, schema: Dict[str, Any], func_name: str):
    errors = []
    warnings = []
    self._validate_recursive(data, schema, func_name, "", errors, warnings)

    return {
        "success": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
    }
```

这一层主要校验：

- 返回值整体类型是否正确。
- 必填字段是否存在。
- 字段类型是否符合预期。
- 列表元素结构是否符合预期。
- 嵌套对象是否符合预期。

面试时可以强调：schema 校验把接口测试从“能调通”提升到“接口契约是否稳定”。这对回归测试很重要，因为前后端或外部系统依赖的是接口结构，而不只是状态码。

### 7.1 成熟商业项目通常如何判断接口返回正确

在成熟的商业项目里，判断一个接口返回是否正确，一般不会只依赖 schema 校验，而是分成几层逐步检查。可以理解成一个从“请求是否成功”到“业务结果是否可信”的校验流程。

```text
HTTP 层检查
    -> status_code 是否为 200
    -> 是否超时
    -> 返回内容是否为 JSON

业务状态码检查
    -> 响应体里的 code 是否为 200
    -> message 是否表示成功

结构契约校验
    -> data 是 list 还是 dict
    -> 必填字段是否存在
    -> 字段类型是否正确
    -> 嵌套对象和数组元素结构是否符合预期

业务断言校验
    -> 项目 ID 是否和请求一致
    -> 时间序列是否按时间升序
    -> 水深、水位、流速等数值是否在合理范围
    -> 修改接口执行后，再查询确认数据是否真的更新

历史基线比对
    -> 当前结果和历史稳定版本相比是否有异常差异
    -> 忽略 pid、时间戳等动态字段
    -> 对模型计算结果允许一定数值容差
```

这个项目目前已经覆盖了其中几层：`base_api.py` 负责业务 `code == 200` 检查，`response_validator.py` 负责 schema 结构校验，`COMPARE_WITH_PREVIOUS_CONFIG` 和 `test_results_history/` 负责历史基线比对。

如果继续往成熟商业测试框架演进，可以补强两类能力：

- 第一类是引入标准化 schema 工具，例如 `jsonschema`、`pydantic` 或基于 OpenAPI 文档做 contract validation，替代部分手写递归校验。
- 第二类是给关键接口增加业务断言，尤其是修改类接口采用“先修改、再查询、再断言”的闭环校验，确保接口不只是返回成功，而是真实业务状态也发生了正确变化。

面试时可以这样总结：

> 我们当前工具主要做了业务状态码检查、响应结构 schema 校验和历史基线比对。成熟商业项目通常还会在此基础上增加标准化 contract validation 和业务断言。尤其是对修改类接口，不能只看接口返回成功，还要再调用查询接口验证数据是否真的更新，这样才能形成完整的接口正确性校验闭环。

## 8. 历史基线比对：自动发现回归差异

除了结构校验之外，这个工具还支持历史基线比对。每次测试运行都会生成一个批次 ID，并把当前接口响应保存到 `test_results_history/batches/{batch_id}`。如果某一次运行结果被设置为 baseline，后续测试就会自动和这个 baseline 对比。

```python
# test_def/response_validator.py

class ResponseValidator:
    def __init__(self, history_dir=None, batch_id=None):
        self.history_dir = Path(history_dir or "test_results_history")
        self.batches_dir = self.history_dir / "batches"
        self.baseline_file = self.history_dir / "baseline.json"
        self.batch_id = batch_id

    def compare_with_previous(
        self,
        func_name: str,
        project_id: str,
        current_data: Any,
        compare_config: Dict[str, Any],
        scene_id: Optional[str] = None,
    ):
        project_id_short = project_id[:8]
        history_file_name = f"{func_name}_{project_id_short}.json"

        if scene_id:
            history_file_name = f"{func_name}_{project_id_short}_{scene_id}.json"

        current_batch_dir = self.batches_dir / self.batch_id
        current_batch_file = current_batch_dir / history_file_name
        current_batch_file.write_text(
            json.dumps(current_data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        baseline_batch_id = self.get_baseline_batch_id()
        if not baseline_batch_id:
            return {
                "has_history": False,
                "success": True,
                "differences": [],
                "message": "暂无 baseline，本次结果只保存不对比",
            }

        baseline_file = self.batches_dir / baseline_batch_id / history_file_name
        previous_data = json.loads(baseline_file.read_text(encoding="utf-8"))

        differences = []
        self._compare_recursive(
            previous_data,
            current_data,
            "",
            func_name,
            compare_config.get("compare_fields"),
            compare_config.get("ignore_fields", []),
            compare_config.get("ignore_paths", []),
            compare_config.get("tolerance", {}),
            differences,
            compare_config.get("ignore_length", True),
        )

        return {
            "has_history": True,
            "success": len(differences) == 0,
            "differences": differences,
        }
```

对比规则通过配置控制：

```python
# test_def/test_config.py

COMPARE_WITH_PREVIOUS_CONFIG = {
    "query_rainfall_time_serial": {
        "enabled": True,
        "compare_fields": None,
        "ignore_fields": [],
        "ignore_paths": ["rainfall[*].pid"],
        "tolerance": {},
        "ignore_length": True,
    },

    "get_data_assimilation_info": {
        "enabled": True,
        "compare_fields": None,
        "ignore_fields": ["pid"],
        "ignore_paths": [],
        "tolerance": {},
    },
}
```

这里可以处理几类实际问题：

- 有些字段每次都会变，例如 `pid`、时间戳，可以忽略。
- 有些数组长度可能因为业务数据变化而变化，可以选择忽略长度。
- 有些数值允许小范围浮动，可以配置容差。
- 多场景接口可以按 `scene_id` 保存和比对不同结果。

这个能力解决了“接口返回成功但结果悄悄变了”的问题，是回归测试里很关键的一环。

## 9. 可视化报告：用 HTML 报告提升定位效率

自动化测试如果只在控制台输出日志，定位效率仍然不高。所以工具最后会生成 HTML 报告，把每个 case 的执行状态、请求参数、响应结果、校验结果、历史对比结果都展示出来。

```python
# test_def/report_generator.py

def generate_html_report(case_results: List[Dict[str, Any]], output_path: str):
    total_cases = len(case_results)
    passed_cases = sum(1 for c in case_results if c.get("success", False))
    failed_cases = total_cases - passed_cases
    pass_rate = (passed_cases / total_cases * 100) if total_cases else 0

    case_cards_html = ""
    for index, case_item in enumerate(case_results):
        mermaid_diagram = generate_mermaid_diagram(case_item, index)

        case_cards_html += f"""
        <div class="case-card" id="case-{index}">
            <div class="case-header">
                <h3>{case_item["name"]}</h3>
                <span>{ "通过" if case_item["success"] else "失败" }</span>
            </div>
            <div class="mermaid-container">
                <div class="mermaid">
                    {mermaid_diagram}
                </div>
            </div>
        </div>
        """

    html_content = f"""
    <html>
    <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js"></script>
    </head>
    <body>
        <div class="stats">
            <div>总数：{total_cases}</div>
            <div>通过：{passed_cases}</div>
            <div>失败：{failed_cases}</div>
            <div>通过率：{pass_rate:.1f}%</div>
        </div>
        {case_cards_html}
    </body>
    </html>
    """

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
```

报告里重点展示：

- 总用例数、成功数、失败数、通过率。
- 失败用例导航。
- Mermaid 流程图，展示每个 case 的执行步骤。
- 点击步骤查看 request、response、异常堆栈。
- 展示 schema 校验结果和 baseline 对比结果。

这个设计的价值是把测试结果从“控制台日志”变成“可阅读、可定位、可复盘”的报告。失败后可以直接看到是哪一个接口、哪个参数、哪个字段校验失败、和历史结果有什么差异。

## 10. 完整运行流程：从命令启动到生成报告

这一节可以作为面试时的“全链路讲解”。前面讲的是工具的架构设计点，这里要把这些点串成一次真实运行流程：用户输入什么命令，程序从哪里开始，经过哪些模块，最后产出什么结果。

### 10.1 用户如何启动测试

用户进入项目根目录后，执行入口脚本：

```bash
cd F:\wuchuan_yunshui\codeCode\z_something_other\python_api_test1
python runner\run_tests.py
```

这个命令会运行 `runner/run_tests.py`。这个文件是整个测试工具的入口，它不会直接写具体接口逻辑，而是负责组织完整测试流程。

```python
# runner/run_tests.py

def main():
    batch_id = generate_batch_id()

    client = HttpClient(BASE_URL)
    token = client.login(LOGIN_USERNAME, LOGIN_PASSWORD)

    test_cases = get_test_cases(PROJECTS)
    case_results = run_all_tests(test_cases, client, batch_id=batch_id)

    output_path = "python-api-test-report.html"
    generate_html_report(case_results, output_path)

    validator = ResponseValidator()
    baseline_batch_id = validator.get_baseline_batch_id()
    # 最后询问用户是否把本次批次设置为新的 baseline


if __name__ == "__main__":
    main()
```

面试时可以强调：入口文件只做流程编排，不关心具体接口细节。具体接口封装在 `apis/`，测试用例生成在 `test_cases.py`，执行和校验在 `test_runner.py` 和 `response_validator.py`。

### 10.2 第一步：初始化测试批次

程序启动后会先生成一个批次 ID：

```python
def generate_batch_id() -> str:
    now = datetime.now()
    return now.strftime("%Y%m%d_%H%M%S")
```

例如：

```text
20260107_110758
```

这个批次 ID 的作用是标记本轮测试。后续接口返回结果会按这个批次保存到：

```text
test_results_history/batches/20260107_110758/
```

这样每次测试都有独立记录，后面做 baseline 比对时也能知道当前结果来自哪一次运行。

### 10.3 第二步：创建 HTTP 客户端并登录

入口脚本读取 `config.py` 中的环境配置：

```python
from config import BASE_URL, LOGIN_USERNAME, LOGIN_PASSWORD, PROJECTS
```

然后创建 HTTP 客户端：

```python
client = HttpClient(BASE_URL)
token = client.login(LOGIN_USERNAME, LOGIN_PASSWORD)
```

`HttpClient` 会向 `/user/login` 发请求，登录成功后把 token 保存在 `client.token` 中。后续所有接口请求都会复用这个 token。

这一层对应的是 `http_client.py`，主要负责底层 HTTP 通信和认证状态管理。

### 10.4 第三步：自动发现接口并生成测试用例

登录成功后，入口脚本会调用：

```python
test_cases = get_test_cases(PROJECTS)
```

`get_test_cases` 位于 `test_def/test_cases.py`，它内部会做几件事：

```text
1. 扫描 apis/ 目录下的 Python 文件
2. 动态导入 hydrologic.py、one_dimensional.py、two_dimensional.py、project_manage.py
3. 使用 inspect 找出每个模块里的函数
4. 判断函数第一个参数是否为 client
5. 根据函数所在模块选择项目 ID
6. 从 test_config.py 读取测试参数
7. 如果配置了 scenarios，就展开成多个测试 case
8. 如果函数在 SKIP_APIS 中，就跳过
9. 如果函数在 DIRTY_DATA_APIS 中，就使用 dirty_data 项目 ID
```

这一步结束后，程序得到的是一组结构化测试用例：

```python
test_case = {
    "name": "获取一维堰信息",
    "steps": [
        {
            "name": "get_weir_info",
            "func": get_weir_info,
            "args": {
                "project_id": "a43427b6-baa2-4933-a8f2-c0d020f0b414"
            }
        }
    ]
}
```

这里的关键点是：测试用例不是人工手写出来的，而是由接口函数和配置自动生成。

### 10.5 第四步：逐个执行测试用例

测试用例生成后，入口脚本会调用：

```python
case_results = run_all_tests(test_cases, client, batch_id=batch_id)
```

`run_all_tests` 位于 `test_def/test_runner.py`。它会遍历所有测试用例，并执行每个 case 下的 step。

核心调用逻辑可以简化理解为：

```python
def execute_step(step, client):
    func = step["func"]
    args = step["args"]

    try:
        result = func(client, **args)
        step_result["success"] = True
    except Exception as e:
        step_result["success"] = False
        step_result["error"] = {
            "type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc(),
        }

    return step_result
```

这里最关键的语法是：

```python
result = func(client, **args)
```

它表示动态调用接口函数。比如当前 step 是 `get_weir_info`，那么它等价于：

```python
get_weir_info(client, project_id="...")
```

如果当前 step 是 `query_two_dim_result`，它又可能等价于：

```python
query_two_dim_result(client, project_id="...", type="1", grid_no=10)
```

所以测试执行器不需要知道每个接口具体有哪些参数，它只要拿到 `func` 和 `args`，就能统一执行。

### 10.6 第五步：接口函数组装 path 和 body

当 `test_runner.py` 调用具体接口函数时，会进入 `apis/*.py`。

例如一维堰信息查询：

```python
# apis/one_dimensional.py

def get_weir_info(client: HttpClient, project_id: str):
    path = "/business/project/getWeirInfo"
    body = {"projectId": project_id}
    return post_json(client, path, body)
```

业务接口函数只负责两件事：

```text
1. 定义接口路径 path
2. 组装请求 body
```

真正发送请求的逻辑交给 `base_api.py` 的 `post_json`。

### 10.7 第六步：统一发送请求并处理业务响应

`post_json` 会调用 `client.post` 真正发送 HTTP 请求。

```python
# base_api.py

def post_json(client: HttpClient, path: str, body: Dict[str, Any], headers=None) -> Any:
    client._last_request_path = path

    resp = client.post(path, json=body, headers=headers)
    resp_json = resp.get("json_data")

    code = resp_json.get("code")
    if code != 200:
        raise Exception(f"接口调用失败 [path={path}, code={code}]: {resp_json}")

    client._last_response_info = {
        "code": code,
        "data": resp_json.get("data"),
    }

    return resp_json.get("data")
```

这里做了统一处理：

- 记录当前请求 path，方便报告展示。
- 发送 POST JSON 请求。
- 判断业务响应 `code` 是否为 200。
- 如果失败，抛出异常，交给测试执行器记录。
- 如果成功，只返回业务 `data`。

这一步体现了通用 API 调用层的价值：每个业务接口不用重复写响应 code 判断。

### 10.8 第七步：响应结构校验和历史基线比对

接口返回 `data` 后，`test_runner.py` 会继续调用 `ResponseValidator`。

第一类校验是 schema 校验：

```text
当前接口是否配置了 schema
    -> 如果配置了，就检查响应类型、必填字段、嵌套字段、列表元素结构
    -> 如果字段缺失或类型不对，就把当前 step 标记为失败
```

第二类校验是 baseline 比对：

```text
当前接口是否启用历史比对
    -> 保存当前响应到 test_results_history/batches/{batch_id}/
    -> 读取 baseline.json 中记录的 baseline 批次
    -> 找到 baseline 批次下同一个接口的历史响应
    -> 递归比较当前响应和历史响应
    -> 忽略配置中的动态字段，例如 pid、时间戳
    -> 如果发现差异，就记录 differences
```

这一步让工具不只是在“调接口”，而是在判断：

```text
接口结构有没有变？
接口返回结果和历史稳定版本相比有没有异常变化？
```

### 10.9 第八步：生成 HTML 测试报告

所有 case 执行完后，入口脚本调用：

```python
generate_html_report(case_results, "python-api-test-report.html")
```

报告里会展示：

- 总用例数。
- 通过数。
- 失败数。
- 通过率。
- 每个 case 的执行流程。
- 每个 step 的 request。
- 每个 step 的 response。
- 异常信息。
- schema 校验结果。
- baseline 对比结果。

报告的价值是把测试结果从控制台日志变成可视化页面。失败后可以直接定位到哪个接口、哪个请求参数、哪个响应字段、哪一处历史差异。

### 10.10 第九步：用户决定是否更新 baseline

报告生成之后，程序会读取当前 baseline 信息：

```python
validator = ResponseValidator()
baseline_batch_id = validator.get_baseline_batch_id()
```

然后询问用户是否把本次测试批次设置为新的 baseline。

```text
是否将本次批次设置为新的 baseline? (y/n)
```

如果用户输入 `y`，工具会把当前批次写入：

```text
test_results_history/baseline.json
```

后续测试就会以这次结果作为新的历史基线。

这个设计保证 baseline 不是每次自动覆盖，而是由测试人员确认当前结果可信后再更新，避免错误结果污染基线。

### 10.11 用一句话总结完整流程

完整流程可以这样讲：

> 用户在项目根目录执行 `python runner\run_tests.py` 后，入口脚本会创建本次测试批次，初始化 HTTP 客户端并登录获取 token；随后 `test_cases.py` 自动扫描 `apis/` 下的接口函数，根据 `test_config.py` 中的参数配置和场景配置生成测试用例；`test_runner.py` 逐个执行这些用例，调用具体 API 函数组装 path 和 body，再通过 `base_api.py` 和 `http_client.py` 统一发送请求；接口返回后，`response_validator.py` 会做响应结构校验和历史 baseline 比对；最后 `report_generator.py` 生成 HTML 报告，并由用户决定是否将本次批次设置为新的 baseline。

## 11. 项目收益与简历表达

这个工具最终解决的是接口回归效率问题。它把原本需要人工逐个接口调用、修改参数、观察响应、对比历史结果的流程，改造成一键批量执行。

可以从几个维度总结收益：

- 覆盖范围：覆盖一维、二维、水文、项目管理、数据同化等 80+ 核心接口。
- 新增接口成本降低：新增接口只需要补充 `apis/` 函数和 `test_config.py` 参数配置。
- 回归执行成本降低：从人工逐个验证变成一键批量运行。
- 问题定位成本降低：HTML 报告直接展示请求、响应、异常、schema 校验和历史差异。
- 回归质量提升：不仅判断接口是否成功，还能发现结构变化和结果变化。
- 综合来看，接口回归人力成本降低约 70%。

## 12. 面试总结话术

可以这样收尾：

> 这个项目我不是简单写了一批接口请求脚本，而是把接口回归测试抽象成一个可扩展的小型测试框架。核心设计包括分层封装、配置驱动、自动发现、场景化测试、响应结构校验和历史基线比对。通过 Python 的反射能力，工具可以自动扫描 `apis/` 下的接口函数并生成测试用例；通过配置化参数和场景配置，一个接口可以覆盖多组业务输入；通过 schema 校验和 baseline 对比，可以发现字段结构变化和历史结果差异。最终这个工具覆盖了 80+ 核心接口，把接口回归从人工逐个验证变成一键执行，显著降低了回归测试的人力成本。
