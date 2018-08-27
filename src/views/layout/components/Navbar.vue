<template>
  <el-menu :class="navbar" mode="horizontal">
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

  <el-row v-if="havesoftphone">
    <!-- logo预留 -->
    <!-- <el-col :span="2">
      123
    </el-col> -->

    <!-- <el-col :span="16" style="margin-top:1.4%;"> -->

        <el-col :span="17" style="margin-top:0.2%;">
          <el-row style="height:30px;">
            <el-col :span="1" style="margin-left:1%;">
              <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
            </el-col>
            <el-form :inline="true" size="mini">
              <el-col :span="4" style="height:30px;">
                <el-form-item class="txtDN" size="mini">
                  <el-col :span="22"  prop="DN">
                    <el-input v-model="formInline.DN" placeholder="分机号">{{formInline.DN}}</el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" size="mini" style="margin-left:50%;" v-if="!islogin" @click="agentLogin()">登入</el-button>
                    <el-button type="primary" size="mini" style="margin-left:50%;" v-if="islogin" @click="agentLogoff()">登出</el-button>
                  </el-col>
                </el-form-item>
                <!-- <el-form-item style="margin-top:.5%;display:inline;"> -->
                  <!-- <el-button type="primary" size="mini">登入</el-button> -->
                <!-- </el-form-item> -->
              </el-col>

              <el-col :span="4" style="padding-top:0.6%;height:30px;">
                <div style="display:inline-block;width:16%;">
                  <img src="../../../../static/images/nologin_state.png" title="未登录" style="width:100%;" v-if="agentState1">
                  <img src="../../../../static/images/busy_normal.png" title="示忙" style="width:100%;" v-if="agentState2">
                  <img src="../../../../static/images/agentStat38_allReady.png" title="就绪" style="width:100%;" v-if="agentState3">
                  <img src="../../../../static/images/back_state.png" title="坐席状态" style="width:100%;" v-if="agentState4">
                </div>
                <el-form-item class="state_now">
                  <el-select v-model="formInline.region" placeholder="示忙" @change="changeState()">
                    <el-option label="就绪" value="0"></el-option>
                    <el-option label="示忙" value="13"></el-option>
                    <el-option label="后处理" value="14"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="5" style="height:30px;">
                <div style="display:inline-block;width:16%;">
                  <img src="../../../../static/images/answer_disable.png" title="接听(不可用)" style="cursor:pointer;width:100%;" v-if="!answerCall">
                  <img src="../../../../static/images/answer_normal.gif" title="接听" style="cursor:pointer;width:100%;" v-if="answerCall" @click="agentanswercall()">
                </div>
                <el-form-item class="numberBox">
                  <el-col :span="24">
                    <el-input v-model="formInline.user" size="mini"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="9" style="height:30px;">
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/dial_disable.png" title="拨号(不可用)" style="cursor:pointer;width:100%;" v-if="!dialCall">
                  <img src="../../../../static/images/dial_normal.png" title="拨号" style="cursor:pointer;width:100%;" v-if="dialCall" @click="agentdialout()">
                </div>
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/hold_disable.png" title="保持(不可用)" style="cursor:pointer;width:100%;" v-if="holdCall1">
                  <img src="../../../../static/images/hold_normal.png" title="保持" style="cursor:pointer;width:100%;" v-if="holdCall2" @click="agenthold()">
                  <img src="../../../../static/images/holding_state.gif" title="保持" style="cursor:pointer;width:100%;" v-if="holdCall3"  @click="agenthold()">
                </div>
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/trans_disable.png" title="转接(不可用)" style="cursor:pointer;width:100%;" v-if="transCall1">
                  <img src="../../../../static/images/trans_normal.png" title="转接" style="cursor:pointer;width:100%;" v-if="transCall2" @click="agentstarttransfer()">
                  <img src="../../../../static/images/comtrans_normal.gif" title="转接中" style="cursor:pointer;width:100%;" v-if="transCall3" @click="agentstarttransfer()">
                </div>
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/conf_disable.png" title="三方(不可用)" style="cursor:pointer;width:100%;" v-if="confCall1">
                  <img src="../../../../static/images/conf_normal.png" title="三方" style="cursor:pointer;width:100%;" v-if="confCall2" @click="agentstartconffer()">
                  <img src="../../../../static/images/comconf_normal.gif" title="三方" style="cursor:pointer;width:100%;" v-if="confCall3" @click="agentstartconffer()">
                </div>
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/retrieve_disable.png" title="取回(不可用)" style="cursor:pointer;width:100%;" v-if="!retrieveCall">
                  <img src="../../../../static/images/retrieve_normal.png" title="取回" style="cursor:pointer;width:100%;" v-if="retrieveCall" @click=" agentretrieve()">
                </div>
                <div style="display:inline-block;width:8%;">
                  <img src="../../../../static/images/hangup_disable.png" title="挂断(不可用)" style="cursor:pointer;width:100%;" v-if="!hangupCall">
                  <img src="../../../../static/images/hangup_normal.png" title="挂断" style="cursor:pointer;width:100%;" v-if="hangupCall" @click="agenthangup()">
                </div>
              </el-col>
            </el-form>
          </el-row>

          <!-- <el-row style="height:40px;padding-top:15px;padding-right:15px;">
            <breadcrumb></breadcrumb>
          </el-row> -->
        </el-col>


    <el-col :span="7" class="userInfo" style="margin-top:-7px;">
      <el-col :span="6">
        <p>
          <b>状态：</b>
          <span>{{telephoneState}}</span>
        </p>
        <p>
          <b>时长：</b>
          <span>{{timeCount}}</span>
        </p>
      </el-col>
      <el-col :span="6">
        <p>
          <b>主叫：</b>
          <span>{{caller}}</span>
        </p>
        <p>
          <b>被叫：</b>
          <span>{{callee}}</span>
        </p>
        <p>
          <b>原主叫：</b>
          <span>{{orginCaller}}</span>
        </p>
      </el-col>
      <el-col :span="6">
        <p>
          <b>用户：</b>
          <span>{{userInfo.userName}}</span>
        </p>
        <p>
          <b>工号：</b>
          <span>{{userInfo.staffId}}</span>
        </p>
        <p>
          <b>部门：</b>
          <span>{{userInfo.departName}}</span>
        </p>
      </el-col>
      <el-col :span="3" style="margin-top:18px;">
        <el-button type="primary" @click="logout" size="mini">注销</el-button>
      </el-col>
    </el-col>
  </el-row>
  <el-row v-if="!havesoftphone">
    <div style="display:inline-block;margin-left:1%;">
     <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </div>
    <div style="float:right;margin-right:3%;">
          <b>用户：</b>
          <span>{{userInfo.userName}}</span>
          &nbsp; &nbsp;
          <b>工号：</b>
          <span>{{userInfo.staffId}}</span>
          &nbsp; &nbsp;
          <b>部门：</b>
          <span>{{userInfo.departName}}</span>
          &nbsp; &nbsp; &nbsp;
          <el-button type="primary" @click="logout" size="mini">注销</el-button>
    </div>

  </el-row>
  </el-menu>

