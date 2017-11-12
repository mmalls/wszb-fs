import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = (resolve) => {
  import('@/components/index/index').then((module) => {
    resolve(module)
  })
} 

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
      component: resolve => import('@/components/user/login').then(module =>resolve(module))
    }, 
    { 
      path: '/customs/list',
      component: resolve => import('@/components/custom/list').then(module =>resolve(module))
    },
    { 
      path: '/customs/add',
      component: resolve => import('@/components/custom/add').then(module =>resolve(module))
    },
    { 
      path: '/orders/list',
      component: resolve => import('@/components/order/list').then(module =>resolve(module))
    },
    { 
      path: '/goods/list',
      component: resolve => import('@/components/goods/list').then(module =>resolve(module))
    },
    { 
      path: '/channels/list',
      component: resolve => import('@/components/channel/list').then(module =>resolve(module))
    }
  ]
})

export default router
