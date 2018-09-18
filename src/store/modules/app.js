import Cookies from 'js-cookie'

const app = {
  state: {
    menu: [],
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    logoClass: 'opened'
  },
  mutations: {
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
    SET_LOGOCLASS: (state, logoClass) => {
      state.logoClass = logoClass
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
    }
  }
}

export default app
