<template>
  <div class="order_list">
    <div v-for="(c, idx) in orders" :key="c.id" >
      <group>
        <cell title="单笔收入" :value="c.earning"></cell>
        <div v-for="(g, idx) in c.goods" :key="g.id" >
          <cell :title="'商品：' + (idx +1)" is-link :border-intent="false"
                :arrow-direction="g.show ? 'up' : 'down'"
                @click.native="g.show = !g.show">         
          </cell>
          <template v-if="g.show">
            <cell-form-preview :list="g.list" v-if="c.custom.show"></cell-form-preview>
          </template>
        </div>
        <cell title="客户信息" is-link :border-intent="false"
                :arrow-direction="c.custom.show ? 'up' : 'down'"
                @click.native="c.custom.show = !c.custom.show">         
        </cell>
        <template v-if="c.custom.show">
          <cell-form-preview :list="c.custom.list" v-if="c.custom.show"></cell-form-preview>
        </template>
        <box gap="10px 10px">
        <flexbox>
          <flexbox-item style="text-align:center">
            <x-button plain @click.native="doEdit('/orders/edit/', c.id)">修改</x-button>
          </flexbox-item>
          <flexbox-item style="text-align:center"> 
            <x-button plain @click.native="cnfDelete(c.id)" class="custom-primary-red">删除</x-button>
          </flexbox-item>
        </flexbox> 
        </box>     
      </group>

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
import {FormPreview, Toast, Confirm, Cell, Group, Box, 
 CellFormPreview, Flexbox, FlexboxItem, XButton } from 'vux'
import xdelcnf from '@/components/mixins/xdelcnf.js'
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins: [xdelcnf, xtoast],
  components: {
    FormPreview, Toast, Confirm, Cell, Group, Box,
    CellFormPreview, Flexbox, FlexboxItem, XButton
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
           let out = []
           res.data.orders.forEach( (it) => {
              let ogoods = []
              let oitem = {}
              let purchasePrice = 0 
              
              for (let c of it.goods) {
                let item = {}
                item.show = true
                item.list = [
                  {label:'商品名称', value: c.goodsName},
                  {label:'单位售价', value: '￥' + c.sellPrice.toFixed(2)},
                  {label:'单位进价', value: '￥' + c.purchasePrice.toFixed(2)},
                  {label:'购买数量', value: c.quantity}
                ]
                purchasePrice += c.purchasePrice*c.quantity
                ogoods.push(item)
              }
              oitem.goods = ogoods
              //console.log("get orders it, ", it)
              oitem.earning = '￥' + (it.totalSellPrice - purchasePrice).toFixed(2)
              oitem.id = it.id
              oitem.custom = {
                show: true, 
                list: [
                  {label:'客户微信号', value: it.custom.weixin},
                  {label:'客户手机号', value: it.custom.phone},
                  {label:'成交日期', value: it.createdAt}
                ]
              }
              out.push(oitem)
           })
           this.orders = out
           //console.log("orders, ", this.orders)
        }).catch(e => {
          console.log("get orders failed, ", e)
          this.showToast("warn", "获取订单列表失败")
        })
    },
    doDelete(id) {
      //console.log("delete orders: ", id)
      let url = "/users/"+ this.$lstore.userId() + "/orders/" + this.delcnf.id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除订单信息成功")
        this.listOrders()
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

<style lang="less">
.custom-primary-red {
  border-color: #CE3C39!important;
  color: #CE3C39!important;
  &:active {
    border-color: rgba(206, 60, 57, 0.6)!important;
    color: rgba(206, 60, 57, 0.6)!important;
    background-color: transparent;
  }
}
</style>