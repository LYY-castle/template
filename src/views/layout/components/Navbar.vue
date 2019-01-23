<template>
  <el-menu class="navbar" mode="horizontal">
  <el-row>
    <!-- logo及按钮 -->
    <div class="navbar-form-container">
      <div id="logo" :class="logoClass" style="float:left">
        <router-link to="/dashboard">
          <img :src="logoUrl">
        </router-link>
      </div>
      <!-- <el-col :span="1" class="hamburger">
        <hamburger style="margin-top:35px;" class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      </el-col> -->
        <!-- 表单 -->
        <div style="float:left;height:75px;margin-left:22px;" v-if="havesoftphone">
          <!-- 分机号和状态选项 -->
          <div class="navbar-forms">
            <el-form :inline="true" size="mini">
              <el-popover trigger="click" placement="bottom">
                <el-form :inline="true" size="mini" style="padding-top:20px;">
                  <!-- 分机号登入 -->
                  <el-form-item class="txtDN" size="mini" style="width:70px;">
                    <el-input v-model="formInline.DN" placeholder="分机号" :disabled="disabledDN">{{formInline.DN}}</el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" style="display:inline;" v-if="!islogin" @click="agentLogin()">登入</el-button>
                    <el-button type="primary" size="mini" style="display:inline;" v-if="islogin" @click="agentLogoff()">登出</el-button>
                  </el-form-item>
                </el-form>
                <img slot="reference" src="../../../../static/images/enter_disable.png" title="登入" class="img-all icon-container" style="width:53px;">
              </el-popover>
              <!-- 状态 -->
              <el-dropdown trigger="click" placement="bottom" @command="changeState" >
                <img src="../../../../static/images/nologin_state.png" title="未登录" class="img-all" v-if="agentState1">
                <img src="../../../../static/images/busy_normal.png" title="示忙"  class="img-all" v-else-if="agentState2">
                <img src="../../../../static/images/agentStat38_allReady.png" title="就绪"  class="img-all" v-else-if="agentState3">
                <img src="../../../../static/images/back_state.png" title="后处理"  class="img-all" v-else-if="agentState4">
                <img src="../../../../static/images/autodialAllReady.png" title="外呼就绪"  class="img-all" v-else-if="agentState5">
                <img src="../../../../static/images/autoDialBusy.png" title="外呼占用"  class="img-all" v-else-if="agentState6">
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0" :disabled="lockChange">就绪</el-dropdown-item>
                  <el-dropdown-item command="13" :disabled="lockChange">示忙</el-dropdown-item>
                  <el-dropdown-item command="14" :disabled="lockChange">后处理</el-dropdown-item>
                  <el-dropdown-item command="-5" :disabled="lockChange">外呼就绪</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 号码输入框 -->
              <img src="../../../../static/images/answer_disable.png" title="接听(不可用)"  class="img-all" v-show="!answerCall" style="width:53px;">
              <img src="../../../../static/images/answer_normal.gif" title="接听"  class="img-all" v-show="answerCall" @click="agentanswercall()" style="width:53px;">
              <el-form-item class="numberBox">
                <!-- <el-col :span="24"> -->
                  <el-input v-model="formInline.user" size="mini" :disabled="disabledDial"></el-input>
                <!-- </el-col> -->
              </el-form-item>
            </el-form>
          </div>
          <div class="navbar-buttons">
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/dial_disable.png" title="拨号(不可用)" class="img-all" v-show="!dialCall">
              <img src="../../../../static/images/dial_normal.png" title="拨号"  class="img-all" v-show="dialCall" @click="agentdialout()">
            </div>
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/hold_disable.png" title="保持(不可用)" class="img-all" v-show="holdCall1">
              <img src="../../../../static/images/hold_normal.png" title="保持" class="img-all" v-show="holdCall2" @click="agenthold()">
              <img src="../../../../static/images/holding_state.gif" title="保持" class="img-all" v-show="holdCall3"  @click="agenthold()">
            </div>
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/trans_disable.png" title="转接(不可用)" class="img-all" v-show="transCall1">
              <img src="../../../../static/images/trans_normal.png" title="转接" class="img-all" v-show="transCall2" @click="agentstarttransfer()">
              <img src="../../../../static/images/comtrans_normal.gif" title="转接中" class="img-all" v-show="transCall3" @click="agentstarttransfer()">
            </div>
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/conf_disable.png" title="三方(不可用)" class="img-all" v-show="confCall1">
              <img src="../../../../static/images/conf_normal.png" title="三方" class="img-all" v-show="confCall2" @click="agentstartconffer()">
              <img src="../../../../static/images/comconf_normal.gif" title="三方" class="img-all" v-show="confCall3" @click="agentstartconffer()">
            </div>
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/retrieve_disable.png" title="取回(不可用)" class="img-all" v-show="!retrieveCall">
              <img src="../../../../static/images/retrieve_normal.png" title="取回" class="img-all" v-show="retrieveCall" @click=" agentretrieve()">
            </div>
            <div style="float:left;margin-left:5px;" class="icon-container">
              <img src="../../../../static/images/hangup_disable.png" title="挂断(不可用)" class="img-all" v-show="!hangupCall">
              <img src="../../../../static/images/hangup_normal.png" title="挂断" class="img-all" v-show="hangupCall" @click="agenthangup()">
            </div>
          </div>
          <span style="float:left" class="line"></span>
          <div class="status-container">
            <div style="clear:both;diaplay:inline-block;">
              <b>状态：</b>
              <el-popover trigger="hover" placement="bottom" :content="telephoneState">
                <span slot="reference">{{telephoneState}}</span>
              </el-popover>
            </div>
            <br>
            <div style="clear:both;display:inline-block;margin-top:32px;">
              <b>时长：</b>
              <el-popover trigger="hover" placement="bottom" :content="timeCount">
                <span slot="reference">{{timeCount}}</span>
              </el-popover>
            </div>
          </div>
          <div class="status-container call">
              <div style="clear:both;display:inline-block;">
                <b>主叫：</b>
                <el-popover trigger="hover" placement="bottom" :content="caller">
                  <span slot="reference">{{caller}}</span>
                </el-popover>
              </div>
            <br>
              <div style="clear:both;display:inline-block;margin-top:32px;">
                <b>被叫：</b>
                <el-popover trigger="hover" placement="bottom" :content="callee">
                  <span slot="reference">{{callee}}</span>
                </el-popover>
              </div>
            <!-- <br>
              <div style="clear:both;display:inline-block;margin-top:23.5px;">
                <b>原主叫：</b>
                <el-popover trigger="hover" placement="bottom" :content="orginCaller">
                  <span slot="reference">{{orginCaller}}</span>
                </el-popover>
              </div>
            <br> -->
          </div>
          <!-- <span style="float:left" class="line"></span> -->

        </div>
        <div style="margin-right:2px;position: absolute;right:0" v-if="havesoftphone">
          <!-- 用户 -->
          <el-tooltip placement="bottom" class="user">
            <div slot="content">用户信息</div>
            <el-dropdown @command="handleCommand" trigger="click" >
              <el-button type="info" circle><svg-icon icon-class="user" class="icon-size"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>
                  <span><b>工号：</b>{{userInfo.staffId}}</span><br/>
                  <span><b>用户：</b>{{userInfo.userName}}</span><br/>
                  <span><b>部门：</b>{{userInfo.departName}}</span><br/>
                </el-dropdown-item>
                <el-dropdown-item style="text-align:center" divided command="changePWD">
                  <i class="el-icon-edit-outline">  修改密码</i>
                </el-dropdown-item>
                <el-dropdown-item style="text-align:center" divided command="logout">
                  <i class="el-icon-circle-close">  注销用户</i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <!-- 有未读信息 -->
          <div v-show="msgNum_all > 0" class="message">
            <el-badge v-model="msgNum_all" class="item" :max="99">
              <el-tooltip placement="bottom">
                <div slot="content">
                  您有{{msgNum_all}}条未读信息<br/><br/>
                  今日消息：{{msgNum_today_all}} 条<br/>
                  <!-- 未读特提：{{msgNum_sm}} 条<br/>
                  未读特急：{{msgNum_eu}} 条<br/> -->
                </div>
                <el-button type="success" icon="el-icon-message" circle @click="checkMessageList()" class="icon-size"></el-button>
              </el-tooltip>
            </el-badge>
          </div>
          <!-- 没有未读信息 -->
          <div v-show="msgNum_all === '' || msgNum_all === 0" class="message">
            <el-tooltip placement="bottom">
              <div slot="content">
                您有{{msgNum_all}}条未读信息<br/><br/>
                今日消息：{{msgNum_today_all}} 条<br/>
                <!-- 未读特提：{{msgNum_sm}} 条<br/>
                未读特急：{{msgNum_eu}} 条<br/> -->
              </div>
              <el-button type="success" icon="el-icon-message" circle @click="checkMessageList()" class="icon-size"></el-button>
            </el-tooltip>
          </div>
          <!-- 微信 -->
          <el-badge v-model="msgNum_wechat" class="item wechat" :max="999" :hidden="!msgNum_wechat" v-if="show_wechat === 'true'">
            <el-tooltip placement="bottom">
              <div slot="content">{{wechatState=="0"?"示忙":"就绪"}}</div>
              <el-dropdown trigger="click" placement="bottom" @command="changeWechatState" >
                <el-button type="info" circle><svg-icon icon-class="wechat" class="icon-size"/></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="toWeChat">
                      进入微信聊天
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="1">就绪</el-dropdown-item>
                  <el-dropdown-item command="0">示忙</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
          </el-badge>
          </div>
        <el-row v-if="!havesoftphone" style="height:75px;">
          <el-col :span="7" class="userInfo" style="float:right;margin-top:-7px;">
             <el-col :span="3" style="margin-top:18px;float:right;margin-left:10px;">
              <!-- 用户 -->
              <el-dropdown @command="handleCommand" trigger="click" >
                <el-button type="info" circle><svg-icon icon-class="user" style="font-size:30px;"/></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>
                    <span><b>工号：</b>{{userInfo.staffId}}</span><br/>
                    <span><b>用户：</b>{{userInfo.userName}}</span><br/>
                    <span><b>部门：</b>{{userInfo.departName}}</span><br/>
                  </el-dropdown-item>
                  <el-dropdown-item style="text-align:center" divided command="changePWD">
                    <i class="el-icon-edit-outline">  修改密码</i>
                  </el-dropdown-item>
                  <el-dropdown-item style="text-align:center" divided command="logout">
                    <i class="el-icon-circle-close">  注销用户</i>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>

            <el-col :span="3"  style="margin-top:18px;float:right;margin-left:10px;">
              <!-- 有未读信息 -->
              <div v-show="msgNum_all > 0">
                <el-badge v-model="msgNum_all" class="item" :max="99">
                  <el-tooltip placement="bottom">
                    <div slot="content">
                      您有{{msgNum_all}}条未读信息<br/><br/>
                      今日消息：{{msgNum_today_all}} 条<br/>
                      <!-- 未读特提：{{msgNum_sm}} 条<br/>
                      未读特急：{{msgNum_eu}} 条<br/> -->
                    </div>
                    <el-button type="success" icon="el-icon-message" circle @click="checkMessageList()" style="font-size:30px;"></el-button>
                  </el-tooltip>
                </el-badge>
              </div>
              <!-- 没有未读信息 -->
              <div v-show="msgNum_all === '' || msgNum_all === 0">
                <el-tooltip placement="bottom">
                  <div slot="content">
                    您有{{msgNum_all}}条未读信息<br/><br/>
                    今日消息：{{msgNum_today_all}} 条<br/>
                    <!-- 未读特提：{{msgNum_sm}} 条<br/>
                    未读特急：{{msgNum_eu}} 条<br/> -->
                  </div>
                  <el-button type="success" icon="el-icon-message" circle @click="checkMessageList()" style="font-size:30px;"></el-button>
                </el-tooltip>
              </div>
            </el-col>
          </el-col>

        </el-row>

        <!-- tab -->
        <div>
          <el-col :span="20">
            <tags-view></tags-view>
          </el-col>
        </div>

    <!-- </el-col> -->
    </div>
  </el-row>


  <el-dialog width="30%" title="修改密码" :visible.sync="changePwdVisiable" append-to-body>
      <span style="color:red">*</span><span style="font-size:15px;">请输入旧密码：</span><br/>
       <el-input type="password" placeholder="请输入旧密码" size="medium" v-model="changePWD.oldPassword" maxlength="20" clearable></el-input>
      <span style="color:red">*</span><span style="font-size:15px;">请输入新密码：</span><br/>
       <el-input type="password" placeholder="请输入新密码" size="medium" v-model="changePWD.newPassword" maxlength="20" clearable></el-input>
      <span style="color:red">*</span><span style="font-size:15px;">请输入验证码：</span><br/>
       <el-input type="text" placeholder="请输入验证码" size="medium" v-model="changePWD.validateCode" maxlength="4" style="width:70%" clearable></el-input>
       <img style="position:relative;top:10px;" height="35" width="75"  :src="codeUrl" @click="getCode()">
       <!-- <div>{{codeUrl}}</div> -->
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="checkChangePWD(changePWD)">确定</el-button>
        <el-button @click="changePwdVisiable = false">取消</el-button>
      </div>
  </el-dialog>
  </el-menu>
