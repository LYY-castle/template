<template>
  <el-menu class="navbar" mode="horizontal">
    <!-- <div> -->
      <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
     <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
         <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <span>10003</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/dashboard">
            <el-dropdown-item>
              返回顶层
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    <!-- </div> -->

  <el-row>
    <!-- logo预留 -->
    <!-- <el-col :span="2">
      123
    </el-col> -->
    <el-col :span="1">
<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </el-col>
    <el-col :span="16" style="margin-top:1.4%;">
      
      <el-form :inline="true" size="mini">
          <el-col :span="6">
            <el-form-item label="坐席分机:" class="txtDN" size="mini">
              <el-col :span="20">
                <el-input v-model="formInline.user"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="mini" style="margin-left:50%;">登入</el-button>
              </el-col> 
            </el-form-item>
            <!-- <el-form-item style="margin-top:.5%;display:inline;"> -->
              <!-- <el-button type="primary" size="mini">登入</el-button> -->
            <!-- </el-form-item> -->
          </el-col>
          
          <el-col :span="4">
            <img src="../../../../static/images/nologin_state.png" title="坐席状态">
              <el-form-item class="state_now">
                <el-select v-model="formInline.region" placeholder="示忙">
                <el-option label="就绪" value="jiuxu"></el-option>
                <el-option label="示忙" value="shimang"></el-option>
                <el-option label="后处理" value="houchuli"></el-option>
              </el-select>
            </el-form-item>            
          </el-col>

          <el-col :span="5">
            <img src="../../../../static/images/answer_disable.png" title="接听(不可用)" style="cursor:pointer;">
              <el-form-item class="numberBox">
                <el-col :span="24">
                  <el-input v-model="formInline.user" size="mini"></el-input>
                </el-col>  
              </el-form-item>          
          </el-col>
          <el-col :span="9">
            <img src="../../../../static/images/dial_disable.png" title="拨号(不可用)" style="cursor:pointer;">
            <img src="../../../../static/images/hold_disable.png" title="保持(不可用)" style="cursor:pointer;">
            <img src="../../../../static/images/trans_disable.png" title="转接(不可用)" style="cursor:pointer;">
            <img src="../../../../static/images/conf_disable.png" title="三方(不可用)" style="cursor:pointer;">
            <img src="../../../../static/images/retrieve_disable.png" title="取回(不可用)" style="cursor:pointer;">
            <img src="../../../../static/images/hangup_disable.png" title="挂断(不可用)" style="cursor:pointer;">
            <!-- <img src="../../../../static/images/monitor_disable.png" title="挂断(不可用)" style="cursor:pointer;"> -->
          </el-col>
          

      </el-form>
    </el-col>
    <el-col :span="7" class="userInfo">
      <el-col :span="6">
        <p>
          <b>状态:</b>
          <span>登出</span>
        </p>
        <p>
          <b>时长:</b>
          <span></span>
        </p>
      </el-col>
      <el-col :span="6">
        <p>
          <b>主叫:</b>
          <span>123</span>
        </p>
        <p>
          <b>被叫:</b>
          <span>123</span>
        </p>
      </el-col>
      <el-col :span="6">
        <p>
          <b>用户:</b>
          <span>123</span>
        </p>
        <p>
          <b>工号:</b>
          <span>123</span>
        </p>
        <p>
          <b>部门:</b>
          <span>123</span>
        </p>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="mini" style="margin-left:50%;" @click="logout">注销</el-button>
      </el-col>
    </el-col>
  </el-row>
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
      value: 'shanghai',
      formInline: {
        user: '',
        region: ''
      }
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.navbar{
  .txtDN .el-form-item__content{
    margin-top:3%;
    width:48% !important;
  }
  .txtDN label{
    margin-bottom:4%;
  }
  .state_now .el-form-item__content{
    margin-top:4%;
    width:100% !important;
  }
  .state_now{
    margin-top:1%;
    width:55%;
  }
  .numberBox .el-form-item__content{
    // width:55%;
    margin-top:4%;
  }
  .numberBox{
    width:65%;
  }
  .userInfo{
    p{
      height:20px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
p{
  margin:0;
}
.navbar {
  /*height: 100px;*/
  line-height: 50px;
  border-radius: 0px !important;
  box-shadow: 0 0 5px #888;
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

