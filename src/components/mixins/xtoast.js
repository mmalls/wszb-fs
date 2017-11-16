export default {
  data () {
    return {
      toast: {
        show: false,
        msg: "",
        type: "warn"
      }
    }
  },
  methods: {
    showToast(type, msg) {
      this.toast.show = true
      this.toast.msg = msg
      this.toast.type = type
    },
    doEdit(path, id) {
      this.$router.push({path: ''+path+id})
    }
  }
}
