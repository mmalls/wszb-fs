<template>
  <div id="good_list">
    <div v-for="c in goods" :key="c.id" >
      <form-preview header-label="商品名" :header-value="c.name" :body-items="c.list" :footer-buttons="c.btn"></form-preview>
        <br/>
    </div>
  </div>
</template>

<script>
import {FormPreview} from 'vux'
import xprompt from '@/components/mixins/xprompt.js'

export default {
  mixins: [xprompt],
  components: {
    FormPreview
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
                {label:'卖价', value: '￥' + it.sellPrice.toFixed(2)},
                {label:'进价', value: '￥' + it.purchasePrice.toFixed(2)},
                {label:'种类', value: it.catalog},
                {label:'单位', value: it.unit},
                {label:'说明', value: it.intro},
                {label:'进货渠道', value: it.channelName}
              ]
              let btn = [{
                style: 'primary',
                text: '下单',
                onButtonClick: (name) => {this.$router.push({path: '/orders/add?goodsId=' + it.id})}
              }, {
                style: 'default',
                text: '修改',
                onButtonClick: (name) => _t.doEdit('/goods/edit/', it.id)
              }, {
                style: 'default',
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
      let url = "/users/"+ this.$lstore.userId() + "/goods/" + id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除商品信息成功")
        this.listGoods()
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