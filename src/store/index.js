import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
import dict from './modules/dict'
import auth from './modules/auth';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    menu,
    dict,
    auth
  }
})
