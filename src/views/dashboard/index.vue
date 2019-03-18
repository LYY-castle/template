<template>
  <!-- 现场主管 -->
  <div class="dashboard">
    <div v-if="!qcdepart||!qcstaff">
      <!-- <h1 v-if="depart">现场主管</h1> -->
      <monitor-workingset v-if="depart"></monitor-workingset>
      <!-- <h1 v-if="!depart&&staff">坐席</h1> -->
      <ord-workingset v-if="!depart&&staff"></ord-workingset>
    </div>
    <div v-if="!depart||!staff">
      <!-- <h1 v-if="qcdepart">质检主管</h1> -->
      <ordqc-workingset v-if="qcdepart"></ordqc-workingset>
      <!-- <h1 v-if="!qcdepart&&qcstaff">质检员</h1> -->
      <qcmonitor-workingset v-if="!qcdepart&&qcstaff"></qcmonitor-workingset>
    </div>
  </div>
</template>

<script>
const constantRouterMap = [
  { path: '/login', component: '@/views/login/index', hidden: true },
  { path: '/404', component: '@/views/404', hidden: true },
  { path: '/', redirect: '/login' },
  {
    path: '/dashboard',
    redirect: '/dashboard/index',
    name: 'dashboard',
    hidden: true,
    children: [{
      path: 'index',
      name: 'dashboard',
      meta: { title: '首页' },
      component: '@/views/dashboard/index'
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
import { mapGetters } from 'vuex'
import monitorWorkingset from '../monitor_workingset/index'
import ordWorkingset from '../ord_workingset/index'
import ordqcWorkingset from '../ord_qc_workingset/index'
import qcmonitorWorkingset from '../qc_monitor_workingset/index'
import {
  getMenu,
  checkDepart,
  checkqcDepart,
  checkStaff,
  checkqcStaff
} from '@/api/dashboard'
// import Layout from '../layout/Layout'
import getDynamicRouter from '@/router/dynamic-router'

export default {
  name: 'dashboard',
  data() {
    return {
      show_wechat: `${process.env.SHOW_WECHAT}`,
      agentId: localStorage.getItem('agentId'),
      depart: false, // 现场主管
      qcdepart: false, // 质检主管
      staff: false, // 坐席
      qcstaff: false // 质检
    }
  },
  components: {
    monitorWorkingset,
    ordWorkingset,
    ordqcWorkingset,
    qcmonitorWorkingset
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    console.log(this.$router)
    // const promise = new Promise(resolve => {
    getMenu(localStorage.getItem('agentId')).then(response => {
      var data = response.data
      // 判断是否显示微信相关
      if (this.show_wechat === 'false') {
        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].id === 58) {
            data.data.splice(i, 1)
          } else {
            for (var j = 0; j < data.data[i].sub_menus.length; j++) {
              if (data.data[i].sub_menus[j].id === 58) {
                data.data[i].sub_menus.splice(j, 1)
              }
            }
          }
        }
      }
      // 存到session storage
      sessionStorage.setItem('getMenu', JSON.stringify(data))
      // 存到store里面
      this.$store.dispatch('SetMenu', getDynamicRouter(data))
      this.$router.addRoutes(getDynamicRouter(data))
      this.$set(this.$router.options, 'routes', getDynamicRouter(data))
      for (let i = 0; i < constantRouterMap.length; i++) {
        this.$router.options.routes.push(constantRouterMap[i])
      }
      this.$router.options.routes.concat(constantRouterMap)
      // resolve()
    }).catch(error => {
      if (error.response.status === 403) {
        sessionStorage.setItem('getMenu', '')
        this.$store.dispatch('SetMenu', [])
        this.$router.addRoutes(getDynamicRouter(''))
      }
      console.error(error)
    })
    // })
    // promise.then(() => {
    // const menu = sessionStorage.getItem('getMenu')
    // if (menu && menu.indexOf('ord_workingset') > 0) {
    //   this.$router.push({ name: 'ord_workingset' })
    // } else if (menu && menu.indexOf('ord_qc_workingset') > 0) {
    //   this.$router.push({ name: 'ord_qc_workingset' })
    // } else {
    //   console.log('没有坐席工作台和质检员工作台的页面权限')
    // }
    // })
    // 查询工号所属角色
    // axios.all([
    // 判断现场主管权限
    checkDepart(this.agentId).then(() => {
      this.depart = true
    }).catch(error => {
      if (error.response.status === 403) {
        this.depart = false
        // 判断坐席权限
        checkStaff(this.agentId).then(() => {
          this.staff = true
        }).catch(error => {
          if (error.response.status === 403) {
            this.staff = false
            // this.$message.error('您无权访问此页面')
          } else {
            throw new Error(error)
          }
        })
      } else {
        throw new Error(error)
      }
    })
    // 判断质检主管权限
    checkqcDepart(this.agentId).then(() => {
      this.qcdepart = true
    }).catch(error => {
      if (error.response.status === 403) {
        this.qcdepart = false
        // 判断质检员权限
        checkqcStaff(this.agentId).then(() => {
          this.qcstaff = true
        }).catch(error => {
          if (error.response.status === 403) {
            this.qcstaff = false
            // this.$message.error('您无权访问此页面')
          } else {
            throw new Error(error)
          }
        })
      } else {
        throw new Error(error)
      }
    })
    // ]).then(() => {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &.container{
    padding:0 10px;
    padding-top:130px;
  }
}
</style>
