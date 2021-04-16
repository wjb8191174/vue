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
updateComponent()+new Watcher() => render() => _update()

## 数据响应式