<template>
  <div id="good_list">
    <div v-for="c in goods" :key="c.id" >
      <form-preview header-label="商品名" :header-value="c.name" :body-items="c.list" :footer-buttons="c.btn"></form-preview>
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
import {FormPreview, Toast} from 'vux'
import xdelcnf from '@/components/mixins/xdelcnf.js'
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins: [xdelcnf, xtoast],
  components: {
    FormPreview, Toast
  },
  data () {
    return {
      goods: []
    }
  },
  props: {},
  watch: {},
  methods: {
    listGoods() {
      let _t = this
      let url = "/users/"+ this.$lstore.userId() + "/goods"
      this.$rest.get(url).then(res => {
           //console.log("get goods res, ", res.data)
           let cs = []
           res.data.goods.forEach( (it) => {
              let c = {}
              //console.log("get goods it, ", it)
              c['name'] = it.name
              c['id'] = it.id
              let list = [
                {label:'卖价', value: it.sellPrice},
                {label:'进价', value: it.purchasePrice},
                {label:'种类', value: it.catalog},
                {label:'说明', value: it.intro},
                {label:'进货渠道', value: it.channelName}
              ]
              let btn = [{
                style: 'primary',
                text: '修改',
                onButtonClick: (name) => _t.doEdit('/goods/edit/', it.id)
              }, {
                style: 'warn',
                text: '删除',
                onButtonClick: (name) => _t.cnfDelete(it.id)
              }]
              c['list'] = list
              c['btn'] = btn
              cs.push(c)
           })
           this.goods = cs
           //console.log("goods, ", this.goods)
        }).catch(e => {
          //console.log("get goods failed, ", e)
          this.showToast("warn", "获取商品列表失败")
        })
    },
    doDelete(id) {
      //console.log("delete goods: ", id)
      let url = "/users/"+ this.$lstore.userId() + "/goods/" + this.delcnf.id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除商品信息成功")
        this.listgoods()
      }).catch(e => {
        this.showToast("warn", "删除商品信息失败")
      }) 
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    this.listGoods()
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>