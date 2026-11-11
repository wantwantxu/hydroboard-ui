
import '@/mock'

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import { initFlexible } from '@/utils/flexible'
import '@/assets/css/reset.scss'
import '@/theme/index.css'
import '@/assets/css/mixin.scss'
import 'leaflet/dist/leaflet.css'
import './assets/css/map.scss'
import './assets/css/popbox.scss'
import $api from '@/api/index'
import JsonExcel from 'vue-json-excel'
import './permission'
import store from './store'
import lottie from 'vue-lottie'
import drag from './directive/drag'
import * as eCharts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markLine'

window.eventBus = new Vue()
initFlexible()

Vue.config.productionTip = true
Vue.config.errorHandler = (err, vm, info) => {
  window.__e = window.__e || []
  window.__e.push('VUE:' + (err && err.message) + ' @' + info)
}
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'medium' }
Vue.prototype.$eCharts = eCharts
Vue.prototype.$api = $api
Vue.component('downloadExcel', JsonExcel)
Vue.component('lottie', lottie)
Vue.directive('drag', drag)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
