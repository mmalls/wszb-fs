<template>
  <div class="custom_add">
    <group title="录入客户信息">
      <x-input title="微信号" name="weixin" v-model="custom.weixin" placeholder="请输入微信号" :required="true"></x-input>
      <x-input title="手机号码" v-model="custom.phone" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile" :readonly="readonly"></x-input>
      <x-input title="收货人" name="receiver" v-model="custom.receiver" placeholder="请输入收货人" :required="true"></x-input>
      <x-textarea :max="200" title="收货地址" v-model="custom.address"  name="address" placeholder="请输入收货地址" :required="true"></x-textarea>
      <x-input title="邮编" v-model="custom.postCode"  name="postcode" keyboard="number" placeholder="请输入邮编"></x-input>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="doEdit" v-if="edit">更新</x-button>
        <x-button type="primary" @click.native="doSave" v-else >保存</x-button>
      </box>
    </group>
  </div>
</template>

<script>
import { XInput, XTextarea, Group, XButton, Cell, Box } from 'vux'
import xprompt from '@/components/mixins/xprompt.js'

export default {
  mixins: [xprompt],
  components: {
    XInput, XTextarea, XButton, Group, Box
  },
  data () {
    return {
      customId: "",
      readonly: false,
      edit: false,
      custom: {
        weixin: "",
        phone: "",
        receiver: "",
        address: "",
        postCode: ""
      }
    }
  },
  props: {},
  watch: {},
  methods: {
    checkInput() {
        if (this.custom.weixin == "" || this.custom.phone == "" ||this.custom.address == "") {
          this.showToast("warn", "请输入完整信息")
          return false
        }
        return true
    },
    doSave() {
        if (!this.checkInput()) {
          return
        }
        let url = "/users/"+ this.$lstore.userId() + "/customs"
        this.$rest.post(url, this.custom).then(res => {
          this.showToast("success", "增加客户信息成功")
          this.$router.push({path: '/customs/list'})
        }).catch(res => {
          //console.log("save custom failed, ", res)
          this.showToast("warn", "增加客户信息失败")
        })
    },
    doGet() {
      let url = "/users/"+ this.$lstore.userId() + "/customs/" + this.customId
      this.$rest.get(url).then(res => {
        this.custom = res.data
        //console.log("get custom, ", this.custom)
        this.readonly = true
      }).catch(e => {
        this.showToast("warn", "查询信息失败")
         this.$router.push({path: '/customs/list'})
      })
    },
    doEdit() {
      if (!this.checkInput()) {
        return
      } 
      let url = "/users/"+ this.$lstore.userId() + "/customs/" + this.customId
      this.$rest.put(url,this.custom).then(res => {
        this.showToast("success", "更新客户信息成功")
        this.$router.push({path: '/customs/list'})
      }).catch(res => {
        //console.log("save custom failed, ", res)
        this.showToast("warn", "更新客户信息失败")
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    let rp = this.$route.path
    //console.log("url path:", rp)
    if (rp.startsWith("/customs/edit")) {
      this.customId = this.$route.params.id
      if (this.customId != undefined && this.customId != "") {
        this.edit = true
        this.doGet()
      }
    }
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>