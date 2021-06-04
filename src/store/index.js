import Vue from 'vue'
import Vuex from 'vuex'
import alert from './alert.js'
import dialog from './dialog.js'
import auth from './auth.js'
import prevUrl from './prevUrl.js'

import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'cost-approval',
  storage: window.localStorage,
  modules: ['auth', 'prevUrl']
})

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    alert,
    dialog,
    auth,
    prevUrl,
  }
})
