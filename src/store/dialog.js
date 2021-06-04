export default {
  namespaced: true,
  state: {
    status: false,
  },
  mutations: {
    set: (state, payload) => {
      state.status = payload.status
    },
  },
  actions: {
    set: ({ commit }, payload) => {
      commit('set', payload)
    },
  },
  getters: {
    status: state => state.status,
  }
} 