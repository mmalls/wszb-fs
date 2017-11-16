const pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQwdeQ8CKeRMYYhjPl6Kv563y/
zj2pj85qBU0EKc7rPRA+t8mgH2Jd8+3CRPNPlBzioX1PMjuq+POu4VOeFJwCLnAj
e7p3zdqD7hSLl1jpz7AOSwhLAyqFYNIs76BID9fzwApNZObEdiOtj6M/py9/0Uvm
9fd1N4SgqFgNpunIMwIDAQAB
-----END PUBLIC KEY-----`

import jwt from 'jsonwebtoken'

let store = {
    // 存储 localstorage
    setLocalstorage (id, key, value) {
      var s = window.localStorage.getItem(id)
      if (!s) {
        s = {}
      } else {
         s = JSON.parse(s)
      }
      /*console.log(s, key, value)*/
      s[key] = '' + value
      window.localStorage.setItem(id, JSON.stringify(s))
    },
  
    // 获取 localstorage
    getLocalstorage (id, key, def) {
      let s = window.localStorage.getItem(id)
      if (!s) {
        return def
      }
  
      let m = JSON.parse(s)
      if (!m) {
        return def
      }
  
      return m[key] || def
    },
  
    // 删除单个数据 localstorage
    removeLocalstorage (id, key) {
      let s = window.localStorage.getItem(id)
      if (!s) {
        return 
      }

      let m = JSON.parse(s)
      if (m && m[key]) {
        delete s[key]
      }

      window.localStorage.setItem(id, JSON.stringify(m))
    },

    saveUserInfo (userInfo) {
      console.log("saveUserInfo:", userInfo)
      this.setLocalstorage("wszb", "userId", userInfo.user.id)
      this.setLocalstorage("wszb", "token", userInfo.token)
    },

    cleanUserInfo() {
      this.removeLocalstorage("wszb", "userId")
      this.removeLocalstorage("wszb", "token")
    },

    userId () {
      return this.getLocalstorage("wszb", "userId", "")
    },

    token () {
      return this.getLocalstorage("wszb", "token", "")
    }, 

    isLogin() {
      if (this.userId() == "" ) {
        return false
      }

      try {
        jwt.verify(this.token(), pubKey)
        return true
      }catch (e) {
        this.cleanUserInfo()
        //console.log("verify :" , e)
        return false
      }
    }
  }

  export default store