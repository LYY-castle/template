import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

// const response = JSON.parse(sessionStorage.getItem('getMenu'))
// const routers = []
/* 动态设置hadden即可 */

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/', redirect: '/login' },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'index',
      // redirect: '/workbench/agent',
      component: () => import('@/views/dashboard/index')
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const baseRouter = []
if (sessionStorage.getItem('getMenu')) {
  const data = JSON.parse(sessionStorage.getItem('getMenu')).data
  for (let i = 0; i < data.length; i++) {
    const children = []
    baseRouter[i] = {}
    baseRouter[i].path = '/workbench' + i
    baseRouter[i].component = Layout
    baseRouter[i].name = 'workbench' + i
    baseRouter[i].redirect = baseRouter[i].path + '/' + data[i].sub_menus[0].template
    baseRouter[i].meta = {
      title: data[i].parent_menu_name, icon: 'example'
    }
    for (let j = 0; j < data[i].sub_menus.length; j++) {
      children[j] = {}
      children[j].path = data[i].sub_menus[j].template
      children[j].name = data[i].sub_menus[j].template
      children[j].meta = {
        title: data[i].sub_menus[j].title,
        icon: 'user'
      }
      children[j].component = () => import('@/views/table/index')
    }
    baseRouter[i].children = children
  }
}

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(baseRouter)
})

