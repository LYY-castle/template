import Vue from 'vue'
import Router from 'vue-router'
import getDynamicRouter from './dynamic-router'
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
  {
    path: '/category',
    component: Layout,
    // redirect: '/dashboard/index',
    name: 'Category',
    hidden: true,
    children: [{
      path: 'categoryChild/:id(\\d+)',
      component: () => import('@/views/example/edit'),
      name: 'CategoryChild',
      meta: { title: '选项管理' },
      hidden: true
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const baseRouter = getDynamicRouter()
// if (sessionStorage.getItem('getMenu') && JSON.parse(sessionStorage.getItem('getMenu')).data) {
//   const data = JSON.parse(sessionStorage.getItem('getMenu')).data
//   console.log(data, 'data in router')
//   for (let i = 0; i < data.length; i++) {
//     const children = []
//     baseRouter[i] = {}
//     baseRouter[i].path = '/workbench' + i
//     baseRouter[i].component = Layout
//     baseRouter[i].name = 'workbench' + i
//     baseRouter[i].redirect = baseRouter[i].path + '/' + data[i].sub_menus[0].template
//     baseRouter[i].meta = {
//       title: data[i].parent_menu_name, icon: 'example'
//     }
//     for (let j = 0; j < data[i].sub_menus.length; j++) {
//       children[j] = {}
//       children[j].path = data[i].sub_menus[j].template
//       children[j].name = data[i].sub_menus[j].template
//       children[j].meta = {
//         title: data[i].sub_menus[j].title,
//         icon: 'user'
//       }
//       children[j].component = () => import('@/views/' + data[i].sub_menus[j].template.substring(0, data[i].sub_menus[j].template.length - 5) + '/index')
//     }
//     baseRouter[i].children = children
//     if (baseRouter[i].children.length === 1) {
//       baseRouter[i].alwaysShow = true
//     }
//   }
// }

// export const asnyRouter = [
//   {
//     path: '/workbench',
//     component: Layout,
//     redirect: '/workbench/agent',
//     name: 'workbench',
//     // hidden: true,
//     meta: { title: '工作平台', icon: 'example' },
//     children: [
//       {
//         path: 'agent',
//         name: 'agent',
//         // hidden: true,
//         component: () => import('@/views/table/index'),
//         meta: { title: '坐席工作台', icon: 'user' }
//       },
//       {
//         path: 'team',
//         name: 'team',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '团队长工作台', icon: 'user' }
//       },
//       {
//         path: 'inspectorWorkbench',
//         name: 'inspectorWorkbench',
//         component: () => import('@/views/table/index'),
//         meta: { title: '质检员工作台', icon: 'user' }
//       },
//       {
//         path: 'inspectorLeader',
//         name: 'inspectorLeader',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '质检队长工作台', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/hemanResoruce',
//     component: Layout,
//     redirect: '/hemanResoruce/organize',
//     name: 'hemanResoruce',
//     // hidden: true,
//     meta: { title: '人资管理', icon: 'example' },
//     children: [
//       {
//         path: 'organize',
//         name: 'organize',
//         component: () => import('@/views/table/index'),
//         meta: { title: '组织管理', icon: 'user' }
//       },
//       {
//         path: 'employee',
//         name: 'employee',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '员工管理', icon: 'user' }
//       },
//       {
//         path: 'systemAccount',
//         name: 'systemAccount',
//         component: () => import('@/views/table/index'),
//         meta: { title: '系统账号', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/fieldDirector',
//     component: Layout,
//     redirect: '/fieldDirector/manageRoster',
//     name: 'fieldDirector',
//     // hidden: true,
//     meta: { title: '现场主管', icon: 'example' },
//     children: [
//       {
//         path: 'manageRoster',
//         name: 'manageRoster',
//         component: () => import('@/views/table/index'),
//         meta: { title: '名单管理', icon: 'user' }
//       },
//       {
//         path: 'activityManagement',
//         name: 'activityManagement',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '活动管理', icon: 'user' }
//       },
//       {
//         path: 'summaryManagement',
//         name: 'summaryManagement',
//         component: () => import('@/views/table/index'),
//         meta: { title: '小结管理', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/teamLeader',
//     component: Layout,
//     redirect: '/teamLeader/listAllocation',
//     name: 'teamLeader',
//     // hidden: true,
//     meta: { title: '团队长', icon: 'example' },
//     children: [
//       {
//         path: 'listAllocation',
//         name: 'listAllocation',
//         component: () => import('@/views/table/index'),
//         meta: { title: '名单分配', icon: 'user' }
//       },
//       {
//         path: 'listRecovery',
//         name: 'listRecovery',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '名单回收', icon: 'user' }
//       },
//       {
//         path: 'listMonitoringPeople',
//         name: 'listMonitoringPeople',
//         component: () => import('@/views/table/index'),
//         meta: { title: '名单监控(人)', icon: 'user' }
//       },
//       {
//         path: 'listMonitoringGroup',
//         name: 'listMonitoringGroup',
//         component: () => import('@/views/table/index'),
//         meta: { title: '名单监控(组)', icon: 'user' }
//       },
//       {
//         path: 'listMonitoringList',
//         name: 'listMonitoringList',
//         component: () => import('@/views/table/index'),
//         meta: { title: '名单监控(名单)', icon: 'user' }
//       },
//       {
//         path: 'callMonitorPeople',
//         name: 'callMonitorPeople',
//         component: () => import('@/views/table/index'),
//         meta: { title: '电话监控(人)', icon: 'user' }
//       },
//       {
//         path: 'callMonitorGroup',
//         name: 'callMonitorGroup',
//         component: () => import('@/views/table/index'),
//         meta: { title: '电话监控(组)', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/ordinarySeat',
//     component: Layout,
//     redirect: '/ordinarySeat/dialing',
//     name: 'ordinarySeat',
//     // hidden: true,
//     meta: { title: '普通坐席', icon: 'example' },
//     children: [
//       {
//         path: 'dialing',
//         name: 'dialing',
//         component: () => import('@/views/table/index'),
//         meta: { title: '拨打任务', icon: 'user' }
//       },
//       {
//         path: 'orderManagement',
//         name: 'orderManagement',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '订单管理', icon: 'user' }
//       },
//       {
//         path: 'contactHistory',
//         name: 'contactHistory',
//         component: () => import('@/views/table/index'),
//         meta: { title: '接触历史', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/QCLeader',
//     component: Layout,
//     redirect: '/QCLeader/scoreManagement',
//     name: 'QCLeader',
//     // hidden: true,
//     meta: { title: '质检主管', icon: 'example' },
//     children: [
//       {
//         path: 'scoreManagement',
//         name: 'scoreManagement',
//         component: () => import('@/views/table/index'),
//         meta: { title: '评分表管理', icon: 'user' }
//       },
//       {
//         path: 'activityQuality',
//         name: 'activityQuality',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '活动与质检', icon: 'user' }
//       },
//       {
//         path: 'qualityInspectionManagement',
//         name: 'qualityInspectionManagement',
//         component: () => import('@/views/table/index'),
//         meta: { title: '质检任务管理', icon: 'user' }
//       },
//       {
//         path: 'qualityInspectionDistribution',
//         name: 'qualityInspectionDistribution',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '质检任务分配', icon: 'user' }
//       },
//       {
//         path: 'qualityInspectionRecovery',
//         name: 'qualityInspectionRecovery',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '质检任务回收', icon: 'user' }
//       },
//       {
//         path: 'qualityInspectionMonitorG',
//         name: 'qualityInspectionMonitorG',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '质检任务监控(组)', icon: 'user' }
//       },
//       {
//         path: 'qualityInspectionMonitorP',
//         name: 'qualityInspectionMonitorP',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '质检任务监控(人)', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/inspector',
//     component: Layout,
//     redirect: '/inspector/qualityScore',
//     name: 'inspector',
//     // hidden: true,
//     meta: { title: '质检员', icon: 'example' },
//     children: [
//       {
//         path: 'qualityScore',
//         name: 'qualityScore',
//         component: () => import('@/views/table/index'),
//         meta: { title: '质检评分', icon: 'user' }
//       },
//       {
//         path: 'queryQualityScore',
//         name: 'queryQualityScore',
//         component: () => import('@/views/tree/index'),
//         meta: { title: '查询质检评分(质)', icon: 'user' }
//       }
//     ]
//   },
//   {
//     path: '/revisePass',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         name: 'revisePass',
//         component: () => import('@/views/form/index'),
//         meta: { title: '修改密码', icon: 'form' }
//       }
//     ]
//   }
// ]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(baseRouter)
})

