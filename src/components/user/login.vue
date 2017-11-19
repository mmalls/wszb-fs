<template>
  <div id="user">
    <tab v-model="index">
      <tab-item selected @on-item-click="onItemClick">登陆</tab-item>
      <tab-item @on-item-click="onItemClick" >注册</tab-item>
    </tab>
    <group title="请输入如下信息" v-show="index==0">
      <x-input title="手机号码" v-model="signinInfo.phone" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile" ref="mobile_input"></x-input>
      <x-input title="密码" v-model="signinInfo.password" type="password" placeholder="请输入密码" :required="true" :min="6" :max="20"></x-input>
      <x-button type="primary" @click.native="doSignin">登陆</x-button>
    </group>

    <group title="请输入如下信息" v-show="index==1">
     <x-input title="用户名" v-model="signupInfo.name" placeholder="请输入用户名" :required="true" :min="4" :max="20"></x-input>
      <x-input title="手机号码" v-model="signupInfo.phone" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile"></x-input>
      <x-input title="密码" v-model="signupInfo.password" type="password" placeholder="请输入密码" :required="true" :min="6" :max="20"></x-input>
      <x-input title="密码确认" v-model="signupInfo.password2" type="password" placeholder="请确认输入密码" :equal-with="signupInfo.password"></x-input>
      <x-button type="primary" @click.native="doSignup">注册</x-button>
    </group>
    <toast v-model="toast.show" :type="toast.type" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>

  </div>
</template>

<script>
import { Tab, TabItem, Group, XInput, Toast, XButton } from 'vux'
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins:[xtoast],
  components: {
    Tab,
    TabItem,
    Group, 
    Toast,
    XInput,
    XButton
  },
  data () {
    return {
        index: 0,
        signinInfo: {
          phone: '',
          password: ''
        },
        signupInfo: {
          phone: '',
          password: '',
          name: '',
          password2: ''
        }
    }
  },
  props: {},
  watch: {},
  methods: {
    onItemClick (index) {
      this.index
    },
    doSignin() {
        if (this.signinInfo.phone == '' || this.signinInfo.password == '') {
          this.showToast("warn", "请输入完整信息")
          return
        }
        var _this = this
        this.$rest.post("/auth", this.signinInfo).then(res => {
          this.$lstore.saveUserInfo(res.data)      
          this.$router.push({path: '/'})
        }).catch(res => {
          let rsp = res.response
          if (rsp && rsp.status == 401) {
            _this.showToast("warn", "手机号码或密码错误")
          } else if (rsp && rsp.status >= 400) {
            _this.showToast("warn", "登陆失败")
          }
        })
    },
    doSignup() {
       if (this.signupInfo.name == '' || this.signupInfo.phone == '' || this.signupInfo.password == '') {
          this.showToast("warn", "请输入完整信息")
          return
        }
        var _this = this
        this.$rest.post("/users", this.signupInfo).then(res => {
          this.showToast("success", "注册成功，请登陆")
          this.index = 0
        }).catch(res => {
          let rsp = res.response
          if (rsp && rsp.status == 409) {
            _this.showToast("warn", "手机号码已注册")
          } else if (rsp && res.status >= 400) {
            _this.showToast("warn", "注册失败")
            return
          }
        })
    }
  },
  filters: {},
  computed: {},
  created () {},
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>
