import Toast from './Toast'
const obj = {}

obj.install = function(Vue) {
  // document.body.appendChild(Toast.$el)
  // Vue.prototype.$toast = Toast
   //1.创建组件构造器
  const taostContrustor = Vue.extend(Toast)
  //2.根据new的方式，根据组件构造器，可以创建出来一个组件对象
  const toast = new taostContrustor()
  //3.将组件对象，手动挂载在某一个元素上
  toast.$mount(document.createElement('div'))
  //4.$.toast对应的就是我们创建的div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast
}

export default obj