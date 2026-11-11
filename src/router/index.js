

import pageHome from '../pages/home/index.vue'
import pageWarning from '../pages/warning/index.vue'
import pageRainfall from '../pages/rainfall/index.vue'
import pageWater from '../pages/water/index.vue'
import pageRadar from '../pages/radar/index.vue'
import pageSingle from '../pages/single/index.vue'
import pageForecast from '../pages/forecast/index.vue'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'active',
  linkExactActiveClass: '',
  routes: [
    {
      path: '/',
      component: pageHome
    },
    {
      path: '/index',
      component: pageHome
    },
    {
      path: '/warning',
      component: pageWarning
    },
    {
      path: '/rainfall',
      component: pageRainfall
    },
    {
      path: '/water',
      component: pageWater
    },
    {
      path: '/radar',
      component: pageRadar
    },
    {
      path: '/single',
      component: pageSingle
    },
    {
      path: '/forecast',
      component: pageForecast
    },
    {
      path: '/flood',
      redirect: '/index'
    }
  ]
})

export default router
