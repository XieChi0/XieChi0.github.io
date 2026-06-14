---
title: Lodash 常用方法
published: 2024-07-14
updated: 2026-06-13
description: '介绍 Lodash 中常用的数组、对象、函数工具方法。'
image: ''
tags: [JavaScript, Lodash, 工具库]
category: '前端/JavaScript/其他'
draft: false
---

## Lodash 简介

Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库，提供了很多原生 JS 没有或需要手动封装的方法。

官网：[https://lodash.com/](https://lodash.com/)

```bash
npm install lodash
```

```javascript
import _ from 'lodash'
// 或者按需引入
import cloneDeep from 'lodash/cloneDeep'
```

---

## 对象操作

### cloneDeep - 深拷贝

最常用的方法，深拷贝复杂对象：

```javascript
const obj = {
  name: '张三',
  age: 25,
  address: { city: '北京', district: '朝阳区' },
  hobbies: ['篮球', '游泳'],
  greet() { return `你好，我是${this.name}` }
}

const clone = _.cloneDeep(obj)
clone.name = '李四'
clone.address.city = '上海'

console.log(obj.name)          // 张三，原对象不变
console.log(obj.address.city)   // 北京，原对象不变
console.log(clone.greet())     // 你好，我是李四
```

### merge / mergeWith - 合并对象

```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = { b: 3, c: 4 }

// merge：后面对象的属性会覆盖/合并到前面
_.merge(obj1, obj2)
console.log(obj1)  // { a: 1, b: 3, c: 4 }

// mergeWith：自定义合并逻辑
const obj3 = { items: [1, 2] }
const obj4 = { items: [3, 4] }

_.mergeWith(obj3, obj4, (a, b) => {
  if (Array.isArray(a)) {
    return a.concat(b)  // 数组合并而不是替换
  }
})
console.log(obj3.items)  // [1, 2, 3, 4]
```

### pick / omit - 选择/排除属性

```javascript
const user = {
  name: '张三',
  age: 25,
  password: 'secret123',
  email: 'zhang@example.com'
}

// pick：只选取需要的属性
_.pick(user, ['name', 'email'])
// { name: '张三', email: 'zhang@example.com' }

// omit：排除不需要的属性
_.omit(user, ['password'])
// { name: '张三', age: 25, email: 'zhang@example.com' }
```

### get - 安全获取嵌套属性

```javascript
const data = {
  user: {
    profile: {
      name: '张三'
    }
  },
  items: [{ id: 1 }, { id: 2 }]
}

// 原生写法容易报错
const name1 = data.user.profile.name
const name2 = data && data.user && data.user.profile && data.user.profile.name

// get 安全取值，不怕 undefined
_.get(data, 'user.profile.name')           // 张三
_.get(data, 'user.profile.age', 18)       // 18，默认值
_.get(data, 'items[0].id')                // 1
_.get(data, 'items[5].id', 'N/A')         // N/A，索引不存在
_.get(data, 'a.b.c', '默认值')            // 默认值
```

### set / unset - 设置/删除属性

```javascript
const obj = {}

// set：设置嵌套属性
_.set(obj, 'user.profile.name', '张三')
// { user: { profile: { name: '张三' } } }

_.set(obj, 'items[0].id', 1)
// { user: { profile: { name: '张三' } }, items: [{ id: 1 }] }

// unset：删除属性
_.unset(obj, 'user.profile.name')
// { user: { profile: {} }, items: [{ id: 1 }] }
```

### deburr - 把特殊字符转成普通字母

```javascript
_.deburr('déjà vu')
// 'deja vu'
```

---

## 数组操作

### chunk - 分组

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7]

// 分成每组 n 个
_.chunk(arr, 2)
// [[1, 2], [3, 4], [5, 6], [7]]

_.chunk(arr, 3)
// [[1, 2, 3], [4, 5, 6], [7]]

// 常用场景：分页
const page = 2
const pageSize = 10
const paginated = _.chunk(allItems, pageSize)[page - 1]
```

### flatten / flattenDeep - 扁平化

```javascript
const arr = [1, [2, [3, [4]], 5]]

// flatten：只扁平一层
_.flatten(arr)
// [1, 2, [3, [4]], 5]

// flattenDeep：完全扁平化
_.flattenDeep(arr)
// [1, 2, 3, 4, 5]
```

### uniq / uniqBy - 去重

```javascript
const arr = [1, 2, 2, 3, 3, 3, 'a', 'a']

// uniq：基本去重
_.uniq(arr)
// [1, 2, 3, 'a']

// uniqBy：按指定属性去重
const users = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 25 }
]

_.uniqBy(users, 'age')
// [{ name: '张三', age: 25 }, { name: '李四', age: 30 }]
```

### difference / differenceBy - 差集

```javascript
const arr1 = [1, 2, 3, 4, 5]
const arr2 = [2, 4, 6]

// difference：返回在 arr1 中但不在 arr2 中的元素
_.difference(arr1, arr2)
// [1, 3, 5]

// differenceBy：按条件比较
const users1 = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]
const users2 = [{ id: 2, name: '李四' }]

