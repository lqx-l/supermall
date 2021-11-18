<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @click="contentCsroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
  
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DeatilCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from '@/components/common/scroll/Scroll'
  import GoodsList from '@/components/content/goods/GoodsList'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from '@/network/detail'
  import {itemListenerMixin, backTopMixin} from '@/common/mixin'
  import {debounce} from '@/common/utils'
  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: {},
        goods: {},
        shop: {},
        detailInfo:{},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求详细的数据
      getDetail(this.iid).then(res => {
        //获取数据
        const data = res.result
        // console.log(res)
        //1.获取顶部轮播图图片数据
        this.topImages = data.itemInfo.topImages
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //3.创建店铺信息
        this.shop = new Shop(data.shopInfo)
        //4.保存商品的详细信息数据
        this.detailInfo = data.detailInfo
        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        //6.取出评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        //7.该函数是等到标签渲染完之后进行回调一次的
        // this.$nextTick(() => {
        //   //根据最新的数据，对应的DOM已经渲染出来了，但是图片依旧没有加载完成，所以值不对
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(-(this.$refs.params.$el.offsetTop))
        //   this.themeTopYs.push(-(this.$refs.comment.$el.offsetTop))
        //   this.themeTopYs.push(-(this.$refs.recommend.$el.offsetTop))
        //   console.log(this.themeTopYs)
        // }) 
      })
      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      //4.给getThemeTopY附一个值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(-(this.$refs.params.$el.offsetTop))
        this.themeTopYs.push(-(this.$refs.comment.$el.offsetTop))
        this.themeTopYs.push(-(this.$refs.recommend.$el.offsetTop))
        this.themeTopYs.push(-Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      },100)
    },
    mounted() {
      
    },
    updated() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        
        this.getThemeTopY()
      },
      titleClick(index) {
        console.log(index)
        this.$refs.scroll.scrollTo(0, this.themeTopYs[index], 100)
      },
      contentCsroll(position) {
        // console.log(position)
        //1.获取y值
        const positionY = position.y
        // console.log(Number.MAX_VALUE)
        //2.将positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          // if(this.currentIndex !== i && ((i < length - 1 && positionY <= this.themeTopYs[i] && positionY > this.themeTopYs[i+1]) || (i === length - 1 && positionY <= this.themeTopYs[i]))) {
          //   // console.log(i)
          //   this.currentIndex = i
          //   // console.log(this.currentIndex)
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
          if(this.currentIndex !== i && (positionY <= this.themeTopYs[i] && positionY > this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
            console.log(i)
          }
        }
        //3.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 500
      },
      //监听加入购物车
      addToCart() {
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        //2.将商品添加到购物车
        // this.$store.commit('addCart', product)
        this.$store.dispatch('addCart', product).then(res => {
          this.$toast.show(res, 1000)
          //普通形式展示
          // this.show = true
          // this.message = res
          
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // }, 1500)
        })
        
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content {
    height: calc(100% - 44px - 58px);
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>