<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <navbar></navbar>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <!-- <tags-view></tags-view> -->
      <app-main></app-main>
      <!-- <div class="hamberger-bar"> -->
      <hamburger :class="hamburger" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <!-- </div> -->
    </div>
  </div>
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
    },
    hamburger() {
      return this.$store.state.app.logoClass + ' hamberger-bar'
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
        this.$store.commit('SET_LOGOCLASS', 'opened')
        $('.hamburger i').addClass('el-icon-arrow-left').removeClass('el-icon-arrow-right')
        $('.tags-view-container').width('90.5%')
      } else {
        this.$store.commit('SET_LOGOCLASS', 'closed')
        $('.hamburger i').addClass('el-icon-arrow-right').removeClass('el-icon-arrow-left')
        $('.tags-view-container').width('98%')
      }
    }
  }
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
    margin-left: 164px;
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
      margin-left: 164px;
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
      margin-left: 164px;
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
