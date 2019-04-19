import S from 'string'
import Layout from '../views/layout'

export default (menuData) => {
  let menuRawData = []
  if (menuData && menuData.data && menuData.data.length) {
    menuRawData = menuData.data
  } else {
    const sessionMenuData = sessionStorage.getItem('getMenu') && JSON.parse(sessionStorage.getItem('getMenu')).data
    menuRawData = sessionMenuData || []
  }

  const getRouterForMenu = (menu, parentMenu) => {
    menu.level = S(menu.idPath).count('/') - 1
    menu.path = menu.value ? (menu.level > 1 ? `${menu.value}` : `/${menu.value}`) : ''
    menu.component = parentMenu ? (menu.value ? () => import('@/views/' + menu.value + '/index') : () => import('@/views/empty/index')) : Layout
    menu.hidden = menu.status === '0'
    menu.meta = {
      title: menu.name,
      icon: menu.icon
    }
    menu.alwaysShow = menu.value ? true : (menu.children && menu.children.length)
    if (menu.level === 1 && menu.value) {
      menu.redirect = `${menu.value}/index`
    }
  }
  const fillRecursiveRoutersFromMenus = (menus, parentMenu) => {
    menus.forEach(menu => {
      getRouterForMenu(menu, parentMenu)
      if (menu.children && menu.children.length) {
        fillRecursiveRoutersFromMenus(menu.children, menu)
      } else if (!parentMenu) {
        menu.children = [{
          path: 'index',
          component: menu.value ? () => import('@/views/' + menu.value + '/index') : null
        }]
      }
    })
  }

  fillRecursiveRoutersFromMenus(menuRawData)

  return menuRawData
}
