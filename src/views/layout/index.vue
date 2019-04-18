<template>
  <el-container class="app-wrapper" :class="classObj">
    <el-aside
      style="width:auto;position:relative;background:#242a2e;"
      class="sidebar-container">
      <sidebar class="sidebar-container"></sidebar>
    </el-aside>
    <el-container style="position:relative;">
      <div class="hamberger-bar">
        <hamburger class="hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      </div>
      <el-header style="height:auto;overflow:hidden;padding:0;">
        <navbar></navbar>
      </el-header>
      <el-main style="padding:0;">
          <div class="main-container">
            <app-main></app-main>
          </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Hamburger
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      'hamburger'
    ]),
    logoUrl() {
      return this.$store.state.theme.logo
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
      // logo缩放
      if (this.$store.state.app.sidebar.opened) {
        $('.hamburger i').addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right')
      } else {
        $('.hamburger i').addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left')
      }
    }
  }
  // mounded() {
  //   // 强制打开menu
  //   window.onresize = () => {
  //     this.$store.commit('OPEN_SIDEBAR')
  //     this.toggleSideBar()
  //   }
  // }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
<style>
  div.hamberger-bar{
    position: absolute;
    left:0;
    top:47%;
    z-index:99;
    width:12px;
    height:78px;
  }
  /* div.hamberger-bar.opened{
    left:163px;
    transition: left .3s;
  }
  div.hamberger-bar.closed{
    left:36px;
    transition: left .2s;
  } */
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
  #app .sidebar-container {
    width: 164px !important;
    z-index:100;
  }
  #app .icon-arrow{
    font-size:12px;
    color:#fff;
    line-height:78px;
  }
  #app .main-container {
    min-height:100%;
    /* max-height:100%; */
    /* margin-left: 164px; */
    position: relative;
    overflow-y: auto;
  }
  #app .sidebar-container .svg-icon {
    margin-right: 10px;
  }
  #app .el-scrollbar__wrap{
    margin-right:-19px !important;
  }
  #app .el-menu-item {
    padding-left: 48px !important;
  }
  #app .el-submenu__title{
    width:164px;
  }
  @media screen and (min-width: 1281px) and (max-width:1367px){
    #app .main-container {
      /* margin-left: 164px; */
    }
    #app .sidebar-container {
      /* width: 154px !important; */
      width: 164px !important;
    }
    #app .sidebar-container span{
      font-size:12px;
    }
    #app .sidebar-container .svg-icon {
      margin-right: 0;
    }
  }
  @media all and (min-width:1024px) and (max-width:1280px)  {
    #app .main-container {
      min-height:100%;
      /* margin-left: 164px; */
      position: relative;
    }
    #app .sidebar-container {
      width: 164px !important;
    }
    #app .sidebar-container span{
      font-size:10px;
    }
    #app .sidebar-container .svg-icon {
    margin-right: 0;
    }
  }
  @media all and (min-width:400px) and (max-width:1023px)  {
    #app .sidebar-container {
      /* width: 137px !important; */
      width: 164px !important;
    }
    #app .sidebar-container span{
      font-size:8px;
    }
    #app .sidebar-container .svg-icon {
    margin-right: 0;
}
  }
</style>