</template>

<script>

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserInfo } from '@/api/dashboard'
import { Message } from 'element-ui'
import { addComeContact, addDialContact, addAnswerContact, addHangupContact, getPhoneOwn, checkSoftphonePerm } from '@/api/navbar'

import cti from '@/utils/ctijs'
var vm = null
var interval = null
export default {
  name: 'layout',
  data() {
    return {
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
      agentState1: true,
      agentState2: false,
      agentState3: false,
      agentState4: false,
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
      navbar: 'navbar',
      sidebarStatus: ''
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
    ]),
    sidebar() {
      this.sidebarStatus = this.$store.state.app.sidebar
      return this.$store.state.app.sidebar
    }
  },
  methods: {
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
    changeState() {
      if (this.islogin) {
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
          if (res.data.data[0].zipCode === '518000' && res.data.data[0].areaCode === '0755') { // 深圳市邮编518000，区号0755
            vm.dialNum = '9' + vm.formInline.user
          } else {
            vm.dialNum = '90' + vm.formInline.user
          }
          resolve()
        })
      })
    },
    agentdialout() {
      const DN = this.formInline.DN
      vm.dialNum = this.formInline.user
      const reg = /^([1-9][0-9]{2,10}|[0-9]{1,4}\-?[0-9]{1,4}\-?[0-9]{1,9})$/
      if (DN === vm.dialNum) {
        Message({
          message: '不能拨打自己本身',
          type: 'error',
          duration: 1 * 1000
        })
      } else {
        if (reg.test(vm.dialNum)) {
          const regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01356789]|18[0-9]|19[89])\d{8}$/
          if (regex.test(vm.dialNum)) {
            this.getPromise(vm.dialNum).then(function() {
              cti.makecall(DN, vm.dialNum)
            })
          } else {
            cti.makecall(DN, vm.dialNum)
          }
        } else {
          Message({
            message: '号码不规范',
            type: 'error',
            duration: 1 * 1000
          })
        }
      }
    },
    agentLogin() {
      const agentId = localStorage.getItem('agentId')
      const DN = this.formInline.DN
      if (agentId !== null && DN !== null && DN !== '') {
        cti.login(agentId, this.formInline.DN, '518', '1', '0')
        if (this.reasonCode === '-1' || this.reasonCode === '-2') {
          // localStorage.setItem('callerDN', null)
          localStorage.setItem('DN', null)
        } else {
          // localStorage.setItem('callerDN', DN)
          localStorage.setItem('DN', DN)
        }
      }
    },
    agentLogoff() {
      const agentId = localStorage.getItem('agentId')
      const DN = this.formInline.DN
      if (agentId !== null && DN !== null && DN !== '') {
        cti.logoff(agentId, DN, 9)
        localStorage.removeItem('DN')
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
        case 'sessionclosed':this.agentState1 = true
          this.agentState2 = false
          this.agentState3 = false
          this.agentState4 = false// 未登录状态
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
        case 'logoff':
          this.agentState1 = true
          this.agentState2 = false
          this.agentState3 = false
          this.agentState4 = false// 未登录状态
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
          this.agentState4 = false// 未登录状态
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
      addHangupContact({
        'event': 'on_hangup_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID
      }).then(res => {
        console.log('新增挂断电话的记录：' + res)
      }).catch(error => {
        console.log('error:' + error)
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
      vm.setbtnStatus('talking')
    },
    on_ringback_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, activeLine) {
      vm.caller = callerid
      vm.callee = calleeid
      vm.orginCaller = ori_ani
      vm.global_taskId = localStorage.getItem('global_taskId')
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
    on_ringing_event(event, agentid, DN, UUID, callerid, calleeid, ori_ani, other_leg_uuid, queueName, activeLine) {
      vm.caller = callerid
      vm.callee = calleeid
      vm.orginCaller = ori_ani
      addComeContact({
        'event': 'on_ringing_event', 'agentid': agentid, 'DN': DN, 'UUID': UUID, 'callerid': callerid, 'calleeid': calleeid, 'ori_ani': ori_ani, 'other_leg_uuid': other_leg_uuid, 'ringing_time': new Date(), 'callDirection': 1
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
    },
    on_reasonchange(event, agentId, DN, reasonCode) {
      console.log('响应事件：改变话机状态' + event + ',员工工号：' + agentId + '，分机：' + DN + '，状态码：' + reasonCode)
      switch (reasonCode) {
        case '-1':
          vm.islogin = false
          vm.timeCount = ''
          vm.telephoneState = '登出'
          clearInterval(interval)
          vm.setbtnStatus('logoff')
          break
        case '0':
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
          vm.formInline.region = '就绪'
          vm.setbtnStatus('login')
          break
        case '13':
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
          vm.formInline.region = '示忙'
          vm.setbtnStatus('login')
          break
        case '14':
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
          vm.formInline.region = '后处理'
          vm.setbtnStatus('login')
          break
        case '-100':
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
          break
        case '-101':
          vm.islogin = true
          vm.oldtelephonestate = vm.telephoneState
          vm.telephoneState = '去电通话中'
          if (vm.oldtelephonestate !== vm.telephoneState) {
            clearInterval(interval)
            vm.times()
          }

          if (vm.orginCaller === 'WisperCall' || vm.orginCaller === 'IntrudeCall') { // 表示是强插或者耳语功能
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
          break
        case '-2':
          vm.timeCount = ''
          vm.telephoneState = '登出'
          clearInterval(interval)
          vm.islogin = false
          vm.setbtnStatus('logoff')
          break
      }
      vm.reasonCode = reasonCode
      localStorage.setItem('reasonCode', vm.reasonCode)
    },
    on_loginsucess(event, agentId, DN) {
      console.log('响应事件：登录成功' + event + ',员工工号：' + agentId + '，分机：' + DN)
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
      console.log('error')
      vm.setbtnStatus('logoff')
    },
    on_SessionClose(event) {
      vm.bolConnected = false
      vm.islogin = false
      console.log('closed')
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
    },
    logout() {
      vm.agentLogoff()
      this.$store.dispatch('LogOut').then((data) => {
        if (data.info) {
          this.$router.push({ path: '/login' })
          // location.reload() // 为了重新实例化vue-router对象 避免bug
        }
      })
    }
  },
  mounted() {
    vm = this
    const agentId = localStorage.getItem('agentId')
    // const menu = []
    // getMenu().then(res => {
    //   menu = res.data.data.map(function(item, index) {
    //     return item.parent_menu_name
    //   })
    //   this.havesoftphone = (menu.indexOf('软电话') > -1)
    //   if (this.havesoftphone) {
    //     cti.connectCTI('ws://119.27.179.175:9050/')
    //   }
    // }).catch(error => {
    //   console.log(error)
    // })
    checkSoftphonePerm(agentId).then(res => {
      this.havesoftphone = true
      cti.connectCTI('ws://119.27.179.175:9050/')
    }).catch(error => {
      console.log(error)
    })
    getUserInfo().then(res => {
      this.userInfo.userName = res.data.staffName
      this.userInfo.staffId = res.data.agentId
      this.userInfo.departName = res.data.departName
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

.navbar{
  width:100%;
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
    width:53% !important;
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
  .numberBox .el-form-item__content{
    // width:55%;
    margin-top:4%;
  }
  .numberBox{
    width:65%;
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
  box-shadow: 0 0 5px #888;
  margin-bottom:0px;
  position:fixed;
  z-index:999;
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

