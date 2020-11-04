## 在es5环境实现let
```javascript
(function() {
  for(var i = 0; i < 5; i++) {
    console.log(i)
  }
})()
console.log(i); // Uncaught ReferenceError: i is not defined
```
```javascript
// 非块级作用域的情况
for(var i = 0; i < 5; i++) {
  console.log(i)
}
console.log(i); 
```
## 在es5中实现const
实现const的关键在于Object.defineProperty()这个API
```javascript
function __const(key, value) {
 const desc = {
   value,
   writable: false
 } 
 Object.defineProperty(window, key, desc)
}

__const('obj', {a: 1}); // 定义obj
obj.b = 2; // 可以正常给obj的属性赋值
obj = {}; // 抛出错误，提示对象read-only
```
## 手写call
原理：
函数的this指向它的直接调用者，变更调用者即可完成this指向的变更
```javascript
// 变更函数调用者示例
function foo() {
  console.log(this.name)
}
// 测试
const obj = {
  name: 'js是世界上最好的语言'
}
obj.foo = foo; // 变更函数的调用者
obj.foo();
```

```javascript
Function.prototype.myCall = function(thisArg, ...args) {
  thisArg.fn = this;
  return thisArg.fn(...args)
}
```
优化细节
```javascript
Function.prototype.myCall = function(thisArg, ...args) {
  if(typeof this !== 'function') {
    throw new TypeError('error')
  }
  const fn = Symbol('fn');  // 声明一个独有的Symbol属性，防止fn覆盖已有属性
  thisArg = thisArg || window; // 若没有传入this,默认绑定window对象
  thisArg[fn] = this; // this指向调用call的对象，即我们要改变this指向的函数
  const result = thisArg[fn])(...args); // 执行当前函数
  delete thisArg[fn]; // 删除我们声明的fn属性
  return result // 返回函数执行结果
}
```

## 手写apply
```javascript
Function.prototype.myApply = function(thisArg, args) {
  if(typeof this !== 'function') {
    throw new TypeError('error')
  }
  const fn = Symbol('fn');  // 声明一个独有的Symbol属性，防止fn覆盖已有属性
  thisArg = thisArg || window; // 若没有传入this,默认绑定window对象
  thisArg[fn] = this; // this指向调用call的对象，即我们要改变this指向的函数
  const result = thisArg[fn])(...args); // 执行当前函数
  delete thisArg[fn]; // 删除我们声明的fn属性
  return result // 返回函数执行结果
}
```

## 手写bind
```javascript
Function.prototype.myBind = function(thisArg, ...args) {
  if(typeof this !== 'function') {
    throw new TypeError('Bind must be calledon a functioin')
  }
  var self = this;
  // new优先级[参照注释1]
  var fbound = function() {
    self.apply(this instanceof self ? this : thisArg, args.concat(Array.prototype.slice.call(arguments)))
  }
  // 继承原型上的属性和方法
  fbound.prototype = Object.create(self.prototype);
  return fbound;
}
// 测试
const obj = {name: 'js是世界上最好的语言'};
function foo() {
  console.log(this.name);
  console.log(arguments);
}
foo.myBind(obj,'a', 'b', 'c')()
```
注释1
bind有以下一个特性
一个绑定函数也能使用new操作符创建对象：这种行为就行把原函数当成构造器，提供的this值将被忽略，同时调用时的参数为提供给模拟函数
```javascript
let value = 2;
let foo = {value: 1};
function bar(name, age) {
  this.habit = 'shopping';
  console.log(this.value);
  console.log(name);
  console.log(age)
}
bar.prototype.friend = '张三';
let bindFoo = bar.bind(foo, '李四');
let obj = new bindFoo(20);
// undefined 李四 20
```
上面例子中，运行结果 this.value 输出为 undefined ，这不是全局 value 也不是 foo 对象中的 value ，这说明 bind 的 this 对象失效了，new 的实现中生成一个新的对象，这个时候的 this 指向的是 obj 。

## 函数防抖
在事件被触发的n秒后再执行回调，如果在n秒内又被触发，则重新计时
```javascript
function debounce(fn, delay) {
  var timer;
  return function() {
    var __this = this;
    var args = arguments;
    if(timer) {
      clearTimeout(timer);
    }
    // console.log(this, 'this') // window
    timer = setTimeout(function() {
      fn.apply(__this, args)
    }, delay)
  }
}
// 测试用例
function testConsole() {
  console.log('xxxxxxxxxxx')
}
var debounceTest = debounce(testConsole, 1000);
document.onmousemove = function() {
  debounceTest();
}
```

## 函数节流
每隔一段时间，只执行一次函数

1. 定时器实现节流函数
```javascript
function throttle(fn, delay) {
  var timer;
  return function() {
    var __this = this;
    var args = arguments;
    if(timer) {
      return
    }
    timer = setTimeout(function() {
      fn.apply(__this, args);
      timer = null; // 在delay后执行完fn后清空timer，此时timer为假，throttle可以进入计时器
    }, delay)
  }
}
// 测试用例
function testConsole() {
  console.log('xxxxxxxxxxx')
}
var throttleTest = throttle(testConsole, 1000);
document.onmousemove = function() {
  throttleTest();
}
```

2. 时间戳实现节流函数

```javascript
function throttle(fn, delay) {
  var previous = 0;
  return function() {
    var __this = this;
    var args = arguments;
    var now = new Date();
    if(now - previous > delay) {
      fn.apply(__this, args);
      previous = now;
    }
  }
}
 // test
 function testThrottle(e, content) {
   console.log(e, content)
 }
 var testThrottleFn = throttle(testThrottle, 1000); // 节流函数
 document.onmousemove = function(e) {
   testThrottleFn(e, 'throttle')
 }
```

## 函数扁平化
1. es6的flat()
   flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
   语法
   var newArray = arr.flat([depth])
   ```javascript
  const arr = [1,[1,2],[1,2,3]];
  arr.flat(Infinity)
   ```
2. 递归
```javascript
const arr = [1,[2,3],[1,2,3]];
function flat(arr) {
  let result = [];
  for(var i = 0; i < arr.length; i++) {
    const item = arr[i];
    item instanceof Array ? result = result.concat(flat(item)) : result.push(item)
  }
  return result;
}
```

3. reduce()递归
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```javascript
const arr = [1,[2,3],[1,2,3]];
function flat(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(cur instanceof Array ? flat(cur) : cur)
  }, [])  
}
```
4. 迭代+展开运算符
```javascript
while(arr.some(Array.isArray)) {
  arr = [].concat(...arr)
}
```

## 手写一个promise

