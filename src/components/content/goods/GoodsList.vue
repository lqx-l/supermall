<template>
  <div class="goods">
    <goods-list-item v-for="(item, index) in goods" :key="index" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
  name: 'GoodsList',
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .goods {
    display: flex;
    /* 设置为包裹，这样就可以根据宽度决定一行显示多少个item */
    flex-wrap: wrap;   
    /* 使一行的内容均等分 */
    justify-content: space-around;
  }
</style>