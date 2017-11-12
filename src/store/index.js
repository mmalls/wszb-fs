import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  isLoading: false,
  direction: 'forward'
}

export default new Vuex.Store({
  state,
  mutations: {
    UPDATE_LOADING (state, status) {
      state.isLoading = status
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    }
  },
  getters: {
    route: (state) => state.route,
    isLoading: (state) => state.isLoading,
    direction: (state) => state.direction
  }
})