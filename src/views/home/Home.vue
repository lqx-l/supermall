<template>
  <div id="home">
    <nav-bar  class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                    ref="tabControl1"
                    @tabClick="tabClick" 
                    class="tab-control" 
                    v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @click="contentCsroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swipperImageLoad="swipperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" 
                    ref="tabControl2"
                    @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  //公共组件
  import NavBar from '@/components/common/navbar/NavBar'
  import TabControl from '@/components/content/tabControl/TabControl'
  import GoodsList from '@/components/content/goods/GoodsList'
  import Scroll from '@/components/common/scroll/Scroll'

  //功能组件
  import {getHomeMultidata, getHomeGoods } from "@/network/home"
  import {itemListenerMixin, backTopMixin} from '@/common/mixin'
  
  export default {
    name: 'Home',
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar, 
      TabControl,
      GoodsList,
      Scroll
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell') 
    },
    destroyed() {
      console.log('销毁')
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
      // console.log('11')
    },
    deactivated() {
      //1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      //2.取消全局事件监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    mounted() {
      
    },
    methods: {
      // 事件监听相关方法 
      tabClick(index) {
        // console.log(index)
        switch(index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentCsroll(position) {
        //1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 500
        //2.决定TabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //监听上拉加载事件的方法
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swipperImageLoad() {
        //2.获取tabControl的offsetTop
        //所有的组件都有一个属性$el：用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      // 网络请求相关方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //this.$refs.scroll.scroll.finishPullUp()   再一次上拉加载更多
          this.$refs.scroll.finishPullUp()

        })
      },
      
    }
  }
</script>

<style scoped>
  #home {
    position: relative;
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    font-size: 22px;
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9; */
  }
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
    overflow: hidden;
  }
  /* .content {
    height:calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>