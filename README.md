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
