
import store from '../index'
import Api from '@/api'
import {getToken, removeToken, setToken} from '@/utils/token'
import {removeAllCookies} from '@/utils/token';

export default {
  clearAll() {
    removeAllCookies()
    localStorage.clear()
  },
  getUserInfo() {
    return store.getters['user/userInfo'] || {}
  },

  getMenus() {
    return store.getters['menu/menus'] || []
  },

  getDict(dictKey) {
    const dicts = store.getters['dict/dicts'] || {}
    return dicts[dictKey] || []
  },
  getAllDicts() {

    let dicts = store.getters['dict/dicts']
    if (!dicts || !Object.keys(dicts).length) {
      return store.dispatch('dict/getDictList').then(() => this.applyPortalConfigToDicts())
    }
    return Promise.resolve(this.applyPortalConfigToDicts())
  },

  applyPortalConfigToDicts() {
    const dicts = store.getters['dict/dicts'] || {}
    const pc = window.portalConfig || {}
    const merged = { ...dicts }
    Object.keys(pc).forEach((k) => {
      if (merged[k] === undefined) {
        merged[k] = [{ value: pc[k] }]
      }
    })
    window.dicts = Object.freeze(merged)
    window.dict = window.dicts
    return merged
  },

  getPortalConfig() {
    const config = store.state.dict.portalConfig || {}
    window.portalConfig = config
    return config
  },

  getPortalConfigValue(key, defaultValue) {
    const config = this.getPortalConfig()
    const val = config[key]
    return val === undefined || val === null || val === '' ? defaultValue : val
  },

  async loadPortalData() {

    const portalRaw = await Api.portalInit('hydroboard')
    const portalData = portalRaw.result || portalRaw

    if (portalData.userInfo) {
      store.commit('user/SET_USER_INFO', portalData.userInfo)
    }

    window.userMenus = portalData.menus || []
    store.commit('menu/SET_MENUS', portalData.menus || [])

    window.layerTree = portalData.layerTree || []

    if (portalData.portalConfig) {
      window.portalConfig = portalData.portalConfig
    }

    window.baseLayers = portalData.baseLayers || []

    this.applyPortalConfigToDicts()
  },
  async initDevApp() {

    const userInfo = store.getters['user/userInfo']
    if (!userInfo || !userInfo.id) {
      await store.dispatch('user/getUserInfo')
    }

    const dicts = store.getters['dict/dicts'] || {}
    if (Object.keys(dicts).length === 0) {
      await store.dispatch('dict/getDictList')
    }

    await store.dispatch('dict/getPortalConfig')

    try {
      if (!(window.userMenus && window.userMenus.length)) {
        await this.loadPortalData()
      }
    } catch (e) {
      console.warn('开发环境门户数据加载失败（可忽略）', e)
    }
  },
  async initApp(code) {
    try {
      const clientId = process.env.OAUTH_CLIENT_ID || 'rbjoint'
      const res = await Api.getToken({clientId, code: code})

      let obj
      try {
        obj = JSON.parse(res.result)
      } catch (parseError) {
        throw new Error(`token解析失败: ${parseError.message}`)
      }

      if (!obj.access_token) {
        throw new Error('接口未返回有效的access_token')
      }
      removeToken()
      setToken(obj.access_token)

      await this.loadPortalData()

      const dicts = store.getters['dict/dicts'] || {}
      if (Object.keys(dicts).length === 0) {
        await store.dispatch('dict/getDictList')
      }

    } catch (error) {
      console.error('生产环境初始化失败:', error)
      removeToken()
      throw error
    }
  }
}
