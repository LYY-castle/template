import Cookies from 'js-cookie'
import cti from '@/utils/monitorcti_m'

const app = {
  state: {
    menu: [],
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    msgNum_wechat: null,
    wechat_contents: [],
    wechat_customerInfos: [],
    formContainer: function() {
      $('.el-collapse-item__header.is-active').append(`
        <span class="form-more" style="float:right;margin-right:6px;color:#57AFFF;font-weight:normol;">收起</span>
      `)
    }
  },
  mutations: {
    CHANGE_WECHATMSG: (state, count) => {
      state.msgNum_wechat = count
    },
    SET_WECHATCUSTOMERINFO: (state, customerInfos) => {
      state.wechat_customerInfos = customerInfos
    },
    SET_WECHATCONTENTS: (state, contents) => {
      state.wechat_contents = contents
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
        sessionStorage.setItem('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
        sessionStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    OPEN_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = true
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    LOGIN_MGR_PHONE: (state, { monitorID, monitorDN }) => {
      if (state.needLoginMgrPhone) {
        // 1. 引入登录班长坐席号码的方法.
        // 2. 在此处调用登录班长坐席号码方法.
        cti.login('100' + monitorID, monitorDN)
      }
    },
    SWITCH_NEED_LOGIN_MGR_PHONE: state => {
      state.needLoginMgrPhone = !state.needLoginMgrPhone
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetMenu({ commit }, menu) {
      commit('SET_MENU', menu)
    },
    LoginMgrPhone({
      commit
    }, { monitorID, monitorDN }) {
      commit('LOGIN_MGR_PHONE', { monitorID, monitorDN })
    },
    SwitchNeedLoginMgrPhone({
      commit
    }) {
      commit('SWITCH_NEED_LOGIN_MGR_PHONE')
    }
  }
}

export default app
