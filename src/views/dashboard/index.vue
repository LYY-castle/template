<template>
  <div class="container">
    <!--<div class="dashboard-text">name:{{name}}</div>-->
    <!--<div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>-->
    <div class="dashboard-text">欢迎登陆本系统</div>
    <div class="dashboard-text">123</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenu } from '@/api/dashboard'
// import Layout from '../layout/Layout'
import getDynamicRouter from '@/router/dynamic-router'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    getMenu().then(response => {
      const data = response.data
      // 存到session storage
      sessionStorage.setItem('getMenu', JSON.stringify(data))
      // 存到store里面
      this.$store.dispatch('SetMenu', getDynamicRouter(data))
      this.$router.addRoutes(getDynamicRouter(data))
    }).catch(error => {
      console.error(error)
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
