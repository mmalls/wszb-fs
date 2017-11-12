<template>
  <div class="custome_list">
    <x-header title="新增客户信息"></x-header>
    <group title="录入客户信息">
      <x-input title="微信号" name="weixin" v-model="custom.weixin" placeholder="请输入微信号" :required="true"></x-input>
      <x-input title="手机号码" v-model="custom.mobile" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile"></x-input>
      <x-textarea :max="200" title="送货地址" v-model="custom.address"  name="address" placeholder="请输入送货地址" :required="true"></x-textarea>
      <x-input title="邮编" v-model="custom.postcode"  name="postcode" keyboard="number" placeholder="请输入邮"></x-input>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="doSave">保存</x-button>
      </box>
    </group>
    <toast v-model="toast.show" type="warn" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>
    <x-footer></x-footer>
  </div>
</template>

<script>
import XFooter from '@/components/base/footer'
import { XHeader, XInput, XTextarea, Group, XButton, Cell, Box, Toast } from 'vux'

export default {
  components: {
    XHeader, XFooter, XInput, XTextarea, XButton,
    Group, Box, Toast
  },
  data () {
    return {
      toast: {
        show: false,
        msg: "",
      },
      custom: {
        weixin: "",
        mobile: "",
        address: "",
        postcode: ""
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
    doSave() {
        if (this.custom.weixin == "" ||this.custom.mobile == ""||this.custom.address == "") {
          this.showToast(true, "请输入完整信息")
          return
        }
        this.$rest.post("/users/"+ this.$lstore.userId() + "/customs", 
          this.custom
        ).then(res => {
          this.$router.push({path: '/customs/list'})
        }).catch(res => {
          console.log("save custom failed, ", res)
        })
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>