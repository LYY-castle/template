<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!--keep-alive:include用作缓存-->
      <keep-alive :include="cachedViews">
        <router-view :key="key" class="container"></router-view>
      </keep-alive>
      <!--<router-view></router-view>-->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style rel="stylesheet/scss">
  .container{
    padding:100px 20px;
  }
</style>
