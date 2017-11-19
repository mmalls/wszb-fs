<template>
  <div class="channel_list">
    <div v-for="c in channels" :key="c.id" >
      <form-preview header-label="进货渠道" :header-value="c.name" :body-items="c.list" :footer-buttons="c.btn"></form-preview>
        <br/>
    </div>
    <toast v-model="toast.show" :type="toast.type" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>
    <div>
      <confirm v-model="delcnf.show"
      title="操作提示"
      content="确认删除？删除之后不可恢复哦！"
      @on-confirm="doDelete">
      </confirm>
    </div>
  </div>
</template>

<script>
import {FormPreview, Group, Toast, Confirm} from 'vux'
import xdelcnf from '@/components/mixins/xdelcnf.js'
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins: [xdelcnf, xtoast],
  components: {
    FormPreview,
    Toast,
    Confirm
  },
  data () {
    return {
      channels: []
    }
  },
  props: {},
  watch: {},
  methods: {
    listChannels() {
      let _t = this
      let url = "/users/"+ this.$lstore.userId() + "/channels"
      this.$rest.get(url).then(res => {
           //console.log("get channels res, ", res.data)
           let cs = []
           res.data.channels.forEach( (it) => {
              let c = {}
              //console.log("get channels it, ", it)
              c['name'] = it.name
              c['id'] = it.id
              let list = [
                {label:'手机号', value: it.phone},
                {label:'备注', value: it.intro}
              ]
              let btn = [{
                style: 'primary',
                text: '进货',
                onButtonClick: (name) => {this.$router.push({path: '/goods/add?channelId=' + it.id})}
              }, {
                style: 'default',
                text: '修改',
                onButtonClick: (name) => _t.doEdit('/channels/edit/', it.id)
              }, {
                style: 'default',
                text: '删除',
                onButtonClick: (name) => _t.cnfDelete(it.id)
              }]
              c['list'] = list
              c['btn'] = btn
              cs.push(c)
           })
           this.channels = cs
           //console.log("channels, ", this.channels)
        }).catch(e => {
          //console.log("get channels failed, ", e)
          this.showToast("warn", "获取渠道商列表失败")
        })
    },
    doDelete() {
      //console.log("delete channel: ", id)
      let url = "/users/"+ this.$lstore.userId() + "/channels/" + this.delcnf.id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除渠道商信息成功")
        this.listChannels()
      }).catch(e => {
        this.showToast("warn", "删除渠道商信息失败")
      }) 
    }
  },
  filters: {},
  computed: {},
  created () {
     this.$isLogin()
     this.listChannels()
  },
  mounted () {
   
    
  },
  destroyed () {}
}
</script>

<style>

</style>