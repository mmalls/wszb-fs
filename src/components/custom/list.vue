<template>
  <div id="custome_list">
    <div v-for="c in customs" :key="c.id" >
      <form-preview header-label="微信号" :header-value="c.weixin" :body-items="c.list" :footer-buttons="c.btn"></form-preview>
        <br/>
    </div>
    <toast v-model="toast.show" :type="toast.type" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import {FormPreview, Toast} from 'vux'

export default {
  components: {
    FormPreview, Toast
  },
  data () {
    return {
      toast: {
        show: false,
        msg: "",
        type: "warn"
      },
      customs: []
    }
  },
  props: {},
  watch: {},
  methods: {
    showToast(type, msg) {
      this.toast.show = true
      this.toast.msg = msg
      this.toast.type = type
    },
    listCustoms() {
      let _t = this
      let url = "/users/"+ this.$lstore.userId() + "/customs"
      this.$rest.get(url).then(res => {
           console.log("get customs res, ", res.data)
           let cs = []
           res.data.customs.forEach( (it) => {
              let c = {}
              //console.log("get customs it, ", it)
              c['weixin'] = it.weixin
              c['id'] = it.id
              let list = [
                {label:'手机号', value: it.phone},
                {label:'送货地址', value: it.address},
                {label:'邮编', value: it.postCode}
              ]
              let btn = [{
                style: 'primary',
                text: '修改',
                onButtonClick: (name) => _t.doEdit(it.id)
              }, {
                style: 'warn',
                text: '删除',
                onButtonClick: (name) => _t.doDelete(it.id)
              }]
              c['list'] = list
              c['btn'] = btn
              cs.push(c)
           })
           this.customs = cs
           //console.log("customs, ", this.customs)
        }).catch(e => {
          //console.log("get customs failed, ", e)
          this.showToast("warn", "获取客户列表失败")
        })
    },
    doDelete(id) {
      console.log("delete custom: ", id)
      let url = "/users/"+ this.$lstore.userId() + "/customs/" + id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除客户信息成功")
        this.listCustoms()
      }).catch(e => {
        this.showToast("warn", "删除客户信息失败")
      }) 
    },
    doEdit(id) {
      //console.log("edit custom: ", id)
      this.$router.push({path: '/customs/edit/'+id})
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    this.listCustoms()
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>