import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from '@/components/common/toast'


Vue.config.productionTip = false

//将$bus中赋值一个vue实例，vue实例可以作为一个事件总线
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

//解决移动端300 毫秒的延迟
FastClick.attach(document.body)

//使用vue的懒加载图片
Vue.use(VueLazyLoad, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

