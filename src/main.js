import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
// import '@/permission' // permission control
ElementUI.TableColumn.props.resizable.default = false
ElementUI.TableColumn.props.showOverflowTooltip = { type: Boolean, default: true }
ElementUI.Select.props.filterable = { type: Boolean, default: true }
ElementUI.Button.props.size = { type: String, default: 'small' }
Vue.use(ElementUI, { locale })
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue()
  }
})

// 路由跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
