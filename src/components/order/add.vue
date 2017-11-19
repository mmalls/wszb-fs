<template>
    <div class="order_add">
        <group title="购买商品">
          <cell title="一共购买商品件数">
            <inline-x-number :min="1" width="50px" v-model.number="order.number" button-style="round" @on-change="chgNumber"></inline-x-number>
          </cell>
          <div v-for="(g, idx) in order.goods" :key="g.id">
            <cell :title="'商品：' + g.goodsName" is-link :border-intent="false"
            :arrow-direction="g.show ? 'up' : 'down'"
            @click.native="g.show = !g.show">
            </cell>
            <template v-if="g.show">
              <popup-radio title="商品名称" placeholder="请选择商品名称" v-model="g.goodsId" :options="optGoods.options" @on-change="selectGoods(idx, g.goodsId)">
                <p slot="popup-header" class="vux-1px-b radio-slot">请选择商品名称</p>
              </popup-radio>
              <input hidden v-model="g.goodsName" value=""/>
              <x-input title="单位" v-model.number="g.unit" placeholder="选择商品自动关联" :required="true" type="text" ></x-input>
              <x-input title="单位进价" v-model.number="g.purchasePrice" placeholder="选择商品自动关联" :required="true"  keyboard="number" type="number" ></x-input>
              <x-input title="单位售价" v-model.number="g.sellPrice" placeholder="选择商品自动关联，可再修改" :required="true"  keyboard="number" type="number"></x-input> 
              <cell title="购买数量">
                <inline-x-number :min="1" width="50px" v-model.number="g.quantity" button-style="round" @on-change="chgQuantity"></inline-x-number>
              </cell>
            </template>
           </div>
            <x-input title="总售价" v-model.number="order.totalSellPrice" placeholder="自己计算，可改价" :required="true"  keyboard="number" type="number"></x-input>
        </group>
        <group title="客户信息">
            <flexbox>
                <flexbox-item :span="8">
                <popup-radio title="客户微信号" placeholder="请选择客户微信" :options="optCustoms.options" v-model="order.custom.id" @on-change="selectCustom">
                    <p slot="popup-header" class="vux-1px-b radio-slot">请选择客户微信</p>
                </popup-radio>
            </flexbox-item>
            <flexbox-item > 
                <x-button link="/customs/add"><i class="fa fa-plus-circle" ></i>新客户</x-button>
            </flexbox-item>
            </flexbox>
             <input hidden v-model="order.custom.weixin" value=""/>
             <x-input title="手机号码" v-model="order.custom.phone" placeholder="选择客户自动关联" :required="true"  readonly ></x-input>
            <x-input title="收货人" v-model="order.custom.receiver" placeholder="选择客户自动关联" :required="true" readonly ></x-input>
            <x-textarea :max="100" title="收货地址" v-model="order.custom.address"  placeholder="选择客户自动关联" :required="true" readonly ></x-textarea>
            <x-input title="邮编" v-model="order.custom.postcode" keyboard="number" placeholder="选择客户自动关联" readonly></x-input>
        </group>
        <box gap="10px 10px">
            <x-button type="primary" @click.native="doEdit" v-if="edit">更新</x-button>
            <x-button type="primary" @click.native="doSave" v-else >保存</x-button>
      </box>
    </div>
</template>

<script>
import { XInput, Selector, XTextarea, Group, Cell, XButton, Box, Toast, InlineXNumber,PopupRadio, Flexbox, FlexboxItem} from 'vux'
import xtoast from '@/components/mixins/xtoast.js'
import xlist from '@/components/mixins/xlist.js'


