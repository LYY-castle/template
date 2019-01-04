<template>
  <div class="app-container">
    <div>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToDailTask('0','agent')">
                <font style="font-size:large;color:#fff;padding-right: 5px">首拨数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{rowData.firstCallTotal}}</font>
              </div>
              <div style="float: right;line-height: 50px;cursor: pointer" @click="changeToDailTask('1','agent')">
                <font style="font-size:medium;color:#fff;padding-right: 5px">预约数量: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{rowData.appointCallTotal}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <!--<el-col :span="8" >-->
                  <!--<el-card shadow="hover" style="background-color:#f66">-->
                      <!--<div class="circle" style="border:solid #f66 1px;background-color:#fff;">-->
                        <!--<a @click="changeToDailTask('1')"><font class="line-center" style="color:#f66;">{{rowData.appointCallTotal}}</font></a>-->
                      <!--</div>-->
                    <!--<div style="text-align: center">-->
                      <!--<font class="text-align-center" style="font-size: small">预约名单</font>-->
                    <!--</div>-->
                  <!--</el-card>-->
                <!--</el-col>-->
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <a @click="changeToDailTask('2','agent')"><font class="line-center" style="color:#36a9ce;">{{new_success_contact_task_count}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日成功量</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <a @click="changeToDailTask('3','agent')"><font class="line-center" style="color:#eb7f36;">{{new_fail_contact_task_count}}</font></a>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">今日失败量</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;cursor: pointer" @click="changeToOrderManagement('0')">
                <font style="font-size:large;color:#fff;padding-right: 5px">订单数量: </font>
                <font style="font-size:large;color:rgb(255,255,0);">{{count}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <font class="line-center" style="color:#36a9ce;">{{total_amount}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">订单总金额</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8" :offset="3">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{avg_amount}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">订单平均金额</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" style="background-color:#339999;">
            <div slot="header" class="clearfix">
              <div style="display: inline-block;line-height: 50px;">
                <font style="font-size:medium;color:#fff;padding-right: 5px">通话时间: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{ord_call_time_duration}}</font>
              </div>
              <div style="float: right;line-height: 50px">
                <font style="font-size:medium;color:#fff;padding-right: 5px">通话次数: </font>
                <font style="font-size:medium;color:rgb(255,255,0);">{{calls_number}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{ord_online_time_duration}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">在线时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#36a9ce">
                    <div class="circle" style="border:solid #36a9ce 1px;background-color:#fff;">
                      <font class="line-center" style="color:#36a9ce;">{{ord_free_time_duration}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">空闲时长</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="hover" style="background-color:#eb7f36">
                    <div class="circle"  style="border:solid #eb7f36 1px;background-color:#fff;">
                      <font class="line-center" style="color:#eb7f36;">{{ord_busy_time_duration}}</font>
                    </div>
                    <div style="text-align: center">
                      <font class="text-align-center" style="font-size: small">示忙时长</font>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>



  </div>
</template>

<script>
// import { Message, MessageBox } from 'element-ui'
import { formatDateTime, sec_to_time } from '@/utils/tools'
import { getDepartId, obreportAgent, orderreportAgent, reportAgent } from '@/api/ctiReport'
import { findContactHistory, findTotalContactByTime } from '@/api/ord_workingset'
import moment from 'moment'
var baseinfo = null
export default {
  name: 'ord_workingset',
  data() {
    return {
      totalInfo: {}, // 用于统计在线时长，空闲时长，示忙时长，通话时间的对象
      interval: {}, // 定时器数组，在线时长，空闲时长，示忙时长，通话时间
      monitorID: '',
      monitorDN: '',
      freetimeInterval: '', // 空闲计时器
      calltimeInterval: '', // 通话计时器
      busytimeInterval: '', // 示忙计时器
      onlineInterval: '', // 在线计时器
      ord_busy_time_duration: '',
      ord_call_time_duration: '',
      calls_number: 0,
      ord_free_time_duration: '',
      ord_online_time_duration: '',
      count: '',
      total_amount: '',
      avg_amount: '',
      new_appoint_contact_task_count: '',
      new_fail_contact_task_count: '',
      new_first_dial_task_count: '',
      new_success_contact_task_count: '',
      selectStatus: 'today',
      ischecked: true,
      rowData: {
        firstCallTotal: 0,
        appointCallTotal: 0,
        successCallTotal: 0,
        failedCallTotal: 0
      },
      rowInfo: {
        totalCallOut: 0,
        totalCallTime: '',
        answerTotal: 0,
        failedCallTotal: 0
      },
      departId: '',
      timerOnline: null,
      timerNumber: null
    }
  },
  beforeMount() {
    var self = this
    // this.timerOnline = setInterval(getTotelOnline, 300000)
    this.timerNumber = setInterval(getTotelNumber, 15000)
    function getTotelNumber() {
      getDepartId().then(res => {
        self.departId = res.data.departId
        obreportAgent({
          statistics_type: 'agent',
          depart_id: self.departId,
          time_dimension: 'day',
          agent_id: localStorage.getItem('agentId'),
          start_time: self.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
          end_time: self.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
        }).then(response => {
          // console.log(response)
          self.new_appoint_contact_task_count = response.data.result[0].new_appoint_contact_task_count
          self.new_fail_contact_task_count = response.data.result[0].new_fail_contact_task_count
          self.new_first_dial_task_count = response.data.result[0].new_first_dial_task_count
          self.new_success_contact_task_count = response.data.result[0].new_success_contact_task_count
        })
        orderreportAgent({
          statistics_type: 'agent',
          depart_id: self.departId,
          time_dimension: 'day',
          agent_id: localStorage.getItem('agentId'),
          start_time: self.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
          end_time: self.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
        }).then(response => {
          self.avg_amount = response.data.result[0].avg_amount
          self.total_amount = response.data.result[0].total_amount
          self.count = response.data.result[0].count
        })
      })
      findContactHistory().then(res => {
        if (res.data.code === 0) {
          self.rowData.firstCallTotal = res.data.data.noContactCount
          self.rowData.appointCallTotal = res.data.data.appointCount
          self.rowData.successCallTotal = res.data.data.successCount
          self.rowData.failedCallTotal = res.data.data.failCount
        }
      })
    }

    // function getTotelOnline() {
    //   getDepartId().then(res => {
    //     self.departId = res.data.departId
    //     reportAgent({
    //       statistics_type: 'agent',
    //       depart_id: self.departId,
    //       time_dimension: 'day',
    //       agent_id: localStorage.getItem('agentId'),
    //       start_time: self.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
    //       end_time: self.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
    //     }).then(response => {
    //       self.busy_time_duration = sec_to_time(response.data.result[0].busy_time_duration)
    //       self.call_time_duration = sec_to_time(response.data.result[0].call_time_duration)
    //       self.calls_number = response.data.result[0].calls_number
    //       self.free_time_duration = sec_to_time(response.data.result[0].free_time_duration)
    //       self.online_time_duration = sec_to_time(response.data.result[0].online_time_duration)
    //     })
    //   })
    // }
  },
  beforeDestroy() {
    if (this.timerOnline) {
      clearInterval(this.timerOnline)
    }
    if (this.timerNumber) {
      clearInterval(this.timerNumber)
    }
    this.closeInterval()
  },
  destroyed() {
    baseinfo.$root.eventHub.$off('reasoncodechange')
    baseinfo.$root.eventHub.$emit('ord_set', false)
  },
  created() {
    if (localStorage.getItem(localStorage.getItem('agentId'))) {
      const obj = JSON.parse(localStorage.getItem(localStorage.getItem('agentId')))
      this.on_reasonchange('refreshPage', localStorage.getItem('agentId'), obj.DN, obj.reasoncode)
    }
  },
  mounted() {
    baseinfo = this
    baseinfo.$root.eventHub.$emit('ord_set', true)
    // baseinfo.$root.eventHub.$emit('manualchange', true)
    getDepartId().then(res => {
      this.departId = res.data.departId
      obreportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.new_appoint_contact_task_count = response.data.result[0].new_appoint_contact_task_count
        this.new_fail_contact_task_count = response.data.result[0].new_fail_contact_task_count
        this.new_first_dial_task_count = response.data.result[0].new_first_dial_task_count
        this.new_success_contact_task_count = response.data.result[0].new_success_contact_task_count
      })
      orderreportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.avg_amount = response.data.result[0].avg_amount
        this.total_amount = response.data.result[0].total_amount
        this.count = response.data.result[0].count
      })
      reportAgent({
        statistics_type: 'agent',
        depart_id: this.departId,
        time_dimension: 'day',
        agent_id: localStorage.getItem('agentId'),
        start_time: this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
        end_time: this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
      }).then(response => {
        this.ord_busy_time_duration = sec_to_time(response.data.result[0].busy_time_duration)
        this.ord_call_time_duration = sec_to_time(response.data.result[0].call_time_duration)
        this.calls_number = response.data.result[0].calls_number
        this.ord_free_time_duration = sec_to_time(response.data.result[0].free_time_duration)
        this.ord_online_time_duration = sec_to_time(response.data.result[0].online_time_duration)
      })
    })
    findContactHistory().then(res => {
      if (res.data.code === 0) {
        this.rowData.firstCallTotal = res.data.data.noContactCount
        this.rowData.appointCallTotal = res.data.data.appointCount
        this.rowData.successCallTotal = res.data.data.successCount
        this.rowData.failedCallTotal = res.data.data.failCount
      }
    })
    findTotalContactByTime('today').then(res => {
      if (res.data.code === 0) {
        this.rowInfo.totalCallOut = res.data.data.callTotalCount
        this.rowInfo.totalCallTime = res.data.data.callTotalTime
        this.rowInfo.failedCallTotal = res.data.data.callFailCount
        this.rowInfo.answerTotal = res.data.data.callSuccessCount
        this.selectStatus = 'today'
      }
    })
    // 接收软话机条的消息
    baseinfo.$root.eventHub.$on('reasoncodechange', (obj) => {
      // console.log(obj.event + ',' + obj.agentId + ',' + obj.DN + ',' + obj.reasonCode)
      console.log('接收到改变：', obj.reasonCode)
      console.log('接收到改变事件：', new Date().getTime())
      baseinfo.on_reasonchange(obj.event, obj.agentId, obj.DN, obj.reasonCode + '')
    })
    baseinfo.$root.eventHub.$on('addCall', (obj) => {
      // console.log(obj.event + ',' + obj.agentId + ',' + obj.DN + ',' + obj.reasonCode)
      baseinfo.calls_number = baseinfo.calls_number + 1
    })
    baseinfo.$root.eventHub.$on('closeInterval', (obj) => {
      // console.log(obj.event + ',' + obj.agentId + ',' + obj.DN + ',' + obj.reasonCode)
      baseinfo.closeInterval()
    })
  },
  methods: {
    closeInterval() {
      // if (typeof baseinfo.interval.ord_busy_time_duration !== 'undefined') {
      clearInterval(window.busytimeInterval)
      window.busytimeInterval = null
      // }
      // if (typeof baseinfo.interval.ord_call_time_duration !== 'undefined') {
      clearInterval(window.calltimeInterval)
      window.calltimeInterval = null
      // }
      // if (typeof baseinfo.interval.ord_online_time_duration !== 'undefined') {
      // console.log('删除前' + new Date().getTime(), baseinfo.interval.get('ord_online_time_duration'))
      clearInterval(window.onlineInterval)
      window.onlineInterval = null
      // console.log('删除后' + new Date().getTime(), baseinfo.interval.get('ord_online_time_duration'))
      // }
      // if (typeof baseinfo.interval.ord_free_time_duration !== 'undefined') {
      clearInterval(window.freetimeInterval)
      window.freetimeInterval = null
      // }
    },
    on_reasonchange(event, agentid, DN, reasoncode) {
      this.closeInterval()
      const tempObj = JSON.parse(localStorage.getItem(agentid))
      let stillTime = 0
      if (tempObj) {
        // if ((tempObj.reasoncode === tempObj.beforeStatus) && tempObj.beforeUpdatetime) {
        //   stillTime = new Date(tempObj.updateTime).getTime() - new Date(tempObj.beforeUpdatetime).getTime()
        // }
        stillTime = (new Date().getTime() - new Date(tempObj.updateTime).getTime()) / 1000
      }
      getDepartId().then(res => {
        baseinfo.departId = res.data.departId
        reportAgent({
          statistics_type: 'agent',
          depart_id: baseinfo.departId,
          time_dimension: 'day',
          agent_id: localStorage.getItem('agentId'),
          start_time: baseinfo.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString()))),
          end_time: baseinfo.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))
        }).then(response => {
          baseinfo.totalInfo.busy_time_duration = response.data.result[0].busy_time_duration
          baseinfo.totalInfo.call_time_duration = response.data.result[0].call_time_duration
          baseinfo.totalInfo.free_time_duration = response.data.result[0].free_time_duration
          baseinfo.totalInfo.online_time_duration = response.data.result[0].online_time_duration
          if (agentid === localStorage.getItem('agentId')) {
            switch (reasoncode) {
              case '-101':// 去电通话
              case '-100':// 来电通话
                baseinfo.timesInterval('ord_online_time_duration', baseinfo.totalInfo.online_time_duration + stillTime)
                // baseinfo.timesInterval('ord_busy_time_duration', baseinfo.totalInfo.busy_time_duration)
                baseinfo.timesInterval('ord_call_time_duration', baseinfo.totalInfo.call_time_duration + stillTime)
                // 请求后台数据，刷新定时器
                break
              case '-3':// 来电振铃
              case '-4':// 去电回铃
                // 请求后台数据，刷新定时器
                baseinfo.timesInterval('ord_online_time_duration', baseinfo.totalInfo.online_time_duration + stillTime)
                // baseinfo.timesInterval('ord_busy_time_duration', baseinfo.totalInfo.busy_time_duration)
                break
              case '13':// 示忙
                // 请求后台数据，刷新定时器
                baseinfo.timesInterval('ord_online_time_duration', baseinfo.totalInfo.online_time_duration + stillTime)
                baseinfo.timesInterval('ord_busy_time_duration', baseinfo.totalInfo.busy_time_duration + stillTime)
                break
              case '14':// 后处理
                // 请求后台数据，刷新定时器
                baseinfo.timesInterval('ord_online_time_duration', baseinfo.totalInfo.online_time_duration + stillTime)
                // baseinfo.timesInterval('ord_busy_time_duration', baseinfo.totalInfo.busy_time_duration)
                break
              case '-2':// 登出
              case '-1':// 登出
                // 请求后台数据，刷新定时器
                break
              case '0':// 就绪
                // 请求后台数据，刷新定时器
                baseinfo.timesInterval('ord_online_time_duration', baseinfo.totalInfo.online_time_duration + stillTime)
                baseinfo.timesInterval('ord_free_time_duration', baseinfo.totalInfo.free_time_duration + stillTime)
                break
            }
          }
        })
      })
    },
    timesInterval(item, timeValue) {
      // timeValue = 9000
      // const agentinterval = setInterval(function() {
      //   if (timeValue) {
      //     const hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
      //     const minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
      //     const seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
      //     baseinfo[item] = hours + ':' + minutes + ':' + seconds
      //     timeValue = timeValue + 1
      //   }
      // }, 1000)
      const time = new Date().getTime() - timeValue * 1000
      // console.log('timeValue', timeValue)
      const agentinterval = setInterval(function() {
        if (time) {
          const endtime = new Date()
          const diff = (endtime.getTime() - time) / 1000
          const days = Math.floor(diff / 1440 / 60)
          let hours = ('' + Math.floor((diff - days * 1440 * 60) / 3600)).length === 2 ? Math.floor((diff - days * 1440 * 60) / 3600) : '0' + Math.floor((diff - days * 1440 * 60) / 3600)
          let minutes = ('' + Math.floor((diff - days * 1440 * 60 - hours * 3600) / 60)).length === 2 ? Math.floor((diff - days * 1440 * 60 - hours * 3600) / 60) : '0' + Math.floor((diff - days * 1440 * 60 - hours * 3600) / 60)
          let seconds = ('' + (diff - days * 1440 * 60 - hours * 3600 - minutes * 60).toFixed(0)).length === 2 ? (diff - days * 1440 * 60 - hours * 3600 - minutes * 60).toFixed(0) : '0' + (diff - days * 1440 * 60 - hours * 3600 - minutes * 60).toFixed(0)
          if (seconds === '60') {
            seconds = '00'
            minutes = '' + (parseInt(minutes) + 1)
          }
          if (minutes === '60') {
            minutes = '00'
            hours = '' + (parseInt(hours) + 1)
          }
          baseinfo[item] = hours + ':' + minutes + ':' + seconds
        }
      }, 1000)
      // baseinfo.interval[item] = agentinterval
      switch (item) {
        case 'ord_online_time_duration':
          // window.onlineInterval = setInterval(function() {
          //   if (timeValue) {
          //     const hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
          //     const minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
          //     const seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
          //     baseinfo[item] = hours + ':' + minutes + ':' + seconds
          //     timeValue = timeValue + 1
          //   }
          // }, 1000)
          window.onlineInterval = agentinterval
          break
        case 'ord_free_time_duration':
          // window.freetimeInterval = setInterval(function() {
          //   if (timeValue) {
          //     const hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
          //     const minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
          //     const seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
          //     baseinfo[item] = hours + ':' + minutes + ':' + seconds
          //     timeValue = timeValue + 1
          //   }
          // }, 1000)
          window.freetimeInterval = agentinterval
          break
        case 'ord_call_time_duration':
          // window.calltimeInterval = setInterval(function() {
          //   if (timeValue) {
          //     const hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
          //     const minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
          //     const seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
          //     baseinfo[item] = hours + ':' + minutes + ':' + seconds
          //     timeValue = timeValue + 1
          //   }
          // }, 1000)
          window.calltimeInterval = agentinterval
          break
        case 'ord_busy_time_duration':
          // window.busytimeInterval = setInterval(function() {
          //   if (timeValue) {
          //     const hours = ('' + Math.floor(timeValue / 3600)).length === 1 ? '0' + Math.floor(timeValue / 3600) : Math.floor(timeValue / 3600)
          //     const minutes = ('' + Math.floor((timeValue - hours * 3600) / 60)).length === 2 ? Math.floor((timeValue - hours * 3600) / 60) : '0' + Math.floor((timeValue - hours * 3600) / 60)
          //     const seconds = ('' + Math.floor(timeValue - hours * 3600 - minutes * 60)).length === 2 ? Math.floor(timeValue - hours * 3600 - minutes * 60) : '0' + Math.floor(timeValue - hours * 3600 - minutes * 60)
          //     baseinfo[item] = hours + ':' + minutes + ':' + seconds
          //     timeValue = timeValue + 1
          //   }
          // }, 1000)
          window.busytimeInterval = agentinterval
          break
      }
    },
    getStartTimestamp(timeStr) {
      return moment(timeStr, 'x').valueOf()
    },
    getEndTimestamp(timeStr) {
      return moment(timeStr, 'x').add(1, 'days').subtract(1, 'ms').valueOf()
    },
    findCallInfo(obj) {
      findTotalContactByTime(obj).then(res => {
        if (res.data.code === 0) {
          this.rowInfo.totalCallOut = res.data.data.callTotalCount
          this.rowInfo.totalCallTime = res.data.data.callTotalTime
          this.rowInfo.failedCallTotal = res.data.data.callFailCount
          this.rowInfo.answerTotal = res.data.data.callSuccessCount
          this.selectStatus = obj
        }
      })
    },
    changeToDailPage(status) {
      this.$router.push({
        name: 'dial_task',
        query: { 'dialstatus': status, 'isDialTask': false }
      })
      sessionStorage.removeItem('isDialTask')
    },
    changeToDailInfo(str) {
      const startTime = new Date(new Date().setHours(0, 0, 0, 0))
      const endTime = new Date(new Date().setHours(23, 59, 59, 0))
      let sTime = ''
      let eTime = ''
      let monthNum = 0
      let callStatu = 0 // 未接通状态
      switch (str) {
        case '0':
          callStatu = 0
          break
        case '1':
          callStatu = 1
          break
      }

      switch (this.selectStatus) {
        case 'yesterday':
          startTime.setDate(startTime.getDate() - 1)
          endTime.setDate(endTime.getDate() - 1)
          sTime = formatDateTime(startTime)
          eTime = formatDateTime(endTime)
          break
        case 'today':
          sTime = formatDateTime(startTime)
          eTime = formatDateTime(endTime)
          break
        case 'month':
          startTime.setDate(1)
          sTime = formatDateTime(startTime)
          monthNum = endTime.getMonth()
          eTime = formatDateTime(new Date(new Date(endTime.getFullYear(), ++monthNum, 1) - 1))
          break
      }
      this.$router.push({
        name: 'contact_record_dail',
        query: { 'sTime': sTime, 'eTime': eTime, 'callStatu': callStatu }
      })
    },
    changeToDailTask(status, agent) {
      this.$router.push({
        name: 'dial_task',
        query: { 'dialstatus': status, 'agent': agent, 'startTime': formatDateTime(this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))),
          'endTime': formatDateTime(this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))) }
      })
      sessionStorage.removeItem('isDialTask')
      sessionStorage.removeItem('quickDialto')
    },
    changeToOrderManagement() {
      this.$router.push({
        name: 'order_management',
        query: { 'startTime': formatDateTime(this.getStartTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))),
          'endTime': formatDateTime(this.getEndTimestamp(Date.parse(new Date((new Date()).toLocaleDateString())))) }
      })
    }
  }
}
</script>
<style>
.el-card__body{
  padding: 2%
}
.circle{
  width:6em;
  height:40px;
  border-radius:40px;
  /*float:left;*/
  margin: 0 auto;
  text-align:center;
}
.line-center{
  line-height:40px;
  font-size:14px;
  font-weight:bold;
}
.p-item{
  margin-top:23%;
  margin-left:-4%;
  float:left
}
.text-align-center{
  font-size:large;
  color:#fff;
  margin-top:1%;
  line-height:50px;
}
.squash-item{
  width: 80px;
  height: 25px;
  border-bottom-right-radius:10px;
  border-top-right-radius:10px;
  border:solid #36a9ce 1px;
  line-height: 25px;
  font-weight:500;
  background-color:#36a9ce;
}
</style>
