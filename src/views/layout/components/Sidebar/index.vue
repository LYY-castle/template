<template>
  <div>
    <div id="logo">
      <router-link to="/dashboard">
        <img :src="logoUrl">
      </router-link>
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper" style="height:89%;">
      <!-- <div class="hamberger-bar">
        <hamburger :class="hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      </div> -->

      <el-menu
        :unique-opened="true"
        style="z-index:1;"
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF">
        <sidebar-item :routes="routesData"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'menu'
      // 'hamburger'
    ]),
    logoUrl() {
      return this.$store.state.theme.logo
    },
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    routesData() {
      return this.menu.length !== 0 ? this.menu : this.$router.options.routes
    }
  }
}
</script>
<style>
  .el-asdie .el-scrollbar__view .el-menu .el-menu-item{
    font-size:12px;
  }
  /* div.hamberger-bar svg path{
    fill:#fff;
  } */
  @media screen and (min-width: 1281px) and (max-width:1367px){

  }
  @media all and (min-width:1024px) and (max-width:1280px)  {

  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  // 一级无子菜单样式
  /deep/ .menu-wrapper>a>li{
    height: 45px;
    line-height: 45px;
    padding-left:12px !important;
    background: #242A2E !important;
    &:hover{
      background: #181d20 !important;
    }
    &>i{
      margin-right: 14px;
      color:#fff;
    }
    &>span{
      color:#fff;
    }
  }
</style>
