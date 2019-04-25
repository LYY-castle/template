<template>
<div>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="item.alwaysShow || !item.hidden">
      <router-link v-if="item.path" :to="item.path"
        :key="item.name">
        <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown' : !isNest}">
          <i v-if="item.meta && item.meta.icon" :class="item.meta.icon ? item.meta.icon : ''"></i>
          <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name || item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta && item.meta.icon" :class="item.meta.icon ? item.meta.icon : ''"></i>
          <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length > 0" :routes="[child]" :key="child.path"></sidebar-item>
          <router-link v-else :to="item.path + '/' + child.path" :key="child.name">
            <el-menu-item :index="item.path + '/' + child.path" :class="child.level === 3 ? 'third-level-menu' : ''">
              <i v-if="child.meta && child.meta.icon" :class="child.meta.icon ? child.meta.icon : ''"></i>
              <span v-if="child.meta && child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</div>

</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>

<style>
  .el-submenu__title i {
    font-size: 14px;
    margin-right: 5px;
    width: 14px;
    height: 14px;
  }
</style>
