<template>
  <div class="menu-wrapper">
    <template v-for="(item, index) in routes">

      <div v-if="!(item.children&&item.children.length)"
                   :key="item.path">
        <el-popover
          placement="right"
          trigger="hover">
          <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(item)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(item)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(item)"></el-button>
          </el-button-group>
          <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}" slot="reference">
            <i class="el-icon-document"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </el-popover>
      </div>

      <el-submenu v-else :index="item.path" :key="item.path">
        <template slot="title">
          <el-popover
            placement="right"
            trigger="hover">
            <el-button-group>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(item)"></el-button>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(item)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(item)"></el-button>
            </el-button-group>
            <div slot="reference">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.name}}</span>
            </div>
          </el-popover>
        </template>

        <template v-for="child in item.children">
          <sidebar-item1 :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item1>

          <div v-else :key="child.path">
            <el-popover
              placement="right"
              trigger="hover">
              <el-button-group>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="add(item)"></el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="reverse(item)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(item)"></el-button>
              </el-button-group>
              <el-menu-item :index="child.path" slot="reference">
                <i class="el-icon-document"></i>
                <span slot="title">{{child.name}}</span>
              </el-menu-item>
            </el-popover>
          </div>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
  // import { addDirectory } from '@/api/kb'

  export default {
    name: 'SidebarItem1',
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
      },
      add(item) {
        // addDirectory().then()
      },
      reverse(item) {
        console.log(item)
      },
      del(item) {
        console.log(item)
      }
    }
  }
</script>
