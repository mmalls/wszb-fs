export default {
  data () {
    return {
      delcnf: {
        show: false ,
        id: ""
      }
    }
  },
  methods: {
    cnfDelete(id) {
      //console.log('cnfDelete from mixin')
      this.delcnf.show = true
      this.delcnf.id = id
    }
  }
}