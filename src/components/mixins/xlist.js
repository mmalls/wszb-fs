export default {
    data () {
      return {
        optChannels: { options:[], data: [] },
        optCustoms: { options:[], data: [] },
        optGoods: { options:[], data: [] }
      }
    },
    methods: {
        cacheChannels() {
            let url = "/users/" + this.$lstore.userId() + "/channels";
            this.$rest.get(url).then(res => {
                //console.log("get channels res, ", res.data)
                let cs = [];
                res.data.channels.forEach(it => {
                    let c = { key: it.id, value: it.name };
                    cs.push(c);
                });
                this.optChannels.options = cs;
                this.optChannels.data = res.data.channels
                //console.log("channels, ", this.optChannels)
            }).catch(e => {
                console.log("get channels failed, ", e)
            })
            return this.optChannels
        },
        cacheCustoms() {
            let url = "/users/" + this.$lstore.userId() + "/customs";
            this.$rest.get(url).then(res => {
                //console.log("get customs res, ", res.data)
                let cs = [];
                res.data.customs.forEach(it => {
                    let c = { key: it.id, value: it.weixin };
                    cs.push(c);
                });
                this.optCustoms.options = cs;
                this.optCustoms.data = res.data.customs
                //console.log("customs, ", this.channels)
            }).catch(e => {
                console.log("get customs failed, ", e)
            })
            return this.optCustoms
        },
        cacheGoods() {
            let url = "/users/" + this.$lstore.userId() + "/goods";
            this.$rest.get(url).then(res => {
                //console.log("get goods res, ", res.data)
                let cs = [];
                res.data.goods.forEach(it => {
                    let c = { key: it.id, value: it.name };
                    cs.push(c);
                });
                this.optGoods.options = cs;
                this.optGoods.data = res.data.goods
                //console.log("goods, ", this.channels)
            }).catch(e => {
                console.log("get goods failed, ", e)
            })
            return this.optGoods
        }
    }
  }