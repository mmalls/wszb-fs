import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLoading: false,
  direction: 'forward',
  channels: [],
  customs: [],
  goods: []
}

export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    },
    updateChannels(state, channels) {
      state.channels = channels
    },
    updateCustoms(state, customs) {
      state.customs = customs
    },
    updateGoods(state, goods) {
      state.goods = goods
    }
  },
  getters: {
    route: (state) => state.route,
    isLoading: (state) => state.isLoading,
    direction: (state) => state.direction,
    cacheChannels: (state) => state.channels,
    cacheCustoms: (state) => state.customs,
    cacheGoods: (state) => state.goods,
  }
})