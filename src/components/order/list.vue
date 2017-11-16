<template>
  <div class="order_list">
    <div v-for="c in orders" :key="c.id" >
      <form-preview header-label="单笔收入" :header-value="c.earning" :body-items="c.list" :footer-buttons="c.btn"></form-preview>
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
import {FormPreview, Toast, Confirm} from 'vux'
import xdelcnf from '@/components/mixins/xdelcnf.js'
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins: [xdelcnf, xtoast],
  components: {
    FormPreview, Toast, Confirm
  },
  data () {
    return {
      orders: []
    }
  },
  props: {},
  watch: {},
  methods: {
    listOrders() {
      let _t = this
      let url = "/users/"+ this.$lstore.userId() + "/orders"
      this.$rest.get(url).then(res => {
           //console.log("get orders res, ", res.data)
           let cs = []
           res.data.orders.forEach( (it) => {
              let c = {}
              //console.log("get orders it, ", it)
              c['earning'] = ((it.sellPrice - it.purchasePrice) * it.quantity).toFixed(2)
              c['id'] = it.id
              let list = [
                {label:'客户微信号', value: it.customWeixin},
                {label:'客户手机号', value: it.customPhone},
                {label:'商品名称', value: it.goodsName},
                {label:'成交价', value: it.sellPrice},
                {label:'进价', value: it.purchasePrice},
                {label:'购买数量', value: it.quantity},
                {label:'成交日期', value: it.createdAt},
                //{label:'折扣类型', value: it.discountType},
                //{label:'折扣数', value: it.discount}
              ]
              let btn = [{
                style: 'primary',
                text: '修改',
                onButtonClick: (name) => _t.doEdit('/orders/edit/', it.id)
              }, {
                style: 'warn',
                text: '删除',
                onButtonClick: (name) => _t.cnfDelete(it.id)
              }]
              c['list'] = list
              c['btn'] = btn
              cs.push(c)
           })
           this.orders = cs
           //console.log("orders, ", this.orders)
        }).catch(e => {
          //console.log("get orders failed, ", e)
          this.showToast("warn", "获取订单列表失败")
        })
    },
    doDelete(id) {
      //console.log("delete orders: ", id)
      let url = "/users/"+ this.$lstore.userId() + "/orders/" + this.delcnf.id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除订单信息成功")
        this.listorders()
      }).catch(e => {
        this.showToast("warn", "删除订单信息失败")
      }) 
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    this.listOrders()
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>

</style>