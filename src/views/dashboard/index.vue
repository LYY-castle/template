<template>
  <!-- 现场主管 -->
  <div class="dashboard">
    <div v-if="!personnel">
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
      <incall-statistical :role="role" v-if="depart||staff"></incall-statistical>
    </div>
  </div>
</template>

<script>
const constantRouterMap = [
  { path: '/login', component: '@/views/login/index', hidden: true },
  { path: '/404', component: '@/views/404', hidden: true },
  { path: '/', redirect: '/login', hidden: true },
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
  {
    path: '/wechat_dial',
    redirect: '/wechat_dial/index',
    name: '微信外呼',
    children: [{
      path: 'index',
      name: '微信外呼',
      meta: { title: '微信外呼' },
      // redirect: '/workbench/agent',
      component: '@/views/wechat_dial/index'
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
import { mapGetters } from 'vuex'
import monitorWorkingset from '../monitor_workingset/index'
import ordWorkingset from '../ord_workingset/index'
import ordqcWorkingset from '../ord_qc_workingset/index'
import qcmonitorWorkingset from '../qc_monitor_workingset/index'
import incallStatistical from '../incall_statistical/index'
import {
  getMenu
} from '@/api/dashboard'
import { permsManager, permsPersonnel, permsDepart, permsStaff, permsQCDepart, permsQCStaff } from '@/api/permission'
// import Layout from '../layout/Layout'
import getDynamicRouter from '@/router/dynamic-router'

export default {
  name: 'dashboard',
  data() {
    return {
      role: '',
      show_wechat: `${process.env.SHOW_WECHAT}`,
      agentId: localStorage.getItem('agentId'),
      accountNo: localStorage.getItem('accountNo'),
      depart: false, // 现场主管
      qcdepart: false, // 质检主管
      staff: false, // 坐席
      qcstaff: false, // 质检
      personnel: false// 人事
    }
  },
  components: {
    monitorWorkingset,
    ordWorkingset,
    ordqcWorkingset,
    qcmonitorWorkingset,
    incallStatistical
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    getMenu(localStorage.getItem('accountNo')).then(response => {
      var data = response.data
      this.routerData = getDynamicRouter(data)
      // 存到session storage
      sessionStorage.setItem('getMenu', JSON.stringify(data))
      sessionStorage.setItem('dynamicRouter', JSON.stringify(this.routerData))
      // 存到store里面
      this.$store.dispatch('SetMenu', this.routerData)
      this.$router.addRoutes(this.routerData)
      this.$set(this.$router.options, 'routes', this.routerData)
      this.$router.options.routes.concat(constantRouterMap)
      console.log(this.$router)
    }).catch(error => {
      console.error(error)
    })

    //
    permsPersonnel(this.accountNo).then(response => {
      const code = parseInt(response.data.code)
      if (code === 200) {
        this.personnel = true
      } else if (code === 403) {
        this.personnel = false
        // 判断现场主管权限
        permsManager(this.accountNo).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) {
            this.depart = true
            this.role = 'depart'
          } else if (code === 403) {
            this.depart = false
            // 判断班组长权限
            permsDepart(this.accountNo).then(response => {
              const code = parseInt(response.data.code)
              if (code === 200) {
                this.depart = true
                this.role = 'depart'
              } else if (code === 403) {
                this.depart = false
                // 判断坐席权限
                permsStaff(this.accountNo).then(response => {
                  const code = parseInt(response.data.code)
                  if (code === 200) {
                    this.staff = true
                    this.role = 'staff'
                  } else if (code === 403) {
                    this.staff = false
                  }
                }).catch(error => {
                  throw error
                })
              }
            }).catch(error => {
              throw error
            })
          }
        }).catch(error => {
          throw error
        })
        // 判断质检主管权限
        permsQCDepart(this.accountNo).then(response => {
          const code = parseInt(response.data.code)
          if (code === 200) {
            this.qcdepart = true
          } else if (code === 403) {
            this.qcdepart = false
            // 判断质检员权限
            permsQCStaff(this.accountNo).then(response => {
              const code = parseInt(response.data.code)
              if (code === 200) {
                this.qcstaff = true
              } else if (code === 403) {
                this.qcstaff = false
              }
            }).catch(error => {
              throw error
            })
          }
        }).catch(error => {
          throw error
        })
      }
    }).catch(error => {
      throw error
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &.container{
    padding:0 10px;
  }
}
</style>
