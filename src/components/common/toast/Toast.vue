<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: 'Toast',
    props: {
      // message: {
      //   type: String,
      //   default() {
      //     return ''
      //   }
      // },
      // show: {
      //   type: Boolean,
      //   default() {
      //     return false
      //   }
      // }
    },
    data() {
      return {
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message = '默认文字', duration = 1500) {
        this.isShow = true
        this.message = message

        setTimeout(() => {
          this.isShow = false
          this.message = ''
        }, duration)
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #eee;
    padding: 6px 8px;
    border-radius: 10%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 9;
  }
</style>