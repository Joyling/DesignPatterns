## 单例模式

单例模式即一个类只能构造出唯一实例，单例模式的意义在于共享、唯一，Redux/Vuex中的store、JQ的$或者业务场景中的购物车、登录框都是单例模式的应用

类（class）通过 static 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。

```javascript
class SingletonLogin {
  constructor(name, password) {
    this.name = name;
    this.password = password
  }
  static getInstance(name, password) {
    if(!this.instance) this.instance = new SingletonLogin(name, password)
    return this.instance
  }
}

let obj1 = SingletonLogin.getInstance('CXK','123')
let obj2 = SingletonLogin.getInstance('CXK','321')

console.log(obj1 === obj2) // true
console.log(obj1); 
console.log(obj2)
```

## 工厂模式-一个类只能构造出唯一实例
工厂模式即对创建对象逻辑的封装，或者可以简单理解为对new的封装，这种封装就像创建对象的工厂，故名工厂模式。

React.createElement()、Vue.component()都是工厂模式的实现。工厂模式有多种：简单工厂模式、工厂方法模式、抽象工厂模式，这里只以简单工厂模式为例：
```javascript
class User {
  constructor(name, auth) {
    this.name = name;
    this.auth = auth;
  }
}
class UserFactory {
  static createUser(name, auth) {
    //工厂内部封装了创建对象的逻辑:权限为admin时,auth传1,而使用者在外部创建对象时,不需要知道admin对应哪个字段
    if(auth === 'admin')  new User(name, 1)
    if(auth === user)  new User(name, 2)
  }
}

const admin = UserFactory.createUser('admin');
const user = UserFactory.createUser('user');
```

## 观察者模式-当被观察者发生改变时，自动通知所有观察者
观察者模式算是前端最常用的设计模式了，观察者模式概念很简单：观察者监听被观察者的变化，被观察者发生改变时，通知所有的观察者。观察者模式被广泛用于监听事件的实现，有关观察者模式的详细应用

有些文章也把观察者模式称为发布订阅模式，其实二者是有所区别的，发布订阅相较于观察者模式多一个调度中心！！！！！。
```javascript
// 目标者类
class Subject {
  constructor() {
    this.observers = [];  // 观察者列表
  }
  // 添加
  add(observer) {
    this.observers.push(observer);
  }
  // 删除
  remove(observer) {
    let idx = this.observers.findIndex(item => item === observer);
    idx > -1 && this.observers.splice(idx, 1);
  }
  // 通知
  notify() {
    for (let observer of this.observers) {
      observer.update();
    }
  }
}

// 观察者类
class Observer {
  constructor(name) {
    this.name = name;
  }
  // 目标对象更新时触发的回调
  update() {
    console.log(`目标者通知我更新了，我是：${this.name}`);
  }
}

// 实例化目标者
let subject = new Subject();

// 实例化两个观察者
let obs1 = new Observer('前端开发者');
let obs2 = new Observer('后端开发者');

// 向目标者添加观察者
subject.add(obs1);
subject.add(obs2);

// 目标者通知更新
subject.notify();  
// 输出：
// 目标者通知我更新了，我是前端开发者
// 目标者通知我更新了，我是后端开发者

```

## 装饰器模式-对类的包装，动态扩展类的功能(AOP切面编程)
装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
装饰器模式，可以理解为对类的一个包装，动态地拓展类的功能，ES7的装饰器语法以及React中的高阶组件（HoC）都是这一模式的实现。react-redux的connect()也运用了装饰器模式，这里以ES7的装饰器为例：
```javascript
function info(target) {
  target.prototype.name = '张三'
  target.prototype.age = 10
}

@info
class Man {}

let man = new Man()
man.name // 张三
```

## 适配器模式--兼容新旧接口
适配器模式，将一个接口转换成客户希望的另一个接口，使接口不兼容的那些类可以一起工作。我们在生活中就常常有使用适配器的场景，例如出境旅游插头插座不匹配，这时我们就需要使用转换插头，也就是适配器来帮我们解决问题

```javascript
class Adaptee {
  test() {
      return '旧接口'
  }
}

class Target {
  constructor() {
      this.adaptee = new Adaptee()
  }
  test() {
      let info = this.adaptee.test()
      return `适配${info}`
  }
}

let target = new Target()
console.log(target.test())
```

## 代理模式-控制对象的访问
代理模式，为一个对象找一个替代对象，以便对原对象进行访问。即在访问者与目标对象之间加一层代理，通过代理做授权和控制。最常见的例子是经纪人代理明星业务，假设你作为一个投资者，想联系明星打广告，那么你就需要先经过代理经纪人，经纪人对你的资质进行考察，并通知你明星排期，替明星本人过滤不必要的信息。事件代理、JQuery的$.proxy、ES6的proxy都是这一模式的实现，下面以ES6的proxy为例：
```javascript
const idol = {
  name: '蔡x抻',
  phone: 10086,
  price: 1000000  //报价
}

const agent = new Proxy(idol, {
  get: function(target) {
    //拦截明星电话的请求,只提供经纪人电话
    return '经纪人电话:10010'
  },
  set: function(target, key, value) {
    if(key === 'price' ) {
      //经纪人过滤资质
      if(value < target.price) throw new Error('报价过低')
      target.price = value
    }
  }
})


agent.phone        //经纪人电话:10010
agent.price = 100  //Uncaught Error: 报价过低
```