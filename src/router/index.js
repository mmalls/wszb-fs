import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = () => import('@/components/index/index') 
const user = () => import('@/components/user/login')
const custom_list = () => import('@/components/custom/list')
const custom_add = () => import('@/components/custom/add')
const channel_list = () => import('@/components/channel/list')
const channel_add = () => import('@/components/channel/add')
const goods_list = () => import('@/components/goods/list')
const goods_add = () => import('@/components/goods/add')
const order_list = () => import('@/components/order/list')
const order_add = () => import('@/components/order/add')

const router = new Router({
  routes: [
    { // 根路径
      path: '/',
      redirect: '/index',
      component: home
    },{ // 首页
      path: '/index',
      component: home
    },{ 
      path: '/user',
      component: user
    },{ 
      path: '/customs/list',
      component: custom_list
    },{ 
      path: '/customs/add',
      component: custom_add
    },{ 
      path: '/customs/edit/:id',
      component: custom_add
    },{ 
      path: '/orders/list',
      component: order_list
    },{ 
      path: '/orders/add',
      component: order_add
    },{ 
      path: '/orders/edit/:id',
      component: order_add
    },{ 
      path: '/goods/list',
      component: goods_list
    },{ 
      path: '/goods/add',
      component: goods_add
    },{ 
      path: '/channels/list',
      component: channel_list
    },{ 
      path: '/channels/add',
      component: channel_add
    },{ 
      path: '/channels/edit/:id',
      component: channel_add
    }
  ]
})

export default router
