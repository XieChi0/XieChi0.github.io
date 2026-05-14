---
title: SQL 数据库入门指南：从零理解数据库与查询
published: 2026-05-07
updated: 2026-05-11
description: 'Read more about Markdown features in Fuwari'
image: ''
tags: [SQL, 数据库, 教程]
category: '基本功/数据库'
draft: false
---

## 基本概念

### 数据库

数据库（Database）是按照一定数据结构组织、存储和管理数据的仓库。它能够高效地支持数据的查询、统计、**关联分析等操作**，适用于存储和管理大量结构化数据。

### SQL 与数据库的关系

- **数据库**：存放数据的"仓库"（如 MySQL、PostgreSQL、SQLite）
- **SQL**：Structured Query Language，结构化查询语言，是操作关系型数据库的标准编程语言（操作仓库的"语言"）

通过 SQL 可以实现对数据库的各类操作，包括查询数据、插入数据、修改数据、删除数据。

### DBMS

DBMS = Database Management System，数据库管理系统，是位于用户与数据库之间的系统软件，提供数据存储、检索、更新等功能，并管理数据库的运行和维护。
> 很多人习惯说"用 MySQL 存数据"，但严格来说，**MySQL 不是数据库，而是数据库管理系统（DBMS）**。
> - MySQL 是用来管理数据库的**软件系统**
> - MySQL 创建的"仓库"才是数据库
> 类似的还有 PostgreSQL、SQLite，它们都是 DBMS 软件，而不是数据库本身。




### 关系型数据库与非关系型数据库

根据数据模型的不同，数据库可以分为以下两大类型：

#### 关系型数据库（RDBMS）

（RDBMS）Relational Database Management System，使用表（Table）来存储数据，数据以行和列的形式组织。

特点：

- 数据存储在二维表中，每行是一条记录，每列是一个字段
- 表与表之间通过主键和外键建立关联关系
- 支持 SQL 语言进行查询和操作
- 事务支持完善（ACID），数据一致性有保障

常见产品：


| 产品         | 特点          | 适用场景          |
| ---------- | ----------- | ------------- |
| MySQL      | 开源免费，社区活跃   | Web 应用、中小型项目  |
| PostgreSQL | 功能丰富，支持高级特性 | 复杂业务、数据分析     |
| SQLite     | 轻量级，无需独立服务器 | 移动应用、嵌入式、小型项目 |


适用场景：结构化数据、需要表关联查询、业务逻辑复杂（如电商系统、ERP、财务系统）

#### 非关系型数据库

（NoSQL）Not Only SQL，是对关系型数据库的补充，数据存储方式更加灵活，不局限于表格结构。

常见类型与代表产品：


| 类型   | 代表产品            | 数据存储形式       | 适用场景          |
| ---- | --------------- | ------------ | ------------- |
| 文档型  | MongoDB         | JSON/BSON 文档 | 内容管理、日志系统     |
| 键值型  | Redis           | 键值对          | 缓存、Session 存储 |
| 列族型  | Cassandra、HBase | 列族           | 大数据分析、日志收集    |
| 图数据库 | Neo4j           | 节点与边         | 社交网络、推荐系统     |


选择建议：

- 如果业务涉及复杂的表关联查询、事务一致性要求高 → 选择**关系型数据库**
- 如果追求高性能、高并发、数据结构灵活 → 选择**非关系型数据库**
- 实际项目中，两者经常结合使用（混合架构）

---

## 数据库的层级结构

```
电脑/服务器
└── 数据库（也叫 Schema）
    └── 表（Table）
        └── 字段（Column/Field）
            └── 数据行（Row/Record）
```

---

## 表与字段：数据库的基本单元

### 什么是表？

表就像 Excel 的一张工作表：

- **行（Row）**：每一条记录
- **列（Column）**：每一种属性

### 什么是字段？

字段就是列的名字，以及决定了这一列存放什么类型的数据：

- 整数（INT）
- 字符串（VARCHAR）
- 日期（DATE）

### 主键：唯一标识每一行

每张表最好有一个**主键（Primary Key）**，它的作用是：

- 唯一识别每一行数据
- 不能为空，不能重复

### 外键：表与表之间的关联

外键（Foreign Key）是一个表中的列，引用另一个表的主键或唯一键，用于在两个表之间建立关联，维护数据的引用完整性。

示意图：

```
部门表（被引用的表，又称父表）
├── id（主键）
└── name

员工表（引用别人的表，又称子表）
├── id（主键）
├── name
└── department_id（外键）→ 引用 部门表.id
```

作用：

- **建立关联**：通过外键将两个表连接起来
- **引用完整性**：确保子表中的外键值在父表中存在，避免出现"孤儿数据"

例如：员工表里的 `department_id`，指向部门表的 `id`，这样就能把员工和部门关联起来。

---

## 表的设计原则：三大范式

设计数据库表时，要遵循一些规则，让数据不冗余、不混乱。

