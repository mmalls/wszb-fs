<template>
  <div class="goods_add">
    <group title="录入商品信息">
      <x-input title="商品名称" v-model="goods.name" placeholder="请输入商品名称 " :required="true"></x-input>
       <flexbox>
        <flexbox-item :span="8">
          <popup-radio title="进货渠道" placeholder="请选择进货渠道" v-model="goods.channelId" :options="optChannels.options" >
            <p slot="popup-header" class="vux-1px-b radio-slot">请选择进货渠道</p>
          </popup-radio></flexbox-item>
        <flexbox-item > 
          <x-button link="/channels/add"><i class="fa fa-plus-circle" ></i>新渠道</x-button>
        </flexbox-item>
      </flexbox>      
      <x-input title="商品种类" v-model="goods.catalog" placeholder="请输入种类">  
        </x-input>
      <popup-radio title="单位" placeholder="请选择商品单位" v-model="goods.unit" :options="units" >
            <p slot="popup-header" class="vux-1px-b radio-slot">请选择商品单位</p>
          </popup-radio>
      <x-input title="进价" v-model.number="goods.purchasePrice" placeholder="请输入进价" :required="true"  keyboard="number" type="number"></x-input>
      <x-input title="售价" v-model.number="goods.sellPrice" placeholder="请输入售价" :required="true"  keyboard="number" type="number"></x-input>
      <x-textarea :max="200" title="备注" v-model="goods.intro"  name="intro" placeholder="请输入备注地址"></x-textarea>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="doEdit" v-if="edit">更新</x-button>
        <x-button type="primary" @click.native="doSave" v-else >保存</x-button>
      </box>
    </group>
   <toast v-model="toast.show" :type="toast.type" :time="800" is-show-mask  position="middle">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import {
  XInput, XTextarea, Group, Cell, PopupRadio,
  XButton, Box, Toast, Flexbox,
  FlexboxItem, Checker, CheckerItem
} from "vux"
import xtoast from '@/components/mixins/xtoast.js'
import xlist from '@/components/mixins/xlist.js'

export default {
  mixins: [xtoast, xlist],
  components: {
    XInput, XTextarea, XButton, PopupRadio,
    Cell, Group, Box, Toast,
    Flexbox, FlexboxItem, Checker, CheckerItem
  },
  data() {
    return {
      goodsId: "",
      readonly: false,
      edit: false,
      goods: {
        name: "",
        channelId: 0,
        catalog: "",
        purchasePrice: 0,
        sellPrice: 0,
        unit: "",
        intro: ""
      },
      units:[ 
        { key: '件', value: '件' },
        { key: '箱', value: '箱' },
        { key: '包', value: '包' },
        { key: '斤', value: '斤' },
        { key: '两', value: '两' }
      ]
    };
  },
  props: {},
  watch: {},
  methods: {
    checkInput() {
      this.goods.purchasePrice = parseFloat(this.goods.purchasePrice)
      this.goods.sellPrice = parseFloat(this.goods.sellPrice)
      if (this.goods.name == "" || this.goods.channelId == 0 || this.goods.purchasePrice == 0|| this.goods.sellPrice == 0 ) {
        this.showToast("warn", "请输入完整信息")
        return false
      }
      return true;
    },
    doSave() {
      if (!this.checkInput()) {
        return;
      }
      let url = "/users/" + this.$lstore.userId() + "/goods";
      this.$rest.post(url, this.goods).then(res => {
          this.showToast("success", "增加商品信息成功");
          this.$router.push({ path: "/goods/list" });
        })
        .catch(res => {
          //console.log("save goods failed, ", res)
          this.showToast("warn", "增加商品信息失败");
        });
    },
    doGet() {
      let url = "/users/" + this.$lstore.userId() + "/goods/" + this.goodsId;
      this.$rest
        .get(url)
        .then(res => {
          this.goods = res.data;
          //console.log("get goods, ", this.goods)
          this.readonly = true;
        })
        .catch(e => {
          this.showToast("warn", "查询商品信息失败");
          router.push({ path: "/goods/list" });
        });
    },
    doEdit() {
      if (!this.checkInput()) {
        return;
      }
      let url = "/users/" + this.$lstore.userId() + "/goods/" + this.goodsId;
      this.$rest.put(url, this.goods).then(res => {
          this.showToast("success", "更新商品信息成功");
          this.$router.push({ path: "/goods/list" });
        })
        .catch(res => {
          //console.log("save goods failed, ", res)
          this.showToast("warn", "更新商品信息失败");
        });
    }
  },
  filters: {},
  computed: {},
  created() {
    this.$isLogin();
    this.cacheChannels();
    let rp = this.$route.path;
    //console.log("url path:", rp)
    if (rp.startsWith("/goodss/edit")) {
      this.goodsId = this.$route.params.id;
      if (this.goodsId != undefined && this.goodsId != "") {
        this.edit = true;
        this.doGet();
      }
    }
  },
  mounted() {
    let _this = this
    // from channel page
    let channelId = parseInt(this.$route.query.channelId)
    if (channelId != NaN ) {
      let tid = setInterval(() => {
        if (_this.optChannels.data.length != 0) {
          _this.goods.channelId = channelId
          clearInterval(tid)
        }
      }, 10)
    }
  },
  destroyed() {}
};
</script>

<style scoped>
.radio-slot {
  text-align: center;
  padding: 8px 0;
  color: #888;
}
</style>