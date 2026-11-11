import Api from "@/api";
import {isDev} from "@/utils/env";

const state = {
  menus: [],
  loaded: false
}

const mutations = {
  SET_MENUS(state, menus) {
    state.menus = menus || []
    state.loaded = true

    window.userMenus = menus || []
  }
}

const actions = {
  async getMenuList({commit}) {
    if (isDev()) {
      commit('SET_MENUS', [])
      return []
    }
    try {
      const res = await Api.listResource()
      const menus = Array.isArray(res) ? res : (res.result || res.data || [])
      commit('SET_MENUS', menus)
      return menus
    } catch (e) {
      console.error('加载菜单权限失败:', e)
      commit('SET_MENUS', [])
      return []
    }
  }
}

const getters = {
  menus: state => state.menus,
  loaded: state => state.loaded
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