### 第一范式（1NF）：字段不可再分

**错误示范**：把地址写成一列 "广东省广州市天河区"

**正确做法**：拆分成省、市、区三列

### 第二范式（2NF）：消除部分依赖

适用场景：**多对多关系**

概念：当主键是复合主键的时候（比如选课表，student_id + course_id 联合作为主键），这个字段不该放在选课表里。

含义：如果主键由多个字段组成，那么其他字段必须跟所有主键字段都有关，不能只跟其中一部分有关。

比如"学生选课"：

- 一个学生可以选多门课
- 一门课可以被多个学生选

示意图：

```
学生表（父表）
├── id（主键）
└── name

课程表（父表）
├── id（主键）
└── name

选课表（关联表）
├── id（主键）
├── student_id（外键）→ 引用 学生表.id
└── course_id（外键）→ 引用 课程表.id
```

### 第三范式（3NF）：消除传递依赖

**概念**：非主键字段只能直接依赖主键，与主键没有直接关系的字段，应该移出去单独建表

含义：department_phone 不是直接依赖员工表的主键，而是通过 department_id 间接关联

示意图：

```
❌ 错误做法：员工表中包含部门信息
员工表
├── id（主键）
├── name
├── department_name  ← 部门名称
└── department_phone ← 部门电话（与员工主键无直接关系）

✅ 正确做法：拆出独立的部门表
员工表
├── id（主键）
├── name
└── department_id（外键）→ 引用 部门表.id

部门表
├── id（主键）
├── name
└── phone
```

白话理解：比如"员工表"里有"部门名称"和"部门电话"，部门电话和员工没有直接关系，应该拆出"部门表"

---

## 表与表的关系

### 一对多关系

- **例子**：一个部门 → 多个员工
- **设计**：两张表，在"多"的表（员工表）加一个外键指向部门

### 多对多关系

- **例子**：员工 ↔ 项目（一个员工可以参与多个项目，一个项目有多个员工）
- **设计**：三张表，第三张表（员工项目表）放两个外键

---

## SQL 语法入门

### SQL 的基本语句类型


| 类型  | 作用   | 常见语句                 |
| --- | ---- | -------------------- |
| DDL | 定义结构 | CREATE、DROP、ALTER    |
| DML | 操作数据 | INSERT、UPDATE、DELETE |
| DQL | 查询数据 | SELECT               |


---

### 创建数据库和表

```sql
-- 创建数据库
CREATE DATABASE school;

-- 使用（进入）这个数据库
USE school;

-- 创建学生表
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    class VARCHAR(20),
    score INT
);
```

**常见约束说明**：

- `PRIMARY KEY`：主键，唯一且非空
- `NOT NULL`：该字段不能为空
- `AUTO_INCREMENT`：自动递增（就像编号器）

**常见数据类型**：

- `INT`：整数
- `VARCHAR(n)`：可变长度字符串，n是最大长度
- `DATE`：日期

---

### 插入数据

```sql
INSERT INTO students (name, class, score)
VALUES ('张三', '一年二班', 85);
```

注意：

- 字符串和日期要用引号括起来
- 自增的ID列可以用 DEFAULT

---

### 修改数据

```sql
UPDATE students
SET score = 90
WHERE name = '张三';
```

⚠️ **重要**：UPDATE 和 DELETE 一定要加 WHERE 条件，否则会修改/删除全部数据！

---

### 删除数据

```sql
DELETE FROM students
WHERE name = '张三';
```

---

## 查询数据：SELECT 语句

### 最简单的查询

```sql
-- 查询所有数据
SELECT * FROM students;

-- 查询指定列
SELECT name, score FROM students;
```

---

### 条件筛选：WHERE

```sql
-- 筛选条件
SELECT * FROM students WHERE class = '一年二班';

-- 不等于
SELECT * FROM students WHERE class != '一年二班';

-- 数字比较
SELECT * FROM students WHERE score > 80;

-- 范围查询
SELECT * FROM students WHERE score BETWEEN 80 AND 90;
```

---

### 模糊查询：LIKE

```sql
-- 查询所有姓张的（%代表任意字符）
SELECT * FROM students WHERE name LIKE '张%';

-- 查询名字是两个字的（_代表一个字符）
SELECT * FROM students WHERE name LIKE '张_';
```

---

### 逻辑组合：AND、OR、IN

```sql
-- AND：同时满足多个条件
SELECT * FROM students WHERE score > 80 AND class = '一年二班';

-- OR：满足任一条件
SELECT * FROM students WHERE class = '一年二班' OR class = '一年三班';

-- IN：简化多个 OR
SELECT * FROM students WHERE class IN ('一年二班', '一年三班');
```

---

### 排序：ORDER BY

```sql
-- 升序（默认，从小到大）
SELECT * FROM students ORDER BY score;

-- 降序（从大到小）
SELECT * FROM students ORDER BY score DESC;

-- 多字段排序：先按班级，再按成绩
SELECT * FROM students ORDER BY class, score DESC;
```

