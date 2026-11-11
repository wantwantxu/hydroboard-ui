const state = {

  authCompleted: false,

  authSuccess: false
}

const mutations = {
  setAuthCompleted(state, success) {
    state.authCompleted = true
    state.authSuccess = success
  }
}

const actions = {

  completeAuth({ commit }, success) {
    commit('setAuthCompleted', success)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