</template>

<script>
import { getCurrentTheme } from '@/api/theme'
import TagsView from './TagsView'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import { getUserInfo } from '@/api/dashboard'
import { Message } from 'element-ui'
import {
  addComeContact,
  addDialContact,
  addAnswerContact,
  addHangupContact,
  getPhoneOwn,
  checkSoftphonePerm,
  changeWechatState,
  getWechatState,
  navbarQueryRecords
} from '@/api/navbar'
import {
  getUnreadNum,
  changeRecords
} from '@/api/wechat_list'
import {
  getMyUnreadMessages,
  generateValidateCode,
  changePassword
} from '@/utils/tools'
import cti from '@/utils/ctijs'
import getDynamicRouter from '@/router/dynamic-router'
import WebsocketHeartbeatJs from 'websocket-heartbeat-js'
var vm = null
var interval = null
export default {
  name: 'layout',
  data() {
    return {
      agentArray: [], // 部门下属成员
      lockChange: false, // 默认不禁用切换状态框
      isOrdSet: false, // 是否为普通坐席界面
      isDialTaskPage: false, // 是否为拨打详情页面
      socket_nofitication: null, // 消息通知的socket
      socket_wechat: null, // 微信消息的socket
      disabledDN: false, // 默认不禁用电话号码框
      disabledDial: false, // 默认不禁用拨打号码框
      dialNum: '',
      reasonCode: '',
      bolConnected: false,
      talkCaller: '',
      talkCallee: '',
      tran_Flagbit: '0',
      conf_Flagbit: '0',
      hold_Flagbit: '0',
      talkStatu: '',
      global_taskId: '',
      islogin: false,
      agentState1: true, // 未登录
      agentState2: false, // 就绪
      agentState3: false, // 示忙
      agentState4: false, // 后处理
      agentState5: false, // 外呼就绪
      agentState6: false, // 外呼占用
      answerCall: false,
      dialCall: false,
      holdCall1: true,
      holdCall2: false,
      holdCall3: false,
      transCall1: true,
      transCall2: false,
      transCall3: false,
      confCall1: true,
      confCall2: false,
      confCall3: false,
      retrieveCall: false,
      hangupCall: false,

      oldtelephonestate: '',
      telephoneState: '',
      timeCount: '',
      caller: '',
      callee: '',
      orginCaller: '',

      userInfo: {
        userName: '',
        staffId: '',
        departName: ''
      },
      havesoftphone: false,
      value: 'shanghai',
      formInline: {
        DN: '',
        user: '',
        region: ''
      },
      // navbar: 'navbar',
      sidebarStatus: '',
      agentId: '', // 搜索带的参数 员工工号
      timer: null, // 定时器timer
      msgNum_all: '', // 未读消息总数量
      msgNum_today_all: '', // 今日消息总数（已读+未读）
      changePwdVisiable: false, // 修改密码dialog
      changePWD: {
        staffId: '',
        oldPassword: '',
        newPassword: '',
        validateCode: ''
      },
      codeUrl: '',
      wechatState: null,
      msgNum_wechat1: null, // 微信消息条数
      customerInfo: {},
      show_wechat: `${process.env.SHOW_WECHAT}`
    }
  },
  components: {
    Breadcrumb,
    // Hamburger,
    TagsView
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'logoClass'
    ]),
    sidebar() {
      this.sidebarStatus = this.$store.state.app.sidebar
      return this.$store.state.app.sidebar
    },
    logoClass() {
      return this.$store.state.app.logoClass
    },
    logoUrl() {
      return this.$store.state.theme.logo
    },
    msgNum_wechat() {
      return this.$store.state.app.msgNum_wechat
    }
  },
  methods: {
    // 获取微信状态
    getWechatState() {
      const angentId = localStorage.getItem('agentId')
      getWechatState({ 'angentId': angentId }).then(response => {
        if (response.data.code === 1) {
          if (response.data.data[0].online === 0) {
            console.log('示忙')
            $('.wechat').addClass('outline')
          } else {
            console.log('就绪')
            $('.wechat').removeClass('outline')
          }
          this.wechatState = response.data.online
        } else {
          console.log('获取微信状态失败')
        }
      }).catch(error => {
        throw new Error(error)
      })
    },
    // 切换微信状态
    changeWechatState(val) {
      this.wechatState = val
      const req = {
        angentId: localStorage.getItem('agentId'),
        online: parseInt(val)
      }
      if (val) {
        changeWechatState(req).then(response => {
          if (response.data.code === 1) {
            if (val === '0') {
              this.$message({
                message: '修改微信状态为示忙'
              })
              $('.wechat').addClass('outline')
            } else if (val === '1') {
              this.$message({
                message: '修改微信状态为就绪',
                type: 'success'
              })
              $('.wechat').removeClass('outline')
            }
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          throw new Error(error)
        })
      }
    },
    // 修改密码
    checkChangePWD(changePWD) {
      if (changePWD.oldPassword === '') {
        this.$message.error('请输入原密码！')
        return
      } else if (changePWD.newPassword === '') {
        this.$message.error('请输入新密码！')
        return
      } else if (changePWD.oldPassword === changePWD.newPassword) {
        this.$message.error('新密码与原密码一致，请尝试新的密码组合！')
        return
      } else if (changePWD.validateCode === '') {
        this.$message.error('请输入验证码！')
        return
      } else {
        changePassword(changePWD)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('修改成功！请妥善保存您的新密码')
              this.changePwdVisiable = false
              return
            } else if (res.data.code === '0') {
              // 验证码校验错误
              this.$message.error(res.data.message)
              // 重新生成验证码
              this.getCode()
              return
            } else if (res.data.code === '2') {
              // 验证码没写入redis 重新生成
              this.$message.error('验证码过期，请重新输入！')
              // 重新生成验证码
              this.getCode()
              return
            } else if (res.data.code === 0) {
              this.$message.error('原密码不正确！')
              return
            }
          })
      }
    },
    // 初次获取未读数量
    firstgetUnreadMessages(agentId) {
      getMyUnreadMessages(agentId)
        .then(response1 => {
          this.msgNum_all = response1.data.result ? response1.data.result.total_unread_count : 0
          this.msgNum_today_all = response1.data.result ? response1.data.result.today_total_count : 0
        })
    },
    // 处理点击注销
    handleCommand(command) {
      if (command === 'logout') {
      // 注销时清空定时器
        clearInterval(this.timer)
        sessionStorage.removeItem('isDialTask')
        sessionStorage.removeItem('quickDialto')
        localStorage.removeItem('customerInfos')
        this.timer = null
        clearInterval(interval)
        interval = null
        this.agentArray.forEach(ele => { // 清空班长监控下的历史数据
          localStorage.removeItem('m_' + ele)
        })
        this.socket_nofitication.close()
        if (this.show_wechat === 'true') {
          this.socket_wechat.close()
        }
        this.logout()
      } else if (command === 'changePWD') {
        this.changePWD.staffId = localStorage.getItem('agentId')
        this.changePWD.oldPassword = ''
        this.changePWD.newPassword = ''
        this.changePWD.validateCode = ''
        // 生成验证码
        generateValidateCode()
          .then(res => {
            this.codeUrl = `${res.data}`
          })
        this.changePwdVisiable = true
      }
    },
    // 生成验证码
    getCode() {
      generateValidateCode()
        .then(res => {
          this.codeUrl = `${res.data}`
        })
    },
    // 进入我的消息页
    checkMessageList() {
      let messagePath = ''
      const messageRouter = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
      for (let i = 0; i < messageRouter.length; i++) {
        for (let j = 0; j < messageRouter[i].children.length; j++) {
          if (messageRouter[i].children[j].name === 'notification_my') {
            messagePath = messageRouter[i].path + '/' + messageRouter[i].children[j].name
          }
        }
      }
      this.$router.push({
        path: messagePath
      })
    },
    agentReady() {
      if (this.telephoneState === '就绪') {
        return
      } else {
        cti.AgentReady()
      }
    },
    agentnotReady() {
      if (this.telephoneState === '示忙') {
        return
      } else {
        cti.AgentnotReady()
      }
    },
    agentsetACW() {
      if (this.telephoneState === '后处理') {
        return
      } else {
        cti.setAgentACW()
      }
    },
    agentSetDialInFree() {
      if (this.telephoneState === '外呼就绪') {
        return
      } else {
        cti.setAgentDialInFree()
      }
    },
    changeState(val) {
      if (this.islogin) {
        this.formInline.region = val
        switch (this.formInline.region) {
          case '0':
            this.agentReady()
            break
          case '13':
            this.agentnotReady()
            break
          case '14':
            this.agentsetACW()
            break
          case '-5':
            this.agentSetDialInFree()
            break
          default:
            console.log(this.formInline.region)
            break
        }
      } else {
        return
      }
    },
    times() {
      var time = new Date()
      interval = setInterval(function() {
        if (time) {
          const starttime = new Date(time)
          const endtime = new Date()
          const diff = (endtime.getTime() - starttime.getTime()) / 1000
          const days = Math.floor(diff / 1440 / 60)
          const hours = Math.floor((diff - days * 1440 * 60) / 3600)
          const minutes = Math.floor((diff - days * 1440 * 60 - hours * 3600) / 60)
          const seconds = (diff - days * 1440 * 60 - hours * 3600 - minutes * 60).toFixed(0)

          vm.timeCount = hours + ':' + minutes + ':' + seconds
        }
      }, 1000)
    },
    agentanswercall() {
      cti.answercall()
      this.setbtnStatus('talking')
    },
    agenthangup() {
      cti.hangup()
    },
    agentretrieve() {
      vm.disabledDial = false
      this.talkCaller = this.caller
      this.talkCallee = this.callee
      cti.retrievecall()
      this.oldtelephonestate = this.telephoneState
      this.telephoneState = '通话取回'
      if (this.oldtelephonestate !== this.telephoneState) {
        clearInterval(interval)
        this.times()
      }
      if (this.tran_Flagbit === '1' && this.conf_Flagbit === '0') {
        this.tran_Flagbit = '0'
      } else if (this.tran_Flagbit === '0' && this.conf_Flagbit === '1') {
        this.conf_Flagbit = '0'
      } else {
        this.tran_Flagbit = this.tran_Flagbit
        this.conf_Flagbit = this.conf_Flagbit
      }
    },
    agentstartconffer() {
      this.talkCaller = this.caller
      this.talkCallee = this.callee
      if (this.conf_Flagbit === '1') {
        cti.completeconference()
        this.oldtelephonestate = this.telephoneState
        this.telephoneState = '完成三方'
        if (this.oldtelephonestate !== this.telephoneState) {
          clearInterval(interval)
          this.times()
        }
        this.setbtnStatus('conference')
        this.conf_Flagbit = '0'
      } else {
        vm.dialNum = this.formInline.user
        const reg = /^([1-9][0-9]{2,10}|[0-9]{1,4}\-?[0-9]{1,4}\-?[0-9]{1,9})$/
        if (vm.formInline.DN === vm.dialNum) {
          Message({
            message: '不能三方给自己',
            type: 'error',
            duration: 1 * 1000
          })
          return
        } else {
          if (reg.test(vm.dialNum)) {
            const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
            if (regex.test(vm.dialNum)) {
              this.getPromise(vm.dialNum).then(function() {
                cti.starttransfer(vm.dialNum, vm.formInline.DN)
              })
            } else {
              cti.starttransfer(vm.dialNum, vm.formInline.DN)
            }
          } else {
            Message({
              message: '号码不规范',
              type: 'error',
              duration: 1 * 1000
            })
            return
          }
        }
        this.oldtelephonestate = this.telephoneState
        this.telephoneState = '发起三方'
        if (this.oldtelephonestate !== this.telephoneState) {
          clearInterval(interval)
          this.times()
        }
        this.setbtnStatus('confconsolutaion')
        this.conf_Flagbit = '1'
      }
    },
    agentstarttransfer() {
      this.talkCaller = this.caller
      this.talkCallee = this.callee
      if (this.tran_Flagbit === '1') {
        cti.completetransfer()
        this.oldtelephonestate = this.telephoneState
        this.telephoneState = '完成转接'
        if (this.oldtelephonestate !== this.telephoneState) {
          clearInterval(interval)
          this.times()
        }
        this.tran_Flagbit = '0'
      } else {
        vm.dialNum = this.formInline.user
        const reg = /^([1-9][0-9]{2,10}|[0-9]{1,4}\-?[0-9]{1,4}\-?[0-9]{1,9})$/
        if (vm.formInline.DN === vm.dialNum) {
          Message({
            message: '不能转接给自己',
            type: 'error',
            duration: 1 * 1000
          })
          return
        } else {
          if (reg.test(vm.dialNum)) {
            const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
            if (regex.test(vm.dialNum)) {
              this.getPromise(vm.dialNum).then(function() {
                cti.starttransfer(vm.dialNum, vm.formInline.DN)
              })
            } else {
              cti.starttransfer(vm.dialNum, vm.formInline.DN)
            }
          } else {
            Message({
              message: '号码不规范',
              type: 'error',
              duration: 1 * 1000
            })
            return
          }
        }
        this.oldtelephonestate = this.telephoneState
        this.telephoneState = '发起转接'
        if (this.oldtelephonestate !== this.telephoneState) {
          clearInterval(interval)
          this.times()
        }
        this.setbtnStatus('transconsolutaion')
        this.tran_Flagbit = '1'
      }
    },
    agentunhold() {
      cti.unhold(1)
      this.oldtelephonestate = this.telephoneState
      this.telephoneState = '取消保持'
      if (this.oldtelephonestate !== this.telephoneState) {
        clearInterval(interval)
        this.times()
      }
      this.hold_Flagbit = '0'
    },
    agenthold() {
      if (this.hold_Flagbit === '1') {
        this.agentunhold()
      } else {
        cti.hold(1)
        this.oldtelephonestate = this.telephoneState
        this.telephoneState = '保持'
        if (this.oldtelephonestate !== this.telephoneState) {
          clearInterval(interval)
          this.times()
        }
        this.hold_Flagbit = '1'
      }
    },
    getPromise(num) {
      return new Promise(function(resolve, reject) {
        getPhoneOwn(num).then(res => {
          console.log(res)
          vm.dialNum = res.data
          resolve()
        })
      })
    },
    agentdialout() {
      if (localStorage.getItem(localStorage.getItem('agentId')) && JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '0') {
        Message({
          message: '不能在就绪的状态下拨打电话，请切换成其他状态！',
          type: 'error',
          duration: 1 * 1000
        })
        return
      }
      vm.dialCall = false
      if (vm.isDialTaskPage) {
        // 如果是在拨打页面拨打空时，默认拨打客户
        if (JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode !== '-101' &&
        JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode !== '-100') {
          vm.$root.eventHub.$emit('NAVBAR', 'transfer')
          // vm.dialCall = true
        }
      } else {
        const DN = this.formInline.DN
        vm.dialNum = this.formInline.user
        this.dialOut(DN, vm.dialNum)
      }
    },
    dialOut(DN, dialNum) {
      const reg = /^([1-9][0-9]{2,10}|[0-9]{1,4}\-?[0-9]{1,4}\-?[0-9]{1,9})$/
      if (DN === dialNum) {
        Message({
          message: '不能拨打自己本身',
          type: 'error',
          duration: 1 * 1000
        })
        vm.dialCall = true
      } else {
        if (reg.test(dialNum)) {
          const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
          if (regex.test(dialNum)) {
            this.getPromise(dialNum).then(function() {
              vm.dialCall = false
              cti.makecall(DN, dialNum)
            })
          } else {
            vm.dialCall = false
            cti.makecall(DN, dialNum)
          }
        } else {
          Message({
            message: '号码不规范',
            type: 'error',
            duration: 1 * 1000
          })
          vm.dialCall = true
        }
      }
    },
    agentLogin() {
      const agentId = localStorage.getItem('agentId')
      const DN = this.formInline.DN
      if (agentId !== null && DN !== null && DN !== '') {
        cti.login(agentId, this.formInline.DN, '518', '1', '0')
        // ToDo 待修改
        setTimeout(() => {
          if (this.reasonCode === '-1' || this.reasonCode === '-2') {
          // localStorage.setItem('callerDN', null)
            localStorage.removeItem('DN')
          } else {
          // localStorage.setItem('callerDN', DN)
            localStorage.setItem('DN', DN)
          }
        }, 1000)
      }
    },
    agentLogoff() {
      const agentId = localStorage.getItem('agentId')
      const DN = this.formInline.DN
      if (agentId !== null && DN !== null && DN !== '') {
        cti.logoff(agentId, DN, 9)
        vm.$root.eventHub.$emit('monitorphone', null)// 发送到班长监控话机界面，退出班长号码
        localStorage.removeItem('DN')
        localStorage.removeItem(agentId)
      }
    },
    sleep(seconds) {
      const starttime = new Date().getTime()
      let i = 0
      while (new Date().getTime() < starttime + seconds) {
        i++
      }
      console.log(i)
    },
    setbtnStatus(obj) {
      switch (obj) {
        case 'sessionclosed':
          this.agentState1 = true
          this.agentState2 = false
          this.agentState3 = false
          this.agentState4 = false
          this.agentState5 = false
          this.agentState6 = false// 未登录状态

          this.dialCall = false// 不能拨打
          this.answerCall = false// 不能接听
          this.hangupCall = false// 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false// 不能三方
          this.retrieveCall = false// 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
        case 'login': this.dialCall = true// 可以拨打电话
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false// 不能三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
        case 'outcallReady':
          this.dialCall = false// 不可以拨打电话
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false// 不能三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
        case 'outcallBusy':
          this.dialCall = false// 不可以拨打电话
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false// 不能三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
        case 'logoff':
          this.agentState1 = true
          this.agentState2 = false
          this.agentState3 = false
          this.agentState4 = false
          this.agentState5 = false
          this.agentState6 = false// 未登录状态
          this.dialCall = false // 不能拨打
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false // 不能三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
        case 'talking':this.dialCall = false // 不能拨打
          this.answerCall = false // 不能接听
          this.hangupCall = true // 可以挂断电话
          this.transCall1 = false
          this.transCall2 = true
          this.transCall3 = false // 可以转接
          this.confCall1 = false
          this.confCall2 = true
          this.confCall3 = false// 可以三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = false
          this.holdCall2 = true
          this.holdCall3 = false // 可以保持
          break
        case 'transconsolutaion':this.dialCall = false // 不能拨打
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = false
          this.transCall2 = false
          this.transCall3 = true // 可以完成转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false // 不能三方
          this.retrieveCall = true // 可以取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false // 不能保持
          break
        case 'confconsolutaion':this.dialCall = false // 不能拨打
          this.answerCall = false // 不能接听
          this.hangupCall = false // 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false // 不能转接
          this.confCall1 = false
          this.confCall2 = false
          this.confCall3 = true // 可以完成三方
          this.retrieveCall = true // 可以取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false // 不能保持
          break
        case 'conference':this.dialCall = false // 不能拨打
          this.answerCall = false // 不能接听
          this.hangupCall = true // 可以挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false // 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false // 不能三方
          this.retrieveCall = false // 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false // 不能保持
          break
        case 'onhold': this.holdCall1 = false
          this.holdCall2 = false
          this.holdCall3 = true // 可以取消保持
          this.retrieveCall = false // 不能取回
          break
        case 'unhold':
          this.holdCall1 = false
          this.holdCall2 = true
          this.holdCall3 = false // 可以保持
          this.retrieveCall = false // 不能取回
          break
        case 'ringing':
          this.dialCall = false // 不能拨号
          this.answerCall = true // 可以接听
          this.hangupCall = true // 可以挂断
          break
        case 'ringback':
          this.dialCall = false // 不能拨号
          this.answerCall = false // 不能接听
          this.hangupCall = true // 可以挂断
          break
        default:this.agentState1 = true
          this.agentState2 = false
          this.agentState3 = false
          this.agentState4 = false
          this.agentState5 = false
          this.agentState6 = false// 未登录状态
          this.dialCall = false// 不能拨打
          this.answerCall = false// 不能接听
          this.hangupCall = false// 不能挂断
          this.transCall1 = true
          this.transCall2 = false
          this.transCall3 = false// 不能转接
          this.confCall1 = true
          this.confCall2 = false
          this.confCall3 = false// 不能三方
          this.retrieveCall = false// 不能取回
          this.holdCall1 = true
          this.holdCall2 = false
          this.holdCall3 = false// 不能保持
          break
      }
    },
    onUpdateCallInfo(event, beforeOtherLegDN, afterOterLegDN, updateLine) {
      console.log('事件：更新通话情况' + event + ',原通话的对方号码：' + beforeOtherLegDN + ',更新后通话的对方号码：' + afterOterLegDN + ',更新线路：' + updateLine)
    },
    on_queuecount(event, queuename, queuecount) {
      console.log('队列名：' + queuename + '，队列排队人数：' + queuecount + '人')
    },
    on_unhold_event(event, agentid, DN, UUID, calleeid, other_leg_uuid) {
      vm.setbtnStatus('unhold')
    },
    on_SIP_unregister(event, DN) {
      alert('话机：' + DN + '未注册')
    },
    on_hold_event(event, agentid, DN, UUID, calleeid, other_leg_uuid) {
      vm.setbtnStatus('onhold')
    },
    on_hangup_event(event, agentid, DN, UUID, hangupLine, activeLineCount) {
      if (vm.isDialTaskPage) {
        vm.formInline.user = ''
      }
      addHangupContact({
        'event': 'on_hangup_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID
      }).then(res => {
        console.log('新建挂断电话的记录：', res)
      }).catch(error => {
        console.log('error:', error)
      })
      switch (hangupLine) {
        case 1:
          if (activeLineCount < 1) {
            vm.telephoneState = ''
            vm.caller = ''
            vm.callee = ''
            vm.orginCaller = ''
            vm.tran_Flagbit = '0'
            vm.conf_Flagbit = '0'
            vm.hold_Flagbit = '0'
            vm.setbtnStatus('login')
            cti.setAgentStatus(agentid, '14')
          } else {
            // vm.telephoneState = ''
            // vm.caller = ''
            // vm.callee = ''
            // vm.orginCaller = ''
            vm.tran_Flagbit = '0'
            vm.conf_Flagbit = '0'
            vm.hold_Flagbit = '0'
            vm.setbtnStatus('talking')
          }

          break
        case 2:
          if (vm.tran_Flagbit === '0' && vm.conf_Flagbit === '1') {
            vm.conf_Flagbit = '0'
            vm.telephoneState = '三方被拒'
            vm.caller = vm.talkCaller
            vm.callee = vm.talkCallee
            cti.setAgentStatus(agentid, vm.talkStatu)
          } else if (vm.tran_Flagbit === '1' && vm.conf_Flagbit === '0') {
            vm.tran_Flagbit = '0'
            vm.telephoneState = '转接被拒'
            vm.caller = vm.talkCaller
            vm.callee = vm.talkCallee
            cti.setAgentStatus(agentid, vm.talkStatu)
          } else {
            console.log('通话取回')
          }
          vm.setbtnStatus('talking')
          break
      }
      if (activeLineCount < 1) {
        vm.orginCaller = ''
        clearInterval(interval)
      }
    },
    on_answer_event(event, agentid, DN, UUID, callerid, calleeid, io, other_leg_uuid) {
      addAnswerContact({
        'event': 'on_answer_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID, 'callerid': callerid, 'calleeid': calleeid, 'io': io, 'other_leg_uuid': other_leg_uuid
      }).then(res => {
        console.log('写入接听电话的记录:' + res)
      }).catch(error => {
        console.log('error:' + error)
      })
      vm.$root.eventHub.$emit('addCall', true)
      vm.setbtnStatus('talking')
    },
    on_ringback_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, activeLine) {
      vm.caller = callerid
      vm.callee = calleeid
      vm.orginCaller = ori_ani
      if (vm.isDialTaskPage) {
        vm.global_taskId = localStorage.getItem('global_taskId')
      } else {
        vm.global_taskId = ''
      }
      if (calleeid.length === 12) {
        if (calleeid.substring(0, 1) === '9') {
          calleeid = calleeid.substring(1)
        }
      } else if (calleeid.length === 13) {
        if (calleeid.substring(0, 2) === '90') {
          calleeid = calleeid.substring(2)
        }
      } else {
        calleeid += ''
      }
      addDialContact({
        'event': 'on_ringback_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID, 'callerid': callerid, 'calleeid': calleeid, 'ori_ani': ori_ani, 'ringback_time': new Date(), 'callDirection': 0, 'global_taskId': vm.global_taskId, 'activeLine': activeLine
      }).then(res => {
        console.log('写入拨出电话记录：' + res)
      }).catch(error => {
        console.log('error:' + error)
      })
      vm.setbtnStatus('ringback')
      vm.oldtelephonestate = vm.telephoneState
      vm.telephoneState = '去电回铃'
      if (vm.oldtelephonestate !== vm.telephoneState) {
        clearInterval(interval)
        vm.times()
      }
    },
    on_ringing_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, other_leg_uuid, queueName, activeLine, choice, DialData) {
      vm.caller = callerid
      vm.callee = calleeid
      vm.orginCaller = ori_ani
      addComeContact({
        'event': 'on_ringing_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID, 'callerid': callerid, 'calleeid': calleeid, 'ori_ani': ori_ani, 'other_leg_uuid': other_leg_uuid, 'ringing_time': new Date(), 'callDirection': 1, 'taskId': DialData ? JSON.parse(DialData).data.taskId : null
      }).then(res => {
        console.log('写来电通话记录：' + res)
      }).catch(error => {
        console.log('error:' + error)
      })
      vm.setbtnStatus('ringing')
      vm.oldtelephonestate = vm.telephoneState
      vm.telephoneState = '来电振铃'
      if (vm.oldtelephonestate !== vm.telephoneState) {
        clearInterval(interval)
        vm.times()
      }
      if (DialData) { // 判断为自动外呼
        console.log(JSON.parse(DialData).data, 'data')
        const data = JSON.parse(DialData).data
        const campaignId = data.campaignId
        const taskId = data.taskId
        const customerId = data.customerId
        // const isBlacklist = data.isBlacklist
        const customerPhone = data.customerPhone
        vm.$router.push({//
          name: 'dial_task',
          query: { 'agent': 'agent', 'dialstatus': '0', 'dialType': 'autocall', 'isDialTask': false, 'campaignId': campaignId, 'taskId': taskId, 'customerId': customerId, 'isBlacklist': '0', 'customerPhone': customerPhone }
        })
        // cti.setAgentStatus(agentid, '-5')
      }
    },
    on_reasonchange(event, agentId, DN, reasonCode) {
      console.log('响应事件：改变话机状态' + event + ',员工工号：' + agentId + '，分机：' + DN + '，状态码：' + reasonCode)
      let info = {}
      if (typeof localStorage.getItem(agentId) !== 'undefined' && localStorage.getItem(agentId) !== null) {
        info = JSON.parse(localStorage.getItem(agentId))
        // console.log(info)
        info.beforeStatus = info.reasoncode
        info.beforeUpdatetime = info.updateTime
      }
      info.DN = DN
      info.reasoncode = reasonCode
      info.updateTime = new Date()
      localStorage.setItem(agentId, JSON.stringify(info))
      if (vm.isDialTaskPage) {
        if (reasonCode === '-101' || reasonCode === '-100') {
          vm.formInline.user = ''
          vm.disabledDial = false
        } else {
          vm.disabledDial = true
        }
        switch (reasonCode) {
          case '0':
          case '13':
          case '14':
            vm.$root.eventHub.$emit('dialTrue', '1')
            break
          case '-100':
          case '-101':
          case '-1':
          case '-2':
          default:
            vm.$root.eventHub.$emit('dialTrue', '0')
            break
        }
      } else {
        vm.disabledDial = false
      }
      if (localStorage.getItem('agentId') === agentId) {
        const obj = {}
        obj.event = event
        obj.agentId = agentId
        obj.DN = DN
        obj.reasonCode = reasonCode
        if (vm.isOrdSet) {
          vm.$root.eventHub.$emit('reasoncodechange', obj)
        }
      }
      // if (event !== 'manualchange') {
      switch (reasonCode) {
        case '-1':
          vm.lockChange = true
          vm.islogin = false
          vm.timeCount = ''
          vm.telephoneState = '登出'
          clearInterval(interval)
          localStorage.removeItem(agentId)
          vm.setbtnStatus('logoff')
          vm.disabledDN = false
          break
        case '0':
          vm.lockChange = false
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '就绪'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          vm.agentState1 = false
          vm.agentState2 = false
          vm.agentState3 = true
          vm.agentState4 = false
          vm.agentState5 = false
          vm.formInline.region = '就绪'
          vm.setbtnStatus('login')
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }
          break
        case '13':
          vm.lockChange = false
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '示忙'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          vm.agentState1 = false
          vm.agentState2 = true
          vm.agentState3 = false
          vm.agentState4 = false
          vm.agentState5 = false
          vm.formInline.region = '示忙'
          vm.setbtnStatus('login')
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '14':
          vm.lockChange = false
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '后处理'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          vm.agentState1 = false
          vm.agentState2 = false
          vm.agentState3 = false
          vm.agentState4 = true
          vm.agentState5 = false
          vm.formInline.region = '后处理'
          vm.setbtnStatus('login')
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '-5':// 外呼就绪
          vm.lockChange = false
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '外呼就绪'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          vm.agentState1 = false
          vm.agentState2 = false
          vm.agentState3 = false
          vm.agentState4 = false
          vm.agentState5 = true
          vm.agentState6 = false
          vm.formInline.region = '外呼就绪'
          vm.setbtnStatus('outcallReady')
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '-6':// 外呼占用
          vm.lockChange = true
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '外呼占用'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          vm.agentState1 = false
          vm.agentState2 = false
          vm.agentState3 = false
          vm.agentState4 = false
          vm.agentState5 = false
          vm.agentState6 = true
          vm.formInline.region = '外呼占用'
          vm.setbtnStatus('outcallBusy')
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '-100':
          vm.lockChange = true
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '来电通话中'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }

          if (vm.reasonCode === '-101' && vm.orginCaller === 'ObservCall') { // 表示是班长监控功能，不能转接和三方
            vm.dialCall = false // 不能拨打
            vm.answerCall = false // 不能接听
            vm.hangupCall = true // 可以挂断电话
            vm.transCall1 = true
            vm.transCall2 = false
            vm.transCall3 = false // 不能转接
            vm.confCall1 = true
            vm.confCall2 = false
            vm.confCall3 = false// 不能三方
            vm.retrieveCall = false // 不能取回
            vm.holdCall1 = false
            vm.holdCall2 = true
            vm.holdCall3 = false // 可以保持
            vm.telephoneState = '班长监听'
          }
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '-101':
          vm.lockChange = true
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '去电通话中'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }
          if (vm.orginCaller === 'Forcerelease') {
            vm.telephoneState = '班长强拆'
          }
          if (vm.orginCaller === 'WisperCall' || vm.orginCaller === 'IntrudeCall') { // 表示是强插或者耳语功能
            if (vm.orginCaller === 'WisperCall') {
              vm.telephoneState = '班长耳语'
            } else {
              vm.telephoneState = '班长强插'
            }
            vm.dialCall = false // 不能拨打
            vm.answerCall = false // 不能接听
            vm.hangupCall = true // 可以挂断电话
            vm.transCall1 = true
            vm.transCall2 = false
            vm.transCall3 = false // 不能转接
            vm.confCall1 = true
            vm.confCall2 = false
            vm.confCall3 = false// 不能三方
            vm.retrieveCall = false // 不能取回
            vm.holdCall1 = false
            vm.holdCall2 = true
            vm.holdCall3 = false // 可以保持
          }
          if (vm.formInline.DN === DN) {
            vm.disabledDN = true
          } else {
            vm.disabledDN = false
            vm.formInline.DN = DN
          }

          break
        case '-2':
          vm.lockChange = true
          vm.timeCount = ''
          vm.telephoneState = '登出'
          clearInterval(interval)
          localStorage.removeItem(agentId)
          vm.islogin = false
          vm.setbtnStatus('logoff')
          vm.disabledDN = false
          break
        case '-3':
        case '-4':
          break
      }
      // }
      vm.reasonCode = reasonCode
      localStorage.setItem('reasonCode', vm.reasonCode)
    },
    on_loginsucess(event, agentId, DN) {
      console.log('响应事件：登录成功' + event + ',员工工号：' + agentId + '，分机：' + DN)
      vm.$root.eventHub.$emit('monitorphone', { 'agentId': agentId, 'DN': DN })// 发送到班长监控电话页面，提示更新班长号码
      vm.islogin = true
      cti.setAgentStatus(agentId, '13')
    },
    on_error(event, errortype, errordescription) {
      console.log('响应事件：错误提示' + event + ',错误原因：' + errortype + '，错误描述：' + errordescription)
      vm.islogin = false
      vm.setbtnStatus('logoff')
    },
    on_SessionError(event) {
      vm.bolConnected = false
      vm.islogin = false
      console.log('session error')
      vm.setbtnStatus('logoff')
    },
    on_SessionClose(event) {
      vm.bolConnected = false
      vm.islogin = false
      console.log('session closed')
      vm.setbtnStatus('logoff')
    },
    NewSessionConnected(event) {
      vm.bolConnected = true
      vm.setbtnStatus('logoff')
      const agentId = localStorage.getItem('agentId')
      const DN = localStorage.getItem('DN')
      vm.formInline.DN = DN
      if (agentId !== null && DN !== null && DN !== '') {
        cti.login(agentId, DN, '518', '1', '0')
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
      // logo缩放
      if (this.$store.state.app.sidebar.opened) {
        this.$store.commit('SET_LOGOCLASS', 'opened')
      } else {
        this.$store.commit('SET_LOGOCLASS', 'closed')
      }
    },
    logout() {
      vm.agentLogoff()
      vm.$root.eventHub.$emit('closeInterval', true)// 普通坐席计时停止
      this.$store.dispatch('LogOut').then((data) => {
        if (data.info) {
          this.$router.push({ path: '/login' })
          // location.reload() // 为了重新实例化vue-router对象 避免bug
        }
      })
    },
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
      } else {
        console.log('切换主题失败')
      }
    },
    // 跳转到微信页面
    toWeChat() {
      let messagePath = ''
      const messageRouter = getDynamicRouter(JSON.parse(sessionStorage.getItem('getMenu')))
      for (let i = 0; i < messageRouter.length; i++) {
        for (let j = 0; j < messageRouter[i].children.length; j++) {
          if (messageRouter[i].children[j].name === 'wechat_list') {
            messagePath = messageRouter[i].path + '/' + messageRouter[i].children[j].name
          }
        }
      }
      this.$router.push({
        path: messagePath
      })
    }
  },
  mounted() {
    vm = this
    if (this.show_wechat === 'true') {
      // 获取微信状态
      this.getWechatState()
    }
    // 查询微信未读消息 ，写死
    navbarQueryRecords(localStorage.getItem('agentId')).then(response => {
      this.msgNum_wechat1 = response.data.pageInfo.totalCount
      this.$store.commit('CHANGE_WECHATMSG', this.msgNum_wechat1)
    })
    // 实时接收新的消息
    this.$root.eventHub.$on('RECEIVE_MESSAGES', (oneMsg) => {
      console.log('navbar接收消息')
      let contents = []
      contents = this.$store.state.app.wechat_contents
      if (contents.length !== 0) {
        // push聊天内容
        if (contents[0].customerId === JSON.parse(oneMsg).customerId) {
          this.$set(contents, contents.length, JSON.parse(oneMsg))
          changeRecords([JSON.parse(oneMsg).id]).then(response => {
            console.log(response.data)
          })
        }
        this.$store.commit('SET_WECHATCONTENTS', contents)
      }
      // 查询聊天列表客户对应未读消息数量
      getUnreadNum(localStorage.getItem('agentId')).then(response => {
        if (localStorage.getItem('customerInfos')) {
          vm.customerInfo = JSON.parse(localStorage.getItem('customerInfos'))
        } else {
          vm.customerInfo = []
        }
        for (let i = 0; i < vm.customerInfo.length; i++) {
          for (let j = 0; j < response.data.data.length; j++) {
            if (vm.customerInfo[i].customerId === response.data.data[j].customerId) {
              vm.customerInfo[i].unreadNum = response.data.data[j].num
            }
          }
        }
        this.$store.commit('SET_WECHATCUSTOMERINFO', this.customerInfo)
        localStorage.setItem('customerInfos', JSON.stringify(this.customerInfo))
      })
      // 查询此工号所有未读消息
      navbarQueryRecords(localStorage.getItem('agentId')).then(response => {
        this.$store.commit('CHANGE_WECHATMSG', response.data.pageInfo.totalCount)
      })
      // console.log(this.$store.state.app.wechat_customerInfos)
    })
    const agentId = localStorage.getItem('agentId')
    // 获取主题
    if (localStorage.getItem('themeInfo')) {
      this.themeCommand()
      this.changeTitle()
      this.$store.commit('SET_LOGO', JSON.parse(localStorage.getItem('themeInfo')).logo)
    } else if (!localStorage.getItem('themeInfo')) {
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
    // 强制打开menu
    window.onresize = () => {
      this.$store.commit('OPEN_SIDEBAR')
      this.toggleSideBar()
    }
    if (sessionStorage.getItem('sidebarStatus') === '0') {
      this.$store.commit('SET_LOGOCLASS', 'opened')
    } else if (sessionStorage.getItem('sidebarStatus') === null) {
      this.$store.commit('OPEN_SIDEBAR')
      this.$store.commit('SET_LOGOCLASS', 'opened')
    } else {
      this.$store.commit('SET_LOGOCLASS', 'closed')
    }
    checkSoftphonePerm(agentId).then(res => {
      this.havesoftphone = true
      cti.connectCTI(process.env.CTI_WS_SERVERURL)
    }).catch(error => {
      console.log(error)
    })
    getUserInfo().then(res => {
      localStorage.setItem('departId', res.data.departId)
      localStorage.setItem('agentName', res.data.agentName)
      localStorage.setItem('is_internal_admin', res.data.is_internal_admin)
      this.userInfo.userName = res.data.agentName
      this.userInfo.staffId = res.data.agentId
      this.userInfo.departName = res.data.departName
    }).catch(error => {
      console.log(error)
    })
    // 刚进页面获取未读消息数量
    this.firstgetUnreadMessages(agentId)

    this.socket_nofitication = new WebSocket(`${process.env.TUI_WS_SERVERURL}/realtime_notification_${agentId}`)
    // this.socket_wechat = new WebSocket(`${process.env.TUI_WS_SERVERURL}/realtime_wechat_${agentId}`)

    // 判断是否设置打开微信
    if (this.show_wechat === 'true') {
      // 微信websocket
      const options = {
        url: `${process.env.TUI_WS_SERVERURL}/realtime_wechat_${agentId}`,
        pingTimeout: 300000, // 每隔5min发送一次心跳
        // pingTimeout: 10000, // 每隔10s发送一次心跳
        pongTimeout: 10000, // 10s内若没收到后端返回的消息就认为是断开连接
        reconnectTimeout: 2000, // 尝试重连的时间间隔
        pingMsg: 'ws_heart_beat' // ping内容
      }
      this.socket_wechat = new WebsocketHeartbeatJs(options)

      this.socket_wechat.onopen = function(openEvent) {
        console.log(`Connect tui webSocket(wechat) addr = ${process.env.TUI_WS_SERVERURL}/realtime_wechat_${agentId} successfully.`)
      }

      // 收到微信消息时
      vm.socket_wechat.onmessage = function(messageEvent) {
        console.log('收到消息...')
        if (messageEvent.data === 'ws_heart_beat') {
          console.log('ws_wechat保持连接中...' + new Date())
        } else {
          vm.$root.eventHub.$emit('RECEIVE_MESSAGES', messageEvent.data)
        }
      }

      vm.socket_wechat.onclose = function(closeEvent) {
        console.log('Close tui webSocket(wechat) client successfully.')
      }

      vm.socket_wechat.onerror = () => {
        console.log('ws_wechat connect onerror')
      }
    }

    this.socket_nofitication.onopen = function(openEvent) {
      console.log(`Connect tui webSocket(notification) addr = ${process.env.TUI_WS_SERVERURL}/realtime_notification_${agentId} successfully.`)
    }

    // 收到消息通知时
    this.socket_nofitication.onmessage = function(messageEvent) {
      const data = JSON.parse(messageEvent.data)
      console.log(data)
      if (data.operate_type === 'release') {
        getMyUnreadMessages(agentId)
          .then(response1 => {
            if (response1.data && response1.data.result) {
              if (data.notification.emergency_degree === '1' || data.notification.emergency_degree === '2') {
                vm.$notify({
                  title: '消息提示',
                  message: '收到新通知',
                  offset: 100,
                  type: 'success'
                })
              } else if (data.notification.emergency_degree === '3') {
                vm.$notify({
                  title: '特急消息',
                  message: data.notification.body,
                  offset: 100,
                  type: 'warning'
                })
              } else if (data.notification.emergency_degree === '4') {
                vm.$notify({
                  title: '特提消息',
                  message: data.notification.body,
                  offset: 100,
                  type: 'warning'
                })
              }
            }
            vm.msgNum_all = response1.data.result ? response1.data.result.total_unread_count : 0
            vm.msgNum_today_all = response1.data.result ? response1.data.result.today_total_count : 0 // 今日总量
          })
          // 刷新我的消息通知的列表
        vm.$root.eventHub.$emit('CHANGE_MYMESSAGELIST')
      } else {
        // 修改右上角图标数量
        getMyUnreadMessages(agentId)
          .then(response1 => {
            vm.msgNum_all = response1.data.result ? response1.data.result.total_unread_count : 0
            vm.msgNum_today_all = response1.data.result ? response1.data.result.today_total_count : 0
          })
        // 刷新我的消息通知的列表
        vm.$root.eventHub.$emit('CHANGE_MYMESSAGELIST')
      }
    }

    vm.socket_nofitication.onclose = function(closeEvent) {
      console.log('Close tui webSocket(notification) client successfully.')
    }

    this.$root.eventHub.$on('CHANGE_STATUS', () => {
      this.firstgetUnreadMessages(agentId)
    })
    this.$root.eventHub.$on('DISABLED_DIAL', (str) => {
      if (str === '1') {
        vm.dialCall = false
      } else {
        if (localStorage.getItem(localStorage.getItem('agentId')) &&
        JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '0' ||
        JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '13' ||
        JSON.parse(localStorage.getItem(localStorage.getItem('agentId'))).reasoncode === '14') {
          vm.dialCall = true
        }
      }
    })
    this.$root.eventHub.$on('ord_set', (obj) => {
      vm.isOrdSet = obj
    })
    this.$root.eventHub.$on('monitor_workingset', (obj) => {
      vm.agentArray = obj
    })
    // this.$root.eventHub.$on('manualchange', (obj) => {
    //   const object = JSON.parse(localStorage.getItem(localStorage.getItem('agentId')))
    //   let DN = localStorage.getItem('DN') ? localStorage.getItem('DN') : ''
    //   const agentId = localStorage.getItem('agentId') ? localStorage.getItem('agentId') : ''
    //   let reasoncode = ''
    //   if (object) {
    //     DN = object.DN ? object.DN : ''
    //     reasoncode = object.reasoncode ? object.reasoncode : ''
    //   }
    //   vm.on_reasonchange('manualchange', agentId, DN, reasoncode)
    // })

    this.$root.eventHub.$on('DIAL_TASK', (obj) => {
      if (!obj.isDialTask) { // 说明是拨打页面
        vm.isDialTaskPage = true
        vm.formInline.user = ''
        vm.disabledDial = true
      } else {
        vm.isDialTaskPage = false
        vm.disabledDial = false
        // vm.dialCall = true
      }
    })
    this.$root.eventHub.$on('DIAL_TASK_DIALNM', (obj) => {
      if (vm.isDialTaskPage) {
        if (obj.callee === obj.caller) {
          vm.$message.error('不能拨打给自己')
        } else {
          cti.makecall(obj.caller, obj.callee, obj.campaignId)
        }
      } else {
        vm.$message.error('不在拨打界面，不能拨打客户')
      }
    })
  },
  destroyed() {
    this.$root.eventHub.$off('RECEIVE_MESSAGES')
    this.socket_nofitication.close()
    if (this.show_wechat === 'true') {
      this.socket_wechat.close()
    }
    this.$root.eventHub.$off('CHANGE_STATUS')
    this.agentArray.forEach(ele => { // 清空班长监控下的历史数据
      localStorage.removeItem('m_' + ele)
    })
    localStorage.removeItem(localStorage.getItem('agentId'))// 清空自己的历史数据
    this.$root.eventHub.$off('DISABLED_DIAL')
    this.$root.eventHub.$off('DIAL_TASK')
    this.$root.eventHub.$off('DIAL_TASK_DIALNM')
    this.$root.eventHub.$off('ord_set')
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.message .el-badge__content.is-fixed{
  top: 3px;
  right: 20px;
}
.el-menu--horizontal {
  border:none;
}
#logo{
  width:12%;
  background:#263445;
  height:108.55px;
  box-sizing: border-box;
  transition: width .3s;
}
#logo.closed{
  width:36px;
}
#logo.opened{
  width:12%;
}
#logo.closed img{
  display:none;
}
#logo img{
  width:100%;
  margin:4.4px 0;
  height:100.55px;
}
.icon-container{
  width:53px;
}
// .hamburger{
//   margin-left:-2px;
// }
// .navbar-form-container{
//   margin-left:-48px;
//   position:relative;
// }
.line{
  margin-top:15px;
  padding:23px 0;
  border-left:2px solid #000;
  border-right:2px solid #8B8B8B;
}
.numberBox{
  width:43%;
  margin-top:13px;
}
// .numberBox .el-form-item__content{
  // width:55%;
  // margin-top:4%;