_.differenceBy(users1, users2, 'id')
// [{ id: 1, name: '张三' }]
```

### groupBy - 分组

```javascript
const products = [
  { name: '苹果', category: '水果', price: 5 },
  { name: '白菜', category: '蔬菜', price: 3 },
  { name: '香蕉', category: '水果', price: 6 },
  { name: '青菜', category: '蔬菜', price: 2 }
]

// 按 category 分组
_.groupBy(products, 'category')
// {
//   '水果': [{ name: '苹果', ... }, { name: '香蕉', ... }],
//   '蔬菜': [{ name: '白菜', ... }, { name: '青菜', ... }]
// }

// 按条件分组
_.groupBy(products, item => item.price > 4 ? 'expensive' : 'cheap')
```

### sortBy / orderBy - 排序

```javascript
const users = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 },
  { name: '王五', age: 20 }
]

// sortBy：升序
_.sortBy(users, 'age')
// [{ name: '王五', age: 20 }, { name: '张三', age: 25 }, { name: '李四', age: 30 }]

// orderBy：可以指定升序/降序
_.orderBy(users, ['age', 'name'], ['asc', 'desc'])
// 先按 age 升序，相同时按 name 降序
```

### countBy - 计数

```javascript
const arr = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']

// 按条件计数
_.countBy(arr)
// { apple: 3, banana: 2, orange: 1 }

const users = [
  { name: '张三', active: true },
  { name: '李四', active: false },
  { name: '王五', active: true }
]

_.countBy(users, 'active')
// { true: 2, false: 1 }
```

### keyBy - 用属性值作为 key

```javascript
const products = [
  { id: 'p1', name: '苹果' },
  { id: 'p2', name: '香蕉' }
]

// 用 id 作为 key
_.keyBy(products, 'id')
// {
//   'p1': { id: 'p1', name: '苹果' },
//   'p2': { id: 'p2', name: '香蕉' }
// }

// 查找时 O(1) 复杂度
const product = _.keyBy(products, 'id')['p1']
```

### intersection / union - 交集/并集

```javascript
const arr1 = [1, 2, 3, 4]
const arr2 = [3, 4, 5, 6]

// intersection：交集
_.intersection(arr1, arr2)
// [3, 4]

// union：并集（自动去重）
_.union(arr1, arr2)
// [1, 2, 3, 4, 5, 6]
```

### shuffle - 打乱顺序

```javascript
const arr = [1, 2, 3, 4, 5, 6]

// 返回打乱顺序后的新数组
_.shuffle(arr)
// [3, 1, 5, 2, 6, 4]（每次结果不同）
```

### sample / sampleSize - 随机取样

```javascript
const arr = [1, 2, 3, 4, 5, 6]

// sample：随机取 1 个
_.sample(arr)
// 3（每次结果不同）

// sampleSize：随机取 n 个
_.sampleSize(arr, 3)
// [2, 5, 1]（每次结果不同）
```

---

## 集合/遍历

### map / filter / find / findLast

```javascript
const users = [
  { name: '张三', age: 25, active: true },
  { name: '李四', age: 30, active: false },
  { name: '王五', age: 25, active: true }
]

_.map(users, 'name')           // ['张三', '李四', '王五']
_.map(users, 'age')             // [25, 30, 25]

_.filter(users, { active: true })
// [{ name: '张三', ... }, { name: '王五', ... }]

_.find(users, { age: 30 })
// { name: '李四', age: 30, active: false }

_.findLast(users, u => u.age === 25)
// { name: '王五', age: 25, active: true }，从后往前找
```

### sum / sumBy - 求和

```javascript
const products = [
  { name: '苹果', price: 5 },
  { name: '香蕉', price: 3 },
  { name: '橙子', price: 4 }
]

_.sum([1, 2, 3, 4, 5])           // 15

_.sumBy(products, 'price')        // 12
_.sumBy(products, item => item.price * 2)  // 24
```

### min / max / minBy / maxBy

```javascript
const nums = [3, 1, 4, 1, 5, 9, 2, 6]

_.min(nums)    // 1
_.max(nums)    // 9

const products = [
  { name: '苹果', price: 5 },
  { name: '香蕉', price: 3 },
  { name: '橙子', price: 4 }
]

_.minBy(products, 'price')   // { name: '香蕉', price: 3 }
_.maxBy(products, 'price')   // { name: '苹果', price: 5 }
```

---

## 函数相关

### debounce - 防抖

函数调用后，等待 N 毫秒再执行。如果期间再次调用，则重新计时。

```javascript
function search(keyword) {
  console.log('搜索:', keyword)
}

const debouncedSearch = _.debounce(search, 300)

// 用户输入时
input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value)
})
// 停止输入 300ms 后才会执行搜索
```

### throttle - 节流

函数执行后，必须等待 N 毫秒才能再次执行。

```javascript
function onScroll() {
  console.log('滚动中...')
}

const throttledScroll = _.throttle(onScroll, 200)

window.addEventListener('scroll', throttledScroll)
// 每 200ms 最多执行一次
```

### curry - 柯里化

把多参数函数转成逐个接收参数的形式：

```javascript
function add(a, b, c) {
  return a + b + c
}

