<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        ref="tag"
        :class="($route.path=='/dashboard/index')?'active':''"
        :to="{ path: '/dashboard/index' }"
        tag="span"
        class="tags-view-item">
        首页
      </router-link>
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <!-- <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">close</li>
      <li @click="closeOthersTags">closeOthers</li>
      <li @click="closeAllTags">closeAll</li>
    </ul> -->
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'
// import { generateTitle } from '@/utils/i18n'
// import { clone } from '@/utils/tools'

export default {
  components: { ScrollPane },
  data() {
    return {
      isDialTask: false,
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
    this.$root.eventHub.$on('DIAL_TASK', (obj) => {
      this.isDialTask = obj.isDialTask
    })
  },
  methods: {
    // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const { name } = this.$route
      console.log(this.$route)
      console.log(name)
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (tags) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)

              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }

              break
            }
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      if (view.path === '/my_dial_task' && !this.isDialTask) {
        this.$message({
          message: '请完成外呼任务',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/dashboard/index')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/dashboard/index')
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY

      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  // position: absolute;
  border-bottom:1px solid #ccc;
  // top:75px;
  // width:90.5%;
  height:45px;
  z-index:999;
  transition:width .3s;
  .tags-view-wrapper {
    background: #F8F8F8;
    height: 100%;
    .tags-view-item {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      top:13px;
      height: 30px;
      border: 1px solid #d8dce5;
      padding: 0 3px;
      font-size: 12px;
      margin-left: 11px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0.29px;
      &:first-of-type {
        height: 30px;
        margin-left: 20px;
      }
      &.active {
        height: 30px;
        background-color: #42b983;
        color: #333333;
        border-color: #42b983;
        border-bottom:2px solid #54B8FF;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .scroll-wrapper{
    height:45px;
  }
  .tags-view-item {
    cursor: pointer;
    box-sizing:border-box;
    line-height:30px;
    background:none;
    .el-icon-close {
      width: 14px;
      height: 14px;
      vertical-align: 6px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      // background-color: #b4bccc;
      color:#ccc;
      // display:none;
      position:absolute;
      top: 1px;
      right: -11px;
      display:none;
      &:before {
        display:none;
        font-weight:bold;
        font-size:14px;
        transform: scale(.6);
        vertical-align: -1px;
        position:absolute;
        top: 0px;
        right: 0px;
      }
    }
  }
  .tags-view-item:hover{
    .el-icon-close {
      display:inline-block;
      &:hover{
        background-color: #b4bccc;
      }
      &::before {
        display:inline-block;
      }
    }
  }
  .tags-view-item.active{
    .el-icon-close {
      display:inline-block;
      &::before {
        font-weight:bold;
        font-size:14px;
        transform: scale(.6);
        display: inline-block;
        vertical-align: -1px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