// }
.icon-container-status{
  margin-top:-8px;
}
.navbar-buttons{
  float:left;
  // margin-left:20px;
  margin-right:20px;
  margin-top:11px;
}
.navbar-forms{
  float:left;
  padding-top:12px;
}
.icon-size{
  font-size:30px;
}
// .status-container div{
//   text-overflow: ellipsis;
//   white-space:nowrap;
// }
.status-container{
  float:left;
  width:150px;
  height: 75px;
  // padding-top: 15px;
  padding-top: 23px;
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
  margin-left:20px;
  margin-right:21px;
}
.status-container.call{
  width:270px;
}
.message{
  float:right;

  margin-right:25px;
  margin-top:9px;
}
.user{
  float:right;
  margin-right:25px;
  margin-top:10px;
}
.wechat{
  float:right;
  margin-left:50px;
  margin-right:25px;
  margin-top:10px;
  .el-button{
    border-color:#2AA145;
    background:#2AA145;
  }
  .el-button:hover{
    border-color:#2AA145;
    background:#2AA145;
    opacity:0.7;
  }
  .el-button:active{
    border-color:#2AA145;
    background:#2AA145;
    opacity:1;
  }
}
.outline.wechat{
  float:left;
  margin-left:50px;
  margin-right:25px;
  margin-top:10px;
  .el-button{
    border-color:#333;
    background:#333;
  }
  .el-button:hover{
    border-color:#333;
    background:#333;
    opacity:0.7;
  }
  .el-button:active{
    border-color:#333;
    background:#333;
    opacity:1;
  }
}
 @media screen and (min-width: 1281px) and (max-width:1367px){
  .message{
    float:right;
    margin-right:5px;
    margin-top:18px;
  }
  .user{
    float:right;
    margin-right:5px;
    margin-top:19px;
  }
  .wechat{
    float:right;
    margin-left:22px;
    margin-right:5px;
    margin-top:19px;
    .el-button{
      border-color:#2AA145;
      background:#2AA145;
    }
    .el-button:hover{
      border-color:#2AA145;
      background:#2AA145;
      opacity:0.7;
    }
    .el-button:active{
      border-color:#2AA145;
      background:#2AA145;
      opacity:1;
    }
  }
  .outline.wechat{
    float:left;
    margin-left:22px;
    margin-right:5px;
    margin-top:19px;
    .el-button{
      border-color:#333;
      background:#333;
    }
    .el-button:hover{
      border-color:#333;
      background:#333;
      opacity:0.7;
    }
    .el-button:active{
      border-color:#333;
      background:#333;
      opacity:1;
    }
  }
  .status-container{
    font-size:14px;
    width:107px;
    margin-right:7px;
    margin-left:20px;
  }
  .status-container.call{
    width:150px;
  }
  .icon-size{
    font-size:15px;
  }
  #logo{
    width:154px;
    background:#263445;
    height:108.55px;
    box-sizing: border-box;
    transition: width .3s;
  }
  #logo.closed{
    width:36px;
  }
  #logo.opened{
    width:12%;
  }
  #logo.closed img{
    display:none;
  }
  #logo img{
    width:100%;
    margin:14.4px 0;
    height:78.55px;
  }
  // .icon-container{
  //   margin-top:10px;
  //   width:39px;
  // }
  .icon-container-status{
    margin-top:-4px;
  }
  .numberBox{
    // width:25%;
    margin-top:12px;
  }
  .navbar-buttons{
    margin-left:4px;
    margin-top:12px;
  }
  .navbar-forms{
    width:324px;
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  #logo{
    width:137px;
    background:#263445;
    height:108.55px;
    box-sizing: border-box;
    transition: width .3s;
  }
  #logo.closed{
    width:36px;
  }
  #logo.opened{
    width:12%;
  }
  #logo.closed img{
    display:none;
  }
  #logo img{
    width:100%;
    margin:14.4px 0;
    height:78.55px;
  }
  .message{
    margin-right:3px;
    margin-top:19px;
  }
  .user{
    margin-right:3px;
    margin-top:20px;
  }
  .wechat{
    margin-right:3px;
    margin-top:20px;
    margin-left:20px;
    .el-button{
      border-color:#2AA145;
      background:#2AA145;
    }
    .el-button:hover{
      border-color:#2AA145;
      background:#2AA145;
      opacity:0.7;
    }
    .el-button:active{
      border-color:#2AA145;
      background:#2AA145;
      opacity:1;
    }
  }
  .outline.wechat{
    margin-right:3px;
    margin-top:20px;
    margin-left:20px;
    .el-button{
      border-color:#333;
      background:#333;
    }
    .el-button:hover{
      border-color:#333;
      background:#333;
      opacity:0.7;
    }
    .el-button:active{
      border-color:#333;
      background:#333;
      opacity:1;
    }
  }
  .status-container{
    font-size:14px;
    width:107px;
    margin-right:7px;
    margin-left:7px;
  }
  .status-container.call{
    width:120px;
  }
  .icon-size{
    font-size:25px;
  }
  .el-button.is-circle {
    border-radius: 50%;
    padding: 7px;
  }
  // .icon-container{
  //   margin-top:-2px;
  //   width:39px;
  // }
  .navbar-buttons{
    margin-left:4px;
    margin-top:11px;
  }
  .navbar-forms{
    width:321px;
  }
}
// @media all and (min-width:400px) and (max-width:1023px)  {