const curriedAdd = _.curry(add)

curriedAdd(1)(2)(3)     // 6
curriedAdd(1, 2)(3)     // 6
curriedAdd(1)(2, 3)     // 6

// 实际应用
const getProp = _.curry((obj, path) => _.get(obj, path))
const getName = getProp('name')

getName({ name: '张三' })  // 张三
getName({ name: '李四' })  // 李四
```

### memoize - 记忆化

缓存函数结果，避免重复计算：

```javascript
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const memoizedFib = _.memoize(fibonacci)

memoizedFib(100)  // 很快，结果被缓存
memoizedFib(100)  // 直接从缓存返回
```

---

## 字符串

### capitalize / camelCase / kebabCase / snakeCase

```javascript
_.capitalize('hello world')    // 'Hello world'
_.camelCase('Foo Bar')        // 'fooBar'
_.kebabCase('FooBar')         // 'foo-bar'
_.snakeCase('fooBar')         // 'foo_bar'
_.startCase('foo-bar')        // 'Foo Bar'
_.lowerCase('FOO BAR')        // 'foo bar'
_.upperFirst('cat')           // 'Cat'
```

### trim / trimStart / trimEnd

```javascript
_.trim('  hello  ')           // 'hello'
_.trimStart('  hello  ')     // 'hello  '
_.trimEnd('  hello  ')       // '  hello'
```

### truncate - 截断字符串

```javascript
_.truncate('这是一个很长的字符串', { length: 10 })
// '这是一个很...'

_.truncate('这是一个很长的字符串', { length: 10, separator: ' ' })
// '这是一个...'

_.truncate('这是一个很长的字符串', { length: 10, omission: '...' })
// '这是一个...'
```

### template - 模板字符串

```javascript
const compiled = _.template('<%= greeting %> <%= name %>!')
compiled({ greeting: 'Hello', name: 'World' })
// 'Hello World!'

// 多行模板
const tmpl = _.template(`
  <% _.forEach(users, function(user) { %>
    <li><%= user.name %></li>
  <% }); %>
`)
tmpl({ users: [{ name: '张三' }, { name: '李四' }] })
```

---

## 类型判断

```javascript
_.isArray([1, 2, 3])        // true
_.isObject({})              // true
_.isString('hello')         // true
_.isNumber(123)             // true
_.isFunction(fn)            // true
_.isEmpty({})               // true
_.isEmpty({ a: 1 })         // false
_.isNil(null)               // true
_.isNil(undefined)          // true
_.isNull(null)              // true
_.isUndefined(undefined)    // true
_.isNaN(NaN)                // true
_.isBoolean(true)           // true
_.isDate(new Date())        // true
_.isElement(document.body)  // true
_.isLength(5)               // true
_.isInteger(5)              // true
```

---

## 其他常用

### times - 循环生成

```javascript
// 执行 n 次函数，返回结果数组
_.times(5, _.constant('a'))
// ['a', 'a', 'a', 'a', 'a']

_.times(3, n => n * n)
// [0, 1, 4]

_.times(5, () => Math.random())
// [0.123, 0.456, 0.789, ...]
```

### range - 生成数字序列

```javascript
_.range(5)           // [0, 1, 2, 3, 4]
_.range(1, 5)        // [1, 2, 3, 4]
_.range(0, 20, 5)    // [0, 5, 10, 15]
_.range(5, 0)        // [5, 4, 3, 2, 1]
```

### random - 生成随机数

```javascript
_.random(1, 10)      // 1 到 10 之间的随机整数
_.random(1, 10, true) // 1 到 10 之间的随机小数
```

### clone / cloneDeep - 拷贝

```javascript
// clone：浅拷贝
const shallow = _.clone(original)

// cloneDeep：深拷贝
const deep = _.cloneDeep(original)
```

### equals - 深比较

```javascript
const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { a: 1, b: { c: 2 } }
const obj3 = { a: 1, b: { c: 3 } }

_.isEqual(obj1, obj2)   // true
_.isEqual(obj1, obj3)   // false
```

### noop - 空函数

```javascript
// 创建一个空函数，常用于默认值
const fn = _.noop
fn()  // 什么也不做，返回 undefined
```

---

## 常用场景汇总

| 场景 | 方法 |
| ---- | ---- |
| 深拷贝复杂对象 | `cloneDeep` |
| 安全获取嵌套属性 | `get` |
| 合并对象 | `merge` |
| 选择/排除属性 | `pick` / `omit` |
| 数组分组 | `chunk` |
| 扁平化数组 | `flattenDeep` |
| 数组去重 | `uniq` / `uniqBy` |
| 对象数组去重 | `uniqBy` |
| 按属性分组 | `groupBy` |
| 数组排序 | `sortBy` / `orderBy` |
| 防抖 | `debounce` |
| 节流 | `throttle` |
| 柯里化 | `curry` |
| 字符串格式化 | `capitalize` / `camelCase` |
| 生成数字序列 | `range` |
| 深比较 | `isEqual` |
