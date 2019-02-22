<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <!-- <div class="hamberger-bar">
      <hamburger :class="hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </div> -->
    <el-menu
      style="margin-top:109px;z-index:1;"
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
</template>

<script>
// import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('ToggleSideBar')
    //   // logo缩放
    //   if (this.$store.state.app.sidebar.opened) {
    //     this.$store.commit('SET_LOGOCLASS', 'opened')
    //   } else {
    //     this.$store.commit('SET_LOGOCLASS', 'closed')
    //   }
    // }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'menu'
      // 'hamburger'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    routesData() {
      return this.menu.length !== 0 ? this.menu : this.$router.options.routes
    }
    // hamburger() {
    //   return this.$store.state.app.logoClass + ' hamberger-bar'
    // }
  }
}
</script>
<style>
  .el-scrollbar__view .el-menu .el-menu-item{
    font-size:12px;
  }
  /* div.hamberger-bar svg path{
    fill:#fff;
  } */
  div.hamberger-bar{
    position: fixed;
    left:163px;
    top:47%;
    z-index:99;
    width:12px;
    height:78px;
  }
  div.hamberger-bar.opened{
    left:163px;
    transition: left .3s;
  }
  div.hamberger-bar.closed{
    left:36px;
    transition: left .2s;
  }
  div.hamberger-bar{
    cursor:pointer;
  }
  div.hamberger-bar:hover svg path{
    fill:#fff;
  } 
  div.hamberger-bar div.hamberger{
    position:absolute;
    top: 4px;
    left: 50%;
    transform: translate(0,-50%);
  }
  @media screen and (min-width: 1281px) and (max-width:1367px){

  }
  @media all and (min-width:1024px) and (max-width:1280px)  {
 
  }
</style>

