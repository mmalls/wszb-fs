<template>
  <div class="channel_add">
    <group title="录入进货渠道信息">
      <x-input title="渠道商" name="name" v-model="channel.name" placeholder="进货渠道" :required="true"></x-input>
      <x-input title="手机号码" v-model="channel.phone" placeholder="请输入手机号" :required="true"  keyboard="number" is-type="china-mobile" :readonly="readonly"></x-input>
      <x-textarea :max="200" title="备注" v-model="channel.intro"  name="intro" placeholder="请输入备注地址"></x-textarea>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="doEdit" v-if="edit">更新</x-button>
        <x-button type="primary" @click.native="doSave" v-else >保存</x-button>
      </box>
    </group>
  </div>
</template>

<script>
import { XInput, XTextarea, Group, XButton, Box } from 'vux'
import xprompt from '@/components/mixins/xprompt.js'

export default {
  mixins: [xprompt],
  components: {
    XInput, XTextarea, XButton,
    Group, Box
  },
  data () {
    return {
      channelId: "",
      readonly: false,
      edit: false,
      channel: {
        nanme: "",
        phone: "",
        intro: ""
      }
    }
  },
  props: {},
  watch: {},
  methods: {
    checkInput() {
        if (this.channel.name == "" || this.channel.phone == "" ) {
          this.showToast("warn", "请输入完整信息")
          return false
        }
        return true
    },
    doSave() {
        if (!this.checkInput()) {
          return
        }
        let url = "/users/"+ this.$lstore.userId() + "/channels"
        this.$rest.post(url, this.channel).then(res => {
          this.showToast("success", "增加进货渠道信息成功")
          this.$router.push({path: '/channels/list'})
        }).catch(res => {
          //console.log("save channel failed, ", res)
          this.showToast("warn", "增加进货渠道信息失败")
        })
    },
    doGet() {
      let url = "/users/"+ this.$lstore.userId() + "/channels/" + this.channelId
      this.$rest.get(url).then(res => {
        this.channel = res.data
        //console.log("get channel, ", this.channel)
        this.readonly = true
      }).catch(e => {
        this.showToast("warn", "查询进货渠道信息失败")
        router.push({path: '/channels/list'})
      })
    },
    doEdit() {
      if (!this.checkInput()) {
        return
      } 
      let url = "/users/"+ this.$lstore.userId() + "/channels/" + this.channelId
      this.$rest.put(url,this.channel).then(res => {
        this.showToast("success", "更新进货渠道信息成功")
        this.$router.push({path: '/channels/list'})
      }).catch(res => {
        //console.log("save channel failed, ", res)
        this.showToast("warn", "更新进货渠道信息失败")
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    let rp = this.$route.path
    //console.log("url path:", rp)
    if (rp.startsWith("/channels/edit")) {
      this.channelId = this.$route.params.id
      if (this.channelId != undefined && this.channelId != "") {
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