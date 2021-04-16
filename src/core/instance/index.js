import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// new Vue调用的构造函数 add by wjb
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 实例方法的初始化
initMixin(Vue) // 混入_init()方法 add by wjb
stateMixin(Vue) // $set/$delete/$watch add by wjb
eventsMixin(Vue) // $emit/$on/$once add by wjb
lifecycleMixin(Vue) // $_update/$forceUpdate
renderMixin(Vue) // $nextTick

export default Vue
