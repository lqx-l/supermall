import {debounce} from './utils'
import BackTop from '@/components/content/backTop/BackTop'
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    //1.监听item图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 10)
    //2.对监听的事件进行保存
    this.itemImgListener =  () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    //返回顶部
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0, 0)   实现返回顶部
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
}