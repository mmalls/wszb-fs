<template>
  <div id="user">
    <tab>
     <tab-item selected @on-item-click="onItemClick">登陆</tab-item>
      <tab-item @on-item-click="onItemClick">注册</tab-item>
    </tab>
    <group title="请输入如下信息" v-show="signin">
      <x-input title="手机号码" v-model="signinInfo.mobile" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile" ref="mobile_input"></x-input>
      <x-input title="密码" v-model="signinInfo.password" type="password" placeholder="请输入密码" :required="true" :min="6" :max="20"></x-input>
      <x-button type="primary" @click.native="doSignin">登陆</x-button>
    </group>

    <group title="请输入如下信息" v-show="signup">
     <x-input title="用户名" v-model="signupInfo.username" placeholder="请输入用户名" :required="true"  keyboard="number" is-type="china-mobile"></x-input>
      <x-input title="手机号码" v-model="signupInfo.mobile" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile"></x-input>
      <x-input title="密码" v-model="signupInfo.password" type="password" placeholder="请输入密码" :required="true" :min="6" :max="20"></x-input>
      <x-input title="密码确认" v-model="signupInfo.password2" type="password" placeholder="请确认输入密码" :equal-with="signupInfo.password"></x-input>
      <x-button type="primary" @click.native="doSignup">注册</x-button>
    </group>
    <toast v-model="toast.show" type="warn" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import { Tab, TabItem, Group, XInput, Toast, XButton } from 'vux'

export default {
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
        signin: true,
        signup: false,
        toast: {
          show: false,
          msg: "",
        },
        signinInfo: {
          mobile: '',
          password: ''
        },
        signupInfo: {
          mobile: '',
          password: '',
          username: '',
          password2: ''
        }
    }
  },
  props: {},
  watch: {},
  methods: {
    showToast(show, msg) {
      this.toast.show = show
      this.toast.msg = msg
    },
    onItemClick (index) {
      this.signin = index == 0
      this.signup = index == 1
    },
    doSignin() {
        if (this.signinInfo.mobile == '' || this.signinInfo.password == '') {
          this.showToast(true, "请输入完整信息")
          return
        }
        var _this = this
        this.$rest.post("/auth", this.signinInfo).then(res => _this.signSuccess(res)).catch(res => _this.signFailed(res.response))
    },
    signFailed(res) {
      console.log("error ", JSON.stringify(res))
      if (res && res.status == 401) {
          this.showToast(true, "手机号码或密码错误")
          return
      } else if (res && res.status >= 400) {
          this.showToast(true, "登陆失败")
          return
      }
    },
    signSuccess(res) {

      try{
         this.$lstore.saveUserInfo(res.data)
      } catch(e) {
         console.log(e)
      }
      
       this.$router.push({path: '/'})
    },
    doSignup() {
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
