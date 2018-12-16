<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">欢迎登录系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="extensionNumber">
        <!--<span class="svg-container svg-container_login">-->
          <!--<svg-icon icon-class="user" />-->
        <!--</span>-->
        <el-input name="extensionNumber" type="text" v-model="loginForm.extensionNumber" autoComplete="on" placeholder="请输入分机号码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登 录
        </el-button>
      </el-form-item>
      <!--<div class="tips">-->
        <!--<span style="margin-right:20px;">username: admin</span>-->
        <!--<span> password: admin</span>-->
      <!--</div>-->
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { Message, MessageBox } from 'element-ui'
import { loginValid } from '@/api/login'
// import getDynamicRouter from '@/router/dynamic-router'
import { getCurrentTheme } from '@/api/theme'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('密码不合法'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        extensionNumber: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    // 修改title
    changeTitle() {
      const val = JSON.parse(localStorage.getItem('themeInfo'))
      document.title = val.title
    },
    // 主题切换
    themeCommand() {
      const val = JSON.parse(localStorage.getItem('themeInfo'))
      if (val) {
        $('body').removeClass('theme1')
        $('body').removeClass('theme2')
        $('body').addClass(val.theme)
        setTimeout(() => {
          this.loading.close()
        }, 1000)
      } else {
        console.log('切换主题失败')
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        // 清除缓存中的客户信息
        localStorage.removeItem('customerInfos')
        // 清除以前登录的token
        this.$store.dispatch('FedLogOut', this.loginForm)
        if (valid) {
          localStorage.setItem('agentId', this.loginForm.username)
          localStorage.setItem('DN', this.loginForm.extensionNumber)
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then((data) => {
            if (data.code === '1' || data.code === '4' || data.code === '3') {
              this.loading = false
              this.$router.push({ path: '/dashboard' })
              if (data.code === '3') {
                Message({
                  message: '请注销再登录',
                  type: 'error',
                  duration: 2 * 1000
                })
              }
              if (data.code === '1') {
                Message({
                  message: data.message,
                  type: 'success',
                  duration: 1 * 1000
                })
                // 获取主题
                getCurrentTheme().then(response => {
                  if (response.data.code === 0) {
                    localStorage.setItem('themeInfo', JSON.stringify(response.data.data))
                    this.themeCommand()
                    this.changeTitle()
                    this.$store.commit('SET_LOGO', response.data.data.logo)
                  } else {
                    throw response.data.message
                  }
                })
              }
            } else if (data.code === '0') {
              this.loading = false
              Message({
                message: data.message,
                type: 'error',
                duration: 2 * 1000
              })
            } else if (data.code === '5') {
              this.loading = false
              MessageBox.confirm('账号已在别的地方登入！是否注销！', '确定注销', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$store.dispatch('LoginAnd', this.loginForm).then((data) => {
                  if (data.code === '1') {
                    this.loading = false
                    localStorage.setItem('agentId', this.loginForm.username)
                    this.$router.push({ path: '/dashboard' })
                    // 获取主题
                    getCurrentTheme().then(response => {
                      if (response.data.code === 0) {
                        localStorage.setItem('themeInfo', JSON.stringify(response.data.data))
                        this.themeCommand()
                        this.changeTitle()
                        this.$store.commit('SET_LOGO', response.data.data.logo)
                      } else {
                        throw response.data.message
                      }
                    })
                  } else {
                    this.loading = false
                    Message({
                      message: '系统繁忙',
                      type: 'error',
                      duration: 2 * 1000
                    })
                  }
                }).catch(() => {
                  this.loading = false
                  Message({
                    message: '连接错误',
                    type: 'error',
                    duration: 2 * 1000
                  })
                })
              })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    this.$store.dispatch('delAllViews')
    loginValid().then(response => {
      if (response.data.code === '0') {
        Message({
          message: response.data.msg,
          type: 'error',
          duration: 2 * 1000
        })
        this.$router.push({ path: '/dashboard' })
      }
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
