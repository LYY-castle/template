import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/styles/icofont/icofont.min.css' // icon font

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/theme.scss' // 主题

import App from './App'
import router from './router'
import store from './store'
import VueDND from 'awe-dnd'//拖拽
import { emoji, emoji1 } from './components/Emotion3/emoji.js'
Vue.prototype.emoji = emoji
Vue.prototype.emoji1 = emoji1
Vue.use(VueDND)

import '@/icons' // icon
// import '@/permission' // permission control
ElementUI.TableColumn.props.resizable.default = false
ElementUI.TableColumn.props.resizable.default = false
ElementUI.TableColumn.props.showOverflowTooltip = { type: Boolean, default: true }
ElementUI.Table.props.maxHeight = { type: String, default: '450' }
ElementUI.Select.props.filterable = { type: Boolean, default: true }
ElementUI.Button.props.size = { type: String, default: 'small' }
ElementUI.Form.props.size = { type: String, default: 'small' }

Vue.use(ElementUI, { locale })
Vue.use(VueQuillEditor)
Vue.use(VuePlyr)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue(),
    theme: ''
  },
  mounted() {
    const themeType = localStorage.getItem(localStorage.getItem('agentId') + 'theme')
    if (themeType === 'theme1') {
      this.theme = 'styles/theme1.scss'
    } else if (themeType === 'theme2') {
      this.theme = 'styles/theme2.scss'
    }
  }
})
// 路由跳转后返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
