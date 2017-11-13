import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = () => import('@/components/index/index') 
const user = () => import('@/components/user/login')
const custom_list = () => import('@/components/custom/list')
const custom_add = () => import('@/components/custom/add')
const channel_list = () => import('@/components/channel/list')
const goods_list = () => import('@/components/order/list')
const order_lsit = () => import('@/components/goods/list')

const router = new Router({
  routes: [
    { // 根路径
      path: '/',
      redirect: '/index',
      component: home
    },
    { // 首页
      path: '/index',
      component: home
    },
    { 
      path: '/user',
      component: user
    }, 
    { 
      path: '/customs/list',
      component: custom_list
    },
    { 
      path: '/customs/add',
      component: custom_add
    },
    { 
      path: '/customs/edit/:id',
      component: custom_add
    },
    { 
      path: '/orders/list',
      component: order_lsit
    },
    { 
      path: '/goods/list',
      component: goods_list
    },
    { 
      path: '/channels/list',
      component: channel_list
    }
  ]
})

export default router
