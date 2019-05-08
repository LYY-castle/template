<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!--keep-alive:include用作缓存-->
      <keep-alive >
        <router-view :key="key" class="container" v-if="isRouterAlive"></router-view>
      </keep-alive>
      <!--<router-view></router-view>-->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  provide() {
    return {
      reloadCompoment: this.reloadCompoment
    }
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
    cachedViews() {
      return this.$store.state.tagsView.cachedPaths
    },
    key() {
      return this.$route.fullPath
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reloadCompoment() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style rel="stylesheet/scss">
  .container{
    padding:15px 20px 0 20px ;
  }
</style>
