<template>
  <div class="app-container work-bench">
    <div >
      <el-row :gutter="5">

        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <!--<div slot="header" class="clearfix">-->
              <!--<div style="display: inline-block;line-height: 50px">-->
                <!--<font style="font-size:large;color:#fff;padding-right: 5px">首拨总数量: </font>-->
                <!--<font style="font-size:large;color:rgb(255,255,0);">{{obTaskData.firstCallTotal}}</font>-->
              <!--</div>-->
              <!--<div style="display: inline-block;line-height: 50px;width:10%;float:right;"><i class="el-icon-phone-outline" style="color:white;cursor:pointer;font-size:25px;font-weight:bold"  @click="changeToDailTask('0')"></i></div>-->
            <!--</div>-->
            <div slot="header" class="clearfix">
              <div>
                <b>外呼任务统计</b>
              </div>
              <div class="font12" style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToDailTask('0')">
                <font style="padding-right: 5px">首拨总数量: </font>
                <font class="bold under-line">{{obTaskData.firstCallTotal}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="never" class="no-border">
                    <div class="item-content" @click="changeToDailTask('1')">
                      <font class="line-center font30 under-line">{{obTaskData.appointCallTotal}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">总预约量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content" @click="changeToDailTask('2')">
                      <font class="line-center font30 under-line">{{obTaskData.successCallTotal}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">今日总成功量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content" @click="changeToDailTask('3')">
                      <font class="line-center font30 under-line">{{obTaskData.failedCallTotal}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">今日总失败量</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <div slot="header" class="clearfix">
              <div>
                <b>订单</b>
              </div>
              <div class="font12" style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToOrderManagement()">
                <font style="padding-right: 5px">订单数量: </font>
                <font class="bold under-line">{{orderData.count}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a class="bold" @click="changeToOrderManagement()" >
                        <font class="line-center font30 under-line">{{orderData.total_amount}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12">订单总金额</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a class="bold" @click="changeToOrderManagement()">
                        <font class="line-center font30 under-line">{{orderData.avg_amount}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">订单平均金额</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <div slot="header" class="clearfix">
              <div>
                <b>通话统计</b>
              </div>
              <div>
                <div class="font12" style="display: inline-block;line-height: 25px;">
                  <font style="padding-right: 5px">通话时间: </font>
                  <font class="bold" >{{ctiData.call_time_duration}}</font>
                </div>
                <div class="font12" style="float: right;line-height: 25px">
                  <font style="padding-right: 5px">通话次数: </font>
                  <font class="bold under-line" style="cursor: pointer" @click="changeToDailTaskList()">{{ctiData.calls_number}}</font>
                </div>
              </div>
              <div class="font12">
                <div style="display: inline-block;line-height: 25px">
                  <font style="padding-right: 5px">在线人数: </font>
                  <font class="bold under-line" style="cursor: pointer" @click="changeToMonitorPhone()">{{onlineNum}}</font>
                </div>
                <div style="float:right;" class="font12">
                  <font style="padding-right: 5px">部门人数: </font>
                  <font class="bold under-line" style="cursor: pointer" @click="changeToMonitorPhone()">{{totalNum}}</font>
                </div>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" >
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a @click="changeToMonitorPhone()">
                        <font class="line-center font30 under-line">{{ctiData.online_time_duration}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">在线时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a @click="changeToMonitorPhone()">
                        <font class="line-center font30 under-line">{{ctiData.free_time_duration}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">空闲时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a @click="changeToMonitorPhone()">
                        <font class="line-center font30 under-line" >{{ctiData.busy_time_duration}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">示忙时长</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>

      </el-row>

    </div>
    <div class="table-container">
      <el-row>
        <div class="work-title-style font14 bold">拨打任务情况</div>
      </el-row>
      <el-row style="margin-top:20px;">
          <el-col>
            <el-table :data="obTaskTable">
              <el-table-column align="center" label="部门人员" width="135">
                <template slot-scope="scope">
                    <div>{{agentMap[scope.row.staffId]+" ("+scope.row.staffId+")"}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="首拨数量"
                prop="noContactNum">
              </el-table-column>
              <el-table-column
                align="center"
                label="预约量"
                prop="appiontNum"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                align="center"
                label="今日成功量"
                prop="successNum">
              </el-table-column>
              <el-table-column
                align="center"
                label="今日失败量"
                prop="failNum"
                :show-overflow-tooltip="true">
              </el-table-column>
            </el-table>
          </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-row>
        <div class="work-title-style font14 bold">业务表单情况</div>
      </el-row>
      <el-row style="margin-top:20px;">
          <el-col>
            <el-table :data="orderTable">
              <el-table-column align="center" label="部门人员" width="135">
                <template slot-scope="scope">
                    <div>{{agentMap[scope.row.agent_id] +" ("+scope.row.agent_id+")"}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="订单数量"
                prop="count">
              </el-table-column>
              <el-table-column
                align="center"
                label="订单总金额"
                prop="total_amount"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column
                align="center"
                label="订单平均金额"
                prop="avg_amount">
              </el-table-column>
            </el-table>
          </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-row>
        <div class="work-title-style font14 bold">话机使用情况</div>
      </el-row>
      <el-row style="margin-top:20px;">
          <el-col>
            <el-table :data="ctiTable">
              <el-table-column align="center" label="部门人员" width="135">
                <template slot-scope="scope">
                    <div>{{agentMap[scope.row.agent_id] +" ("+scope.row.agent_id+")"}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="通话时间">
                <template slot-scope="scope">
                    <div>{{formatSeconds(scope.row.call_time_duration)}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="通话次数"
                prop="calls_number"
                :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column align="center" label="在线时长">
                <template slot-scope="scope">
                  <div>{{formatSeconds(scope.row.online_time_duration)}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="空闲时长">
                <template slot-scope="scope">
                  <div>{{formatSeconds(scope.row.free_time_duration)}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="示忙时长">
                <template slot-scope="scope">
                  <div>{{formatSeconds(scope.row.busy_time_duration)}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { formatDateTime, getStartTimestamp, getEndTimestamp, formatSeconds } from '@/utils/tools'
import cti from '@/utils/monitorcti_m'
// import { reportAgent } from '@/api/ctiReport'
import { taskAssignInfo, agentStatus, findCampaignByUser, departAgents, orderReportStatistics, agentOrderStatistics, ctiRecordStatistics, ctiReportByAgent } from '@/api/monitor_workingset'
var baseinfo = null
export default {
  name: 'monitor_workingset',
  data() {
    return {
      // 定时器数组，累计在线，空闲，示忙和通话情况
      online_interval: null,
      free_interval: null,
      busy_interval: null,
      call_interval: null,
      online_time_duration: 0, // 在线时长暂存
      free_time_duration: 0, // 空闲时长暂存
      busy_time_duration: 0, // 示忙时长暂存
      call_time_duration: 0, // 通话时长暂存
      updateTime: 0, // 组员状态更新的当前时间毫秒值
      agentStatusMap: {}, // 保存组下所有员工的情况
      selectStatus: 'today',
      ischecked: true,
      obTaskData: {
        firstCallTotal: 0, // 首拨
        appointCallTotal: 0, // 预约
        successCallTotal: 0, // 成功
        failedCallTotal: 0// 失败
      },
      orderData: {
        count: 0, // 数量
        total_amount: 0, // 总金额
        avg_amount: 0// 平均金额
      },
      ctiData: {
        online_time_duration: 0, // 在线时长展示
        free_time_duration: 0, // 空闲时长展示
        busy_time_duration: 0, // 示忙时长展示
        call_time_duration: 0, // 通话时长展示
        calls_number: 0// 通话次数
      },
      obTaskTable: [],
      orderTable: [],
      ctiTable: [],
      agentMap: {},
      totalNum: 0,
      onlineNum: 0,
      agentArray: [],
      downAgents: [],
      campaignIdArray: [],
      timerOnline: null,
      timerOrder: null,
      timerObTask: null,
      timerOnlineStatus: null
    }
  },
  beforeDestroy() {
    if (this.timerOnline) {
      clearInterval(this.timerOnline)
    }
    if (this.timerOrder) {
      clearInterval(this.timerNumber)
    }
    if (this.timerObTask) {
      clearInterval(this.timerObTask)
    }
    if (this.timerOnlineStatus) {
      clearInterval(this.timerOnlineStatus)
    }
    baseinfo.closeInterval()
    baseinfo.monitorlogoff()
    this.$store.dispatch('SwitchNeedLoginMgrPhone', { monitorId: localStorage.getItem('agentId'), monitorDN: '12345' })
    // cti.onClose()
  },
  destroyed() {
    // baseinfo.agentArray.forEach(ele => {
    //   localStorage.removeItem('m_' + ele)
    // })
    baseinfo.monitorlogoff()
    baseinfo.closeInterval()
    this.$store.dispatch('SwitchNeedLoginMgrPhone', { monitorId: localStorage.getItem('agentId'), monitorDN: '12345' })
    // cti.onClose()
  },
  mounted() {
    baseinfo = this
    baseinfo.monitorID = localStorage.getItem('agentId')
    if (localStorage.getItem('DN')) {
      baseinfo.monitorDN = localStorage.getItem('DN')
    } else {
      baseinfo.monitorDN = '12345'
    }
    // 加载组员情况
    departAgents({ depart_id: localStorage.getItem('departId') }).then(res => {
      this.agentMap = {}
      this.agentStatusMap = {}
      if ((!res.data.error) && (typeof res.data.result.agents !== 'undefined')) {
        this.totalNum = res.data.result.agents.length
        this.agentArray = []
        this.downAgents = []
        res.data.result.agents.forEach(element => {
          const agent_id = (element.agent_id).toString()
          const real_name = element.real_name
          this.agentMap[agent_id] = real_name
          const obj = {}
          obj.real_name = real_name
          obj.busy_time_duration = 0
          obj.free_time_duration = 0
          obj.online_time_duration = 0
          obj.call_time_duration = 0
          obj.updateTime = 0
          this.agentStatusMap[agent_id] = obj
          this.agentArray.push(element.agent_id)
          if (element.agent_id !== localStorage.getItem('agentId')) {
            this.downAgents.push(element.agent_id)
          }
        })
        this.$root.eventHub.$emit('monitor_workingset', this.agentArray)
        agentStatus({ agent_id: this.agentArray.join(',') }).then(res => {
          if (!res.data.errorCode) {
            if (res.data && res.data.result && res.data.result.length > 0) {
              for (let i = 0; i < res.data.result.length; i++) {
                const obj = {}
                // console.log(res.data.result[i])
                obj.busy_time_duration = res.data.result[i].busy_time_duration
                obj.free_time_duration = res.data.result[i].free_time_duration
                obj.online_time_duration = res.data.result[i].online_time_duration
                obj.updateTime = res.data.result[i].last_update_time
                baseinfo[res.data.result[i].agent_id] = obj
              }
              this.closeInterval()// 关闭所有定时器
              if (this.online_interval == null && this.call_interval == null &&
              this.free_interval == null && this.busy_interval == null) {
                this.sumTotal(baseinfo.agentStatusMap)
              }
            }
          }
        })
        // 先加载组员情况
        if (baseinfo.monitorID && baseinfo.monitorDN) {
          cti.connectCTI(process.env.CTI_MONITOR_WS_SERVERURL)
        }
      }
    })
    this.online()
    this.order()
    this.obTask()
    // this.timerOnline = setInterval(this.online, 300000)
    this.timerOrder = setInterval(this.order, 600000)
    this.timerObTask = setInterval(this.obTask, 600000)
    // this.timerOnlineStatus = setTimeout(this.onlinneStatus, 5000)
    this.$store.dispatch('SwitchNeedLoginMgrPhone', { monitorId: localStorage.getItem('agentId'), monitorDN: '12345' })
  },
  methods: {
    changeToDailTaskList() { // 跳转到接触记录
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.contactRecordQuery,
        query: { 'callStatu': 1, 'sTime': formatDateTime(new Date().setHours(0, 0, 0, 0)), 'eTime': formatDateTime(new Date().setHours(23, 59, 59, 0)), 'agentid': '', 'contactType': '1' }
      })
    },
    on_queuecount(event, queuename, queuecount) {
      console.log(event, queuename, queuecount)
    },
    on_SessionClose(evt) {
      console.log(evt)
    },
    fomart(time) {
      const hours = ('' + Math.floor(time / 3600)).length === 1 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600)
      const minutes = ('' + Math.floor((time - hours * 3600) / 60)).length === 1 ? '0' + Math.floor((time - hours * 3600) / 60) : Math.floor((time - hours * 3600) / 60)
      const seconds = ('' + (time - hours * 3600 - minutes * 60)).length === 1 ? '0' + (time - hours * 3600 - minutes * 60) : time - hours * 3600 - minutes * 60
      return hours + ':' + minutes + ':' + seconds
    },
    sumTotal(obj) {
      // 初始化示忙时间，通话时间，空闲时间和在线时间
      let busy_time_duration = baseinfo.busy_time_duration
      let call_time_duration = baseinfo.call_time_duration
      let free_time_duration = baseinfo.free_time_duration
      let online_time_duration = baseinfo.online_time_duration
      // 初始化示忙人数，通话人数，空闲人数，在线人数
      let busySum = 0
      let callSum = 0
      let freeSum = 0
      let onlineSum = 0
      this.agentArray.forEach(element => {
        // busy_time_duration = busy_time_duration + (obj[element].busy_time_duration ? obj[element].busy_time_duration : 0)
        // call_time_duration = call_time_duration + (obj[element].call_time_duration ? obj[element].call_time_duration : 0)
        // free_time_duration = free_time_duration + (obj[element].free_time_duration ? obj[element].free_time_duration : 0)
        // online_time_duration = online_time_duration + (obj[element].online_time_duration ? obj[element].online_time_duration : 0)

        let stillTime = 0
        // if (obj[element].updateTime !== baseinfo.updateTime) { // 说明不是由这个员工状态改变引起的计算,需要计算间隔时间，然后统一到更新时间
        // obj[element].stillTime = baseinfo.updateTime - (obj[element].updateTime ? obj[element].updateTime : 0)
        // obj[element].updateTime = baseinfo.updateTime
        // console.log(new Date().setHours(0, 0, 0, 0))
        obj[element].updateTime = obj[element] ? ((obj[element].updateTime < new Date().setHours(0, 0, 0, 0)) ? new Date().setHours(0, 0, 0, 0) : obj[element].updateTime) : new Date().getTime()
        stillTime = new Date().getTime() - obj[element].updateTime
        if (obj[element].isTrans) { // 转接过程中，时间翻倍，通话加1
          stillTime = stillTime + (new Date().getTime() - obj[element].transTalking)
          // callSum = callSum + 1
        }
        // } else {
        //   obj[element].updateTime = (obj[element].updateTime < new Date().setHours(0, 0, 0, 0)) ? new Date().setHours(0, 0, 0, 0) : obj[element].updateTime
        //   stillTime = new Date().getTime() - obj[element].updatetime
        // }
        switch (obj[element].reasoncode) {
          case '0':// 就绪，累计在线和空闲时间;在线和空闲人数
            free_time_duration = free_time_duration + stillTime / 1000
            online_time_duration = online_time_duration + stillTime / 1000
            freeSum = freeSum + 1
            onlineSum = onlineSum + 1
            break
          case '-101':// 通话，累计在线时间,通话人数
          case '-100':// 通话，累计在线时间，通话人数
            online_time_duration = online_time_duration + stillTime / 1000
            call_time_duration = call_time_duration + stillTime / 1000
            callSum = callSum + 1
            onlineSum = onlineSum + 1
            break
          case '-3':// 来电，累计在线时间
          case '-4':// 去电，累计在线时间
            if (obj[element].beforeStatus === '-101' || obj[element].beforeStatus === '-100' || obj[element].beforeStatus === '-4') { // 说明是转接通话加1，时长加1倍，或者是通话取回，同理
              call_time_duration = call_time_duration + stillTime / 1000
              callSum = callSum + 1
            }
            online_time_duration = online_time_duration + stillTime / 1000
            onlineSum = onlineSum + 1
            break
          case '14':// 后处理，累计在线时间
            online_time_duration = online_time_duration + stillTime / 1000
            onlineSum = onlineSum + 1
            break
          case '13':// 示忙，累计在线和示忙时间
            busy_time_duration = busy_time_duration + stillTime / 1000
            online_time_duration = online_time_duration + stillTime / 1000
            busySum = busySum + 1
            onlineSum = onlineSum + 1
            break
          case '-5':// 外呼就绪，累计在线时间
          case '-6':// 外呼占用，累计在线时间
            online_time_duration = online_time_duration + stillTime / 1000
            onlineSum = onlineSum + 1
            break
          case '-1':// 登出，不做计算时间处理
          case '-2':// 登出，不做计算时间处理
            break
        }
      })
      baseinfo.onlineNum = onlineSum
      baseinfo.ctiData.calls_number = baseinfo.ctiData.calls_number + callSum
      if (busySum > 0) {
        baseinfo.timesInterval('busy_time_duration', busy_time_duration, busySum)
      }
      if (callSum > 0) {
        baseinfo.timesInterval('call_time_duration', call_time_duration, callSum)
      }
      if (onlineSum > 0) {
        baseinfo.timesInterval('online_time_duration', online_time_duration, onlineSum)
      }
      if (freeSum > 0) {
        baseinfo.timesInterval('free_time_duration', free_time_duration, freeSum)
      }
    },
    closeInterval() {
      clearInterval(baseinfo.busy_interval)
      baseinfo.busy_interval = null
      clearInterval(baseinfo.free_interval)
      baseinfo.free_interval = null
      clearInterval(baseinfo.online_interval)
      baseinfo.online_interval = null
      clearInterval(baseinfo.call_interval)
      baseinfo.call_interval = null
    },
    getStartTimestamp(timeStr) {
      return moment(timeStr, 'x').valueOf()
    },
    getEndTimestamp(timeStr) {
      return moment(timeStr, 'x').add(1, 'days').subtract(1, 'ms').valueOf()
    },
    on_AgentStatusList(event, agentid, DN, reasoncode, UpdateTime) { // 坐席状态变化
      if (window.location.href.indexOf('monitor_workingset') === -1 && agentid === localStorage.getItem('agentId')) { // 说明不是班长工作台页面，并且是坐席本身则不接收事件变化
        return
      }
      const tempObj = {}
      if (localStorage.getItem('m_' + agentid)) {
        tempObj.DN = DN
        tempObj.beforeStatus = JSON.parse(localStorage.getItem('m_' + agentid)).reasoncode
        tempObj.beforeUpdatetime = JSON.parse(localStorage.getItem('m_' + agentid)).updateTime
        tempObj.reasoncode = reasoncode
        // tempObj.updateTime = new Date(UpdateTime).getTime()
        if (tempObj.reasoncode === '-4' && (tempObj.beforeStatus === '-100' || tempObj.beforeStatus === '-101' || tempObj.beforeStatus === '-4')) {
          tempObj.updateTime = JSON.parse(localStorage.getItem('m_' + agentid)).updateTime
        } else {
          tempObj.updateTime = new Date(UpdateTime).getTime()
        }
      } else {
        tempObj.DN = DN
        tempObj.reasoncode = reasoncode
        tempObj.updateTime = new Date(UpdateTime).getTime()
        tempObj.beforeStatus = reasoncode
        tempObj.beforeUpdatetime = new Date(UpdateTime).getTime()
      }
      // localStorage.setItem('m_' + agentid, JSON.stringify({ 'reasoncode': reasoncode, 'DN': DN, 'updateTime': new Date().getTime() }))
      if (baseinfo.agentStatusMap[agentid]) { // 说明这个坐席是组内的成员
        localStorage.setItem('m_' + agentid, JSON.stringify(tempObj))
        const obj = baseinfo.agentStatusMap[agentid]
        obj.beforeStatus = tempObj.beforeStatus
        obj.beforeUpdatetime = tempObj.beforeUpdatetime
        obj.updateTime = tempObj.updateTime
        obj.reasoncode = reasoncode
        obj.DN = DN
        // 设置更新时间
        baseinfo.updateTime = new Date().getTime()
        baseinfo.agentStatusMap[agentid] = obj
        baseinfo.trigger(agentid, reasoncode, DN)
      }
    },
    trigger(agentid, reasoncode, DN) {
      console.log(agentid, reasoncode, DN)
      // reportAgent({
      //   statistics_type: 'agent',
      //   depart_id: localStorage.getItem('departId'),
      //   time_dimension: 'day',
      //   agent_id: agentid,
      //   start_time: baseinfo.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
      //   end_time: baseinfo.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      // }).then(response => {
      //   const obj = baseinfo.agentStatusMap[agentid]
      //   obj.busy_time_duration = response.data.result[0].busy_time_duration
      //   obj.call_time_duration = response.data.result[0].call_time_duration
      //   obj.free_time_duration = response.data.result[0].free_time_duration
      //   obj.online_time_duration = response.data.result[0].online_time_duration
      //   obj.stillTime = 0 // 修改状态更新的时间
      //   obj.updateTime = new Date().getTime()
      //   baseinfo.updateTime = new Date().getTime()
      //   obj.reasoncode = reasoncode
      //   obj.DN = DN
      //   baseinfo.agentStatusMap[agentid] = obj
      //   baseinfo.sumTotal(baseinfo.agentStatusMap)
      // })
      // 查出这个组总体情况
      let agentids = ''
      if (this.downAgents.length > 0) {
        agentids = this.downAgents.join(',')
      }
      const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), agent_id: agentids, time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
      ctiRecordStatistics(param).then(res => {
        if (!res.data.error && res.data.result && res.data.result.length) {
          baseinfo.ctiData.online_time_duration = baseinfo.fomart(res.data.result[0].online_time_duration)
          baseinfo.online_time_duration = res.data.result[0].online_time_duration
          baseinfo.ctiData.free_time_duration = baseinfo.fomart(res.data.result[0].free_time_duration)
          baseinfo.free_time_duration = res.data.result[0].free_time_duration
          baseinfo.ctiData.busy_time_duration = baseinfo.fomart(res.data.result[0].busy_time_duration)
          baseinfo.busy_time_duration = res.data.result[0].busy_time_duration
          baseinfo.ctiData.call_time_duration = baseinfo.fomart(res.data.result[0].call_time_duration)
          baseinfo.call_time_duration = res.data.result[0].call_time_duration
          baseinfo.ctiData.calls_number = res.data.result[0].calls_number
          this.closeInterval()
          if (this.online_interval == null && this.call_interval == null &&
              this.free_interval == null && this.busy_interval == null) {
            baseinfo.sumTotal(baseinfo.agentStatusMap)
          }
        }
      })
    },
    on_tierlist(event, queue, AgentID) {
      console.log(event)
      console.log(queue)
      console.log(AgentID)
    },
    on_reasonchange(event, agentid, DN, reasoncode) {
      console.log(event)
      if (window.location.href.indexOf('monitor_workingset') === -1 && agentid === localStorage.getItem('agentId')) { // 说明不是班长工作台页面，并且是坐席本身则不接收事件变化
        return
      }
      const tempObj = {}
      if (localStorage.getItem('m_' + agentid)) {
        tempObj.DN = DN
        tempObj.beforeStatus = JSON.parse(localStorage.getItem('m_' + agentid)).reasoncode
        tempObj.beforeUpdatetime = JSON.parse(localStorage.getItem('m_' + agentid)).updateTime
        tempObj.reasoncode = reasoncode
        if (tempObj.reasoncode === '-4' && (tempObj.beforeStatus === '-100' || tempObj.beforeStatus === '-101' || tempObj.beforeStatus === '-4')) {
          tempObj.updateTime = JSON.parse(localStorage.getItem('m_' + agentid)).updateTime
          tempObj.reasoncode = tempObj.beforeStatus
          tempObj.transTalking = ''
          tempObj.isTrans = false
        } else if (tempObj.reasoncode === '-101' && (tempObj.beforeStatus === '-100' || tempObj.beforeStatus === '-101')) { // 转接被接听
          tempObj.updateTime = JSON.parse(localStorage.getItem('m_' + agentid)).updateTime
          tempObj.transTalking = new Date().getTime()
          tempObj.isTrans = true
        } else {
          tempObj.updateTime = new Date().getTime()
          tempObj.transTalking = ''
          tempObj.isTrans = false
        }
      } else {
        tempObj.DN = DN
        tempObj.reasoncode = reasoncode
        tempObj.updateTime = new Date().getTime()
        tempObj.beforeStatus = reasoncode
        tempObj.beforeUpdatetime = new Date().getTime()
        tempObj.transTalking = ''
        tempObj.isTrans = false
      }
      if (baseinfo.agentStatusMap[agentid]) { // 说明这个坐席是组内的成员
        localStorage.setItem('m_' + agentid, JSON.stringify(tempObj))
        const obj = baseinfo.agentStatusMap[agentid]
        obj.beforeStatus = tempObj.beforeStatus
        obj.beforeUpdatetime = tempObj.beforeUpdatetime
        obj.updateTime = tempObj.updateTime
        obj.reasoncode = reasoncode
        obj.DN = DN
        obj.isTrans = tempObj.isTrans
        obj.transTalking = tempObj.transTalking
        // 设置更新时间
        baseinfo.updateTime = new Date().getTime()
        baseinfo.agentStatusMap[agentid] = obj
        baseinfo.trigger(agentid, reasoncode, DN)
      }
    },
    timesInterval(item, timeValue, num) {
      const agentinterval = setInterval(function() {
        if (timeValue) {
          let hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
          let minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
          let seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
          if (seconds === '60') {
            seconds = '00'
            minutes = ('' + (parseInt(minutes) + 1)).length === 2 ? '' + (parseInt(minutes) + 1) : '0' + (parseInt(minutes) + 1)
          }
          if (minutes === '60') {
            minutes = '00'
            hours = ('' + (parseInt(hours) + 1)).length === 1 ? '0' + (parseInt(hours) + 1) : '' + (parseInt(hours) + 1)
          }
          baseinfo.ctiData[item] = hours + ':' + minutes + ':' + seconds
          timeValue = timeValue + num
        }
      }, 1000)
      switch (item) {
        case 'busy_time_duration':
          baseinfo.busy_interval = agentinterval
          break
        case 'call_time_duration':
          baseinfo.call_interval = agentinterval
          break
        case 'online_time_duration':
          baseinfo.online_interval = agentinterval
          break
        case 'free_time_duration':
          baseinfo.free_interval = agentinterval
          break
      }
      // baseinfo.interval.set(item, agentinterval)
    },
    monitorlogin() {
      if (typeof baseinfo.monitorDN === 'undefined' || baseinfo.monitorDN === '' || baseinfo.monitorDN.trim() === '') {
        baseinfo.monitorDN = '12345'
      }
      cti.login('100' + baseinfo.monitorID, baseinfo.monitorDN)
    },
    monitorlogoff() {
      if (typeof baseinfo.monitorDN === 'undefined' || baseinfo.monitorDN === '' || baseinfo.monitorDN.trim() === '') {
        baseinfo.monitorDN = '12345'
      }
      cti.logoff('100' + baseinfo.monitorID, baseinfo.monitorDN)
    },
    on_monistorStatus(event, data) {
      console.log('on_monistorStatus:data=' + data + ',event=' + JSON.parse(event))
    },
    NewSessionConnected(event) {
      this.monitorlogin()
    },
    // onlinneStatus() {
    //   departAgents({ depart_id: localStorage.getItem('departId') }).then(res => {
    //     this.agentMap = {}
    //     if (!res.data.error) {
    //       this.totalNum = res.data.result.agents.length
    //       this.agentArray = []
    //       res.data.result.agents.forEach(element => {
    //         const agent_id = (element.agent_id).toString()
    //         const real_name = element.real_name
    //         this.agentMap[agent_id] = real_name
    //         this.agentArray.push(element.agent_id)
    //       })
    // agentStatus({ agent_id: this.agentArray.join(',') }).then(res => {
    //   if (!res.data.errorCode) {
    //     this.onlineNum = res.data.online_count
    //   }
    // })
    //     }
    //   })
    // },
    online() {
      const obj = { depart_id: localStorage.getItem('departId') }
      departAgents(obj).then(res => {
        this.agentMap = {}
        if ((!res.data.error) && (typeof res.data.result.agents !== 'undefined')) {
          this.totalNum = res.data.result.agents.length
          this.agentArray = []
          res.data.result.agents.forEach(element => {
            const agent_id = (element.agent_id).toString()
            const real_name = element.real_name
            this.agentMap[agent_id] = real_name
            this.agentArray.push(element.agent_id)
          })
          this.obTaskTable = []
          this.agentArray.forEach(element => {
            this.obTaskTable.push({ staffId: element, appiontNum: 0, successNum: 0, failNum: 0, noContactNum: 0 })
          })
          findCampaignByUser().then(res => {
            if (res.data.code === 0 && res.data.data) {
              if (res.data.data) {
                res.data.data.forEach(element => {
                  this.campaignIdArray.push(element.campaignId)
                })
                taskAssignInfo({ modifyTimeStart: formatDateTime(new Date().setHours(0, 0, 0, 0)), modifyTimeEnd: formatDateTime(new Date().setHours(23, 59, 59, 59)), campaignIds: this.campaignIdArray.join(','), type: '0', currentDepartId: localStorage.getItem('departId'), pageSize: 10000 }).then(res => {
                  if (res.data.code === 0 && res.data.data) {
                    for (var i = 0; i < res.data.data.length; i++) {
                      for (var j = 0; j < this.obTaskTable.length; j++) {
                        if (this.obTaskTable[j].staffId === res.data.data[i].staffId) {
                          this.obTaskTable[j].successNum = parseInt(res.data.data[i].successNum) + parseInt(this.obTaskTable[j].successNum)
                          this.obTaskTable[j].failNum = parseInt(res.data.data[i].failNum) + parseInt(this.obTaskTable[j].failNum)
                        }
                      }
                    }
                    taskAssignInfo({ campaignIds: this.campaignIdArray.join(','), type: '0', currentDepartId: localStorage.getItem('departId'), pageSize: 10000 }).then(res => {
                      if (res.data.code === 0 && res.data.data) {
                        for (var i = 0; i < res.data.data.length; i++) {
                          for (var j = 0; j < this.obTaskTable.length; j++) {
                            if (this.obTaskTable[j].staffId === res.data.data[i].staffId) {
                              this.obTaskTable[j].appiontNum = parseInt(res.data.data[i].appiontNum) + parseInt(this.obTaskTable[j].appiontNum)
                              this.obTaskTable[j].noContactNum = parseInt(res.data.data[i].noContactNum) + parseInt(this.obTaskTable[j].noContactNum)
                            }
                          }
                        }
                        this.obTaskData = { firstCallTotal: 0, // 首拨
                          appointCallTotal: 0, // 预约
                          successCallTotal: 0, // 成功
                          failedCallTotal: 0// 失败
                        }
                        this.obTaskTable.forEach(element => {
                          this.obTaskData.firstCallTotal = parseInt(element.noContactNum) + parseInt(this.obTaskData.firstCallTotal)
                          this.obTaskData.appointCallTotal = parseInt(element.appiontNum) + parseInt(this.obTaskData.appointCallTotal)
                          this.obTaskData.successCallTotal = parseInt(element.successNum) + parseInt(this.obTaskData.successCallTotal)
                          this.obTaskData.failedCallTotal = parseInt(element.failNum) + parseInt(this.obTaskData.failedCallTotal)
                        })
                      }
                    })
                  }
                })
              }
              // console.log('####', res.data)
            }
          })
        }
        // console.log(process.env.BASE_API)
      })
    },
    order() {
      const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
      orderReportStatistics(param).then(res => {
        if (!res.data.error && res.data.result && res.data.result.length) {
          this.orderData.count = res.data.result[0].count
          this.orderData.total_amount = res.data.result[0].total_amount
          this.orderData.avg_amount = res.data.result[0].avg_amount
        }
      })
      agentOrderStatistics(param).then(res => {
        if (!res.data.error) {
          this.orderTable = res.data.result
        }
      })
    },
    obTask() {
      const param = { statistics_type: 'agent', depart_id: localStorage.getItem('departId'), time_dimension: 'day', start_time: getStartTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day'), end_time: getEndTimestamp(moment().format(formatDateTime(new Date()).split(' ')[0]), 'day') }
      ctiRecordStatistics(param).then(res => {
        if (!res.data.error) {
          this.ctiData.online_time_duration = this.fomart(res.data.result[0].online_time_duration)
          this.ctiData.free_time_duration = this.fomart(res.data.result[0].free_time_duration)
          this.ctiData.busy_time_duration = this.fomart(res.data.result[0].busy_time_duration)
          this.ctiData.call_time_duration = this.fomart(res.data.result[0].call_time_duration)
          this.ctiData.calls_number = res.data.result[0].calls_number
        }
      })
      ctiReportByAgent(param).then(res => {
        if (!res.data.error) {
          this.ctiTable = res.data.result
        }
      })
    },
    formatSeconds: formatSeconds,
    formatDateTime: formatDateTime,
    // findCallInfo(obj) {
    //   findTotalContactByTime(obj).then(res => {
    //     if (res.data.code === 0) {
    //       this.rowInfo.totalCallOut = res.data.data.callTotalCount
    //       this.rowInfo.totalCallTime = res.data.data.callTotalTime
    //       this.rowInfo.failedCallTotal = res.data.data.callFailCount
    //       this.rowInfo.answerTotal = res.data.data.callSuccessCount
    //       this.selectStatus = obj
    //     }
    //   })
    // },
    changeToDailPage(status) {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.myDialTask,
        query: { 'dialstatus': status, 'isDialTask': false }
      })
      sessionStorage.removeItem('isDialTask')
    },
    // changeToDailInfo(str) {
    //   const startTime = new Date(new Date().setHours(0, 0, 0, 0))
    //   const endTime = new Date(new Date().setHours(23, 59, 59, 0))
    //   let sTime = ''
    //   let eTime = ''
    //   let monthNum = 0
    //   let callStatu = 0 // 未接通状态
    //   switch (str) {
    //     case '0':
    //       callStatu = 0
    //       break
    //     case '1':
    //       callStatu = 1
    //       break
    //   }

    //   switch (this.selectStatus) {
    //     case 'yesterday':
    //       startTime.setDate(startTime.getDate() - 1)
    //       endTime.setDate(endTime.getDate() - 1)
    //       sTime = formatDateTime(startTime)
    //       eTime = formatDateTime(endTime)
    //       break
    //     case 'today':
    //       sTime = formatDateTime(startTime)
    //       eTime = formatDateTime(endTime)
    //       break
    //     case 'month':
    //       startTime.setDate(1)
    //       sTime = formatDateTime(startTime)
    //       monthNum = endTime.getMonth()
    //       eTime = formatDateTime(new Date(new Date(endTime.getFullYear(), ++monthNum, 1) - 1))
    //       break
    //   }
    //   this.$router.push({
    //     name: 'contact_record_dail',
    //     query: { 'sTime': sTime, 'eTime': eTime, 'callStatu': callStatu }
    //   })
    // },
    changeToDailTask(status) {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.myDialTask,
        query: { 'dialstatus': status }
      })
      sessionStorage.removeItem('isDialTask')
      sessionStorage.removeItem('quickDialto')
    },
    changeToOrderManagement() {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.orderManage,
        query: {
          'startTime': formatDateTime(new Date().setHours(0, 0, 0, 0)),
          'endTime': formatDateTime(new Date().setHours(23, 59, 59, 59))
        }
      })
    },
    changeToMonitorPhone() {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.phoneMonitor
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1281px) and (max-width:1367px){
  .work-bench .font30 {
    font-size: 27px !important;
  }
}
@media all and (min-width:1024px) and (max-width:1280px)  {
  .work-bench .font30 {
    font-size: 25px !important;
  }
}
</style>
