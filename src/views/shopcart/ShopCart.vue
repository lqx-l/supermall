<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'

  import NavBar from '@/components/common/navbar/NavBar'

  import {mapGetters} from 'vuex'

  export default {
    name: 'ShopCart',
    components: {
      CartList,
      CartBottomBar,
      NavBar
    },
    computed: {
      //该语法是用于将vuex里面的getters里面的属性直接转换为组件里面computed的计算属性并且在这里使用
      //后面要跟上需要转换的属性
      ...mapGetters(['cartLength'])
      //第二种方法，前面的length需要渲染
      // ...mapGetters({
      //   length: 'cartLength'
      // })
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-size: 22px;
  }
</style>