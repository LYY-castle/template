<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
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
    /* width: 210px!important; */
    width: 11%!important;
  }
  #app .main-container {
    /* margin-left: 210px; */
    margin-left: 11%;
  }
  @media screen and (min-width: 1200px) {
    #app .sidebar-container span{
      font-size:12px;
    }
    #app .sidebar-container .svg-icon {
    margin-right: 0;
}
  }
  @media all and (min-width:1024px) and (max-width:1199px)  {
    #app .sidebar-container span{
      font-size:10px;
    }
    #app .sidebar-container .svg-icon {
    margin-right: 0;
}
  }
  @media all and (min-width:400px) and (max-width:1023px)  {  
    #app .sidebar-container span{
      font-size:8px;
    }
    #app .sidebar-container .svg-icon {
    margin-right: 0;
}
  }  
</style>
