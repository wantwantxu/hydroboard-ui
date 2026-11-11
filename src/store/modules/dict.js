import Api from '@/api'
import { DEMO_DICTS, DEMO_PORTAL_CONFIG } from '@/mock/data/portal'

const state = {
  dicts: [],
  portalConfig: {}
}

const mutations = {
  SET_DICTS(state, dicts) {
    state.dicts = dicts
    window.dicts = dicts

    window.dict = dicts
    localStorage.setItem('dict', JSON.stringify(dicts))
  },
  SET_PORTAL_CONFIG(state, config) {
    state.portalConfig = config || {}
    window.portalConfig = state.portalConfig
    localStorage.setItem('portalConfig', JSON.stringify(state.portalConfig))
  }
}

const actions = {
  async getDictList({ commit }) {
    try {
      const dictRes = await Api.listDict()
      commit('SET_DICTS', dictRes.result || DEMO_DICTS)
    } catch (e) {
      commit('SET_DICTS', DEMO_DICTS)
    }
  },
  async getPortalConfig({ commit }) {
    try {
      const res = await Api.getPortalConfig('hydroboard')
      commit('SET_PORTAL_CONFIG', res.result || DEMO_PORTAL_CONFIG)
    } catch (e) {
      commit('SET_PORTAL_CONFIG', DEMO_PORTAL_CONFIG)
    }
  }
}

const getters = {
  dicts: state => {
    if (state.dicts && Object.keys(state.dicts).length > 0) {
      return state.dicts
    }
    const local = localStorage.getItem('dict')
    if (local) {
      try {
        const parsed = JSON.parse(local)
        state.dicts = parsed
        return parsed
      } catch (e) {
        return DEMO_DICTS
      }
    }
    return state.dicts
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
