import Vue from 'vue'
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

//将$bus中赋值一个vue实例，vue实例可以作为一个事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

