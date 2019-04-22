import S from 'string'
import Layout from '../views/layout'

export default (menuData) => {
  let menuRawData = []
  if (menuData && menuData.data && menuData.data.length) {
    menuRawData = menuData.data
  } else {
    const sessionMenuData = JSON.parse(sessionStorage.getItem('getMenu')) || {}
    menuRawData = sessionMenuData.data || []
  }

  const getRouterForMenu = (menu, parentMenu) => {
    menu.level = menu.idPath ? S(menu.idPath).count('/') - 1 : 1
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
        console.log(menu)
        menu.children = [{
          path: 'index',
          name: menu.name,
          meta: { title: menu.name },
          component: menu.value ? () => import('@/views/' + menu.value + '/index') : null
        }]
      }
    })
  }

  fillRecursiveRoutersFromMenus(menuRawData)

  return menuRawData
}