---

### 分页：LIMIT 和 OFFSET

```sql
-- 只查询前5条
SELECT * FROM students LIMIT 5;

-- 跳过前5条，查询接下来的5条
SELECT * FROM students LIMIT 5 OFFSET 5;
```

---

## 汇总与分组

### 常用汇总函数


| 函数      | 作用   |
| ------- | ---- |
| COUNT() | 计算数量 |
| SUM()   | 求和   |
| AVG()   | 平均值  |
| MAX()   | 最大值  |
| MIN()   | 最小值  |


```sql
-- 给汇总结果起个别名，更清晰
SELECT AVG(score) AS '平均分' FROM students;
```

---

### 四舍五入：ROUND

```sql
-- 保留一位小数
SELECT ROUND(AVG(score), 1) AS '平均分' FROM students;
```

---

### 分组：GROUP BY

```sql
-- 计算每个班的平均分
SELECT class, AVG(score) AS '平均分'
FROM students
GROUP BY class;
```

---

### 分组后筛选：HAVING

WHERE 是在分组前筛选，HAVING 是在分组后筛选：

```sql
-- 列出平均分 >= 80 的班级
SELECT class, AVG(score) AS '平均分'
FROM students
GROUP BY class
HAVING AVG(score) >= 80;
```

---

### 去重：DISTINCT

```sql
-- 查询有哪些班级（去除重复）
SELECT DISTINCT class FROM students;
```

---

## 多表查询：JOIN 连接

### 为什么需要 JOIN？

实际数据分散在多个表中：

- 学生信息在 students 表
- 社团信息在 clubs 表
- 选课信息在 student_courses 表

JOIN 就是把这些表"连接"起来查询。

---

### 内连接：INNER JOIN

只保留两边都匹配成功的记录：

```sql
SELECT students.name, clubs.name AS '社团名'
FROM students
INNER JOIN clubs ON students.club_id = clubs.id;
```

---

### 左连接：LEFT JOIN

以左表为主，保留左表全部记录，右表没有匹配的显示 NULL：

```sql
SELECT students.name, clubs.name AS '社团名'
FROM students
LEFT JOIN clubs ON students.club_id = clubs.id;
```

---

### 右连接：RIGHT JOIN

以右表为主，保留右表全部记录。

---

### 结果合并：UNION

```sql
-- UNION：去重合并
SELECT name FROM students
UNION
SELECT name FROM teachers;

-- UNION ALL：不去重合并
SELECT name FROM students
UNION ALL
SELECT name FROM teachers;
```

---

### 表别名

给表起短别名，简化查询：

```sql
SELECT s.name, c.name
FROM students s
INNER JOIN clubs c ON s.club_id = c.id;
```

---

## SQL 关键字执行顺序

理解这个顺序很重要：

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

所以：

- WHERE 在 GROUP BY 之前执行
- HAVING 在 GROUP BY 之后执行
- ORDER BY 在 LIMIT 之前执行

### 实战演练

**例1：统计每个部门的平均工资，只看平均工资大于5000的，按工资降序排列**

```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
WHERE status = 'active'
GROUP BY department_id
HAVING AVG(salary) > 5000
ORDER BY avg_salary DESC
LIMIT 10;
```

解析：

- `FROM employees`：从员工表查
- `WHERE status = 'active'`：先过滤，只看在职员工
- `GROUP BY department_id`：按部门分组
- `HAVING AVG(salary) > 5000`：分组后再筛选平均工资
- `SELECT department_id, AVG(salary)`：选择部门ID和计算平均工资
- `ORDER BY avg_salary DESC`：按平均工资降序
- `LIMIT 10`：只取前10条

---

**例2：查找订单金额超过1000的客户，显示客户名和订单总额**

```sql
SELECT c.name, SUM(o.amount) AS total_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.id, c.name
HAVING SUM(o.amount) > 1000
ORDER BY total_amount DESC;
```

解析：

- `FROM customers c JOIN orders o`：从客户表关联订单表
- `ON c.id = o.customer_id`：关联条件是客户ID匹配
- `WHERE o.order_date >= '2024-01-01'`：过滤2024年后的订单
- `GROUP BY c.id, c.name`：按客户分组
- `HAVING SUM(o.amount) > 1000`：分组后筛选订单总额大于1000的
- `SELECT`：选出客户名和订单总额

---

**例3：子查询，找出工资高于平均工资的员工**

```sql
SELECT name, salary, department_id
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
)
ORDER BY salary DESC;
```

解析：

- 括号里的子查询先执行，计算出全体员工的平均工资
- 外层查询用 WHERE salary > 平均工资 来筛选

---

---

## 常用工具

- **MySQL Workbench**：MySQL 官方图形界面
- **phpMyAdmin**：网页版数据库管理
- **VSCode**：配合插件也可以写 SQL

---

