import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import dialTask from './modules/dialTask'
import theme from './modules/theme'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    user,
    dialTask,
    theme,
    needLoginMgrPhone: false
  },
  getters
})

export default store
