<template>
  <div id="app" style="height:100%;">
    <!--
    <loading :show="isLoading" position="absolute"></loading>
    -->
    <view-box ref="view-box">
      <!--header slot-->
      <div class="vux-demo-header-box" slot="header">
        <x-header :left-options="leftOptions" :transition="headerTransition" :title="title">
          <router-link slot="right" :to="addLink.url" v-show="addLink.show">新增</router-link>
        </x-header>
      </div>
      
      <router-view :transition="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" slot="default" style="padding-top:46px;padding-bottom:46px;"></router-view>
      
      <tabbar class="vux-demo-tabbar" icon-class="vux-center" slot="bottom">
          <tabbar-item selected link="/"> 
              <i slot="icon" class="fa fa-home" ></i>
              <span slot="label">首页</span>
          </tabbar-item>
          <tabbar-item link="/orders/list">
              <i slot="icon" class="fa fa-shopping-cart"></i>
              <span slot="label">订单</span>
          </tabbar-item>
          <tabbar-item link="/customs/list">
              <i slot="icon" class="fa fa-users"></i>
              <span slot="label">客户</span>
          </tabbar-item>
          <tabbar-item link="/goods/list">
              <i slot="icon" class="fa fa-truck"></i>
              <span slot="label">产品</span>
          </tabbar-item>
          <tabbar-item link="/channels/list">
              <i slot="icon" class="fa fa-list"></i>
              <span slot="label">渠道</span>
          </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import store from '@/store'
import { mapGetters } from 'vuex'
import { Tabbar, TabbarItem, Loading, ViewBox, XHeader } from 'vux'

export default {
  name: 'app',
  components: {
    Tabbar,
    TabbarItem,
    Loading,
    ViewBox,
    XHeader
  },
  store: store,
  data () {
    return {
      routerTransition: {
        forward: 'slideRL',
        back: 'slideLR'
      },
      addLink: {
        show: false,
        url: ''
      }
    }
  },
  methods: {
  },
 computed: {
   ...mapGetters(['isLoading', 'direction']),
    leftOptions () {
      return {
        showBack: this.$route.path !== '/' && this.$route.path !== '/user'
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    title () {
      let rp = this.$route.path
      this.addLink.show = false
      if (rp && rp.startsWith('/user')) {
        return '用户'
      } 
      if (rp && rp.startsWith('/customs')) {
        this.addLink.show = true
        this.addLink.url =  '/customs/add'
        return '客户'
      }
      if (rp && rp.startsWith('/channels')) {
        this.addLink.show = true
        this.addLink.url =  '/channels/add'
        return '渠道'
      }
      if (rp && rp.startsWith('/goods')) {
        this.addLink.show = true
        this.addLink.url =  '/goods/add'
        return '商品'
      }
      if (rp && rp.startsWith('/orders/list')) {
        this.addLink.show = true
        this.addLink.url =  '/orders/add'
        return '订单'
      }
      return "首页"
    }
  },
  created () {
    this.$isLogin()
  }

}
</script>

<style lang="less">
@import '~vux/src/styles/index.less';
// @import '~vux/src/styles/reset.less';

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}
/* v-r-transition, default is {forward: 'forward', back: 'back'}*/
.forward-enter, .forward-leave {
  transform: translate3d(-100%, 0, 0);
}
.back-enter, .back-leave {
  transform: translate3d(100%, 0, 0);
}
.demo-icon-22 {
  font-family: 'vux-demo';
  font-size: 22px;
  color: #888;
}
.weui_tabbar .vux-demo-tabbar {
  backdrop-filter: blur(10px);
  background-color: none;
  background: rgba(247, 247, 250, 0.5);
}
.vux-demo-tabbar .weui_bar_item_on {
  color: #F70968;
}
.vux-demo-tabbar .weui_tabbar_item.weui_bar_item_on .weui_tabbar_label {
  color: #35495e;
}
.vux-demo-tabbar .weui_tabbar_item.weui_bar_item_on .vux-demo-tabbar-icon-home {
  color: rgb(53, 73, 94);
}
.demo-icon-22:before {
  content: attr(icon);
}
.weui_tabbar_icon + .weui_tabbar_label {
  margin-top: 0!important;
}
.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
.weui_tab_bd {
  padding-top: 46px;
}

/**
* vue-router transition
*/
.vux-pop-out-transition,
.vux-pop-in-transition {
  width: 100%;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  backface-visibility: hidden;
}
.vux-pop-out-enter,
.vux-pop-out-leave,
.vux-pop-in-enter,
.vux-pop-in-leave {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}
.vux-pop-out-enter {
  animation-name: popInLeft;
}
.vux-pop-out-leave {
  animation-name: popOutRight;
}
.vux-pop-in-enter {
  perspective: 1000;
  animation-name: popInRight;
}
.vux-pop-in-leave {
  animation-name: popOutLeft;
}
@keyframes popInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutLeft {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes popInRight {
  from {
    transform: translate3d(100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutRight {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
