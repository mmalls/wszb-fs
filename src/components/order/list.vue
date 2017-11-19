<template>
  <div class="order_list" >
    <div style="height:44px;">
      <sticky scroll-box="vux_view_box_body" :offset="46">
        <div class="vux-1px-t">
        <swipeout>
          <swipeout-item ref="swipeoutItem" :right-menu-width="210" :sensitivity="15"  >
            <div slot="left-menu">
              <swipeout-button @click.native="swipeClick('edit')" type="default">修改</swipeout-button>
              <swipeout-button @click.native="swipeClick('delete')" type="warn">删除</swipeout-button>
              <swipeout-button @click.native="$refs.swipeoutItem.close()" type="default">关闭</swipeout-button>
            </div>
            <div slot="content" class="top-content vux-1px-b">订单列表(点击每项可修改/删除)</div>
          </swipeout-item>
        </swipeout>
        </div>
      </sticky>
    </div>
    <div v-for="(c, idx) in orders" :key="c.id" >
      <group>
        <cell :title="'订单['+idx+']单笔收入'" :value="c.earning" is-link @click.native="cellClick(c.id)" >
           <i slot="icon" class="fa fa-minus-square" style="display:block;margin-right:5px;"></i>
        </cell>
        <div>
          <cell title="客户信息" is-link :border-intent="false" :arrow-direction="c.custom.show ? 'up' : 'down'"  @click.native="c.custom.show = !c.custom.show">
          </cell>
          <template v-if="c.custom.show">
            <cell-form-preview :list="c.custom.list" v-if="c.custom.show"></cell-form-preview>
          </template>
        </div>
        <div v-for="(g, idx) in c.goods" :key="g.id" >
          <cell :title="'商品：' + (idx +1)" is-link :border-intent="false" :arrow-direction="g.show ? 'up' : 'down'" @click.native="g.show = !g.show">         
          </cell>
          <template v-if="g.show">
            <cell-form-preview :list="g.list" v-if="c.custom.show"></cell-form-preview>
          </template>
        </div>
      </group>
    </div>
  </div>
</template>

<script>
import {FormPreview, Confirm, Cell, Group, Box, 
 CellFormPreview,  XButton, 
 Swipeout, SwipeoutItem, SwipeoutButton,Sticky } from 'vux'
import xprompt from '@/components/mixins/xprompt.js'

export default {
  mixins: [xprompt],
  components: {
    FormPreview, Cell, Group, Box,
    CellFormPreview, XButton,
    Swipeout, SwipeoutItem, SwipeoutButton, Sticky
  },
  data () {
    return {
      orders: [],
      currentId :""
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
                  {label:'成交日期', value: it.createdAt.substr(0 ,19).replace('T', ' ')}
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
      let url = "/users/"+ this.$lstore.userId() + "/orders/" + id
      this.$rest.delete(url).then(res=>{
        this.showToast("success", "删除订单信息成功")
        this.listOrders()
      }).catch(e => {
        this.showToast("warn", "删除订单信息失败")
      }) 
    },
    swipeClick(action) {
      if (action ==  "edit") {
        this.doEdit('/orders/edit/', this.currentId)
      }
      else if ( action == "delete") {
        this.cnfDelete(this.currentId)
      }
    },
    cellClick(id) {
      this.$refs.swipeoutItem.open('left')
      this.currentId = id
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
.top-content {
  padding: 10px 10px;
}
</style>