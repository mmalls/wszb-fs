// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import axios from 'axios'
import Bars from 'vuebars'
//import 'font-awesome/css/font-awesome.css'
import App from './App'
import router from './router'
import lstore from '@/assets/js/store'

Vue.config.productionTip = false
FastClick.attach(document.body)

Vue.use(Bars)

var axios_i = axios.create({
  baseURL: '/rest/v1',
  timeout: 1000, 
  withCredentials: true
})
axios_i.interceptors.request.use(config => {
  if (lstore.isLogin()) {
    config.headers.Authorization = 'Bearer ' + lstore.token()
  }
  return config
}, err => {
  return Promise.reject(err)
})

Vue.prototype.$rest = axios_i
Vue.prototype.$lstore = lstore
Vue.prototype.$isLogin = () => {
  let isLogin = lstore.isLogin()
  /*console.log("isLogin :" , isLogin)*/
  if (!isLogin) { // 检查是否登陆
    router.push({path: '/user'})
  } else {
   // console.log("userId:", lstore.userId())
  }
}

/* eslint-disable no-new */
const vue = new Vue({
  router,
  render: h => h(App)
})
vue.$mount('#app-box')
