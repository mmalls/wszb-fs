export default {
    data () {
      return {
      }
    },
    methods: {
      showToast(type, msg) {
        this.$vux.toast.show({
            text: msg, 
            type: type,
            time: 800
           })           
      },
      doEdit(path, id) {
        this.$router.push({path: ''+path+id})
      },
      cnfDelete(id) {
        let _t = this
        this.$vux.confirm.show({
          title: "操作提示",
          content: "确认删除？删除之后不可恢复哦！",
          onConfirm() { _t.doDelete(id) }
        })
      },
      doDelete(id) {
      }
    }
  }