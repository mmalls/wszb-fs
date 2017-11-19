<template>
  <div class="index">
     <tab :line-width=2 active-color='#fc378c'>
       <tab-item class="vux-center" v-for="(item, index) in list" :key="index" @on-item-click="listStats">{{item}}</tab-item>
    </tab>

      <div> 
        <div>
        <bars :padding="18" :data="bardatas" :gradient="['#6fa8dc', '#42b983']">
        </bars>
        </div>
        <group-title>合计</group-title>
        <grid :cols="3">
            <grid-item v-for="(it,idx) in previews" :key="idx" class="grid-center">
               <div>
                <span class="span-number">{{it.value}}</span>
                <br/>
                <span class="span-desc">{{it.desc}}</span>
              </div>
            </grid-item>
        </grid>
        <group-title>单项</group-title>
        <cell v-for="(it,idx) in items" :key="idx" :title="it.key" :value="'￥' +it.incoming" ></cell>
      </div>
  </div>
</template>

<script>
import {
  Tab, TabItem, Card, Cell, 
  Grid, GridItem, GroupTitle
} from "vux"

const list = () => ['7天', '4周', '1年']

export default {
  components: {
    Tab, TabItem, Card, Cell,
    Grid, GridItem, GroupTitle
  },
  data () {
    return {
      list: list(),
      previews: [],
      items: [],
      bardatas: []
    }
  },
  props: {},
  watch: {},
  methods: {
    listStats(idx) {
      let by='week'
      let avgDesc = '日'
      switch (idx) {
      case 1:
        by='month'
        break
      case 2:
        by='year'
        avgDesc = '月'
        break
      default:
        break
      }
      let _t = this
      let url = "/users/"+ this.$lstore.userId() + "/stats/orders?by="+ by
      this.$rest.get(url).then(res => {
        let d = res.data
        let count = d.items.length
        if (count == 0) { count = 1}
        this.previews = [
          { value: d.totalOrder, desc: '总单数'},
          { value: '￥' + d.totalIncoming.toFixed(2), desc: '总收入'},
          { value: '￥' + (d.totalIncoming / count).toFixed(2) , desc: '平均'+avgDesc+'收入'},
          { value: d.totalGoods, desc: '总商品种类数' },
          { value: d.totalCustom, desc: '总成交客户数' },
          { value: d.totalQuantity, desc: '总成交件数' }
        ]
        this.items = d.items
        this.bardatas = []
        this.bardatas.push(0) // there is a bug for bars
        for (let i of d.items) {
           this.bardatas.push(i.incoming)
        }
        //console.log("bardatas :", this.bardatas)
      }).catch(e => {
        console.log("get orders stats failed, ", e)
      })
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    this.listStats(0)
  },
  mounted () {},
  destroyed () {}
}
</script>

<style>
.grid-center {
  display: block;
  text-align: center;
}
.span-number {
  text-align: center;
  font-size: 14px;
  color: #f74c31;
}
.span-desc {
  text-align: center;
  font-size: 12px;
}
</style>
