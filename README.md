# Vue源码学习

## 初始化过程

src/platforms/web/entry-runtime-with-compiler.js
- 扩展$mount
- 解析el、template等选项

src/platforms/web/runtime/index.js
- 声明patch函数
- 声明$mount方法：执行挂载

src/core/index.js
- 初始化全局API

src/core/instance/index.js
- 实现Vue构造函数
- vue实例方法

src/core/instance/init.js
- 初始化过程：组件属性、事件等初始化、两个生命周期、数据响应式

***整体流程***

new Vue() => _init() => $mount() => mountComponent() => 
new Watcher() => updateComponent() => render() => _update()

创建实例 => 执行$init初始化方法 => 初始化各种数据,执行$mount挂载方法 => 执行mountComponent方法,此方法创建一个watcher和updateComponent方法, watcher和当前组件生成一个一对一的关系, 此watcher初始化或更新updateComponent方法 => 执行render方法获取虚拟DOM => 虚拟DOM作为参数传递给_update方法批量创建、追加

## 数据响应式

initState (vm: Component) src\core\instance\state.js
- 初始化数据，包括props、methods、data、computed和watch

***initData核心代码是将data数据响应化***

```javascript
function initData (vm: Component) { 
  // 执行数据响应化 
  observe(data, true /* asRootData */) 
}
```

core/observer/index.js
- observe方法返回一个Observer实例
- Observer对象根据数据类型执行对应的响应化操作
- defineReactive定义对象属性的getter/setter，getter负责添加依赖，setter负责通知更新

core/observer/dep.js
- Dep负责管理一组Watcher，包括watcher实例的增删及通知更新

Watcher
- Watcher解析一个表达式并收集依赖，当数值变化时触发回调函数，常用于$watch API和指令中。每个组件也会有对应的Watcher，数值变化会触发其update函数导致重新渲染

```javascript
export default class Watcher { 
  constructor () {} 
  get () {} 
  addDep (dep: Dep) {} 
  update () {} 
}
```

## vue批量异步更新策略

***vue中的具体实现***
- 异步：只要侦听到数据变化，Vue 将开启⼀个队列，并缓冲在同⼀事件循环中发⽣的所有数据变更。
- 批量：如果同⼀个 watcher 被多次触发，只会被推⼊到队列中⼀次。去重对于避免不必要的计算和 DOM 操作是⾮常重要的。然后，在下⼀个的事件循环“tick”中，Vue 刷新队列执⾏实际⼯作。
- 异步策略：Vue 在内部对异步队列尝试使⽤原⽣的 Promise.then 、 MutationObserver 或 setImmediate ，如果执⾏环境都不⽀持，则会采⽤ setTimeout 代替。

update() core\observer\watcher.js
- dep.notify()之后watcher执⾏更新，执⾏⼊队操作

queueWatcher(watcher) core\observer\scheduler.js
- 执行watcher入队操作

nextTick(flushSchedulerQueue) core\util\next-tick.js
- nextTick按照特定异步策略执⾏队列操作

## 虚拟DOM

***优点***
- 虚拟DOM轻量、快速：当它们发⽣变化时通过新旧虚拟DOM⽐对可以得到最⼩DOM操作量，配合异步更新策略减少刷新频率，从⽽提升性能
- 跨平台：将虚拟dom更新转换为不同运⾏时特殊操作实现跨平台
- 兼容性：还可以加⼊兼容性代码增强操作的兼容性

***必要性***

vue 1.0中有细粒度的数据变化侦测，它是不需要虚拟DOM的，但是细粒度造成了⼤量开销，这对于⼤型项⽬来说是不可接受的。因此，vue 2.0选择了中等粒度的解决⽅案，每⼀个组件⼀个watcher实例，这样状态变化时只能通知到组件，再通过引⼊虚拟DOM去进⾏⽐对和渲染。

***整体流程***

mountComponent() core/instance/lifecycle.js
- 渲染、更新组件

```javascript
// 定义更新函数
const updateComponent = () => {
  // 实际调⽤是在lifeCycleMixin中定义的_update和renderMixin中定义的_render
  vm._update(vm._render(), hydrating) 
}
```

\_render core/instance/render.js
- 生成虚拟dom

\_update core\instance\lifecycle.js
- update负责更新dom，转换vnode为dom

\_\_patch\_\_() platforms/web/runtime/index.js
- \_\_patch\_\_是在平台特有代码中指定的

```javascript
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

***patch获取***

patch是createPatchFunction的返回值，传递nodeOps和modules是web平台特别实现
