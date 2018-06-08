<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<div>-->
      <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
      <!--&lt;!&ndash;<breadcrumb></breadcrumb>&ndash;&gt;-->
      <!--<el-dropdown class="avatar-container" trigger="click">-->
        <!--<div class="avatar-wrapper">-->
          <!--&lt;!&ndash;<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">&ndash;&gt;-->
          <!--<span>10003</span>-->
          <!--<i class="el-icon-caret-bottom"></i>-->
        <!--</div>-->
        <!--<el-dropdown-menu class="user-dropdown" slot="dropdown">-->
          <!--<router-link class="inlineBlock" to="/dashboard">-->
            <!--<el-dropdown-item>-->
              <!--返回顶层-->
            <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <!--<el-dropdown-item divided>-->
            <!--<span @click="logout" style="display:block;">注销</span>-->
          <!--</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
      <!--</el-dropdown>-->
    <!--</div>-->
      <el-col :span="15"><div class="grid-content bg-purple-light">
        <el-form style="text-align: center">
          <el-form-item style="margin-bottom: 8px">
            <el-col :span="24">
              <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
              <div style="margin-top: 5px">
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">拨号</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">保持</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">转接</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">三方</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">取回</el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                  <el-button type="primary" size="mini">挂断</el-button>
                </el-tooltip>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-col :span="3">
              <span>坐席分机</span>
            </el-col>
            <el-col :span="3">
              <el-input size="mini"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini">登入</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini">登出</el-button>
            </el-col>
            <el-col :span="2">
              <span>示忙</span>
            </el-col>
            <el-col :span="4">
              <el-select v-model="value" placeholder="请选择活动区域" size="mini">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="dark" content="不可用" placement="bottom-end">
                <el-button type="primary" size="mini">接听</el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="4">
              <el-input size="mini"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
        <el-row style="font-size: 14px">
          <el-col :span="10"><div class="grid-content bg-purple">
            <div>状态：登出</div>
            <div>时长：</div>
          </div></el-col>
          <el-col :span="14"><div class="grid-content bg-purple-light">
            <div>主叫：12345678</div>
            <div>被叫：</div>
          </div></el-col>
        </el-row>
      </div></el-col>
      <el-col :span="1">
        <!--<div class="grid-content bg-purple-light">-->
          <el-dropdown class="avatar-container" trigger="click" style="top: 15%;">
            <div class="avatar-wrapper">
              <span>用户名</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link class="inlineBlock" to="/dashboard">
                <el-dropdown-item>
                  返回
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span @click="logout" style="display:block;">注销</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        <!--</div>-->
      </el-col>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  name: 'layout',
  data() {
    return {
      value: 'shanghai'
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then((data) => {
        if (data.info) {
          this.$router.push({ path: '/login' })
          // location.reload() // 为了重新实例化vue-router对象 避免bug
        }
      })
      // location.reload() // 为了重新实例化vue-router对象 避免bug
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  /*height: 100px;*/
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>

