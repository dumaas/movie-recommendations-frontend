import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'
import sampleData from './sampleData.js'

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      users: sampleData,
    }
  },
  mutations,
  actions,
  getters,
}