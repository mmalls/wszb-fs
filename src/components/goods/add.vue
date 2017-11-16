<template>
  <div class="goods_add">
    <group title="录入商品信息">
      <x-input title="商品名称" v-model="goods.name" placeholder="请输入商品名称 " :required="true"></x-input>
       <flexbox>
        <flexbox-item :span="9">
          <selector title="进货渠道" placeholder="请选择进货渠道" v-model="goods.channelId" :options="channels" >
          </selector></flexbox-item>
        <flexbox-item > 
          <x-button link="/channels/add"><i class="fa fa-plus-circle" ></i>新增</x-button>
        </flexbox-item>
      </flexbox>      
      <x-input title="商品种类" v-model="goods.catalog" placeholder="请输入种类">  
        </x-input>
      <x-input title="进价" v-model="goods.purchasePrice" placeholder="请输入进价" :required="true"  keyboard="number" type="number"></x-input>
      <x-input title="卖价" v-model="goods.sellPrice" placeholder="请输入卖价" :required="true"  keyboard="number" type="number"></x-input>
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
  XInput,
  XTextarea,
  Group,
  Cell,
  Selector,
  XButton,
  Box,
  Toast,
  Flexbox,
  FlexboxItem,
  Checker,
  CheckerItem
} from "vux"
import xtoast from '@/components/mixins/xtoast.js'

export default {
  mixins: [xtoast],
  components: {
    XInput,
    XTextarea,
    XButton,
    Selector,
    Cell,
    Group,
    Box,
    Toast,
    Flexbox,
    FlexboxItem,
    Checker,
    CheckerItem
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
        intro: ""
      },
      channels: []
    };
  },
  props: {},
  watch: {},
  methods: {
    checkInput() {
      this.goods.purchasePrice = parseFloat(this.goods.purchasePrice)
      this.goods.sellPrice = parseFloat(this.goods.sellPrice)
      if (this.goods.name == "" || this.goods.channelId == 0 || this.goods.purchasePrice == 0|| this.goods.sellPrice == 0 ) {
        this.showToast("warn", "请输入完整信息");
        return false;
      }
      return true;
    },
    doSave() {
      if (!this.checkInput()) {
        return;
      }
      let url = "/users/" + this.$lstore.userId() + "/goods";
      this.$rest
        .post(url, this.goods)
        .then(res => {
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
    },
    listChannels() {
      let _t = this;
      let url = "/users/" + this.$lstore.userId() + "/channels";
      this.$rest
        .get(url)
        .then(res => {
          //console.log("get channels res, ", res.data)
          let cs = [];
          res.data.channels.forEach(it => {
            let c = { key: it.id, value: it.name };
            cs.push(c);
          });
          this.channels = cs;
          //console.log("channels, ", this.channels)
        })
        .catch(e => {
          //console.log("get channels failed, ", e)
          //this.showToast("warn", "获取渠道商列表失败")
        });
    }
  },
  filters: {},
  computed: {},
  created() {
    this.$isLogin();
    this.listChannels();
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
  mounted() {},
  destroyed() {}
};
</script>

<style scoped>

</style>