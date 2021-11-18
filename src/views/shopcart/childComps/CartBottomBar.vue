<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" 
      class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from '@/components/content/checkButton/CheckButton'

  import {mapGetters} from 'vuex'
  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        // return !this.cartList.filter(item => !item.checked).length
        if(this.cartList.length === 0) return false
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {  //全部选中
          this.cartList.forEach(item => item.checked = false)
        } else {  //部分或全部不选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买商品',1000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: fixed;
    bottom: 49px;
    display: flex;
    width: 100%;
    height: 30px;
    background-color: #eee;
    z-index: 9;
  }
  .check-content {
    width: 60px;
    margin: 6px 0 0 3px;
    display: flex;
  }
  .check-content span {
    margin-left: 8px;
  }
  .check-button {
    width: 20px;
    height: 20px;
  }
  .price {
    line-height: 30px;
    margin-left: 18px;
    flex: 1;
  }
  .calculate {
    line-height: 30px;
    width: 110px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>