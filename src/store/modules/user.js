import { getToken, setToken } from '@/utils/token'
import { DEMO_USER } from '@/mock/data/portal'

const state = {
  token: getToken() || 'demo-token',
  userInfo: DEMO_USER
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    setToken(token)
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  async getUserInfo({ commit }) {
    commit('SET_USER_INFO', DEMO_USER)
    return DEMO_USER
  }
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