export default {
  mixins: [xtoast, xlist],
  components: {
    XInput, XTextarea, XButton, Selector, Flexbox, FlexboxItem,
    Group, Cell, Box, Toast, InlineXNumber, PopupRadio
  },
  data () {
    return {
      orderId: "",
      edit: false,
      order: {
        number: 1,
        goods: [
          {
            show: true,
            goodsId: "",
            goodsName: "1",
            unit: "",
            purchasePrice: 0,
            sellPrice: 0,
            quantity: 1,
          }
        ],
        totalSellPrice: 0,
        custom: {
            id: "",
            weixin:"",
            phone:"", 
            receiver:"", 
            address:"", 
            postcode:""
        }
      }
    }
  },
  props: {},
  watch: {},
  methods: {
    checkInput() {
        for (let g of this.order.goods) {
          if (g.goodsId == "" ) {
             this.showToast("warn", "请输入完整商品信息")
             return false
          }
        }
        if (this.order.custom.id == "") {
             this.showToast("warn", "请输入完整客户信息")
             return false
        }
        return true
    },
    doSave() {
        if (!this.checkInput()) {
          return
        }
        let url = "/users/"+ this.$lstore.userId() + "/orders"
        this.$rest.post(url, this.order).then(res => {
          this.showToast("success", "增加订单信息成功")
          this.$router.push({path: '/orders/list'})
        }).catch(res => {
          //console.log("save order failed, ", res)
          this.showToast("warn", "增加订单信息失败")
        })
    },
    doGet() {
      let url = "/users/"+ this.$lstore.userId() + "/orders/" + this.orderId
      this.$rest.get(url).then(res => {
        this.order = res.data
        this.order.number = this.order.goods.length
        for (let g of this.order.goods) {
          g.show = true
        }
        this.order.custom.show = true
      }).catch(e => {
        this.showToast("warn", "查询信息失败")
        router.push({path: '/orders/list'})
      })
    },
    doEdit() {
      if (!this.checkInput()) {
        return
      } 
      let url = "/users/"+ this.$lstore.userId() + "/orders/" + this.orderId
      this.$rest.put(url,this.order).then(res => {
        this.showToast("success", "更新订单信息成功")
        this.$router.push({path: '/orders/list'})
      }).catch(res => {
        //console.log("save order failed, ", res)
        this.showToast("warn", "更新订单信息失败")
      })
    },
    selectCustom (id) {
      id = parseInt(id)
      for (let it of this.optCustoms.data) {
         if (it.id == id) {
           this.order.custom = it
           return
         }
      }
    },
    selectGoods (idx, id) {
      id = parseInt(id)
      for (let it of this.optGoods.data) {
         if (it.id == id) {
           this.order.goods[idx].purchasePrice = it.purchasePrice
           this.order.goods[idx].sellPrice = it.sellPrice
           this.order.goods[idx].goodsName = it.name
           this.order.goods[idx].unit = it.unit
           break
         }
      }
      this.calcTotalPrice()
    },
    calcTotalPrice () {
      let total = 0
      for (let it of this.order.goods) {
        it.purchasePrice = parseFloat(it.purchasePrice)
        it.sellPrice = parseFloat(it.sellPrice)
        it.quantity = parseInt(it.quantity)
        total += it.sellPrice * it.quantity
      }
     
      this.order.totalSellPrice = total.toFixed(2)
    },
    chgQuantity (value) {
      this.calcTotalPrice()
    },
    chgNumber (value) {
      let len = this.order.goods.length
      if (value > len) {
        this.order.goods.push( {
            show: true,
            goodsId: "",
            goodsName: value, 
            purchasePrice: 0,
            sellPrice: 0,
            quantity: 1,
          })
      } else if (value < len) {
          this.order.goods.splice(len-1,1) 
      }
    }
  },
  filters: {},
  computed: {},
  created () {
    this.$isLogin()
    this.cacheCustoms()
    this.cacheGoods()

    // from edit
    let rp = this.$route.path
    if (rp.startsWith("/orders/edit")) {
      this.orderId = this.$route.params.id
      if (this.orderId != undefined && this.orderId != "") {
        this.edit = true
        this.doGet()
      }
    }
  },
  mounted () {
    let _this = this
    // from custom page
    let customId = parseInt(this.$route.query.customId)
    if (customId != NaN) {
      let tid = setInterval(() => {
        if (_this.optCustoms.data.length != 0) {
          _this.order.custom.id = customId
          clearInterval(tid)
        }
      }, 10)  
    }

    // from goods page
    let goodsId = parseInt(this.$route.query.goodsId)
    if (goodsId != NaN ) {
      let tid = setInterval(() => {
        if (_this.optGoods.data.length != 0) {
          _this.order.goods[0].goodsId = goodsId
          clearInterval(tid)
        }
      }, 10)
    }
  },
  destroyed () {}
}
</script>

<style scoped>
.radio-slot {
  text-align: center;
  padding: 8px 0;
  color: #888;
}
</style>
