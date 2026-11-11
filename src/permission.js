import router from './router'
import appService from '@/store/services/appService'
import store from './store'

router.onError((err) => {
  window.__trace = window.__trace || []
  window.__trace.push('router:error:' + (err && (err.message || err)))
})

router.afterEach((to) => {
  window.__trace = window.__trace || []
  window.__trace.push('router:afterEach:' + to.path + ' matched=' + to.matched.length)
})

router.beforeEach(async (to, from, next) => {
  try {
    await appService.initDevApp()
    await appService.getAllDicts()
    await store.dispatch('auth/completeAuth', true)
  } catch (e) {
    console.error('演示环境初始化失败', e)
  }
  next()
})
