<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="hamberger-bar">
      <hamburger :class="hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </div>
    <el-menu
      style="margin-top:144px;z-index:1;"
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
import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
      // logo缩放
      if (this.$store.state.app.sidebar.opened) {
        this.$store.commit('SET_LOGOCLASS', 'opened')
      } else {
        this.$store.commit('SET_LOGOCLASS', 'closed')
      }
    }
  },
  components: { SidebarItem, Hamburger },
  computed: {
    ...mapGetters([
      'sidebar',
      'menu',
      'hamburger'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    routesData() {
      return this.menu.length !== 0 ? this.menu : this.$router.options.routes
    },
    hamburger() {
      return this.$store.state.app.logoClass + ' hamberger-bar'
    }
  }
}
</script>
<style>
  div.hamberger-bar svg path{
    fill:#6F8894;
  }
  div.hamberger-bar{
    height:35px;
    background:rgb(48, 65, 86);
    border-top:1px solid #fff;
    border-bottom:1px solid #fff;
    position: fixed;
    top:109px;
    z-index:9999;
    transition: width .3s;
  }
  div.hamberger-bar .opened{
    width:210px;
  }
  div.hamberger-bar .closed{
    width:36px;
  }
  div.hamberger-bar:hover{
    background:rgb(38, 52, 69);
  }
  div.hamberger-bar:hover svg path{
    fill:#fff;
  } 
  div.hamberger-bar svg{
    position:absolute;
    top: 4px;
    left: 50%;
    transform: translate(0,-50%);
  }
  @media screen and (min-width: 1281px) and (max-width:1367px){
    div.hamberger-bar svg{
      top: 3px;
    }
    div.hamberger-bar .opened{
      width:154px;
    }
    div.hamberger-bar .closed{
      width:36px;
    }
  }
  @media all and (min-width:1024px) and (max-width:1280px)  {
    div.hamberger-bar svg{
    top: 3px;
    }
    div.hamberger-bar .opened{
      width:137px;
    }
    div.hamberger-bar .closed{
      width:36px;
    }
  }
</style>