// }
.img-all{
  cursor:pointer;width:100%;
  border-radius:5px;
  border:3px solid #909399;
}
.img-all:hover{
  transition:box-shadow .5s;
  box-shadow: 0px 0px 5px 2px #888;
}
.navbar{
  width:100%;
  height:109px;
  line-height:0 !important;
  border-radius: 0px !important;
  // -webkit-box-shadow: 0 4px 5px #888;
  // box-shadow:  0 4px 5px #888;
  .el-form-item{
    margin-bottom:0;
    height:30px;
  }
  .el-breadcrumb{
    height:20px;
    margin-left:-0.1% !important;
    line-height:0;
    span{
      float:left;
      height:20px;
      line-height:0;
    }
  }
  .el-col>.el-row>.el-col .el-row{
    height:70px;
  }
  .txtDN .el-form-item__content{
    margin-top:3%;
    // width:53% !important;
  }
  .txtDN label{
    margin-bottom:4%;
  }
  .state_now .el-form-item__content{
    // margin-top:4%;
    width:100% !important;
  }
  .state_now{
    // margin-top:1%;
    width:55%;
  }

  .userInfo{
    div{
      line-height:29px;
    }
    p{
      height:20px;
      font-size: 14px;
      b,span{
        height:16px;
        line-height:16px;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-button{
  width:auto;
}
p{
  margin:0;
}
.navbar.open{
  transition: width 0.3s;
  width:90%;
  position:fixed;
  z-index:999;
}
.navbar.close{
  transition: width 0.3s;
  width:100%
}
.navbar {
  line-height: 50px;
  border-radius: 0px !important;
  margin-bottom:0px;
  position:fixed;
  z-index:999;
  width:100%;
  background:#F8F8F8;
  // .hamburger-container {
  //   line-height: 58px;
  //   height: 50px;
  //   float: left;
  //   padding: 0 10px;
  // }
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
