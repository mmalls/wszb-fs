<template>
  <div class="custome_list">
    <div v-for="c in customs">
      <form-preview header-label="微信号" :header-value="c.weixin" :body-items="c.list" :footer-buttons="btn"></form-preview>
        <br/>
    </div>
  </div>
</template>

<script>
import {XHeader, FormPreview, Group, Cell, Divider} from 'vux'

export default {
  components: {
    XHeader, FormPreview, Group
  },
  data () {
    return {
      customs: [],
      btn: [{
        style: 'default',
        text: '修改'
      }, {
        style: 'primary',
        text: '删除',
        link: '/'
      }]
    }
  },
  props: {},
  watch: {},
  methods: {
    listCustoms() {
      this.$rest.get("/users/"+ this.$lstore.userId() + "/customs",
        ).then(res => {
           console.log("get customs res, ", res.data)
           let cs = []
           res.data.customs.forEach( (it) => {
              let c = {}
              //console.log("get customs it, ", it)
              c['weixin'] = it.weixin
              let list = [
                {label:'手机号', value: it.phone},
                {label:'送货地址', value: it.address},
                {label:'邮编', value: it.postCode}
              ]
              c['list'] = list
              cs.push(c)
           })
           this.customs = cs
           console.log("customs, ", this.customs)
        }).catch(res => {
          console.log("get customs failed, ", res)
        })
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