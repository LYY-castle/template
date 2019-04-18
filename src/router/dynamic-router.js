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
    menu.path = menu.value ? `/${menu.value}` : '/'
    menu.component = parentMenu ? (menu.value ? () => import('@/views/' + menu.value + '/index') : null) : Layout
    menu.hidden = menu.status === '0'
    menu.meta = {
      title: menu.name,
      icon: menu.icon
    }
    menu.level = S(menu.idPath).count('/') - 1
    menu.alwaysShow = menu.value ? true : (menu.children && menu.children.length)
  }
  const fillRecursiveRoutersFromMenus = (menus, parentMenu) => {
    menus.forEach(menu => {
      getRouterForMenu(menu, parentMenu)
      if (menu.children && menu.children.length) {
        fillRecursiveRoutersFromMenus(menu.children, menu)
      }
    })
  }

  fillRecursiveRoutersFromMenus(menuRawData)

  return menuRawData
}
